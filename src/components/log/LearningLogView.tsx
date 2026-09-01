import { useTopics } from '../../hooks/useTopics'
import { TimelineItem } from './TimelineItem'
import { EmptyState } from '../common/EmptyState'
import { History, BookOpen } from 'lucide-react'
import { useUIStore } from '../../store/useUIStore'

export function LearningLogView() {
  const { data: topics = [], isLoading } = useTopics()
  const openQuickAdd = useUIStore((s) => s.openQuickAdd)

  // Sort by learnedAt descending
  const sortedTopics = [...topics].sort((a, b) => b.learnedAt.localeCompare(a.learnedAt))

  // Group by Month Year
  const groupedByMonth: Record<string, typeof sortedTopics> = {}
  sortedTopics.forEach((t) => {
    const date = new Date(`${t.learnedAt}T00:00:00Z`)
    const monthKey = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(date)

    if (!groupedByMonth[monthKey]) {
      groupedByMonth[monthKey] = []
    }
    groupedByMonth[monthKey].push(t)
  })

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="h-64 bg-muted rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            Learning Log
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Your personal chronological timeline of concepts and topics learned
          </p>
        </div>

        <div className="flex items-center gap-3 bg-muted/60 px-3.5 py-1.5 rounded-xl border text-xs font-semibold self-start sm:self-auto">
          <BookOpen className="w-4 h-4 text-primary" />
          <span>{topics.length} Total Concepts Logged</span>
        </div>
      </div>

      {sortedTopics.length === 0 ? (
        <EmptyState
          icon={History}
          title="Your learning log is empty"
          description="Record your first topic to start tracking your knowledge timeline and automated recall sessions."
          actionLabel="+ Add Learned Topic"
          onAction={openQuickAdd}
        />
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedByMonth).map(([monthYear, monthTopics]) => (
            <div key={monthYear} className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">{monthYear}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground">
                  {monthTopics.length} topic{monthTopics.length === 1 ? '' : 's'}
                </span>
                <div className="flex-1 h-px bg-border ml-2" />
              </div>

              <div className="pl-2">
                {monthTopics.map((topic) => (
                  <TimelineItem key={topic.id} topic={topic} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
