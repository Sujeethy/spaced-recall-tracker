import { z } from 'zod'

export type RecallStatus = 'upcoming' | 'due' | 'completed' | 'overdue' | 'skipped' | 'rescheduled'
export type TopicDifficulty = 'easy' | 'medium' | 'hard'
export type TopicStatus = 'yet_to_start' | 'in_progress' | 'completed' | 'draft' | 'skipped'
export type ThemeMode = 'light' | 'dark' | 'system'

export interface Course {
  id: string
  title: string
  description?: string
  color: string
  icon: string
  status: 'active' | 'completed' | 'archived'
  createdAt: string
  updatedAt: string
}

export interface CourseWithDetails extends Course {
  topicsCount: number
  topicsCompletedCount: number
  topicsRemainingCount: number
  completedRecallCount: number
  totalRecallCount: number
  progressPercentage: number
  nextRecallDate?: string | null
}

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
  courseId?: string | null
  orderIndex?: number
  title: string
  description?: string
  notes?: string
  markdownNotes?: string
  status: TopicStatus
  completedAt?: string | null
  learnedAt?: string | null // Optional legacy/planned date
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
  course?: Course
  tags: Tag[]
  recallSessions: RecallSession[]
  nextRecallDate?: string | null
  completedRecallCount: number
  totalRecallCount: number
}

// Zod Schemas
export const courseFormSchema = z.object({
  title: z.string().min(1, 'Course title is required'),
  description: z.string().optional(),
  color: z.string().default('#6366f1'),
  icon: z.string().default('GraduationCap'),
  status: z.enum(['active', 'completed', 'archived']).default('active'),
})

export type CourseFormValues = z.infer<typeof courseFormSchema>

export const topicFormSchema = z.object({
  title: z.string().min(1, 'Topic name is required'),
  courseId: z.string().nullable().optional(),
  orderIndex: z.number().optional().default(0),
  status: z.enum(['yet_to_start', 'in_progress', 'completed', 'draft', 'skipped']).default('yet_to_start'),
  completedAt: z.string().nullable().optional(),
  learnedAt: z.string().optional(),
  categoryId: z.string().min(1, 'Please select or create a category'),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  chatgptUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  description: z.string().optional(),
  notes: z.string().optional(),
  markdownNotes: z.string().optional(),
  tags: z.string().optional(), // comma-separated
  questions: z.array(
    z.object({
      id: z.string(),
      question: z.string().min(1, 'Question text required'),
      answer: z.string().min(1, 'Answer text required'),
      correctCount: z.number().default(0),
      incorrectCount: z.number().default(0),
    })
  ).default([]),
})

export type TopicFormValues = z.infer<typeof topicFormSchema>

export interface ImportPreviewStats {
  coursesCount?: number
  topicsCount: number
  categoriesCount: number
  tagsCount: number
  recallSessionsCount: number
  exportedAt?: string
  version?: string
}
