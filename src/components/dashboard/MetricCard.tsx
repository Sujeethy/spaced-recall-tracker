import { LucideIcon } from 'lucide-react'
import clsx from 'clsx'

interface MetricCardProps {
  title: string
  value: number | string
  subtitle?: string
  icon: LucideIcon
  colorClass?: string
  onClick?: () => void
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  colorClass = 'text-primary bg-primary/10',
  onClick,
}: MetricCardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'p-4 rounded-xl border bg-card/60 shadow-sm flex items-start justify-between transition-all',
        onClick && 'cursor-pointer hover:border-primary/40 hover:shadow-md'
      )}
    >
      <div>
        <p className="text-xs font-medium text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold text-foreground mt-1 tracking-tight">{value}</h3>
        {subtitle && <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>

      <div className={clsx('p-2.5 rounded-lg shrink-0', colorClass)}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  )
}
