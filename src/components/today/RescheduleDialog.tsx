import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Calendar, X } from 'lucide-react'
import { getTodayDateString, addDaysToDateString } from '../../services/spacedRecall'

interface RescheduleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentDate?: string
  topicTitle: string
  onReschedule: (newDate: string) => void
}

export function RescheduleDialog({
  open,
  onOpenChange,
  topicTitle,
  onReschedule,
}: RescheduleDialogProps) {
  const today = getTodayDateString()
  const [selectedDate, setSelectedDate] = useState(today)

  const quickOffsets = [
    { label: 'Today', days: 0 },
    { label: 'Tomorrow', days: 1 },
    { label: 'In 3 Days', days: 3 },
    { label: 'In 1 Week', days: 7 },
  ]

  const handleConfirm = () => {
    if (selectedDate) {
      onReschedule(selectedDate)
      onOpenChange(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border rounded-2xl shadow-2xl p-6 w-[90vw] max-w-md z-50 focus:outline-none">
          <div className="flex items-center justify-between pb-3 border-b mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-500 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <Dialog.Title className="text-base font-bold text-foreground">
                Reschedule Recall
              </Dialog.Title>
            </div>
            <Dialog.Close className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </Dialog.Close>
          </div>

          <p className="text-xs text-muted-foreground mb-4">
            Rescheduling for: <span className="font-semibold text-foreground">{topicTitle}</span>
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                Quick Presets
              </label>
              <div className="grid grid-cols-2 gap-2">
                {quickOffsets.map((preset) => {
                  const target = addDaysToDateString(today, preset.days)
                  const isSelected = selectedDate === target

                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setSelectedDate(target)}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border text-left transition-colors ${
                        isSelected
                          ? 'bg-primary/10 border-primary text-primary font-semibold'
                          : 'hover:bg-muted text-foreground'
                      }`}
                    >
                      <div>{preset.label}</div>
                      <div className="text-[10px] text-muted-foreground">{target}</div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                Or Select Custom Date
              </label>
              <input
                type="date"
                min={today}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-3 border-t">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium border hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-4 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 shadow-sm"
            >
              Save New Date
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
