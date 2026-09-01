import { z } from 'zod'

export type RecallStatus = 'upcoming' | 'due' | 'completed' | 'overdue' | 'skipped' | 'rescheduled'
export type TopicDifficulty = 'easy' | 'medium' | 'hard'
export type ThemeMode = 'light' | 'dark' | 'system'

export interface ActiveRecallQuestion {
  id: string
  question: string
  answer: string
  correctCount: number
  incorrectCount: number
  lastReviewedAt?: string | null
}

export interface Topic {
  id: string
  title: string
  description?: string
  notes?: string
  learnedAt: string // Format: YYYY-MM-DD
  categoryId: string
  difficulty: TopicDifficulty
  chatgptUrl?: string
  questions: ActiveRecallQuestion[]
  createdAt: string
  updatedAt: string
  archived: boolean
}

export interface Category {
  id: string
  name: string
  color: string
  order: number
  createdAt: string
  updatedAt: string
}

export interface Tag {
  id: string
  name: string
}

export interface TopicTag {
  topicId: string
  tagId: string
}

export interface RecallSession {
  id: string
  topicId: string
  intervalDays: number
  recallIndex: number // 0 for Day 0, 1 for Day 1...
  scheduledDate: string // Format: YYYY-MM-DD
  completedAt: string | null
  status: RecallStatus
  rescheduledFrom: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface Settings {
  id?: string
  recallIntervals: number[] // Default: [0, 1, 3, 5, 9, 15, 25, 40, 60, 90, 120, 180, 365]
  notificationEnabled: boolean
  notificationTime: string // "10:00"
  notificationFrequency: 'daily' | 'weekdays'
  remindOverdue: boolean
  remindDueToday: boolean
  timezone: string
  theme: ThemeMode
  weekStartDay: 0 | 1 // 0: Sunday, 1: Monday
  supabaseUrl?: string
  supabaseAnonKey?: string
}

export interface TopicWithDetails extends Topic {
  category?: Category
  tags: Tag[]
  recallSessions: RecallSession[]
  nextRecallDate?: string | null
  completedRecallCount: number
  totalRecallCount: number
}

// Zod Schemas
export const topicFormSchema = z.object({
  title: z.string().min(1, 'Topic name is required'),
  learnedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Valid date YYYY-MM-DD is required'),
  categoryId: z.string().min(1, 'Please select or create a category'),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  chatgptUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  description: z.string().optional(),
  notes: z.string().optional(),
  tags: z.string().optional(), // comma-separated
  questions: z.array(
    z.object({
      id: z.string(),
      question: z.string().min(1, 'Question text required'),
      answer: z.string().min(1, 'Answer text required'),
      correctCount: z.number().default(0),
      incorrectCount: z.number().default(0)
    })
  ).default([])
})

export type TopicFormValues = z.infer<typeof topicFormSchema>

export interface ImportPreviewStats {
  topicsCount: number
  categoriesCount: number
  tagsCount: number
  recallSessionsCount: number
  exportedAt?: string
  version?: string
}
