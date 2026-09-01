import type { TopicWithDetails, RecallSession } from '../../types'
import { Award, CheckCircle2, AlertTriangle, Flame } from 'lucide-react'

interface RetentionStatsProps {
  topics: TopicWithDetails[]
  sessions: RecallSession[]
}

export function RetentionStats({ topics, sessions }: RetentionStatsProps) {
  const totalSessions = sessions.length
  const completedSessions = sessions.filter((s) => s.status === 'completed').length
  const overdueSessions = sessions.filter((s) => s.status === 'overdue').length

  const completionRate =
    totalSessions === 0 ? 0 : Math.round((completedSessions / totalSessions) * 100)

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <div className="p-4 rounded-xl border bg-card shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground">Completion Rate</span>
          <Award className="w-4 h-4 text-indigo-500" />
        </div>
        <div className="text-2xl font-bold text-foreground mt-2">{completionRate}%</div>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          {completedSessions} of {totalSessions} total recalls
        </p>
      </div>

      <div className="p-4 rounded-xl border bg-card shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground">Completed</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="text-2xl font-bold text-foreground mt-2">{completedSessions}</div>
        <p className="text-[11px] text-muted-foreground mt-0.5">Reinforced reviews</p>
      </div>

      <div className="p-4 rounded-xl border bg-card shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground">Overdue Queue</span>
          <AlertTriangle className="w-4 h-4 text-rose-500" />
        </div>
        <div className="text-2xl font-bold text-foreground mt-2">{overdueSessions}</div>
        <p className="text-[11px] text-muted-foreground mt-0.5">Requires review</p>
      </div>

      <div className="p-4 rounded-xl border bg-card shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground">Active Topics</span>
          <Flame className="w-4 h-4 text-amber-500" />
        </div>
        <div className="text-2xl font-bold text-foreground mt-2">{topics.length}</div>
        <p className="text-[11px] text-muted-foreground mt-0.5">In repetition pipeline</p>
      </div>
    </div>
  )
}
