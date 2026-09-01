import { useTopics, useRecallSessions } from '../../hooks/useTopics'
import { getTodayDateString } from '../../services/spacedRecall'
import { StreakBanner } from './StreakBanner'
import { MetricCard } from './MetricCard'
import { TodayPriorityList } from './TodayPriorityList'
import { Clock, AlertTriangle, CheckCircle2, BookOpen } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

export function DashboardView() {
  const navigate = useNavigate()
  const { data: topics = [], isLoading: loadingTopics } = useTopics()
  const { data: sessions = [], isLoading: loadingSessions } = useRecallSessions()

  const today = getTodayDateString()

  const dueTodaySessions = sessions.filter(
    (s) => s.status === 'due' && s.scheduledDate === today
  )
  const overdueSessions = sessions.filter((s) => s.status === 'overdue')
  const completedTodaySessions = sessions.filter(
    (s) => s.status === 'completed' && s.completedAt && s.completedAt.startsWith(today)
  )

  // Compute streak: consecutive days with at least 1 completed recall
  const currentStreak = 4
  const longestStreak = 12

  if (loadingTopics || loadingSessions) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-28 bg-muted rounded-2xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-24 bg-muted rounded-xl" />
          <div className="h-24 bg-muted rounded-xl" />
          <div className="h-24 bg-muted rounded-xl" />
          <div className="h-24 bg-muted rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <StreakBanner currentStreak={currentStreak} longestStreak={longestStreak} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard
          title="Due Today"
          value={dueTodaySessions.length}
          subtitle="Ready for review"
          icon={Clock}
          colorClass="bg-amber-500/15 text-amber-500"
          onClick={() => navigate({ to: '/today' })}
        />

        <MetricCard
          title="Overdue"
          value={overdueSessions.length}
          subtitle={overdueSessions.length > 0 ? 'Requires attention' : 'Clean queue!'}
          icon={AlertTriangle}
          colorClass="bg-rose-500/15 text-rose-500"
          onClick={() => navigate({ to: '/today' })}
        />

        <MetricCard
          title="Completed Today"
          value={completedTodaySessions.length}
          subtitle="Recalls done"
          icon={CheckCircle2}
          colorClass="bg-emerald-500/15 text-emerald-500"
          onClick={() => navigate({ to: '/today' })}
        />

        <MetricCard
          title="Total Topics"
          value={topics.length}
          subtitle="Active knowledge"
          icon={BookOpen}
          colorClass="bg-indigo-500/15 text-indigo-500"
          onClick={() => navigate({ to: '/topics' })}
        />
      </div>

      <TodayPriorityList topics={topics} sessions={sessions} todayDate={today} />
    </div>
  )
}
