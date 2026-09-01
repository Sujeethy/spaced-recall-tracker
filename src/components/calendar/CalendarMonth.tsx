import type { RecallSession } from '../../types'
import { getTodayDateString } from '../../services/spacedRecall'
import clsx from 'clsx'

interface CalendarMonthProps {
  year: number
  month: number // 0-indexed: 0 = Jan, 11 = Dec
  sessions: RecallSession[]
  onSelectDate: (dateStr: string) => void
}

export function CalendarMonth({
  year,
  month,
  sessions,
  onSelectDate,
}: CalendarMonthProps) {
  const today = getTodayDateString()

  // First day of month & total days
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const totalDays = lastDay.getDate()
  const startingDayIndex = firstDay.getDay() // 0 = Sun

  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  // Group sessions by date
  const sessionsByDate: Record<string, RecallSession[]> = {}
  sessions.forEach((s) => {
    if (!sessionsByDate[s.scheduledDate]) {
      sessionsByDate[s.scheduledDate] = []
    }
    sessionsByDate[s.scheduledDate].push(s)
  })

  // Build grid slots
  const days = []
  // Padding slots
  for (let i = 0; i < startingDayIndex; i++) {
    days.push(null)
  }
  // Actual month days
  for (let d = 1; d <= totalDays; d++) {
    const mm = String(month + 1).padStart(2, '0')
    const dd = String(d).padStart(2, '0')
    const dateStr = `${year}-${mm}-${dd}`
    days.push({ dayNumber: d, dateStr })
  }

  return (
    <div className="border rounded-2xl overflow-hidden bg-card shadow-sm">
      {/* Day of week headers */}
      <div className="grid grid-cols-7 border-b bg-muted/40 text-center text-[11px] font-semibold text-muted-foreground py-2">
        {dayHeaders.map((dh) => (
          <div key={dh}>{dh}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y border-b text-xs">
        {days.map((slot, index) => {
          if (!slot) {
            return <div key={`empty-${index}`} className="h-20 sm:h-24 bg-muted/10" />
          }

          const daySessions = sessionsByDate[slot.dateStr] || []
          const isToday = slot.dateStr === today

          const hasOverdue = daySessions.some((s) => s.status === 'overdue')
          const hasDue = daySessions.some((s) => s.status === 'due')
          const hasCompleted = daySessions.some((s) => s.status === 'completed')
          const hasUpcoming = daySessions.some((s) => s.status === 'upcoming')

          return (
            <div
              key={slot.dateStr}
              onClick={() => onSelectDate(slot.dateStr)}
              className={clsx(
                'h-20 sm:h-24 p-1.5 sm:p-2 cursor-pointer transition-colors hover:bg-muted/40 flex flex-col justify-between',
                isToday && 'bg-primary/5 font-bold'
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={clsx(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs',
                    isToday
                      ? 'bg-primary text-primary-foreground font-bold'
                      : 'text-foreground'
                  )}
                >
                  {slot.dayNumber}
                </span>

                {daySessions.length > 0 && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-muted text-muted-foreground">
                    {daySessions.length}
                  </span>
                )}
              </div>

              {/* Status dots */}
              <div className="flex flex-wrap gap-1 mt-1">
                {hasOverdue && <span className="w-2 h-2 rounded-full bg-rose-500" title="Overdue" />}
                {hasDue && <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" title="Due" />}
                {hasCompleted && <span className="w-2 h-2 rounded-full bg-emerald-500" title="Completed" />}
                {hasUpcoming && <span className="w-2 h-2 rounded-full bg-indigo-400" title="Upcoming" />}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
