import type { TopicWithDetails } from '../../types'
import { DifficultyBadge, TopicStatusBadge } from '../common/Badge'
import { Link } from '@tanstack/react-router'
import { Calendar, Zap, ExternalLink, CheckCircle, Circle } from 'lucide-react'
import { useUIStore } from '../../store/useUIStore'
import { useUpdateTopic } from '../../hooks/useTopics'
import { getTodayDateString } from '../../services/spacedRecall'

interface TopicCardProps {
  topic: TopicWithDetails
}

export function TopicCard({ topic }: TopicCardProps) {
  const openQuiz = useUIStore((s) => s.openQuiz)
  const updateMutation = useUpdateTopic()
  const isCompleted = topic.status === 'completed'

  const percent = topic.totalRecallCount === 0
    ? 0
    : Math.round((topic.completedRecallCount / topic.totalRecallCount) * 100)

  const handleToggleCompleted = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isCompleted) {
      updateMutation.mutate({
        id: topic.id,
        values: { status: 'yet_to_start', completedAt: null },
      })
    } else {
      updateMutation.mutate({
        id: topic.id,
        values: { status: 'completed', completedAt: getTodayDateString() },
      })
    }
  }

  return (
    <div className="p-4 sm:p-5 rounded-2xl border bg-card hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between group">
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {topic.course && (
              <span
                className="px-2 py-0.5 rounded text-[10px] font-bold border truncate max-w-[140px]"
                style={{
                  backgroundColor: `${topic.course.color}15`,
                  color: topic.course.color,
                  borderColor: `${topic.course.color}30`,
                }}
              >
                {topic.course.title}
              </span>
            )}
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
          </div>
          <div className="flex items-center gap-1.5">
            <TopicStatusBadge status={topic.status} />
            <DifficultyBadge difficulty={topic.difficulty} />
          </div>
        </div>

        <Link
          to="/topics/$topicId"
          params={{ topicId: topic.id }}
          className="font-bold text-sm sm:text-base text-foreground hover:text-primary transition-colors block line-clamp-2"
        >
          {topic.title}
        </Link>

        {topic.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{topic.description}</p>
        )}
      </div>

      <div className="pt-4 mt-3 border-t space-y-3">
        {/* Next recall & Progress if completed */}
        {isCompleted ? (
          <>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <Calendar className="w-3.5 h-3.5" />
                <span>Next: {topic.nextRecallDate || 'All caught up!'}</span>
              </span>
              <span className="font-semibold text-foreground">
                {topic.completedRecallCount}/{topic.totalRecallCount} ({percent}%)
              </span>
            </div>

            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
          </>
        ) : (
          <div className="text-[11px] text-muted-foreground/80 italic py-0.5">
            Not completed yet • Spaced recall starts when marked Done
          </div>
        )}

        {/* Card actions */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={handleToggleCompleted}
            className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors ${
              isCompleted
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-muted/50 text-foreground hover:bg-muted border-border'
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Completed</span>
              </>
            ) : (
              <>
                <Circle className="w-3.5 h-3.5" />
                <span>Mark Done</span>
              </>
            )}
          </button>

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
        </div>
      </div>
    </div>
  )
}
