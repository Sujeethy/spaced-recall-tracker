import { useState } from 'react'
import type { CourseWithDetails } from '../../types'
import { Link } from '@tanstack/react-router'
import {
  GraduationCap,
  Database,
  Layers,
  BookOpen,
  Server,
  Code,
  Sparkles,
  MoreVertical,
  Edit2,
  Trash2,
  ArrowRight,
} from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ConfirmDialog } from '../common/ConfirmDialog'
import { useDeleteCourse } from '../../hooks/useCourses'

interface CourseCardProps {
  course: CourseWithDetails
  onEdit: (course: CourseWithDetails) => void
}

const ICON_MAP: Record<string, any> = {
  GraduationCap,
  Database,
  Layers,
  BookOpen,
  Server,
  Code,
  Sparkles,
}

export function CourseCard({ course, onEdit }: CourseCardProps) {
  const deleteMutation = useDeleteCourse()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTopicsCascade, setDeleteTopicsCascade] = useState(false)

  const IconComponent = ICON_MAP[course.icon] || GraduationCap

  const handleDelete = () => {
    deleteMutation.mutate({ id: course.id, deleteTopics: deleteTopicsCascade })
  }

  return (
    <>
      <div className="p-5 rounded-2xl border bg-card hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between group">
        <div className="space-y-3">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                style={{
                  backgroundColor: `${course.color}20`,
                  color: course.color,
                }}
              >
                <IconComponent className="w-5 h-5" />
              </div>
              <div>
                <Link
                  to="/courses/$courseId"
                  params={{ courseId: course.id }}
                  className="font-bold text-base text-foreground hover:text-primary transition-colors block line-clamp-1"
                >
                  {course.title}
                </Link>
                <span className="text-xs text-muted-foreground">
                  {course.topicsCount} topic{course.topicsCount === 1 ? '' : 's'} in curriculum
                </span>
              </div>
            </div>

            {/* Actions Menu */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  type="button"
                  className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="end"
                  className="min-w-[160px] bg-card border rounded-xl shadow-xl p-1 z-50 text-xs animate-in fade-in"
                >
                  <DropdownMenu.Item
                    onClick={() => onEdit(course)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-muted text-foreground focus:outline-none"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit Course
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    onClick={() => setDeleteDialogOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 focus:outline-none"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Course
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>

          {course.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{course.description}</p>
          )}
        </div>

        {/* Progress & Bottom Info */}
        <div className="pt-4 mt-4 border-t space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">
              {course.topicsCompletedCount || 0} of {course.topicsCount} topics completed
            </span>
            <span className="font-bold text-primary">
              {course.progressPercentage}%
            </span>
          </div>

          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${course.progressPercentage}%`,
                backgroundColor: course.color,
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
            <span className="font-medium text-amber-600 dark:text-amber-400">
              {course.topicsRemainingCount || 0} left to complete
            </span>

            <Link
              to="/courses/$courseId"
              params={{ courseId: course.id }}
              className="font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Curriculum & Notes <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
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
                Also delete all {course.topicsCount} topic(s) inside this course
              </span>
            </label>
          </div>
        }
        confirmText="Yes, Delete Course"
        isDestructive={true}
        onConfirm={handleDelete}
      />
    </>
  )
}
