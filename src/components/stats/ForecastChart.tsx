import type { RecallSession } from '../../types'
import { getTodayDateString, addDaysToDateString } from '../../services/spacedRecall'
import { Calendar } from 'lucide-react'

interface ForecastChartProps {
  sessions: RecallSession[]
}

export function ForecastChart({ sessions }: ForecastChartProps) {
  const today = getTodayDateString()

  // Generate next 7 days
  const next7Days: { dateStr: string; label: string; count: number }[] = []
  for (let i = 0; i < 7; i++) {
    const dStr = addDaysToDateString(today, i)
    const [y, m, d] = dStr.split('-').map(Number)
    const dateObj = new Date(Date.UTC(y, m - 1, d))
    const dayLabel =
      i === 0
        ? 'Today'
        : i === 1
        ? 'Tomorrow'
        : new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'UTC' }).format(dateObj)

    const count = sessions.filter(
      (s) => s.scheduledDate === dStr && s.status !== 'completed' && s.status !== 'skipped'
    ).length

    next7Days.push({ dateStr: dStr, label: dayLabel, count })
  }

  const maxCount = Math.max(...next7Days.map((d) => d.count), 1)

  return (
    <div className="p-5 sm:p-6 rounded-2xl border bg-card/60 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">7-Day Recall Forecast</h3>
        </div>
        <span className="text-xs text-muted-foreground">Upcoming review load</span>
      </div>

      <div className="grid grid-cols-7 gap-2 pt-4 items-end h-36">
        {next7Days.map((item) => {
          const heightPercent = Math.round((item.count / maxCount) * 100)

          return (
            <div key={item.dateStr} className="flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-[11px] font-bold text-foreground">
                {item.count > 0 ? item.count : ''}
              </span>

              <div className="w-full bg-muted/60 rounded-t-lg h-20 flex items-end overflow-hidden">
                <div
                  className={`w-full transition-all duration-500 rounded-t-lg ${
                    item.label === 'Today' ? 'bg-amber-500' : 'bg-primary'
                  }`}
                  style={{ height: `${Math.max(heightPercent, 6)}%` }}
                />
              </div>

              <div className="text-center">
                <span className="text-[10px] font-semibold text-muted-foreground block truncate">
                  {item.label}
                </span>
                <span className="text-[9px] text-muted-foreground/80 block">
                  {item.dateStr.slice(5)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
