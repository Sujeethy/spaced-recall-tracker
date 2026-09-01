import type { TopicDifficulty, RecallStatus } from '../../types'
import clsx from 'clsx'

interface DifficultyBadgeProps {
  difficulty: TopicDifficulty
  className?: string
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  const styles = {
    easy: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    hard: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  }[difficulty]

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border capitalize',
        styles,
        className
      )}
    >
      {difficulty}
    </span>
  )
}

interface StatusBadgeProps {
  status: RecallStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = {
    overdue: {
      label: 'Overdue',
      style: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
      dot: 'bg-rose-500',
    },
    due: {
      label: 'Due Today',
      style: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
      dot: 'bg-amber-500 animate-pulse',
    },
    completed: {
      label: 'Completed',
      style: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      dot: 'bg-emerald-500',
    },
    upcoming: {
      label: 'Upcoming',
      style: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20',
      dot: 'bg-zinc-400',
    },
    skipped: {
      label: 'Skipped',
      style: 'bg-zinc-500/10 text-zinc-500 dark:text-zinc-500 border-zinc-500/20',
      dot: 'bg-zinc-400',
    },
    rescheduled: {
      label: 'Rescheduled',
      style: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
      dot: 'bg-indigo-500',
    },
  }[status]

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border',
        config.style,
        className
      )}
    >
      <span className={clsx('w-1.5 h-1.5 rounded-full', config.dot)} />
      {config.label}
    </span>
  )
}
