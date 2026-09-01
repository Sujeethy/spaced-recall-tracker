import { Flame, Sparkles } from 'lucide-react'

interface StreakBannerProps {
  currentStreak: number
  longestStreak: number
}

export function StreakBanner({ currentStreak, longestStreak }: StreakBannerProps) {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date())

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent border">
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>{todayFormatted}</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
          {getGreeting()} 👋
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          "What did I learn today?" and "What do I recall today?"
        </p>
      </div>

      <div className="flex items-center gap-3 bg-card/80 backdrop-blur-sm border px-3.5 py-2 rounded-xl self-start sm:self-auto">
        <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center font-bold">
          <Flame className="w-5 h-5 fill-amber-500 text-amber-500 animate-pulse" />
        </div>
        <div>
          <div className="text-xs font-bold text-foreground flex items-center gap-1">
            <span>{currentStreak} Day Streak</span>
          </div>
          <p className="text-[10px] text-muted-foreground">Longest: {longestStreak} days</p>
        </div>
      </div>
    </div>
  )
}
