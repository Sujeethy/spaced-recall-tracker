import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { topicFormSchema, type TopicFormValues, type TopicWithDetails, type TopicStatus } from '../../../types'
import { getTodayDateString, getYesterdayDateString } from '../../../services/spacedRecall'
import { useCreateTopic, useUpdateTopic } from '../../../hooks/useTopics'
import { useCategories, useCreateCategory } from '../../../hooks/useCategories'
import { useCourses } from '../../../hooks/useCourses'
import { SchedulePreviewTable } from './SchedulePreviewTable'
import { QuestionBuilder } from './QuestionBuilder'
import { MarkdownEditor } from '../../common/MarkdownEditor'
import {
  Plus,
  Tag as TagIcon,
  ExternalLink,
  GraduationCap,
  CheckCircle2,
  HelpCircle,
  FileText,
  Bookmark,
  FileCode,
} from 'lucide-react'

interface TopicFormProps {
  initialData?: TopicWithDetails
  initialCourseId?: string
  initialOrderIndex?: number
  onSuccess?: () => void
  onCancel?: () => void
}

const STATUS_OPTIONS: { value: TopicStatus; label: string }[] = [
  { value: 'yet_to_start', label: 'Yet to Start' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'draft', label: 'Draft' },
  { value: 'skipped', label: 'Skipped' },
]

export function TopicForm({
  initialData,
  initialCourseId,
  initialOrderIndex,
  onSuccess,
  onCancel,
}: TopicFormProps) {
  const today = getTodayDateString()
  const yesterday = getYesterdayDateString()

  const { data: categories = [] } = useCategories()
  const { data: courses = [] } = useCourses()
  const createCategoryMutation = useCreateCategory()
  const createTopicMutation = useCreateTopic()
  const updateTopicMutation = useUpdateTopic()

  const [newCatName, setNewCatName] = useState('')
  const [showNewCatInput, setShowNewCatInput] = useState(false)
  const [activeNotesTab, setActiveNotesTab] = useState<'full' | 'keyNotes' | 'definitions' | 'questions'>('full')

  const initialFullTopic = initialData?.fullTopic || initialData?.markdownNotes || ''
  const initialKeyNotes = initialData?.keyNotes || initialData?.notes || ''

  const form = useForm<TopicFormValues>({
    resolver: zodResolver(topicFormSchema),
    defaultValues: {
      title: initialData?.title || '',
      courseId: initialData?.courseId || initialCourseId || null,
      orderIndex: initialData?.orderIndex ?? initialOrderIndex ?? 0,
      status: initialData?.status || 'yet_to_start',
      completedAt: initialData?.completedAt || (initialData?.status === 'completed' ? today : null),
      learnedAt: initialData?.learnedAt || today,
      categoryId: initialData?.categoryId || categories[0]?.id || '',
      difficulty: initialData?.difficulty || 'medium',
      chatgptUrl: initialData?.chatgptUrl || '',
      description: initialData?.description || '',
      fullTopic: initialFullTopic,
      keyNotes: initialKeyNotes,
      notes: initialKeyNotes,
      markdownNotes: initialFullTopic,
      definitions: initialData?.definitions || '',
      questionsMarkdown: initialData?.questionsMarkdown || '',
      tags: initialData?.tags?.map((t) => t.name).join(', ') || '',
      questions: initialData?.questions || [],
    },
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form

  const watchedStatus = watch('status')
  const watchedCompletedAt = watch('completedAt')
  const watchedDifficulty = watch('difficulty')
  const watchedFullTopic = watch('fullTopic') || ''
  const watchedKeyNotes = watch('keyNotes') || ''
  const watchedDefinitions = watch('definitions') || ''
  const watchedQuestionsMarkdown = watch('questionsMarkdown') || ''

  // If status transitions to completed, default completedAt to today if unset
  useEffect(() => {
    if (watchedStatus === 'completed' && !watchedCompletedAt) {
      setValue('completedAt', today, { shouldDirty: true })
    }
  }, [watchedStatus, watchedCompletedAt, setValue, today])

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
    // Keep legacy aliases synced
    const finalValues = {
      ...values,
      markdownNotes: values.fullTopic,
      notes: values.keyNotes,
    }

    if (initialData) {
      await updateTopicMutation.mutateAsync({ id: initialData.id, values: finalValues })
    } else {
      await createTopicMutation.mutateAsync(finalValues)
    }
    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="border-b pb-3">
        <h2 className="text-base font-bold text-foreground">
          {initialData ? 'Edit Topic' : 'Add New Topic'}
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Define topic details and 4 dedicated Markdown study sections (Full Topic, Key Notes, Definitions, Questions).
        </p>
      </div>

      {/* Title */}
      <div>
        <label className="text-xs font-semibold text-foreground block mb-1">
          Topic Title *
        </label>
        <input
          {...register('title')}
          placeholder="e.g. Execution Context & Call Stack"
          className="w-full px-3 py-2 text-xs sm:text-sm border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.title && (
          <p className="text-xs text-destructive mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Course & Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-foreground flex items-center gap-1 mb-1">
            <GraduationCap className="w-3.5 h-3.5 text-primary" />
            <span>Belongs to Course (Curriculum)</span>
          </label>
          <select
            {...register('courseId')}
            className="w-full px-3 py-2 text-xs sm:text-sm border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">No Course (Standalone Topic)</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-foreground">
              Category *
            </label>
            <button
              type="button"
              onClick={() => setShowNewCatInput(!showNewCatInput)}
              className="text-[11px] text-primary hover:underline flex items-center gap-0.5"
            >
              <Plus className="w-3 h-3" /> New Category
            </button>
          </div>

          {showNewCatInput ? (
            <div className="flex gap-2">
              <input
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Category name"
                className="flex-1 px-3 py-2 text-xs border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={handleCreateCategory}
                className="px-3 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-xl hover:bg-primary/90"
              >
                Add
              </button>
            </div>
          ) : (
            <select
              {...register('categoryId')}
              className="w-full px-3 py-2 text-xs sm:text-sm border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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

      {/* Row: Status & Completion Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-xl border bg-muted/20">
        <div>
          <label className="text-xs font-semibold text-foreground block mb-1">
            Study Status
          </label>
          <select
            {...register('status')}
            className="w-full px-3 py-2 text-xs sm:text-sm border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {watchedStatus === 'completed' ? (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Completed Date</span>
              </label>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setValue('completedAt', today, { shouldDirty: true })}
                  className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border border-emerald-500/30"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setValue('completedAt', yesterday, { shouldDirty: true })}
                  className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-muted hover:bg-muted/80 text-foreground border"
                >
                  Yesterday
                </button>
              </div>
            </div>
            <input
              type="date"
              {...register('completedAt')}
              className="w-full px-3 py-2 text-xs sm:text-sm border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        ) : (
          <div className="flex items-center text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-lg border border-dashed">
            <span>
              💡 Spaced-recall sessions will automatically begin once you mark this topic as <strong>Completed</strong>.
            </span>
          </div>
        )}
      </div>

      {/* Row: Difficulty + ChatGPT Link */}
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
            <span>ChatGPT / Claude Link (Optional)</span>
          </label>
          <input
            {...register('chatgptUrl')}
            placeholder="https://chatgpt.com/c/..."
            className="w-full px-3 py-2 text-xs sm:text-sm border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* 4 Markdown Study Sections: Full Topic, Key Notes, Definitions, Questions */}
      <div className="space-y-3 p-4 rounded-2xl border bg-card/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-2.5">
          <span className="text-xs font-bold text-foreground">
            Markdown Study & Recall Content (4 Fields)
          </span>
          {/* Section Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-muted/60">
            <button
              type="button"
              onClick={() => setActiveNotesTab('full')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${
                activeNotesTab === 'full'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-primary" />
              Full Topic
            </button>

            <button
              type="button"
              onClick={() => setActiveNotesTab('keyNotes')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${
                activeNotesTab === 'keyNotes'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-emerald-500" />
              Key Notes
            </button>

            <button
              type="button"
              onClick={() => setActiveNotesTab('definitions')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${
                activeNotesTab === 'definitions'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-500" />
              Definitions
            </button>

            <button
              type="button"
              onClick={() => setActiveNotesTab('questions')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${
                activeNotesTab === 'questions'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
              Questions
            </button>
          </div>
        </div>

        {/* Tab 1: Full Topic Notes */}
        {activeNotesTab === 'full' && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Comprehensive deep dive, architecture diagrams, step-by-step guides, code implementations</span>
            </div>
            <MarkdownEditor
              value={watchedFullTopic}
              onChange={(val) => {
                setValue('fullTopic', val, { shouldDirty: true })
                setValue('markdownNotes', val, { shouldDirty: true })
              }}
              placeholder="Write full comprehensive topic notes, deep dive explanations, code examples..."
              rows={8}
            />
          </div>
        )}

        {/* Tab 2: Key Notes */}
        {activeNotesTab === 'keyNotes' && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Quick key takeaways, bullet points, mental models, must-remember summaries</span>
            </div>
            <MarkdownEditor
              value={watchedKeyNotes}
              onChange={(val) => {
                setValue('keyNotes', val, { shouldDirty: true })
                setValue('notes', val, { shouldDirty: true })
              }}
              placeholder="### Key Takeaways & Mental Models&#10;&#10;- **Takeaway 1**: ...&#10;- **Takeaway 2**: ..."
              rows={8}
            />
          </div>
        )}

        {/* Tab 3: Definitions */}
        {activeNotesTab === 'definitions' && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Core terms, glossaries, one-liners, and crucial technical definitions</span>
            </div>
            <MarkdownEditor
              value={watchedDefinitions}
              onChange={(val) => setValue('definitions', val, { shouldDirty: true })}
              placeholder="### Key Terminology & Definitions&#10;&#10;- **Term 1**: Definition...&#10;- **Term 2**: Definition..."
              rows={8}
            />
          </div>
        )}

        {/* Tab 4: Questions */}
        {activeNotesTab === 'questions' && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Interview questions, edge-case challenges, code outputs & active-recall prompts</span>
            </div>
            <MarkdownEditor
              value={watchedQuestionsMarkdown}
              onChange={(val) => setValue('questionsMarkdown', val, { shouldDirty: true })}
              placeholder="### Top Interview Questions&#10;&#10;1. **Question**: ...&#10;   - *Answer/Explanation*: ...&#10;2. **What is the output of this code?**&#10;   ```js&#10;   console.log(...);&#10;   ```"
              rows={8}
            />
          </div>
        )}
      </div>

      {/* Tags */}
      <div>
        <label className="text-xs font-semibold text-foreground flex items-center gap-1 mb-1">
          <TagIcon className="w-3 h-3 text-muted-foreground" />
          <span>Tags (Comma separated)</span>
        </label>
        <input
          {...register('tags')}
          placeholder="javascript, event-loop, interview-sprint"
          className="w-full px-3 py-2 text-xs sm:text-sm border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Active Recall Flashcard Question Builder */}
      <QuestionBuilder form={form} fieldArray={fieldArray} />

      {/* Live Spaced Recall Schedule Preview (Only when completed) */}
      {watchedStatus === 'completed' && (
        <SchedulePreviewTable learnedAt={watchedCompletedAt || today} />
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
          {initialData ? 'Save Changes' : 'Save Topic'}
        </button>
      </div>
    </form>
  )
}
