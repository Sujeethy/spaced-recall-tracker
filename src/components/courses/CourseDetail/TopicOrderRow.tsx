import { useState } from 'react'
import type { TopicWithDetails } from '../../../types'
import { DifficultyBadge } from '../../common/Badge'
import { Link } from '@tanstack/react-router'
import {
  ChevronUp,
  ChevronDown,
  Zap,
  ExternalLink,
  Edit2,
  Trash2,
  Calendar,
} from 'lucide-react'
import { useUIStore } from '../../../store/useUIStore'
import { ConfirmDialog } from '../../common/ConfirmDialog'
import { useDeleteTopic } from '../../../hooks/useTopics'

interface TopicOrderRowProps {
  topic: TopicWithDetails
  index: number
  totalTopics: number
  onMoveUp: () => void
  onMoveDown: () => void
  onEdit: (topic: TopicWithDetails) => void
}

export function TopicOrderRow({
  topic,
  index,
  totalTopics,
  onMoveUp,
  onMoveDown,
  onEdit,
}: TopicOrderRowProps) {
  const openQuiz = useUIStore((s) => s.openQuiz)
  const deleteMutation = useDeleteTopic()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const percent =
    topic.totalRecallCount === 0
      ? 0
      : Math.round((topic.completedRecallCount / topic.totalRecallCount) * 100)

  return (
    <>
      <div className="p-3.5 sm:p-4 rounded-xl border bg-card hover:border-primary/40 transition-all flex items-center justify-between gap-3 shadow-xs">
        {/* Order Reorder Controls & Index */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex flex-col items-center">
            <button
              type="button"
              disabled={index === 0}
              onClick={onMoveUp}
              className="p-0.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-20 disabled:hover:bg-transparent"
              title="Move Up"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={index === totalTopics - 1}
              onClick={onMoveDown}
              className="p-0.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-20 disabled:hover:bg-transparent"
              title="Move Down"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center font-mono font-bold text-xs text-foreground">
            {index + 1}
          </div>
        </div>

        {/* Topic Title & Meta */}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/topics/$topicId"
              params={{ topicId: topic.id }}
              className="font-bold text-xs sm:text-sm text-foreground hover:text-primary transition-colors block truncate"
            >
              {topic.title}
            </Link>
            <DifficultyBadge difficulty={topic.difficulty} />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Next: {topic.nextRecallDate || 'Done'}</span>
            </span>
            <span>
              {topic.completedRecallCount}/{topic.totalRecallCount} recalls ({percent}%)
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 shrink-0">
          {topic.chatgptUrl && (
            <a
              href={topic.chatgptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg border hover:bg-muted text-muted-foreground hover:text-foreground"
              title="Open ChatGPT conversation"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          {topic.questions && topic.questions.length > 0 && (
            <button
              type="button"
              onClick={() => openQuiz(topic.id)}
              className="p-1.5 rounded-lg border hover:bg-amber-500/10 text-amber-500 hover:text-amber-600"
              title="Active Recall Quiz"
            >
              <Zap className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => onEdit(topic)}
            className="p-1.5 rounded-lg border hover:bg-muted text-muted-foreground hover:text-foreground"
            title="Edit Topic"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setDeleteDialogOpen(true)}
            className="p-1.5 rounded-lg border hover:bg-rose-500/10 text-rose-600 dark:text-rose-400"
            title="Delete Topic"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={`Delete topic "${topic.title}"?`}
        description="This will permanently delete this topic and all its scheduled spaced-recall sessions. This action cannot be undone."
        confirmText="Yes, Delete Topic"
        isDestructive={true}
        onConfirm={() => deleteMutation.mutate(topic.id)}
      />
    </>
  )
}
