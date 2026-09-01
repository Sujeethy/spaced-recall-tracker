import { useState } from 'react'
import type { TopicWithDetails, RecallSession } from '../../types'
import { StatusBadge, DifficultyBadge } from '../common/Badge'
import { AlertCircle, CheckCircle2, CalendarClock, SkipForward, ExternalLink } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { RescheduleDialog } from './RescheduleDialog'
import { useCompleteRecall, useRescheduleRecall, useSkipRecall } from '../../hooks/useTopics'

interface OverdueSectionProps {
  sessions: RecallSession[]
  topics: TopicWithDetails[]
}

export function OverdueSection({ sessions, topics }: OverdueSectionProps) {
  const completeMutation = useCompleteRecall()
  const rescheduleMutation = useRescheduleRecall()
  const skipMutation = useSkipRecall()

  const [rescheduleSession, setRescheduleSession] = useState<{
    session: RecallSession
    topicTitle: string
  } | null>(null)

  if (sessions.length === 0) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
        <AlertCircle className="w-4 h-4" />
        <span>Overdue Recalls ({sessions.length})</span>
      </div>

      <div className="space-y-2.5">
        {sessions.map((session) => {
          const topic = topics.find((t) => t.id === session.topicId)
          if (!topic) return null

          return (
            <div
              key={session.id}
              className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 hover:border-rose-500/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <StatusBadge status="overdue" />
                  <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                    Was due on {session.scheduledDate} (Day {session.intervalDays})
                  </span>
                  {topic.category && (
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{
                        backgroundColor: `${topic.category.color}20`,
                        color: topic.category.color,
                      }}
                    >
                      {topic.category.name}
                    </span>
                  )}
                  <DifficultyBadge difficulty={topic.difficulty} />
                </div>

                <Link
                  to="/topics/$topicId"
                  params={{ topicId: topic.id }}
                  className="font-semibold text-sm sm:text-base text-foreground hover:text-primary transition-colors block truncate"
                >
                  {topic.title}
                </Link>

                {topic.notes && (
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {topic.notes}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 self-end md:self-center shrink-0">
                {topic.chatgptUrl && (
                  <a
                    href={topic.chatgptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg border text-muted-foreground hover:text-foreground hover:bg-card text-xs"
                    title="Open original ChatGPT prompt"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setRescheduleSession({ session, topicTitle: topic.title })}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border hover:bg-card text-xs font-medium text-muted-foreground hover:text-foreground"
                  title="Reschedule to a future date"
                >
                  <CalendarClock className="w-3.5 h-3.5" />
                  <span>Reschedule</span>
                </button>

                <button
                  type="button"
                  onClick={() => skipMutation.mutate(session.id)}
                  disabled={skipMutation.isPending}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border hover:bg-card text-xs font-medium text-muted-foreground hover:text-foreground"
                  title="Skip this session"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                  <span>Skip</span>
                </button>

                <button
                  type="button"
                  onClick={() => completeMutation.mutate({ sessionId: session.id })}
                  disabled={completeMutation.isPending}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-opacity"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Complete Now</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {rescheduleSession && (
        <RescheduleDialog
          open={Boolean(rescheduleSession)}
          onOpenChange={(open) => !open && setRescheduleSession(null)}
          currentDate={rescheduleSession.session.scheduledDate}
          topicTitle={rescheduleSession.topicTitle}
          onReschedule={(newDate) =>
            rescheduleMutation.mutate({ sessionId: rescheduleSession.session.id, newDate })
          }
        />
      )}
    </div>
  )
}
