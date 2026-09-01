import type { TopicWithDetails, Category } from '../../types'
import { Folder } from 'lucide-react'

interface CategoryBreakdownProps {
  topics: TopicWithDetails[]
  categories: Category[]
}

export function CategoryBreakdown({ topics, categories }: CategoryBreakdownProps) {
  const totalTopics = topics.length

  const stats = categories.map((cat) => {
    const count = topics.filter((t) => t.categoryId === cat.id).length
    const percentage = totalTopics === 0 ? 0 : Math.round((count / totalTopics) * 100)
    return { ...cat, count, percentage }
  })

  return (
    <div className="p-5 sm:p-6 rounded-2xl border bg-card/60 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Folder className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">Topics by Category</h3>
        </div>
        <span className="text-xs text-muted-foreground">{categories.length} categories</span>
      </div>

      <div className="space-y-3 pt-2">
        {stats.map((cat) => (
          <div key={cat.id} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="font-semibold text-foreground">{cat.name}</span>
              </div>
              <span className="text-muted-foreground font-medium">
                {cat.count} topics ({cat.percentage}%)
              </span>
            </div>

            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${cat.percentage}%`,
                  backgroundColor: cat.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
