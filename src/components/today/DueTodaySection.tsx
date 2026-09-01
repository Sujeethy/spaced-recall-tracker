import { useState } from 'react'
import type { TopicWithDetails, RecallSession } from '../../types'
import { StatusBadge, DifficultyBadge } from '../common/Badge'
import { Clock, CheckCircle2, Zap, ExternalLink, CalendarClock } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useUIStore } from '../../store/useUIStore'
import { useCompleteRecall, useRescheduleRecall } from '../../hooks/useTopics'
import { RescheduleDialog } from './RescheduleDialog'

interface DueTodaySectionProps {
  sessions: RecallSession[]
  topics: TopicWithDetails[]
}

export function DueTodaySection({ sessions, topics }: DueTodaySectionProps) {
  const openQuiz = useUIStore((s) => s.openQuiz)
  const completeMutation = useCompleteRecall()
  const rescheduleMutation = useRescheduleRecall()

  const [rescheduleSession, setRescheduleSession] = useState<{
    session: RecallSession
    topicTitle: string
  } | null>(null)

  if (sessions.length === 0) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
        <Clock className="w-4 h-4" />
        <span>Due Today ({sessions.length})</span>
      </div>

      <div className="space-y-2.5">
        {sessions.map((session) => {
          const topic = topics.find((t) => t.id === session.topicId)
          if (!topic) return null

          return (
            <div
              key={session.id}
              className="p-4 rounded-xl border bg-card hover:border-amber-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <StatusBadge status="due" />
                  <span className="text-xs font-semibold text-muted-foreground">
                    Recall #{session.recallIndex + 1} (Day {session.intervalDays})
                  </span>
                  {topic.category && (
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{
                        backgroundColor: `${topic.category.color}15`,
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
                    className="p-2 rounded-lg border text-muted-foreground hover:text-foreground hover:bg-muted text-xs"
                    title="Open original ChatGPT prompt"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => setRescheduleSession({ session, topicTitle: topic.title })}
                  className="p-2 rounded-lg border text-muted-foreground hover:text-foreground hover:bg-muted text-xs"
                  title="Reschedule to later"
                >
                  <CalendarClock className="w-3.5 h-3.5" />
                </button>

                {topic.questions && topic.questions.length > 0 && (
                  <button
                    type="button"
                    onClick={() => openQuiz(topic.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs font-medium transition-colors"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Quiz</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => completeMutation.mutate({ sessionId: session.id })}
                  disabled={completeMutation.isPending}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 shadow-sm transition-opacity"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Complete</span>
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
