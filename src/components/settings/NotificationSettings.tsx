import { useSettings, useUpdateSettings } from '../../hooks/useSettings'
import {
  getNotificationSupport,
  requestNotificationPermission,
  sendTestNotification,
} from '../../services/notifications'
import { Bell, Check, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

export function NotificationSettings() {
  const { data: settings } = useSettings()
  const updateSettingsMutation = useUpdateSettings()
  const { permission } = getNotificationSupport()

  const handleToggle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked
    if (checked && permission !== 'granted') {
      const res = await requestNotificationPermission()
      if (res !== 'granted') {
        toast.error('Browser notifications permission was not granted')
        return
      }
    }
    updateSettingsMutation.mutate({ notificationEnabled: checked })
  }

  const handleTest = () => {
    const ok = sendTestNotification()
    if (!ok) {
      toast.error('Failed to trigger test notification. Ensure notifications are allowed.')
    } else {
      toast.success('Test notification sent!')
    }
  }

  return (
    <div className="p-5 sm:p-6 rounded-2xl border bg-card/60 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-bold text-foreground">Browser Reminders</h3>
        </div>
        {permission === 'granted' ? (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <Check className="w-3 h-3" /> Permission Granted
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
            <AlertCircle className="w-3 h-3" /> Needs Permission
          </span>
        )}
      </div>

      <div className="space-y-3">
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <span className="text-xs font-semibold text-foreground block">
              Enable Daily Recall Reminders
            </span>
            <span className="text-[11px] text-muted-foreground">
              Receive a daily desktop or mobile alert when topics are due for review
            </span>
          </div>
          <input
            type="checkbox"
            checked={settings?.notificationEnabled || false}
            onChange={handleToggle}
            className="w-4 h-4 rounded text-primary focus:ring-primary"
          />
        </label>

        {settings?.notificationEnabled && (
          <div className="pt-2 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-foreground font-medium">Daily Reminder Time:</span>
              <input
                type="time"
                value={settings.notificationTime || '10:00'}
                onChange={(e) =>
                  updateSettingsMutation.mutate({ notificationTime: e.target.value })
                }
                className="px-2.5 py-1 text-xs border rounded-lg bg-background text-foreground"
              />
            </div>

            <button
              type="button"
              onClick={handleTest}
              className="px-3 py-1 text-xs font-medium border rounded-lg hover:bg-muted self-start sm:self-auto"
            >
              Send Test Notification
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
