import type { Topic, Category, Course, Tag, TopicTag, RecallSession, Settings, ImportPreviewStats } from '../types'
import { generateRecallSessions, getTodayDateString } from './spacedRecall'

export interface BackupData {
  version: string
  exportedAt: string
  courses?: Course[]
  topics: Topic[]
  categories: Category[]
  tags: Tag[]
  topicTags: TopicTag[]
  recallSessions: RecallSession[]
  settings?: Settings
}

/**
 * Validate backup JSON schema
 */
export function validateBackupData(data: unknown): { valid: boolean; error?: string; stats?: ImportPreviewStats } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invalid backup file: file content is not a JSON object' }
  }

  const backup = data as Partial<BackupData>

  if (!Array.isArray(backup.topics)) {
    return { valid: false, error: 'Invalid backup file: missing or malformed "topics" array' }
  }
  if (!Array.isArray(backup.categories)) {
    return { valid: false, error: 'Invalid backup file: missing or malformed "categories" array' }
  }
  if (!Array.isArray(backup.recallSessions)) {
    return { valid: false, error: 'Invalid backup file: missing or malformed "recallSessions" array' }
  }

  return {
    valid: true,
    stats: {
      coursesCount: Array.isArray(backup.courses) ? backup.courses.length : 0,
      topicsCount: backup.topics.length,
      categoriesCount: backup.categories.length,
      tagsCount: Array.isArray(backup.tags) ? backup.tags.length : 0,
      recallSessionsCount: backup.recallSessions.length,
      exportedAt: backup.exportedAt,
      version: backup.version || '1.0'
    }
  }
}

export interface ParsedCsvTopic extends Partial<Topic> {
  category?: string
}

/**
 * Parse CSV content for bulk importing topics
 * Expected headers: title, description, learnedAt, category, tags, chatgptUrl
 */
export function parseTopicsCsv(csvText: string, defaultIntervals?: number[]): {
  topics: ParsedCsvTopic[]
  newCategories: string[]
  newTags: string[]
  sessionsByTopicIndex: RecallSession[][]
} {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0)
  if (lines.length <= 1) {
    return { topics: [], newCategories: [], newTags: [], sessionsByTopicIndex: [] }
  }

  // Parse header line
  const header = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/^["']|["']$/g, ''))
  const titleIdx = header.indexOf('title')
  const descIdx = header.indexOf('description')
  const learnedIdx = header.indexOf('learnedat') !== -1 ? header.indexOf('learnedat') : header.indexOf('learned_at')
  const catIdx = header.indexOf('category')
  const tagsIdx = header.indexOf('tags')
  const urlIdx = header.indexOf('chatgpturl') !== -1 ? header.indexOf('chatgpturl') : header.indexOf('chatgpt_url')

  const parsedTopics: Partial<Topic>[] = []
  const newCategories = new Set<string>()
  const newTags = new Set<string>()
  const sessionsByTopicIndex: RecallSession[][] = []
  const today = getTodayDateString()

  for (let i = 1; i < lines.length; i++) {
    // Basic CSV parser handling quoted commas
    const row = parseCsvRow(lines[i])
    if (!row || row.length === 0) continue

    const title = titleIdx !== -1 ? row[titleIdx]?.trim() : row[0]?.trim()
    if (!title) continue

    const learnedAt = (learnedIdx !== -1 && row[learnedIdx]?.trim()) ? row[learnedIdx].trim() : today
    const category = (catIdx !== -1 && row[catIdx]?.trim()) ? row[catIdx].trim() : 'General'
    const description = (descIdx !== -1 && row[descIdx]) ? row[descIdx].trim() : ''
    const chatgptUrl = (urlIdx !== -1 && row[urlIdx]) ? row[urlIdx].trim() : ''
    const tagsStr = (tagsIdx !== -1 && row[tagsIdx]) ? row[tagsIdx].trim() : ''

    newCategories.add(category)
    if (tagsStr) {
      tagsStr.split(';').map(t => t.trim()).filter(Boolean).forEach(t => newTags.add(t))
    }

    const topicId = crypto.randomUUID()
    const nowIso = new Date().toISOString()
    const topic: ParsedCsvTopic = {
      id: topicId,
      title,
      description,
      notes: '',
      learnedAt,
      category,
      difficulty: 'medium',
      chatgptUrl,
      questions: [],
      createdAt: nowIso,
      updatedAt: nowIso,
      archived: false,
    }

    const sessions = generateRecallSessions(topicId, learnedAt, defaultIntervals, today)

    parsedTopics.push(topic)
    sessionsByTopicIndex.push(sessions)
  }

  return {
    topics: parsedTopics,
    newCategories: Array.from(newCategories),
    newTags: Array.from(newTags),
    sessionsByTopicIndex,
  }
}

function parseCsvRow(text: string): string[] {
  const result: string[] = []
  let cell = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(cell.trim())
      cell = ''
    } else {
      cell += char
    }
  }
  result.push(cell.trim())
  return result.map(c => c.replace(/^["']|["']$/g, ''))
}

/**
 * Generate CSV string from topics
 */
export function generateTopicsCsv(topics: Topic[], categoriesMap: Map<string, string>): string {
  const header = ['Title', 'Category', 'Learned Date', 'ChatGPT URL', 'Description', 'Questions Count']
  const rows = topics.map(t => [
    `"${t.title.replace(/"/g, '""')}"`,
    `"${(categoriesMap.get(t.categoryId) || 'Uncategorized').replace(/"/g, '""')}"`,
    `"${t.learnedAt}"`,
    `"${(t.chatgptUrl || '').replace(/"/g, '""')}"`,
    `"${(t.description || '').replace(/"/g, '""')}"`,
    `"${t.questions?.length || 0}"`,
  ])

  return [header.join(','), ...rows.map(r => r.join(','))].join('\n')
}
