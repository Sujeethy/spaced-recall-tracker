import type { Topic, Category, Tag, TopicTag, RecallSession, Settings } from '../types'
import { generateSeedData, DEFAULT_SETTINGS } from './seedData'
import { refreshSessionStatuses, getTodayDateString } from '../services/spacedRecall'

const STORAGE_KEYS = {
  TOPICS: 'recall_tracker_topics_v1',
  CATEGORIES: 'recall_tracker_categories_v1',
  TAGS: 'recall_tracker_tags_v1',
  TOPIC_TAGS: 'recall_tracker_topic_tags_v1',
  SESSIONS: 'recall_tracker_sessions_v1',
  SETTINGS: 'recall_tracker_settings_v1',
  INITIALIZED: 'recall_tracker_initialized_v1',
}

function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function setItem<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val))
  } catch (err) {
    console.warn(`LocalStorage write error for ${key}:`, err)
  }
}

export function initializeLocalDatabase(forceReset: boolean = false): void {
  const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED)
  if (isInitialized && !forceReset) {
    return
  }

  const seed = generateSeedData()
  setItem(STORAGE_KEYS.TOPICS, seed.topics)
  setItem(STORAGE_KEYS.CATEGORIES, seed.categories)
  setItem(STORAGE_KEYS.TAGS, seed.tags)
  setItem(STORAGE_KEYS.TOPIC_TAGS, seed.topicTags)
  setItem(STORAGE_KEYS.SESSIONS, seed.sessions)
  setItem(STORAGE_KEYS.SETTINGS, seed.settings)
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true')
}

// Ensure DB is seeded on first load
initializeLocalDatabase()

export const localDb = {
  getTopics(): Topic[] {
    return getItem<Topic[]>(STORAGE_KEYS.TOPICS, [])
  },

  saveTopics(topics: Topic[]): void {
    setItem(STORAGE_KEYS.TOPICS, topics)
  },

  getCategories(): Category[] {
    return getItem<Category[]>(STORAGE_KEYS.CATEGORIES, [])
  },

  saveCategories(categories: Category[]): void {
    setItem(STORAGE_KEYS.CATEGORIES, categories)
  },

  getTags(): Tag[] {
    return getItem<Tag[]>(STORAGE_KEYS.TAGS, [])
  },

  saveTags(tags: Tag[]): void {
    setItem(STORAGE_KEYS.TAGS, tags)
  },

  getTopicTags(): TopicTag[] {
    return getItem<TopicTag[]>(STORAGE_KEYS.TOPIC_TAGS, [])
  },

  saveTopicTags(topicTags: TopicTag[]): void {
    setItem(STORAGE_KEYS.TOPIC_TAGS, topicTags)
  },

  getSessions(): RecallSession[] {
    const rawSessions = getItem<RecallSession[]>(STORAGE_KEYS.SESSIONS, [])
    const today = getTodayDateString()
    const refreshed = refreshSessionStatuses(rawSessions, today)
    // If any status updated due to date change, persist
    if (JSON.stringify(rawSessions) !== JSON.stringify(refreshed)) {
      setItem(STORAGE_KEYS.SESSIONS, refreshed)
    }
    return refreshed
  },

  saveSessions(sessions: RecallSession[]): void {
    setItem(STORAGE_KEYS.SESSIONS, sessions)
  },

  getSettings(): Settings {
    return getItem<Settings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS)
  },

  saveSettings(settings: Settings): void {
    setItem(STORAGE_KEYS.SETTINGS, settings)
  },

  clearAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.TOPICS)
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES)
    localStorage.removeItem(STORAGE_KEYS.TAGS)
    localStorage.removeItem(STORAGE_KEYS.TOPIC_TAGS)
    localStorage.removeItem(STORAGE_KEYS.SESSIONS)
    localStorage.removeItem(STORAGE_KEYS.SETTINGS)
    localStorage.removeItem(STORAGE_KEYS.INITIALIZED)
  },

  resetToSeed(): void {
    this.clearAllData()
    initializeLocalDatabase(true)
  }
}