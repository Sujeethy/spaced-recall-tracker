import { useState } from 'react'
import type { RecallSession } from '../../../types'
import { StatusBadge } from '../../common/Badge'
import { CheckCircle2, CalendarClock, SkipForward } from 'lucide-react'
import { useCompleteRecall, useRescheduleRecall, useSkipRecall } from '../../../hooks/useTopics'
import { RescheduleDialog } from '../../today/RescheduleDialog'

interface RecallHistoryTableProps {
  sessions: RecallSession[]
  topicTitle: string
}

export function RecallHistoryTable({ sessions, topicTitle }: RecallHistoryTableProps) {
  const completeMutation = useCompleteRecall()
  const rescheduleMutation = useRescheduleRecall()
  const skipMutation = useSkipRecall()

  const [rescheduleSession, setRescheduleSession] = useState<RecallSession | null>(null)

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto border rounded-xl bg-card">
        <table className="w-full text-xs text-left">
          <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-semibold border-b">
            <tr>
              <th className="px-4 py-3">Recall #</th>
              <th className="px-4 py-3">Interval</th>
              <th className="px-4 py-3">Scheduled Date</th>
              <th className="px-4 py-3">Completed At</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {sessions.map((session) => {
              const isDone = session.status === 'completed'

              return (
                <tr key={session.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-semibold text-foreground">
                    #{session.recallIndex + 1}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground font-mono">
                    Day {session.intervalDays}
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">
                    {session.scheduledDate}
                    {session.rescheduledFrom && (
                      <span className="text-[10px] text-muted-foreground block">
                        (from {session.rescheduledFrom})
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {session.completedAt
                      ? new Date(session.completedAt).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={session.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {!isDone && (
                        <>
                          <button
                            type="button"
                            onClick={() => completeMutation.mutate({ sessionId: session.id })}
                            disabled={completeMutation.isPending}
                            className="p-1.5 rounded hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            title="Complete this recall"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setRescheduleSession(session)}
                            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                            title="Reschedule"
                          >
                            <CalendarClock className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => skipMutation.mutate(session.id)}
                            className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                            title="Skip"
                          >
                            <SkipForward className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {rescheduleSession && (
        <RescheduleDialog
          open={Boolean(rescheduleSession)}
          onOpenChange={(open) => !open && setRescheduleSession(null)}
          currentDate={rescheduleSession.scheduledDate}
          topicTitle={topicTitle}
          onReschedule={(newDate) =>
            rescheduleMutation.mutate({ sessionId: rescheduleSession.id, newDate })
          }
        />
      )}
    </div>
  )
}
