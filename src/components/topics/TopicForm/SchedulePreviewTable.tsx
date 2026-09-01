import { addDaysToDateString, DEFAULT_RECALL_INTERVALS } from '../../../services/spacedRecall'
import { Calendar } from 'lucide-react'

interface SchedulePreviewTableProps {
  learnedAt: string
  intervals?: number[]
}

export function SchedulePreviewTable({
  learnedAt,
  intervals = DEFAULT_RECALL_INTERVALS,
}: SchedulePreviewTableProps) {
  if (!learnedAt || !/^\d{4}-\d{2}-\d{2}$/.test(learnedAt)) {
    return (
      <div className="p-4 border rounded-xl bg-muted/20 text-center text-xs text-muted-foreground">
        Select a valid learned date to preview the spaced-recall schedule.
      </div>
    )
  }

  return (
    <div className="border rounded-xl p-4 bg-muted/20 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          <span>Automated Recall Schedule Preview ({intervals.length} sessions)</span>
        </div>
        <span className="text-[11px] text-muted-foreground">Zero manual math</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 text-xs">
        {intervals.map((days, idx) => {
          const scheduledDate = addDaysToDateString(learnedAt, days)

          return (
            <div
              key={days}
              className="p-2 rounded-lg border bg-card/60 flex flex-col justify-between"
            >
              <div className="text-[10px] font-bold text-muted-foreground">
                #{idx + 1} — Day {days}
              </div>
              <div className="text-xs font-semibold text-foreground mt-1 truncate">
                {scheduledDate}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
