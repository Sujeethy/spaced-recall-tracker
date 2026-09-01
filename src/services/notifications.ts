export interface NotificationPermissionState {
  supported: boolean
  permission: NotificationPermission | 'unsupported'
}

/**
 * Check if the browser environment supports Notifications
 */
export function getNotificationSupport(): NotificationPermissionState {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return { supported: false, permission: 'unsupported' }
  }
  return { supported: true, permission: Notification.permission }
}

/**
 * Request notification permission from the user
 */
export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported'
  }
  try {
    const permission = await Notification.requestPermission()
    return permission
  } catch {
    return Notification.permission
  }
}

/**
 * Trigger a browser notification if permitted
 */
export function showRecallNotification(
  dueCount: number,
  overdueCount: number,
  onClickUrl: string = '/today'
): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false
  }

  if (Notification.permission !== 'granted') {
    return false
  }

  const total = dueCount + overdueCount
  if (total === 0) return false

  let title = `🧠 ${dueCount} topic${dueCount === 1 ? '' : 's'} to recall today`
  let body = 'Daily spaced-recall keeps your technical knowledge fresh.'

  if (overdueCount > 0) {
    title = `⚠️ ${overdueCount} overdue & ${dueCount} due recall${total === 1 ? '' : 's'}`
    body = `You have ${overdueCount} overdue item${overdueCount === 1 ? '' : 's'}. Review them now!`
  }

  try {
    const notification = new Notification(title, {
      body,
      icon: '/pwa-192x192.png',
      badge: '/favicon.svg',
      tag: 'daily-spaced-recall',
    })

    notification.onclick = () => {
      window.focus()
      window.location.href = onClickUrl
      notification.close()
    }

    return true
  } catch {
    return false
  }
}

/**
 * Send a test notification
 */
export function sendTestNotification(): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) return false
  if (Notification.permission !== 'granted') return false

  try {
    new Notification('🧠 Spaced Recall Reminder Test', {
      body: 'Notifications are working! You will be reminded when technical recalls are due.',
      icon: '/pwa-192x192.png',
      tag: 'test-notification',
    })
    return true
  } catch {
    return false
  }
}