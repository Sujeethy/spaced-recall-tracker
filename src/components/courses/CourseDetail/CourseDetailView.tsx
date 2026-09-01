import { useState } from 'react'
import { useParams, useNavigate, Link } from '@tanstack/react-router'
import { useCourse, useDeleteCourse, useReorderTopicsInCourse } from '../../../hooks/useCourses'
import { useTopics } from '../../../hooks/useTopics'
import { TopicOrderRow } from './TopicOrderRow'
import { CourseFormModal } from '../CourseFormModal'
import { TopicForm } from '../../topics/TopicForm/TopicForm'
import { ConfirmDialog } from '../../common/ConfirmDialog'
import { EmptyState } from '../../common/EmptyState'
import {
  ArrowLeft,
  GraduationCap,
  Database,
  Layers,
  BookOpen,
  Server,
  Code,
  Sparkles,
  Edit,
  Trash2,
  Plus,
} from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import type { TopicWithDetails } from '../../../types'

const ICON_MAP: Record<string, any> = {
  GraduationCap,
  Database,
  Layers,
  BookOpen,
  Server,
  Code,
  Sparkles,
}

export function CourseDetailView() {
  const params = useParams({ strict: false }) as { courseId: string }
  const courseId = params.courseId
  const navigate = useNavigate()

  const { data: course, isLoading } = useCourse(courseId)
  const { data: allTopics = [] } = useTopics()
  const deleteCourseMutation = useDeleteCourse()
  const reorderMutation = useReorderTopicsInCourse()

  const [isEditCourseOpen, setIsEditCourseOpen] = useState(false)
  const [isDeleteCourseOpen, setIsDeleteCourseOpen] = useState(false)
  const [deleteTopicsCascade, setDeleteTopicsCascade] = useState(false)

  const [isAddTopicOpen, setIsAddTopicOpen] = useState(false)
  const [editingTopic, setEditingTopic] = useState<TopicWithDetails | null>(null)

  if (isLoading) {
    return (
      <div className="py-12 text-center text-xs text-muted-foreground animate-pulse">
        Loading course curriculum...
      </div>
    )
  }

  if (!course) {
    return (
      <div className="p-8 text-center space-y-3">
        <h2 className="text-lg font-bold text-foreground">Course Not Found</h2>
        <Link to="/courses" className="text-xs text-primary font-semibold hover:underline">
          ← Back to Courses
        </Link>
      </div>
    )
  }

  const IconComponent = ICON_MAP[course.icon] || GraduationCap

  // Filter topics belonging to this course and sort by orderIndex
  const courseTopics = allTopics
    .filter((t) => t.courseId === course.id)
    .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= courseTopics.length) return

    const newOrder = [...courseTopics]
    const [moved] = newOrder.splice(index, 1)
    newOrder.splice(newIndex, 0, moved)

    const orderedIds = newOrder.map((t) => t.id)
    reorderMutation.mutate({ courseId: course.id, orderedTopicIds: orderedIds })
  }

  const handleDeleteCourse = async () => {
    await deleteCourseMutation.mutateAsync({ id: course.id, deleteTopics: deleteTopicsCascade })
    navigate({ to: '/courses' })
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-in fade-in">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/courses"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Courses
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditCourseOpen(true)}
            className="px-3 py-1.5 rounded-xl border hover:bg-muted text-xs font-semibold text-foreground flex items-center gap-1.5"
          >
            <Edit className="w-3.5 h-3.5" /> Edit Course
          </button>
          <button
            type="button"
            onClick={() => setIsDeleteCourseOpen(true)}
            className="px-3 py-1.5 rounded-xl border border-rose-500/30 hover:bg-rose-500/10 text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      </div>

      {/* Course Header Banner */}
      <div className="p-6 rounded-2xl border bg-card/60 relative overflow-hidden shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md"
              style={{ backgroundColor: `${course.color}20`, color: course.color }}
            >
              <IconComponent className="w-6 h-6" />
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">{course.title}</h1>
              {course.description && (
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{course.description}</p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAddTopicOpen(true)}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 flex items-center justify-center gap-1.5 shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Topic to Course
          </button>
        </div>

        {/* Progress bar */}
        <div className="pt-2 border-t space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {courseTopics.length} Curriculum Topics • {course.completedRecallCount}/{course.totalRecallCount} Total Recalls
            </span>
            <span className="font-bold text-foreground">{course.progressPercentage}% Mastered</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${course.progressPercentage}%`,
                backgroundColor: course.color,
              }}
            />
          </div>
        </div>
      </div>

      {/* Curriculum Topics Ordered List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">Curriculum Topics ({courseTopics.length})</h2>
          <span className="text-xs text-muted-foreground">Use arrows to reorder learning sequence</span>
        </div>

        {courseTopics.length === 0 ? (
          <EmptyState
            title="No topics in this course yet"
            description="Start building your learning curriculum by adding technical topics to this course."
            actionLabel="Add First Topic"
            onAction={() => setIsAddTopicOpen(true)}
          />
        ) : (
          <div className="space-y-2.5">
            {courseTopics.map((topic, index) => (
              <TopicOrderRow
                key={topic.id}
                topic={topic}
                index={index}
                totalTopics={courseTopics.length}
                onMoveUp={() => handleMove(index, 'up')}
                onMoveDown={() => handleMove(index, 'down')}
                onEdit={(t) => setEditingTopic(t)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Course Modal */}
      <CourseFormModal
        open={isEditCourseOpen}
        onOpenChange={setIsEditCourseOpen}
        initialData={course}
      />

      {/* Delete Course Confirm Dialog */}
      <ConfirmDialog
        open={isDeleteCourseOpen}
        onOpenChange={setIsDeleteCourseOpen}
        title={`Delete course "${course.title}"?`}
        description={
          <div className="space-y-3 text-xs">
            <p>
              Are you sure you want to delete this course? You can choose to keep the topics as
              standalone or delete all topics inside this course.
            </p>
            <label className="flex items-center gap-2 p-2.5 rounded-lg border bg-muted/40 cursor-pointer">
              <input
                type="checkbox"
                checked={deleteTopicsCascade}
                onChange={(e) => setDeleteTopicsCascade(e.target.checked)}
                className="rounded border-zinc-700 text-rose-600 focus:ring-rose-500"
              />
              <span className="font-medium text-foreground">
                Also delete all {courseTopics.length} topic(s) inside this course
              </span>
            </label>
          </div>
        }
        confirmText="Yes, Delete Course"
        isDestructive={true}
        onConfirm={handleDeleteCourse}
      />

      {/* Add Topic Dialog */}
      <Dialog.Root open={isAddTopicOpen} onOpenChange={setIsAddTopicOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border rounded-2xl shadow-2xl p-6 w-[95vw] max-w-2xl z-50 max-h-[90vh] overflow-y-auto focus:outline-none">
            <TopicForm
              initialCourseId={course.id}
              initialOrderIndex={courseTopics.length}
              onSuccess={() => setIsAddTopicOpen(false)}
              onCancel={() => setIsAddTopicOpen(false)}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Edit Topic Dialog */}
      <Dialog.Root open={Boolean(editingTopic)} onOpenChange={(open) => !open && setEditingTopic(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border rounded-2xl shadow-2xl p-6 w-[95vw] max-w-2xl z-50 max-h-[90vh] overflow-y-auto focus:outline-none">
            {editingTopic && (
              <TopicForm
                initialData={editingTopic}
                onSuccess={() => setEditingTopic(null)}
                onCancel={() => setEditingTopic(null)}
              />
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
