import type { TopicWithDetails, RecallSession } from '../../types'
import { getTodayDateString, addDaysToDateString } from '../../services/spacedRecall'
import clsx from 'clsx'

interface CalendarWeekProps {
  baseDate: string // YYYY-MM-DD
  sessions: RecallSession[]
  topics: TopicWithDetails[]
  onSelectDate: (dateStr: string) => void
}

export function CalendarWeek({
  baseDate,
  sessions,
  topics,
  onSelectDate,
}: CalendarWeekProps) {
  const today = getTodayDateString()

  // Generate 7 days starting from baseDate
  const days: { dateStr: string; label: string; dayNum: number }[] = []
  for (let i = 0; i < 7; i++) {
    const dStr = addDaysToDateString(baseDate, i)
    const [y, m, d] = dStr.split('-').map(Number)
    const dateObj = new Date(Date.UTC(y, m - 1, d))
    const dayLabel = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'UTC' }).format(dateObj)
    days.push({ dateStr: dStr, label: dayLabel, dayNum: d })
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-3">
      {days.map((day) => {
        const isToday = day.dateStr === today
        const daySessions = sessions.filter((s) => s.scheduledDate === day.dateStr)

        return (
          <div
            key={day.dateStr}
            onClick={() => onSelectDate(day.dateStr)}
            className={clsx(
              'border rounded-2xl p-3 bg-card cursor-pointer transition-all hover:border-primary/40 flex flex-col justify-between min-h-48 shadow-sm',
              isToday && 'border-primary ring-1 ring-primary/20 bg-primary/5'
            )}
          >
            <div>
              <div className="flex items-center justify-between pb-2 border-b mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase">
                  {day.label}
                </span>
                <span
                  className={clsx(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                    isToday ? 'bg-primary text-primary-foreground' : 'text-foreground'
                  )}
                >
                  {day.dayNum}
                </span>
              </div>

              <div className="space-y-1.5">
                {daySessions.slice(0, 3).map((s) => {
                  const topic = topics.find((t) => t.id === s.topicId)
                  if (!topic) return null

                  return (
                    <div
                      key={s.id}
                      className="p-1.5 rounded-lg border bg-background/80 text-[11px] truncate"
                    >
                      <div className="truncate font-medium">{topic.title}</div>
                      <div className="text-[10px] text-muted-foreground">
                        Day {s.intervalDays}
                      </div>
                    </div>
                  )
                })}

                {daySessions.length > 3 && (
                  <p className="text-[10px] text-primary font-semibold text-center">
                    +{daySessions.length - 3} more
                  </p>
                )}

                {daySessions.length === 0 && (
                  <p className="text-[10px] text-muted-foreground text-center py-4 italic">
                    Free
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2 text-[10px] text-muted-foreground text-center">
              {daySessions.length} recall{daySessions.length === 1 ? '' : 's'}
            </div>
          </div>
        )
      })}
    </div>
  )
}
