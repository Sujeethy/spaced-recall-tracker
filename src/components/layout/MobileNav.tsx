import { Link, useRouterState } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Clock,
  GraduationCap,
  BookOpen,
  Calendar,
  Settings,
} from 'lucide-react'
import { useRecallSessions } from '../../hooks/useTopics'
import { getTodayDateString } from '../../services/spacedRecall'
import clsx from 'clsx'

const MOBILE_ITEMS = [
  { to: '/', label: 'Home', icon: LayoutDashboard },
  { to: '/today', label: 'Today', icon: Clock, showBadge: true },
  { to: '/courses', label: 'Courses', icon: GraduationCap },
  { to: '/topics', label: 'Topics', icon: BookOpen },
  { to: '/calendar', label: 'Calendar', icon: Calendar },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function MobileNav() {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname
  const { data: sessions = [] } = useRecallSessions()

  const today = getTodayDateString()
  const dueCount = sessions.filter(
    (s) => (s.status === 'due' && s.scheduledDate === today) || s.status === 'overdue'
  ).length

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-t px-2 py-1.5 flex items-center justify-around">
      {MOBILE_ITEMS.map((item) => {
        const Icon = item.icon
        const isActive =
          item.to === '/' ? currentPath === '/' : currentPath.startsWith(item.to)

        return (
          <Link
            key={item.to}
            to={item.to}
            className={clsx(
              'flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] font-medium transition-colors relative',
              isActive
                ? 'text-primary font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <div className="relative">
              <Icon className="w-5 h-5 mb-0.5" />
              {item.showBadge && dueCount > 0 && (
                <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full text-[9px] font-bold bg-amber-500 text-white min-w-3.5 text-center">
                  {dueCount}
                </span>
              )}
            </div>
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
