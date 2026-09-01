import { useTopics, useRecallSessions } from '../../hooks/useTopics'
import { useCategories } from '../../hooks/useCategories'
import { RetentionStats } from './RetentionStats'
import { ForecastChart } from './ForecastChart'
import { CategoryBreakdown } from './CategoryBreakdown'

export function StatsView() {
  const { data: topics = [], isLoading: loadingTopics } = useTopics()
  const { data: sessions = [], isLoading: loadingSessions } = useRecallSessions()
  const { data: categories = [], isLoading: loadingCategories } = useCategories()

  if (loadingTopics || loadingSessions || loadingCategories) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded" />
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
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
          Learning & Retention Analytics
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Metrics on knowledge retention, review completion, and workload forecast
        </p>
      </div>

      <RetentionStats topics={topics} sessions={sessions} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ForecastChart sessions={sessions} />
        <CategoryBreakdown topics={topics} categories={categories} />
      </div>
    </div>
  )
}
