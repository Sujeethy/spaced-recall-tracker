import { useState } from 'react'
import { useParams, useNavigate, Link } from '@tanstack/react-router'
import { useTopic, useDeleteTopic } from '../../../hooks/useTopics'
import { RecallHistoryTable } from './RecallHistoryTable'
import { DifficultyBadge } from '../../common/Badge'
import { ConfirmDialog } from '../../common/ConfirmDialog'
import { useUIStore } from '../../../store/useUIStore'
import {
  ArrowLeft,
  ExternalLink,
  Zap,
  Trash2,
  Edit,
  Calendar,
} from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import { TopicForm } from '../TopicForm/TopicForm'

export function TopicDetailView() {
  const params = useParams({ strict: false }) as { topicId: string }
  const topicId = params.topicId
  const navigate = useNavigate()

  const { data: topic, isLoading } = useTopic(topicId)
  const deleteMutation = useDeleteTopic()
  const openQuiz = useUIStore((s) => s.openQuiz)

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="h-40 bg-muted rounded-2xl" />
        <div className="h-64 bg-muted rounded-xl" />
      </div>
    )
  }

  if (!topic) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-muted-foreground">Topic not found.</p>
        <button
          type="button"
          onClick={() => navigate({ to: '/topics' })}
          className="mt-3 text-xs text-primary font-semibold hover:underline"
        >
          Return to Topics Directory
        </button>
      </div>
    )
  }

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(topic.id)
    navigate({ to: '/topics' })
  }

  return (
    <div className="space-y-6">
      {/* Back button & Actions */}
      <div className="flex items-center justify-between">
        <Link
          to="/topics"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Topics</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditDialogOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium hover:bg-muted"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>

          <button
            type="button"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="p-1.5 rounded-lg border border-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 text-xs"
            title="Delete topic"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main topic header card */}
      <div className="p-6 rounded-2xl border bg-card/60 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {topic.category && (
            <span
              className="px-2.5 py-0.5 rounded text-xs font-medium"
              style={{
                backgroundColor: `${topic.category.color}15`,
                color: topic.category.color,
              }}
            >
              {topic.category.name}
            </span>
          )}
          <DifficultyBadge difficulty={topic.difficulty} />
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Learned on {topic.learnedAt}</span>
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
          {topic.title}
        </h1>

        {topic.description && (
          <p className="text-sm text-muted-foreground">{topic.description}</p>
        )}

        {topic.notes && (
          <div className="p-4 rounded-xl border bg-muted/40 text-xs sm:text-sm text-foreground">
            <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
              Key Concepts & Notes
            </div>
            <p className="whitespace-pre-wrap">{topic.notes}</p>
          </div>
        )}

        {/* Tags */}
        {topic.tags && topic.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {topic.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-0.5 rounded-md text-[11px] bg-secondary text-secondary-foreground font-mono"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Direct Action Launchers */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t">
          {topic.chatgptUrl && (
            <a
              href={topic.chatgptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border bg-card hover:bg-muted text-xs font-semibold text-foreground shadow-sm transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-emerald-500" />
              <span>Launch ChatGPT Prompt</span>
            </a>
          )}

          {topic.questions && topic.questions.length > 0 && (
            <button
              type="button"
              onClick={() => openQuiz(topic.id)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25 text-xs font-semibold shadow-sm transition-colors"
            >
              <Zap className="w-4 h-4" />
              <span>Launch Active Recall Quiz ({topic.questions.length})</span>
            </button>
          )}

          <div className="text-xs text-muted-foreground ml-auto">
            Progress: {topic.completedRecallCount} / {topic.totalRecallCount} completed
          </div>
        </div>
      </div>

      {/* Full Spaced-Recall Schedule Table */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-foreground">
          Spaced-Recall Schedule History
        </h2>
        <RecallHistoryTable
          sessions={topic.recallSessions || []}
          topicTitle={topic.title}
        />
      </div>

      {/* Edit Dialog */}
      <Dialog.Root open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border rounded-2xl shadow-2xl p-6 w-[95vw] max-w-2xl z-50 max-h-[90vh] overflow-y-auto focus:outline-none">
            <div className="pb-3 border-b mb-4">
              <Dialog.Title className="text-base font-bold text-foreground">
                Edit Topic
              </Dialog.Title>
            </div>
            <TopicForm
              initialData={topic}
              onSuccess={() => setIsEditDialogOpen(false)}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Topic?"
        description={`Are you sure you want to delete "${topic.title}"? This will permanently remove the topic and all of its ${topic.totalRecallCount} scheduled recall sessions.`}
        confirmText="Delete Topic"
        isDestructive
        onConfirm={handleDelete}
      />
    </div>
  )
}
