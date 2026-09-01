import { format, isValid } from 'date-fns'
import type { RecallSession, RecallStatus } from '../types'

export const DEFAULT_RECALL_INTERVALS = [0, 1, 3, 5, 9, 15, 25, 40, 60, 90, 120, 180, 365]

/**
 * Returns today's date in local calendar YYYY-MM-DD format
 */
export function getTodayDateString(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Returns yesterday's date in local calendar YYYY-MM-DD format
 */
export function getYesterdayDateString(): string {
  return addDaysToDateString(getTodayDateString(), -1)
}

/**
 * Pure timezone-safe date addition
 * Adding N days to a YYYY-MM-DD date string using UTC arithmetic to eliminate DST/timezone shifts
 */
export function addDaysToDateString(dateString: string, daysToAdd: number): string {
  const [yearStr, monthStr, dayStr] = dateString.split('-')
  const year = parseInt(yearStr, 10)
  const month = parseInt(monthStr, 10) - 1
  const day = parseInt(dayStr, 10)

  const utcDate = new Date(Date.UTC(year, month, day))
  utcDate.setUTCDate(utcDate.getUTCDate() + daysToAdd)

  const y = utcDate.getUTCFullYear()
  const m = String(utcDate.getUTCMonth() + 1).padStart(2, '0')
  const d = String(utcDate.getUTCDate()).padStart(2, '0')

  return `${y}-${m}-${d}`
}

/**
 * Pure status evaluator for a recall session based on current date
 */
export function evaluateRecallStatus(
  scheduledDate: string,
  completedAt: string | null,
  currentStatus: RecallStatus,
  todayDate: string = getTodayDateString()
): RecallStatus {
  if (completedAt || currentStatus === 'completed') {
    return 'completed'
  }
  if (currentStatus === 'skipped') {
    return 'skipped'
  }
  if (currentStatus === 'rescheduled') {
    return 'rescheduled'
  }
  if (scheduledDate < todayDate) {
    return 'overdue'
  }
  if (scheduledDate === todayDate) {
    return 'due'
  }
  return 'upcoming'
}

/**
 * Generate recall sessions for a topic given its learned date and configured intervals
 */
export function generateRecallSessions(
  topicId: string,
  learnedDate: string,
  intervals: number[] = DEFAULT_RECALL_INTERVALS,
  todayDate: string = getTodayDateString()
): RecallSession[] {
  const nowIso = new Date().toISOString()

  return intervals.map((intervalDays, index) => {
    const scheduledDate = addDaysToDateString(learnedDate, intervalDays)
    const status = evaluateRecallStatus(scheduledDate, null, 'upcoming', todayDate)

    return {
      id: crypto.randomUUID(),
      topicId,
      intervalDays,
      recallIndex: index,
      scheduledDate,
      completedAt: null,
      status,
      rescheduledFrom: null,
      notes: null,
      createdAt: nowIso,
      updatedAt: nowIso,
    }
  })
}

/**
 * Re-evaluate a list of sessions with updated today date
 */
export function refreshSessionStatuses(
  sessions: RecallSession[],
  todayDate: string = getTodayDateString()
): RecallSession[] {
  return sessions.map((session) => {
    const newStatus = evaluateRecallStatus(
      session.scheduledDate,
      session.completedAt,
      session.status,
      todayDate
    )
    if (newStatus !== session.status) {
      return { ...session, status: newStatus, updatedAt: new Date().toISOString() }
    }
    return session
  })
}

/**
 * Apply updated intervals to future non-completed sessions of a topic,
 * NEVER modifying completed or skipped history.
 */
export function applyNewScheduleToTopic(
  topicId: string,
  learnedDate: string,
  existingSessions: RecallSession[],
  newIntervals: number[],
  todayDate: string = getTodayDateString()
): RecallSession[] {
  // Preserve all historical completed and skipped sessions
  const historical = existingSessions.filter(
    (s) => s.completedAt !== null || s.status === 'completed' || s.status === 'skipped'
  )

  const completedIntervals = new Set(historical.map((s) => s.intervalDays))

  // For intervals in the new schedule that have not yet been completed, generate them
  const remainingIntervals = newIntervals.filter((int) => !completedIntervals.has(int))
  const newFutureSessions: RecallSession[] = remainingIntervals.map((intervalDays, idx) => {
    const scheduledDate = addDaysToDateString(learnedDate, intervalDays)
    const status = evaluateRecallStatus(scheduledDate, null, 'upcoming', todayDate)
    const nowIso = new Date().toISOString()

    return {
      id: crypto.randomUUID(),
      topicId,
      intervalDays,
      recallIndex: historical.length + idx,
      scheduledDate,
      completedAt: null,
      status,
      rescheduledFrom: null,
      notes: null,
      createdAt: nowIso,
      updatedAt: nowIso,
    }
  })

  // Combine and sort by scheduledDate
  const allSessions = [...historical, ...newFutureSessions]
  allSessions.sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate))

  return allSessions.map((session, idx) => ({
    ...session,
    recallIndex: idx,
  }))
}

/**
 * Format a YYYY-MM-DD date for display: "Sep 1, 2026"
 */
export function formatDisplayDate(dateString: string): string {
  if (!dateString) return '—'
  try {
    const [y, m, d] = dateString.split('-').map(Number)
    const date = new Date(y, m - 1, d)
    if (!isValid(date)) return dateString
    return format(date, 'MMM d, yyyy')
  } catch {
    return dateString
  }
}

/**
 * Format relative date description: "Today", "Tomorrow", "In 5 days", "3 days overdue"
 */
export function formatRelativeDate(dateString: string, todayDate: string = getTodayDateString()): string {
  if (!dateString) return ''
  if (dateString === todayDate) return 'Today'

  const [ty, tm, td] = todayDate.split('-').map(Number)
  const [sy, sm, sd] = dateString.split('-').map(Number)

  const todayUtc = Date.UTC(ty, tm - 1, td)
  const targetUtc = Date.UTC(sy, sm - 1, sd)
  const diffDays = Math.round((targetUtc - todayUtc) / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return 'Tomorrow'
  if (diffDays === -1) return 'Yesterday'
  if (diffDays > 1) return `In ${diffDays} days`
  if (diffDays < -1) return `${Math.abs(diffDays)} days overdue`

  return ''
}
