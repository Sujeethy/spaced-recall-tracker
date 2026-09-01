import { Link, useRouterState } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Clock,
  GraduationCap,
  BookOpen,
  Calendar,
  History,
  BarChart3,
  Settings,
  Database,
} from 'lucide-react'
import { useRecallSessions } from '../../hooks/useTopics'
import { getTodayDateString } from '../../services/spacedRecall'
import clsx from 'clsx'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/today', label: 'Today', icon: Clock, showBadge: true },
  { to: '/courses', label: 'Courses', icon: GraduationCap },
  { to: '/topics', label: 'Topics', icon: BookOpen },
  { to: '/calendar', label: 'Calendar', icon: Calendar },
  { to: '/log', label: 'Learning Log', icon: History },
  { to: '/stats', label: 'Statistics', icon: BarChart3 },
]

const BOTTOM_NAV_ITEMS = [
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/backup', label: 'Backup & Restore', icon: Database },
]

export function Sidebar() {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname
  const { data: sessions = [] } = useRecallSessions()

  const today = getTodayDateString()
  const dueCount = sessions.filter(
    (s) => (s.status === 'due' && s.scheduledDate === today) || s.status === 'overdue'
  ).length

  return (
    <aside className="hidden md:flex flex-col w-56 border-r bg-card/40 p-3 justify-between shrink-0 select-none">
      <div className="space-y-1">
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Workspace
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive =
            item.to === '/' ? currentPath === '/' : currentPath.startsWith(item.to)

          return (
            <Link
              key={item.to}
              to={item.to}
              className={clsx(
                'flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={clsx('w-4 h-4', isActive ? 'text-primary' : 'text-muted-foreground')} />
                <span>{item.label}</span>
              </div>

              {item.showBadge && dueCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400">
                  {dueCount}
                </span>
              )}
            </Link>
          )
        })}
      </div>

      <div className="space-y-1 pt-4 border-t">
        <div className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          System
        </div>
        {BOTTOM_NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = currentPath.startsWith(item.to)
          return (
            <Link
              key={item.to}
              to={item.to}
              className={clsx(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
