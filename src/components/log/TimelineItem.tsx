import type { TopicWithDetails } from '../../types'
import { DifficultyBadge } from '../common/Badge'
import { Link } from '@tanstack/react-router'
import { Calendar, ArrowRight } from 'lucide-react'

interface TimelineItemProps {
  topic: TopicWithDetails
}

export function TimelineItem({ topic }: TimelineItemProps) {
  return (
    <div className="relative pl-6 sm:pl-8 pb-6 border-l last:border-l-0">
      {/* Timeline dot */}
      <div className="absolute -left-1.5 top-0.5 w-3 h-3 rounded-full bg-primary ring-4 ring-background" />

      <div className="p-4 rounded-xl border bg-card hover:border-primary/40 transition-all space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{topic.learnedAt}</span>
            </span>
            {topic.category && (
              <span
                className="px-2 py-0.5 rounded text-[10px] font-medium"
                style={{
                  backgroundColor: `${topic.category.color}15`,
                  color: topic.category.color,
                }}
              >
                {topic.category.name}
              </span>
            )}
          </div>

          <DifficultyBadge difficulty={topic.difficulty} />
        </div>

        <Link
          to="/topics/$topicId"
          params={{ topicId: topic.id }}
          className="font-bold text-sm sm:text-base text-foreground hover:text-primary transition-colors block"
        >
          {topic.title}
        </Link>

        {topic.notes && (
          <p className="text-xs text-muted-foreground line-clamp-2">{topic.notes}</p>
        )}

        <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
          <span>{topic.completedRecallCount}/{topic.totalRecallCount} recalls completed</span>
          <Link
            to="/topics/$topicId"
            params={{ topicId: topic.id }}
            className="text-primary font-semibold hover:underline flex items-center gap-0.5"
          >
            Review <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}
