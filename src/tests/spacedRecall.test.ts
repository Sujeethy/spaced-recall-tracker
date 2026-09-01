import { describe, it, expect } from 'vitest'
import {
  addDaysToDateString,
  generateRecallSessions,
  applyNewScheduleToTopic,
  formatRelativeDate
} from '../services/spacedRecall'

describe('Spaced Recall Pure Algorithm', () => {
  it('correctly calculates scheduled dates for default intervals starting on Sep 1, 2026', () => {
    const learnedDate = '2026-09-01'
    const intervals = [0, 1, 3, 5, 9, 15, 25, 40]

    const expectedDates = [
      '2026-09-01', // Day 0
      '2026-09-02', // Day 1
      '2026-09-04', // Day 3
      '2026-09-06', // Day 5
      '2026-09-10', // Day 9
      '2026-09-16', // Day 15
      '2026-09-26', // Day 25
      '2026-10-11', // Day 40 (Sep has 30 days -> 25 days remaining in Sep + 15 in Oct = Oct 11)
    ]

    expectedDates.forEach((expected, idx) => {
      const calculated = addDaysToDateString(learnedDate, intervals[idx])
      expect(calculated).toBe(expected)
    })
  })

  it('correctly handles leap years', () => {
    // 2024 is a leap year (Feb has 29 days)
    expect(addDaysToDateString('2024-02-28', 1)).toBe('2024-02-29')
    expect(addDaysToDateString('2024-02-28', 2)).toBe('2024-03-01')

    // 2025 is not a leap year (Feb has 28 days)
    expect(addDaysToDateString('2025-02-28', 1)).toBe('2025-03-01')
  })

  it('correctly handles month and year boundaries', () => {
    // Month transition
    expect(addDaysToDateString('2026-08-31', 1)).toBe('2026-09-01')
    expect(addDaysToDateString('2026-04-30', 1)).toBe('2026-05-01')

    // Year transition
    expect(addDaysToDateString('2026-12-31', 1)).toBe('2027-01-01')
    expect(addDaysToDateString('2026-12-31', 365)).toBe('2027-12-31')
  })

  it('generates all recall sessions with correct status based on today date', () => {
    const topicId = 'test-topic-1'
    const learnedDate = '2026-09-01'
    const today = '2026-09-04' // Simulating today is Day 3

    const sessions = generateRecallSessions(topicId, learnedDate, [0, 1, 3, 5, 9], today)

    expect(sessions).toHaveLength(5)
    expect(sessions[0].intervalDays).toBe(0)
    expect(sessions[0].scheduledDate).toBe('2026-09-01')
    expect(sessions[0].status).toBe('overdue') // Since scheduled Sep 1 < today Sep 4 and not completed

    expect(sessions[1].intervalDays).toBe(1)
    expect(sessions[1].scheduledDate).toBe('2026-09-02')
    expect(sessions[1].status).toBe('overdue')

    expect(sessions[2].intervalDays).toBe(3)
    expect(sessions[2].scheduledDate).toBe('2026-09-04')
    expect(sessions[2].status).toBe('due') // Scheduled Sep 4 == today Sep 4

    expect(sessions[3].intervalDays).toBe(5)
    expect(sessions[3].scheduledDate).toBe('2026-09-06')
    expect(sessions[3].status).toBe('upcoming') // Scheduled Sep 6 > today Sep 4
  })

  it('preserves completed history when applying a modified interval schedule', () => {
    const topicId = 'test-topic-2'
    const learnedDate = '2026-09-01'
    const initialSessions = generateRecallSessions(topicId, learnedDate, [0, 1, 3, 5])

    // Mark Day 0 and Day 1 as completed
    initialSessions[0].completedAt = '2026-09-01T12:00:00Z'
    initialSessions[0].status = 'completed'
    initialSessions[1].completedAt = '2026-09-02T12:00:00Z'
    initialSessions[1].status = 'completed'

    // New schedule adds Day 2 and Day 7, removes Day 3
    const newSchedule = [0, 1, 2, 5, 7]
    const updatedSessions = applyNewScheduleToTopic(
      topicId,
      learnedDate,
      initialSessions,
      newSchedule,
      '2026-09-02'
    )

    // Verify completed Day 0 and Day 1 are strictly preserved
    expect(updatedSessions[0].intervalDays).toBe(0)
    expect(updatedSessions[0].status).toBe('completed')
    expect(updatedSessions[0].completedAt).toBe('2026-09-01T12:00:00Z')

    expect(updatedSessions[1].intervalDays).toBe(1)
    expect(updatedSessions[1].status).toBe('completed')
    expect(updatedSessions[1].completedAt).toBe('2026-09-02T12:00:00Z')

    // Verify new intervals Day 2, Day 5, Day 7 exist
    const intervalsPresent = updatedSessions.map((s) => s.intervalDays)
    expect(intervalsPresent).toContain(2)
    expect(intervalsPresent).toContain(5)
    expect(intervalsPresent).toContain(7)
  })

  it('evaluates relative date formatting correctly', () => {
    const today = '2026-09-04'
    expect(formatRelativeDate('2026-09-04', today)).toBe('Today')
    expect(formatRelativeDate('2026-09-05', today)).toBe('Tomorrow')
    expect(formatRelativeDate('2026-09-03', today)).toBe('Yesterday')
    expect(formatRelativeDate('2026-09-09', today)).toBe('In 5 days')
    expect(formatRelativeDate('2026-09-01', today)).toBe('3 days overdue')
  })
})
