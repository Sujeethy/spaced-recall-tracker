import type { TopicWithDetails } from '../../types'
import { DifficultyBadge } from '../common/Badge'
import { Link } from '@tanstack/react-router'
import { Calendar, Zap, ExternalLink } from 'lucide-react'
import { useUIStore } from '../../store/useUIStore'

interface TopicCardProps {
  topic: TopicWithDetails
}

export function TopicCard({ topic }: TopicCardProps) {
  const openQuiz = useUIStore((s) => s.openQuiz)
  const percent = topic.totalRecallCount === 0
    ? 0
    : Math.round((topic.completedRecallCount / topic.totalRecallCount) * 100)

  return (
    <div className="p-4 sm:p-5 rounded-2xl border bg-card hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between">
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          {topic.category ? (
            <span
              className="px-2 py-0.5 rounded text-[11px] font-medium"
              style={{
                backgroundColor: `${topic.category.color}15`,
                color: topic.category.color,
              }}
            >
              {topic.category.name}
            </span>
          ) : (
            <span className="text-[11px] text-muted-foreground">General</span>
          )}
          <DifficultyBadge difficulty={topic.difficulty} />
        </div>

        <Link
          to="/topics/$topicId"
          params={{ topicId: topic.id }}
          className="font-bold text-sm sm:text-base text-foreground hover:text-primary transition-colors block line-clamp-2"
        >
          {topic.title}
        </Link>

        {topic.notes && (
          <p className="text-xs text-muted-foreground line-clamp-2">{topic.notes}</p>
        )}
      </div>

      <div className="pt-4 mt-3 border-t space-y-3">
        {/* Next recall & Progress */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Next: {topic.nextRecallDate || 'All done!'}</span>
          </span>
          <span className="font-semibold">
            {topic.completedRecallCount}/{topic.totalRecallCount} ({percent}%)
          </span>
        </div>

        {/* Progress line */}
        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-primary h-full rounded-full transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Card actions */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            {topic.chatgptUrl && (
              <a
                href={topic.chatgptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg border hover:bg-muted text-muted-foreground hover:text-foreground"
                title="Launch ChatGPT"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {topic.questions && topic.questions.length > 0 && (
              <button
                type="button"
                onClick={() => openQuiz(topic.id)}
                className="p-1.5 rounded-lg border hover:bg-amber-500/10 text-amber-500 hover:text-amber-600"
                title="Self-Quiz"
              >
                <Zap className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <Link
            to="/topics/$topicId"
            params={{ topicId: topic.id }}
            className="text-xs font-semibold text-primary hover:underline"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  )
}
