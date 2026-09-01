import type { TopicWithDetails, RecallSession } from '../../types'
import { CheckCircle2, RotateCcw } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { api } from '../../lib/api'
import { useQueryClient } from '@tanstack/react-query'
import { TOPICS_QUERY_KEY, SESSIONS_QUERY_KEY } from '../../hooks/useTopics'
import { toast } from 'sonner'

interface CompletedSectionProps {
  sessions: RecallSession[]
  topics: TopicWithDetails[]
}

export function CompletedSection({ sessions, topics }: CompletedSectionProps) {
  const queryClient = useQueryClient()

  if (sessions.length === 0) return null

  const handleUndo = async (session: RecallSession) => {
    try {
      await api.uncompleteRecallSession(session.id)
      queryClient.invalidateQueries({ queryKey: TOPICS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: SESSIONS_QUERY_KEY })
      toast.info('Recall marked as uncompleted')
    } catch {
      toast.error('Failed to undo recall')
    }
  }

  return (
    <div className="space-y-3 pt-4 border-t">
      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
        <CheckCircle2 className="w-4 h-4" />
        <span>Completed Today ({sessions.length})</span>
      </div>

      <div className="space-y-2">
        {sessions.map((session) => {
          const topic = topics.find((t) => t.id === session.topicId)
          if (!topic) return null

          const completedTime = session.completedAt
            ? new Date(session.completedAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })
            : ''

          return (
            <div
              key={session.id}
              className="p-3 rounded-xl border bg-muted/30 flex items-center justify-between gap-3 text-muted-foreground"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <Link
                  to="/topics/$topicId"
                  params={{ topicId: topic.id }}
                  className="text-xs sm:text-sm font-medium line-through hover:text-foreground transition-colors truncate"
                >
                  {topic.title}
                </Link>
                <span className="text-[11px] text-muted-foreground shrink-0">
                  (Day {session.intervalDays})
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {completedTime && (
                  <span className="text-[11px] text-muted-foreground hidden sm:inline">
                    {completedTime}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleUndo(session)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted"
                  title="Undo completion"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Undo</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
