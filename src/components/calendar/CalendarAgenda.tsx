import type { TopicWithDetails, RecallSession } from '../../types'
import { StatusBadge } from '../common/Badge'
import { Link } from '@tanstack/react-router'
import { CheckCircle2 } from 'lucide-react'
import { useCompleteRecall } from '../../hooks/useTopics'

interface CalendarAgendaProps {
  sessions: RecallSession[]
  topics: TopicWithDetails[]
}

export function CalendarAgenda({ sessions, topics }: CalendarAgendaProps) {
  const completeMutation = useCompleteRecall()

  // Filter only upcoming / due / overdue sessions from today onwards or overdue
  const sortedSessions = [...sessions]
    .filter((s) => s.status !== 'completed' && s.status !== 'skipped')
    .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate))
    .slice(0, 25)

  if (sortedSessions.length === 0) {
    return (
      <div className="border rounded-2xl p-8 bg-card text-center text-sm text-muted-foreground">
        No upcoming scheduled recalls in the near queue.
      </div>
    )
  }

  return (
    <div className="border rounded-2xl bg-card overflow-hidden divide-y shadow-sm">
      {sortedSessions.map((session) => {
        const topic = topics.find((t) => t.id === session.topicId)
        if (!topic) return null

        return (
          <div
            key={session.id}
            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-start sm:items-center gap-3 min-w-0">
              <div className="w-16 text-center shrink-0">
                <span className="text-xs font-bold text-foreground block">
                  {session.scheduledDate}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Day {session.intervalDays}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <StatusBadge status={session.status} />
                  {topic.category && (
                    <span
                      className="px-1.5 py-0.2 rounded text-[10px] font-medium"
                      style={{
                        backgroundColor: `${topic.category.color}15`,
                        color: topic.category.color,
                      }}
                    >
                      {topic.category.name}
                    </span>
                  )}
                </div>

                <Link
                  to="/topics/$topicId"
                  params={{ topicId: topic.id }}
                  className="text-xs sm:text-sm font-semibold text-foreground hover:text-primary transition-colors block truncate"
                >
                  {topic.title}
                </Link>
              </div>
            </div>

            <button
              type="button"
              onClick={() => completeMutation.mutate({ sessionId: session.id })}
              disabled={completeMutation.isPending}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 self-end sm:self-center shadow-sm shrink-0"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark Complete</span>
            </button>
          </div>
        )
      })}
    </div>
  )
}
