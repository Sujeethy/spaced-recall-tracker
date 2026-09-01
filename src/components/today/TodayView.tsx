import { useTopics, useRecallSessions } from '../../hooks/useTopics'
import { getTodayDateString } from '../../services/spacedRecall'
import { TodayProgressBar } from './TodayProgressBar'
import { OverdueSection } from './OverdueSection'
import { DueTodaySection } from './DueTodaySection'
import { CompletedSection } from './CompletedSection'
import { EmptyState } from '../common/EmptyState'
import { CheckCircle2, Plus } from 'lucide-react'
import { useUIStore } from '../../store/useUIStore'

export function TodayView() {
  const { data: topics = [], isLoading: loadingTopics } = useTopics()
  const { data: sessions = [], isLoading: loadingSessions } = useRecallSessions()
  const openQuickAdd = useUIStore((s) => s.openQuickAdd)

  const today = getTodayDateString()

  const dueSessions = sessions.filter(
    (s) => s.status === 'due' && s.scheduledDate === today
  )
  const overdueSessions = sessions.filter((s) => s.status === 'overdue')
  const completedTodaySessions = sessions.filter(
    (s) => s.status === 'completed' && s.completedAt && s.completedAt.startsWith(today)
  )

  const totalRequired = dueSessions.length + overdueSessions.length + completedTodaySessions.length

  if (loadingTopics || loadingSessions) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-20 bg-muted rounded-2xl" />
        <div className="h-40 bg-muted rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            Today's Recalls
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Active recall reviews scheduled for {today}
          </p>
        </div>

        <button
          type="button"
          onClick={openQuickAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Topic</span>
        </button>
      </div>

      <TodayProgressBar
        completedCount={completedTodaySessions.length}
        totalCount={totalRequired}
      />

      {totalRequired === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="No recalls scheduled for today!"
          description="Your review queue is clear. Learn something new and add it to the tracker to schedule your next spaced repetition intervals."
          actionLabel="+ Add New Topic"
          onAction={openQuickAdd}
        />
      ) : (
        <div className="space-y-6">
          <OverdueSection sessions={overdueSessions} topics={topics} />
          <DueTodaySection sessions={dueSessions} topics={topics} />
          <CompletedSection sessions={completedTodaySessions} topics={topics} />
        </div>
      )}
    </div>
  )
}
