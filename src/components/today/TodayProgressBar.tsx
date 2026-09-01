import * as Progress from '@radix-ui/react-progress'
import { Sparkles, Trophy } from 'lucide-react'

interface TodayProgressBarProps {
  completedCount: number
  totalCount: number
}

export function TodayProgressBar({ completedCount, totalCount }: TodayProgressBarProps) {
  const percentage = totalCount === 0 ? 100 : Math.round((completedCount / totalCount) * 100)
  const isAllDone = totalCount > 0 && completedCount >= totalCount

  return (
    <div className="p-4 sm:p-5 rounded-2xl border bg-card/60">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {isAllDone ? (
            <Trophy className="w-5 h-5 text-amber-500" />
          ) : (
            <Sparkles className="w-5 h-5 text-indigo-500" />
          )}
          <span className="font-bold text-sm sm:text-base text-foreground">
            {isAllDone
              ? 'All daily recalls complete! 🎉'
              : `${completedCount} of ${totalCount} recalls completed today`}
          </span>
        </div>
        <span className="text-xs font-bold text-muted-foreground">{percentage}%</span>
      </div>

      <Progress.Root
        className="relative overflow-hidden bg-muted rounded-full w-full h-3"
        value={percentage}
      >
        <Progress.Indicator
          className="bg-primary h-full transition-all duration-500 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </Progress.Root>
    </div>
  )
}
