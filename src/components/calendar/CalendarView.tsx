import { useState } from 'react'
import { useTopics, useRecallSessions } from '../../hooks/useTopics'
import { getTodayDateString } from '../../services/spacedRecall'
import { CalendarMonth } from './CalendarMonth'
import { CalendarWeek } from './CalendarWeek'
import { CalendarAgenda } from './CalendarAgenda'
import { DayDetailModal } from './DayDetailModal'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function CalendarView() {
  const { data: topics = [] } = useTopics()
  const { data: sessions = [] } = useRecallSessions()

  const today = getTodayDateString()
  const todayDateObj = new Date()

  const [currentYear, setCurrentYear] = useState(todayDateObj.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(todayDateObj.getMonth())
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'agenda'>('month')
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const handleToday = () => {
    const now = new Date()
    setCurrentYear(now.getFullYear())
    setCurrentMonth(now.getMonth())
  }

  const selectedDaySessions = selectedDay
    ? sessions.filter((s) => s.scheduledDate === selectedDay)
    : []

  return (
    <div className="space-y-6">
      {/* Calendar Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            Recall Calendar
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Visualize your spaced repetition schedule across days and months
          </p>
        </div>

        {/* View Mode Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-muted rounded-xl self-start sm:self-auto">
          {(['month', 'week', 'agenda'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-colors ${
                viewMode === mode
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Month Navigation Toolbar */}
      <div className="flex items-center justify-between p-3.5 border rounded-2xl bg-card/60">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg border hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg border hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <span className="text-sm sm:text-base font-bold text-foreground ml-2">
            {monthNames[currentMonth]} {currentYear}
          </span>
        </div>

        <button
          type="button"
          onClick={handleToday}
          className="px-3 py-1.5 rounded-lg border text-xs font-semibold hover:bg-muted"
        >
          Today
        </button>
      </div>

      {/* Active Calendar View */}
      {viewMode === 'month' && (
        <CalendarMonth
          year={currentYear}
          month={currentMonth}
          sessions={sessions}
          onSelectDate={(dateStr) => setSelectedDay(dateStr)}
        />
      )}

      {viewMode === 'week' && (
        <CalendarWeek
          baseDate={today}
          sessions={sessions}
          topics={topics}
          onSelectDate={(dateStr) => setSelectedDay(dateStr)}
        />
      )}

      {viewMode === 'agenda' && (
        <CalendarAgenda sessions={sessions} topics={topics} />
      )}

      {/* Day detail popup modal */}
      {selectedDay && (
        <DayDetailModal
          open={Boolean(selectedDay)}
          onOpenChange={(open) => !open && setSelectedDay(null)}
          date={selectedDay}
          sessions={selectedDaySessions}
          topics={topics}
        />
      )}
    </div>
  )
}
