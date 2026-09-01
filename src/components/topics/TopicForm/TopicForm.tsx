import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { topicFormSchema, type TopicFormValues, type TopicWithDetails } from '../../../types'
import { getTodayDateString } from '../../../services/spacedRecall'
import { useCreateTopic, useUpdateTopic } from '../../../hooks/useTopics'
import { useCategories, useCreateCategory } from '../../../hooks/useCategories'
import { SchedulePreviewTable } from './SchedulePreviewTable'
import { QuestionBuilder } from './QuestionBuilder'
import { Plus, Tag as TagIcon, ExternalLink } from 'lucide-react'

interface TopicFormProps {
  initialData?: TopicWithDetails
  onSuccess?: () => void
  onCancel?: () => void
}

export function TopicForm({ initialData, onSuccess, onCancel }: TopicFormProps) {
  const today = getTodayDateString()
  const { data: categories = [] } = useCategories()
  const createCategoryMutation = useCreateCategory()
  const createTopicMutation = useCreateTopic()
  const updateTopicMutation = useUpdateTopic()

  const [newCatName, setNewCatName] = useState('')
  const [showNewCatInput, setShowNewCatInput] = useState(false)

  const form = useForm<TopicFormValues>({
    resolver: zodResolver(topicFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      learnedAt: initialData?.learnedAt || today,
      categoryId: initialData?.categoryId || (categories[0]?.id || ''),
      difficulty: initialData?.difficulty || 'medium',
      chatgptUrl: initialData?.chatgptUrl || '',
      description: initialData?.description || '',
      notes: initialData?.notes || '',
      tags: initialData?.tags?.map((t) => t.name).join(', ') || '',
      questions: initialData?.questions || [],
    },
  })

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = form
  const watchedLearnedAt = watch('learnedAt')
  const watchedDifficulty = watch('difficulty')

  const fieldArray = useFieldArray({
    control: form.control,
    name: 'questions',
  })

  const handleCreateCategory = async () => {
    if (!newCatName.trim()) return
    const newCat = await createCategoryMutation.mutateAsync({ name: newCatName.trim() })
    setValue('categoryId', newCat.id)
    setNewCatName('')
    setShowNewCatInput(false)
  }

  const onSubmit = async (values: TopicFormValues) => {
    if (initialData) {
      await updateTopicMutation.mutateAsync({ id: initialData.id, values })
    } else {
      await createTopicMutation.mutateAsync(values)
    }
    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Title */}
      <div>
        <label className="text-xs font-semibold text-foreground block mb-1">
          Topic Title <span className="text-rose-500">*</span>
        </label>
        <input
          {...register('title')}
          placeholder="e.g. PostgreSQL Index Types & EXPLAIN ANALYZE"
          className="w-full px-3.5 py-2 text-sm border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.title && (
          <p className="text-[11px] text-rose-500 mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Row: Learned Date + Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-foreground block mb-1">
            Learned Date <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            {...register('learnedAt')}
            className="w-full px-3 py-2 text-sm border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.learnedAt && (
            <p className="text-[11px] text-rose-500 mt-1">{errors.learnedAt.message}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-foreground">Category</label>
            <button
              type="button"
              onClick={() => setShowNewCatInput(!showNewCatInput)}
              className="text-[11px] text-primary hover:underline font-medium flex items-center gap-0.5"
            >
              <Plus className="w-3 h-3" /> {showNewCatInput ? 'Cancel' : 'New'}
            </button>
          </div>

          {showNewCatInput ? (
            <div className="flex gap-2">
              <input
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Category name"
                className="w-full px-3 py-1.5 text-xs border rounded-lg bg-background"
              />
              <button
                type="button"
                onClick={handleCreateCategory}
                className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium"
              >
                Add
              </button>
            </div>
          ) : (
            <select
              {...register('categoryId')}
              className="w-full px-3 py-2 text-sm border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="" disabled>Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Row: Difficulty + ChatGPT URL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-foreground block mb-1.5">
            Difficulty Level
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['easy', 'medium', 'hard'] as const).map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => setValue('difficulty', diff)}
                className={`py-1.5 px-3 text-xs font-medium rounded-lg border capitalize transition-colors ${
                  watchedDifficulty === diff
                    ? 'bg-primary/10 border-primary text-primary font-bold'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-foreground flex items-center gap-1 mb-1">
            <ExternalLink className="w-3 h-3 text-muted-foreground" />
            <span>ChatGPT Conversation Link (Optional)</span>
          </label>
          <input
            {...register('chatgptUrl')}
            placeholder="https://chatgpt.com/c/..."
            className="w-full px-3 py-2 text-sm border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Description / Summary Notes */}
      <div>
        <label className="text-xs font-semibold text-foreground block mb-1">
          Key Takeaways & Core Concepts (Notes)
        </label>
        <textarea
          {...register('notes')}
          rows={3}
          placeholder="Brief takeaways: formulas, architecture points, or code syntax to recall..."
          className="w-full px-3.5 py-2 text-sm border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="text-xs font-semibold text-foreground flex items-center gap-1 mb-1">
          <TagIcon className="w-3 h-3 text-muted-foreground" />
          <span>Tags (Comma separated)</span>
        </label>
        <input
          {...register('tags')}
          placeholder="postgres, indexing, sql-tuning"
          className="w-full px-3 py-2 text-sm border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Active Recall Question Builder */}
      <QuestionBuilder form={form} fieldArray={fieldArray} />

      {/* Live Spaced Recall Schedule Preview */}
      {!initialData && (
        <SchedulePreviewTable learnedAt={watchedLearnedAt || today} />
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-3 border-t">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-medium border hover:bg-muted"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-sm transition-opacity"
        >
          {initialData ? 'Save Changes' : 'Save Topic & Schedule Recalls'}
        </button>
      </div>
    </form>
  )
}
