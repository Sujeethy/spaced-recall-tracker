import * as Dialog from '@radix-ui/react-dialog'
import type { TopicWithDetails, RecallSession } from '../../types'
import { StatusBadge } from '../common/Badge'
import { Calendar, X, CheckCircle2 } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { useCompleteRecall } from '../../hooks/useTopics'

interface DayDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  date: string
  sessions: RecallSession[]
  topics: TopicWithDetails[]
}

export function DayDetailModal({
  open,
  onOpenChange,
  date,
  sessions,
  topics,
}: DayDetailModalProps) {
  const completeMutation = useCompleteRecall()

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border rounded-2xl shadow-2xl p-6 w-[90vw] max-w-lg z-50 max-h-[85vh] overflow-y-auto focus:outline-none">
          <div className="flex items-center justify-between pb-3 border-b mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-500 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <Dialog.Title className="text-base font-bold text-foreground">
                  Recalls for {date}
                </Dialog.Title>
                <Dialog.Description className="text-xs text-muted-foreground">
                  {sessions.length} recall session{sessions.length === 1 ? '' : 's'} scheduled
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close className="p-1 rounded-lg text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </Dialog.Close>
          </div>

          {sessions.length === 0 ? (
            <p className="text-xs text-muted-foreground py-6 text-center">
              No recalls scheduled for this date.
            </p>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => {
                const topic = topics.find((t) => t.id === session.topicId)
                if (!topic) return null

                const isDone = session.status === 'completed'

                return (
                  <div
                    key={session.id}
                    className="p-3.5 rounded-xl border bg-card/60 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <StatusBadge status={session.status} />
                        <span className="text-[11px] font-semibold text-muted-foreground">
                          Day {session.intervalDays}
                        </span>
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
                        onClick={() => onOpenChange(false)}
                        className="text-xs sm:text-sm font-semibold text-foreground hover:text-primary transition-colors block truncate"
                      >
                        {topic.title}
                      </Link>
                    </div>

                    {!isDone && (
                      <button
                        type="button"
                        onClick={() => completeMutation.mutate({ sessionId: session.id })}
                        disabled={completeMutation.isPending}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 shrink-0 shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Done</span>
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
