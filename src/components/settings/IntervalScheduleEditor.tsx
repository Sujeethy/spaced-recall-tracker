import { useState } from 'react'
import { DEFAULT_RECALL_INTERVALS } from '../../services/spacedRecall'
import { useSettings, useUpdateSettings } from '../../hooks/useSettings'
import { Clock, Plus, Trash2, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'

export function IntervalScheduleEditor() {
  const { data: settings } = useSettings()
  const updateSettingsMutation = useUpdateSettings()

  const intervals = settings?.recallIntervals || DEFAULT_RECALL_INTERVALS
  const [newInterval, setNewInterval] = useState('')

  const handleAdd = () => {
    const val = parseInt(newInterval, 10)
    if (isNaN(val) || val < 0) {
      toast.error('Please enter a non-negative number of days')
      return
    }
    if (intervals.includes(val)) {
      toast.error(`Interval of ${val} days already exists`)
      return
    }

    const updated = [...intervals, val].sort((a, b) => a - b)
    updateSettingsMutation.mutate({ recallIntervals: updated })
    setNewInterval('')
  }

  const handleRemove = (val: number) => {
    if (intervals.length <= 1) {
      toast.error('You must keep at least one recall interval')
      return
    }
    const updated = intervals.filter((i) => i !== val)
    updateSettingsMutation.mutate({ recallIntervals: updated })
  }

  const handleReset = () => {
    updateSettingsMutation.mutate({ recallIntervals: DEFAULT_RECALL_INTERVALS })
  }

  return (
    <div className="p-5 sm:p-6 rounded-2xl border bg-card/60 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">
            Spaced-Recall Interval Schedule
          </h3>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 font-medium"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        Default schedule (in day offsets from learned date). New topics will automatically generate recall sessions at these intervals.
      </p>

      {/* Interval tags */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {intervals.map((val, idx) => (
          <div
            key={val}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border bg-card text-xs font-semibold text-foreground shadow-sm"
          >
            <span>Day {val}</span>
            <span className="text-[10px] text-muted-foreground">#{idx + 1}</span>
            <button
              type="button"
              onClick={() => handleRemove(val)}
              className="text-muted-foreground hover:text-rose-500 ml-1"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      {/* Add interval */}
      <div className="flex items-center gap-2 pt-2">
        <input
          type="number"
          min="0"
          placeholder="New interval offset (days)..."
          value={newInterval}
          onChange={(e) => setNewInterval(e.target.value)}
          className="w-48 px-3 py-1.5 text-xs border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Interval</span>
        </button>
      </div>
    </div>
  )
}
