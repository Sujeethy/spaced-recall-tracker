import { IntervalScheduleEditor } from './IntervalScheduleEditor'
import { NotificationSettings } from './NotificationSettings'
import { SupabaseSettings } from './SupabaseSettings'
import { useUIStore } from '../../store/useUIStore'
import { Moon, Sun, Laptop } from 'lucide-react'

export function SettingsView() {
  const theme = useUIStore((s) => s.theme)
  const setTheme = useUIStore((s) => s.setTheme)

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
          Application Settings
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Configure recall intervals, sync settings, and notification preferences
        </p>
      </div>

      {/* Theme selection card */}
      <div className="p-5 sm:p-6 rounded-2xl border bg-card/60 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-foreground">Theme & Appearance</h3>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
              theme === 'light'
                ? 'bg-primary/10 border-primary text-primary shadow-sm'
                : 'hover:bg-muted text-muted-foreground'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Light</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
              theme === 'dark'
                ? 'bg-primary/10 border-primary text-primary shadow-sm'
                : 'hover:bg-muted text-muted-foreground'
            }`}
          >
            <Moon className="w-4 h-4 text-indigo-400" />
            <span>Dark</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme('system')}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${
              theme === 'system'
                ? 'bg-primary/10 border-primary text-primary shadow-sm'
                : 'hover:bg-muted text-muted-foreground'
            }`}
          >
            <Laptop className="w-4 h-4 text-zinc-400" />
            <span>System</span>
          </button>
        </div>
      </div>

      <IntervalScheduleEditor />
      <NotificationSettings />
      <SupabaseSettings />
    </div>
  )
}
