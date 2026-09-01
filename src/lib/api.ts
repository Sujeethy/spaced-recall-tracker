import type {
  Topic,
  Category,
  Course,
  CourseWithDetails,
  CourseFormValues,
  Tag,
  TopicTag,
  RecallSession,
  Settings,
  TopicWithDetails,
  TopicFormValues,
  TopicStatus,
} from '../types'
import { localDb } from './localDb'
import { getSupabaseClient } from './supabase'
import {
  generateRecallSessions,
  evaluateRecallStatus,
  getTodayDateString,
} from '../services/spacedRecall'
import type { BackupData } from '../services/exportImport'

/**
 * Unified API repository layer.
 * Seamlessly interfaces with Supabase when configured, or localDb when offline/local-first.
 */
export const api = {
  // -------------------------------------------------------------
  // Courses
  // -------------------------------------------------------------
  async getCourses(): Promise<CourseWithDetails[]> {
    const supabase = getSupabaseClient()
    if (supabase) {
      try {
        const { data: coursesData, error } = await supabase
          .from('courses')
          .select('*')
          .order('created_at', { ascending: false })

        if (!error && coursesData) {
          const topics = await this.getTopics()
          return coursesData.map(c => enrichCourse(c, topics))
        }
      } catch (err) {
        console.warn('Supabase query for courses failed, falling back to localDb:', err)
      }
    }

    const courses = localDb.getCourses()
    const topics = await this.getTopics()
    return courses.map(c => enrichCourse(c, topics))
  },

  async getCourseById(id: string): Promise<CourseWithDetails | null> {
    const courses = await this.getCourses()
    return courses.find(c => c.id === id) || null
  },

  async createCourse(values: CourseFormValues): Promise<CourseWithDetails> {
    const nowIso = new Date().toISOString()
    const courseId = crypto.randomUUID()

    const newCourse: Course = {
      id: courseId,
      title: values.title.trim(),
      description: values.description?.trim() || '',
      color: values.color || '#6366f1',
      icon: values.icon || 'GraduationCap',
      status: values.status || 'active',
      createdAt: nowIso,
      updatedAt: nowIso,
    }

    const currentCourses = localDb.getCourses()
    localDb.saveCourses([newCourse, ...currentCourses])

    return (await this.getCourseById(courseId))!
  },

  async updateCourse(id: string, values: Partial<CourseFormValues>): Promise<CourseWithDetails> {
    const courses = localDb.getCourses()
    const idx = courses.findIndex(c => c.id === id)
    if (idx === -1) throw new Error(`Course not found: ${id}`)

    const current = courses[idx]
    const updated: Course = {
      ...current,
      title: values.title !== undefined ? values.title.trim() : current.title,
      description: values.description !== undefined ? values.description?.trim() : current.description,
      color: values.color !== undefined ? values.color : current.color,
      icon: values.icon !== undefined ? values.icon : current.icon,
      status: values.status !== undefined ? values.status : current.status,
      updatedAt: new Date().toISOString(),
    }

    courses[idx] = updated
    localDb.saveCourses(courses)

    return (await this.getCourseById(id))!
  },

  async deleteCourse(id: string, deleteTopics: boolean = false): Promise<void> {
    const courses = localDb.getCourses().filter(c => c.id !== id)
    localDb.saveCourses(courses)

    const topics = localDb.getTopics()
    if (deleteTopics) {
      // Cascade delete topics belonging to this course
      const topicsToDelete = topics.filter(t => t.courseId === id)
      for (const t of topicsToDelete) {
        await this.deleteTopic(t.id)
      }
    } else {
      // Unassign course from topics
      const updatedTopics = topics.map(t => (t.courseId === id ? { ...t, courseId: null } : t))
      localDb.saveTopics(updatedTopics)
    }
  },

  async reorderTopicsInCourse(courseId: string, orderedTopicIds: string[]): Promise<void> {
    const topics = localDb.getTopics()
    const updatedTopics = topics.map(t => {
      if (t.courseId === courseId) {
        const order = orderedTopicIds.indexOf(t.id)
        if (order !== -1) {
          return { ...t, orderIndex: order, updatedAt: new Date().toISOString() }
        }
      }
      return t
    })
    localDb.saveTopics(updatedTopics)
  },

  // -------------------------------------------------------------
  // Topics
  // -------------------------------------------------------------
  async getTopics(): Promise<TopicWithDetails[]> {
    const supabase = getSupabaseClient()
    if (supabase) {
      try {
        const { data: topicsData, error } = await supabase
          .from('topics')
          .select('*, categories(*), topic_tags(*, tags(*)), recall_sessions(*)')
          .eq('archived', false)
          .order('learned_at', { ascending: false })

        if (!error && topicsData) {
          return topicsData.map(formatSupabaseTopic)
        }
      } catch (err) {
        console.warn('Supabase query failed, falling back to localDb:', err)
      }
    }

    // Local DB fallback
    const topics = localDb.getTopics().filter(t => !t.archived)
    const categories = localDb.getCategories()
    const tags = localDb.getTags()
    const topicTags = localDb.getTopicTags()
    const sessions = localDb.getSessions()

    return topics.map(t => enrichTopic(t, categories, tags, topicTags, sessions))
  },

  async getTopicById(id: string): Promise<TopicWithDetails | null> {
    const topics = await this.getTopics()
    return topics.find(t => t.id === id) || null
  },

  async createTopic(values: TopicFormValues, customIntervals?: number[]): Promise<TopicWithDetails> {
    const today = getTodayDateString()
    const nowIso = new Date().toISOString()
    const topicId = crypto.randomUUID()

    const fullTopicContent = values.fullTopic?.trim() || values.markdownNotes?.trim() || ''
    const keyNotesContent = values.keyNotes?.trim() || values.notes?.trim() || ''
    const effectiveCompletedAt = values.status === 'completed' ? (values.completedAt || today) : null

    const newTopic: Topic = {
      id: topicId,
      courseId: values.courseId || null,
      orderIndex: values.orderIndex !== undefined ? values.orderIndex : 0,
      title: values.title.trim(),
      description: values.description?.trim() || '',
      fullTopic: fullTopicContent,
      keyNotes: keyNotesContent,
      notes: keyNotesContent,
      markdownNotes: fullTopicContent,
      definitions: values.definitions?.trim() || '',
      questionsMarkdown: values.questionsMarkdown?.trim() || '',
      status: values.status || 'yet_to_start',
      completedAt: effectiveCompletedAt,
      learnedAt: values.learnedAt || today,
      categoryId: values.categoryId,
      difficulty: values.difficulty || 'medium',
      chatgptUrl: values.chatgptUrl?.trim() || '',
      questions: values.questions || [],
      createdAt: nowIso,
      updatedAt: nowIso,
      archived: false,
    }

    // Only generate spaced-recall sessions if topic is actually COMPLETED
    let generatedSessions: RecallSession[] = []
    if (newTopic.status === 'completed' && newTopic.completedAt) {
      const settings = await this.getSettings()
      const intervals = customIntervals || settings.recallIntervals
      generatedSessions = generateRecallSessions(topicId, newTopic.completedAt, intervals, today)
    }

    // Handle tag parsing
    const tagNames = (values.tags || '')
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)

    const allTags = localDb.getTags()
    const newTopicTags: TopicTag[] = []

    for (const tagName of tagNames) {
      let existingTag = allTags.find(t => t.name.toLowerCase() === tagName.toLowerCase())
      if (!existingTag) {
        existingTag = { id: crypto.randomUUID(), name: tagName }
        allTags.push(existingTag)
      }
      newTopicTags.push({ topicId, tagId: existingTag.id })
    }

    localDb.saveTags(allTags)
    const currentTopicTags = localDb.getTopicTags()
    localDb.saveTopicTags([...currentTopicTags, ...newTopicTags])

    const currentTopics = localDb.getTopics()
    localDb.saveTopics([newTopic, ...currentTopics])

    if (generatedSessions.length > 0) {
      const currentSessions = localDb.getSessions()
      localDb.saveSessions([...currentSessions, ...generatedSessions])
    }

    return (await this.getTopicById(topicId))!
  },

  async updateTopic(id: string, values: Partial<TopicFormValues>): Promise<TopicWithDetails> {
    const today = getTodayDateString()
    const topics = localDb.getTopics()
    const idx = topics.findIndex(t => t.id === id)
    if (idx === -1) throw new Error(`Topic not found: ${id}`)

    const current = topics[idx]
    const updatedStatus = values.status !== undefined ? values.status : current.status || 'yet_to_start'
    let updatedCompletedAt = values.completedAt !== undefined ? values.completedAt : current.completedAt

    if (updatedStatus === 'completed' && !updatedCompletedAt) {
      updatedCompletedAt = today
    } else if (updatedStatus !== 'completed') {
      updatedCompletedAt = null
    }

    const updatedFullTopic = values.fullTopic !== undefined ? values.fullTopic : (values.markdownNotes !== undefined ? values.markdownNotes : current.fullTopic || current.markdownNotes || '')
    const updatedKeyNotes = values.keyNotes !== undefined ? values.keyNotes : (values.notes !== undefined ? values.notes : current.keyNotes || current.notes || '')

    const updated: Topic = {
      ...current,
      title: values.title !== undefined ? values.title.trim() : current.title,
      courseId: values.courseId !== undefined ? values.courseId : current.courseId,
      orderIndex: values.orderIndex !== undefined ? values.orderIndex : current.orderIndex,
      description: values.description !== undefined ? values.description : current.description,
      fullTopic: updatedFullTopic,
      keyNotes: updatedKeyNotes,
      notes: updatedKeyNotes,
      markdownNotes: updatedFullTopic,
      definitions: values.definitions !== undefined ? values.definitions : current.definitions,
      questionsMarkdown: values.questionsMarkdown !== undefined ? values.questionsMarkdown : current.questionsMarkdown,
      status: updatedStatus,
      completedAt: updatedCompletedAt,
      learnedAt: values.learnedAt !== undefined ? values.learnedAt : current.learnedAt,
      categoryId: values.categoryId !== undefined ? values.categoryId : current.categoryId,
      difficulty: values.difficulty !== undefined ? values.difficulty : current.difficulty,
      chatgptUrl: values.chatgptUrl !== undefined ? values.chatgptUrl : current.chatgptUrl,
      questions: values.questions !== undefined ? values.questions : current.questions,
      updatedAt: new Date().toISOString(),
    }

    topics[idx] = updated
    localDb.saveTopics(topics)

    // Handle recall session updates based on completed status
    const allSessions = localDb.getSessions()
    const otherSessions = allSessions.filter(s => s.topicId !== id)

    if (updated.status === 'completed' && updated.completedAt) {
      const isStatusChanged = current.status !== 'completed'
      const isDateChanged = current.completedAt !== updated.completedAt
      const hasExistingSessions = allSessions.some(s => s.topicId === id)

      if (isStatusChanged || isDateChanged || !hasExistingSessions) {
        const settings = await this.getSettings()
        const newSessions = generateRecallSessions(id, updated.completedAt, settings.recallIntervals, today)
        localDb.saveSessions([...otherSessions, ...newSessions])
      }
    } else {
      // If topic is not completed (e.g. yet_to_start, in_progress, draft), clear its active recall sessions
      localDb.saveSessions(otherSessions)
    }

    // Update tags if provided
    if (values.tags !== undefined) {
      const tagNames = values.tags.split(',').map(t => t.trim()).filter(Boolean)
      const allTags = localDb.getTags()
      const newTopicTags: TopicTag[] = []

      for (const tagName of tagNames) {
        let tag = allTags.find(t => t.name.toLowerCase() === tagName.toLowerCase())
        if (!tag) {
          tag = { id: crypto.randomUUID(), name: tagName }
          allTags.push(tag)
        }
        newTopicTags.push({ topicId: id, tagId: tag.id })
      }

      localDb.saveTags(allTags)
      const remainingTopicTags = localDb.getTopicTags().filter(tt => tt.topicId !== id)
      localDb.saveTopicTags([...remainingTopicTags, ...newTopicTags])
    }

    return (await this.getTopicById(id))!
  },

  async toggleTopicCompletion(id: string, newStatus: TopicStatus = 'completed', completedDate?: string): Promise<TopicWithDetails> {
    return this.updateTopic(id, {
      status: newStatus,
      completedAt: newStatus === 'completed' ? (completedDate || getTodayDateString()) : null,
    })
  },

  async deleteTopic(id: string): Promise<void> {
    const topics = localDb.getTopics().filter(t => t.id !== id)
    localDb.saveTopics(topics)

    const sessions = localDb.getSessions().filter(s => s.topicId !== id)
    localDb.saveSessions(sessions)

    const topicTags = localDb.getTopicTags().filter(tt => tt.topicId !== id)
    localDb.saveTopicTags(topicTags)
  },

  // -------------------------------------------------------------
  // Recall Sessions
  // -------------------------------------------------------------
  async getRecallSessions(): Promise<RecallSession[]> {
    return localDb.getSessions()
  },

  async completeRecallSession(sessionId: string, notes?: string): Promise<RecallSession> {
    const sessions = localDb.getSessions()
    const session = sessions.find(s => s.id === sessionId)
    if (!session) throw new Error(`Session ${sessionId} not found`)

    const nowIso = new Date().toISOString()
    session.completedAt = nowIso
    session.status = 'completed'
    if (notes !== undefined) session.notes = notes
    session.updatedAt = nowIso

    localDb.saveSessions(sessions)
    return session
  },

  async uncompleteRecallSession(sessionId: string): Promise<RecallSession> {
    const sessions = localDb.getSessions()
    const session = sessions.find(s => s.id === sessionId)
    if (!session) throw new Error(`Session ${sessionId} not found`)

    session.completedAt = null
    session.status = evaluateRecallStatus(session.scheduledDate, null, 'upcoming')
    session.updatedAt = new Date().toISOString()

    localDb.saveSessions(sessions)
    return session
  },

  async rescheduleRecallSession(sessionId: string, newDate: string): Promise<RecallSession> {
    const sessions = localDb.getSessions()
    const session = sessions.find(s => s.id === sessionId)
    if (!session) throw new Error(`Session ${sessionId} not found`)

    session.rescheduledFrom = session.scheduledDate
    session.scheduledDate = newDate
    session.completedAt = null
    session.status = evaluateRecallStatus(newDate, null, 'rescheduled')
    session.updatedAt = new Date().toISOString()

    localDb.saveSessions(sessions)
    return session
  },

  async skipRecallSession(sessionId: string): Promise<RecallSession> {
    const sessions = localDb.getSessions()
    const session = sessions.find(s => s.id === sessionId)
    if (!session) throw new Error(`Session ${sessionId} not found`)

    session.status = 'skipped'
    session.updatedAt = new Date().toISOString()

    localDb.saveSessions(sessions)
    return session
  },

  // -------------------------------------------------------------
  // Categories & Tags
  // -------------------------------------------------------------
  async getCategories(): Promise<Category[]> {
    return localDb.getCategories().sort((a, b) => a.order - b.order)
  },

  async createCategory(name: string, color: string = '#6366f1'): Promise<Category> {
    const categories = localDb.getCategories()
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: name.trim(),
      color,
      order: categories.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    localDb.saveCategories([...categories, newCategory])
    return newCategory
  },

  async deleteCategory(id: string): Promise<void> {
    const categories = localDb.getCategories().filter(c => c.id !== id)
    localDb.saveCategories(categories)
  },

  async getTags(): Promise<Tag[]> {
    return localDb.getTags()
  },

  // -------------------------------------------------------------
  // Settings
  // -------------------------------------------------------------
  async getSettings(): Promise<Settings> {
    return localDb.getSettings()
  },

  async updateSettings(updates: Partial<Settings>): Promise<Settings> {
    const current = localDb.getSettings()
    const updated = { ...current, ...updates }
    localDb.saveSettings(updated)
    return updated
  },

  // -------------------------------------------------------------
  // Backup & Restore
  // -------------------------------------------------------------
  async exportBackup(): Promise<BackupData> {
    return {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      courses: localDb.getCourses(),
      topics: localDb.getTopics(),
      categories: localDb.getCategories(),
      tags: localDb.getTags(),
      topicTags: localDb.getTopicTags(),
      recallSessions: localDb.getSessions(),
      settings: localDb.getSettings(),
    }
  },

  async restoreBackup(backup: BackupData, mode: 'replace' | 'merge'): Promise<void> {
    if (mode === 'replace') {
      if (backup.courses) localDb.saveCourses(backup.courses)
      localDb.saveTopics(backup.topics)
      localDb.saveCategories(backup.categories)
      localDb.saveTags(backup.tags || [])
      localDb.saveTopicTags(backup.topicTags || [])
      localDb.saveSessions(backup.recallSessions)
      if (backup.settings) localDb.saveSettings(backup.settings)
    } else {
      // Merge mode
      if (backup.courses) {
        const curCourses = localDb.getCourses()
        const courseMap = new Map(curCourses.map(c => [c.id, c]))
        backup.courses.forEach(c => courseMap.set(c.id, c))
        localDb.saveCourses(Array.from(courseMap.values()))
      }

      const curTopics = localDb.getTopics()
      const curCategories = localDb.getCategories()
      const curTags = localDb.getTags()
      const curSessions = localDb.getSessions()

      const topicMap = new Map(curTopics.map(t => [t.id, t]))
      backup.topics.forEach(t => topicMap.set(t.id, t))

      const catMap = new Map(curCategories.map(c => [c.id, c]))
      backup.categories.forEach(c => catMap.set(c.id, c))

      const tagMap = new Map(curTags.map(t => [t.id, t]))
      ;(backup.tags || []).forEach(t => tagMap.set(t.id, t))

      const sessionMap = new Map(curSessions.map(s => [s.id, s]))
      backup.recallSessions.forEach(s => sessionMap.set(s.id, s))

      localDb.saveTopics(Array.from(topicMap.values()))
      localDb.saveCategories(Array.from(catMap.values()))
      localDb.saveTags(Array.from(tagMap.values()))
      localDb.saveSessions(Array.from(sessionMap.values()))
    }
  }
}

// -------------------------------------------------------------
// Helper enrichment functions
// -------------------------------------------------------------
function enrichCourse(course: Course, topics: TopicWithDetails[]): CourseWithDetails {
  const courseTopics = topics.filter(t => t.courseId === course.id)
  const totalRecalls = courseTopics.reduce((acc, t) => acc + t.totalRecallCount, 0)
  const completedRecalls = courseTopics.reduce((acc, t) => acc + t.completedRecallCount, 0)
  
  const topicsCompletedCount = courseTopics.filter(t => t.status === 'completed').length
  const topicsRemainingCount = courseTopics.length - topicsCompletedCount
  const progressPercentage = courseTopics.length === 0
    ? 0
    : Math.round((topicsCompletedCount / courseTopics.length) * 100)

  // Find earliest upcoming/due recall date
  const nextDates = courseTopics
    .map(t => t.nextRecallDate)
    .filter((d): d is string => Boolean(d))
    .sort()
  const nextRecallDate = nextDates[0] || null

  return {
    ...course,
    topicsCount: courseTopics.length,
    topicsCompletedCount,
    topicsRemainingCount,
    completedRecallCount: completedRecalls,
    totalRecallCount: totalRecalls,
    progressPercentage,
    nextRecallDate,
  }
}

function enrichTopic(
  topic: Topic,
  categories: Category[],
  tags: Tag[],
  topicTags: TopicTag[],
  sessions: RecallSession[]
): TopicWithDetails {
  const category = categories.find(c => c.id === topic.categoryId)
  const course = topic.courseId ? localDb.getCourses().find(c => c.id === topic.courseId) : undefined
  const matchingTagIds = topicTags.filter(tt => tt.topicId === topic.id).map(tt => tt.tagId)
  const matchingTags = tags.filter(t => matchingTagIds.includes(t.id))
  const topicSessions = sessions
    .filter(s => s.topicId === topic.id)
    .sort((a, b) => a.recallIndex - b.recallIndex)

  const completedCount = topicSessions.filter(s => s.status === 'completed').length
  const nextSession = topicSessions.find(s => s.status === 'due' || s.status === 'overdue' || s.status === 'upcoming')

  return {
    ...topic,
    status: topic.status || 'yet_to_start',
    completedAt: topic.completedAt || null,
    category,
    course,
    tags: matchingTags,
    recallSessions: topicSessions,
    nextRecallDate: nextSession ? nextSession.scheduledDate : null,
    completedRecallCount: completedCount,
    totalRecallCount: topicSessions.length,
  }
}

function formatSupabaseTopic(raw: any): TopicWithDetails {
  const category = raw.categories
  const tags = (raw.topic_tags || []).map((tt: any) => tt.tags).filter(Boolean)
  const recallSessions: RecallSession[] = (raw.recall_sessions || []).map((s: any) => ({
    id: s.id,
    topicId: s.topic_id,
    intervalDays: s.interval_days,
    recallIndex: s.recall_index,
    scheduledDate: s.scheduled_date,
    completedAt: s.completed_at,
    status: s.status,
    rescheduledFrom: s.rescheduled_from,
    notes: s.notes,
    createdAt: s.created_at,
    updatedAt: s.updated_at,
  }))

  const completedCount = recallSessions.filter(s => s.status === 'completed').length
  const nextSession = recallSessions.find(s => s.status === 'due' || s.status === 'overdue' || s.status === 'upcoming')

  return {
    id: raw.id,
    courseId: raw.course_id || null,
    orderIndex: raw.order_index || 0,
    title: raw.title,
    description: raw.description,
    notes: raw.notes,
    keyNotes: raw.key_notes || raw.notes || '',
    fullTopic: raw.full_topic || raw.markdown_notes || '',
    markdownNotes: raw.markdown_notes || raw.full_topic || '',
    definitions: raw.definitions || '',
    questionsMarkdown: raw.questions_markdown || '',
    status: raw.status || 'yet_to_start',
    completedAt: raw.completed_at || null,
    learnedAt: raw.learned_at,
    categoryId: raw.category_id,
    difficulty: raw.difficulty,
    chatgptUrl: raw.chatgpt_url,
    questions: raw.questions || [],
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
    archived: raw.archived,
    category,
    tags,
    recallSessions,
    nextRecallDate: nextSession ? nextSession.scheduledDate : null,
    completedRecallCount: completedCount,
    totalRecallCount: recallSessions.length,
  }
}
