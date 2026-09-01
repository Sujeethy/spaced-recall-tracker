import type { TopicWithDetails, RecallSession } from '../../types'
import { StatusBadge, DifficultyBadge } from '../common/Badge'
import { CheckCircle2, ExternalLink, Zap, ArrowRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useUIStore } from '../../store/useUIStore'
import { useCompleteRecall } from '../../hooks/useTopics'
import { EmptyState } from '../common/EmptyState'

interface TodayPriorityListProps {
  topics: TopicWithDetails[]
  sessions: RecallSession[]
  todayDate: string
}

export function TodayPriorityList({ topics, sessions, todayDate }: TodayPriorityListProps) {
  const openQuiz = useUIStore((s) => s.openQuiz)
  const openQuickAdd = useUIStore((s) => s.openQuickAdd)
  const completeMutation = useCompleteRecall()

  // Due today + Overdue sessions
  const activeSessions = sessions
    .filter(
      (s) =>
        s.status === 'overdue' ||
        (s.status === 'due' && s.scheduledDate === todayDate)
    )
    .sort((a) => (a.status === 'overdue' ? -1 : 1))

  if (activeSessions.length === 0) {
    return (
      <div className="mt-6 border rounded-2xl p-6 bg-card/40">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-foreground">Today's Recalls</h2>
          <Link to="/today" className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <EmptyState
          icon={CheckCircle2}
          title="All caught up for today! 🎉"
          description="You have completed all scheduled recall reviews. Add new topics learned today to expand your knowledge."
          actionLabel="+ Add New Topic"
          onAction={openQuickAdd}
        />
      </div>
    )
  }

  return (
    <div className="mt-6 border rounded-2xl p-5 sm:p-6 bg-card/40">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-foreground">Today's Priority Recalls</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {activeSessions.length} topic{activeSessions.length === 1 ? '' : 's'} scheduled for spaced repetition review
          </p>
        </div>
        <Link
          to="/today"
          className="text-xs font-semibold text-primary hover:text-primary/80 flex items-center gap-1"
        >
          Dedicated View <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-3">
        {activeSessions.map((session) => {
          const topic = topics.find((t) => t.id === session.topicId)
          if (!topic) return null

          const isOverdue = session.status === 'overdue'

          return (
            <div
              key={session.id}
              className="p-4 rounded-xl border bg-card hover:border-primary/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <StatusBadge status={session.status} />
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
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {topic.notes}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {topic.chatgptUrl && (
                  <a
                    href={topic.chatgptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg border text-muted-foreground hover:text-foreground hover:bg-muted text-xs flex items-center gap-1"
                    title="Open original ChatGPT prompt"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden lg:inline text-xs">ChatGPT</span>
                  </a>
                )}

                {topic.questions && topic.questions.length > 0 && (
                  <button
                    type="button"
                    onClick={() => openQuiz(topic.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs font-medium transition-colors"
                    title="Start active self-quiz"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Quiz</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => completeMutation.mutate({ sessionId: session.id })}
                  disabled={completeMutation.isPending}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity ${
                    isOverdue
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
                      : 'bg-primary text-primary-foreground hover:opacity-90 shadow-sm'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Recalled</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
