import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Dialog from '@radix-ui/react-dialog'
import { courseFormSchema, type CourseFormValues, type CourseWithDetails } from '../../types'
import { useCreateCourse, useUpdateCourse } from '../../hooks/useCourses'
import {
  GraduationCap,
  Database,
  Layers,
  BookOpen,
  Server,
  Code,
  Sparkles,
  X,
  Check,
} from 'lucide-react'

interface CourseFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: CourseWithDetails | null
}

const COLOR_PRESETS = [
  '#6366f1', // Indigo
  '#3b82f6', // Blue
  '#0ea5e9', // Sky
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#14b8a6', // Teal
]

const ICONS = [
  { id: 'GraduationCap', icon: GraduationCap, label: 'Course' },
  { id: 'Database', icon: Database, label: 'Database' },
  { id: 'Layers', icon: Layers, label: 'Systems' },
  { id: 'Server', icon: Server, label: 'Backend' },
  { id: 'Code', icon: Code, label: 'Code' },
  { id: 'BookOpen', icon: BookOpen, label: 'Book' },
  { id: 'Sparkles', icon: Sparkles, label: 'AI' },
]

export function CourseFormModal({ open, onOpenChange, initialData }: CourseFormModalProps) {
  const createMutation = useCreateCourse()
  const updateMutation = useUpdateCourse()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: '',
      description: '',
      color: '#6366f1',
      icon: 'GraduationCap',
      status: 'active',
    },
  })

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description || '',
        color: initialData.color,
        icon: initialData.icon,
        status: initialData.status,
      })
    } else {
      reset({
        title: '',
        description: '',
        color: '#6366f1',
        icon: 'GraduationCap',
        status: 'active',
      })
    }
  }, [initialData, open, reset])

  const selectedColor = watch('color')
  const selectedIcon = watch('icon')

  const onSubmit = async (values: CourseFormValues) => {
    if (initialData) {
      await updateMutation.mutateAsync({ id: initialData.id, values })
    } else {
      await createMutation.mutateAsync(values)
    }
    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border rounded-2xl shadow-2xl p-6 w-[90vw] max-w-lg z-50 max-h-[90vh] overflow-y-auto focus:outline-none">
          <div className="flex items-center justify-between pb-3 border-b mb-4">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${selectedColor}20`, color: selectedColor }}
              >
                <GraduationCap className="w-4 h-4" />
              </div>
              <Dialog.Title className="text-base font-bold text-foreground">
                {initialData ? 'Edit Course' : 'Create New Course / Curriculum'}
              </Dialog.Title>
            </div>
            <Dialog.Close className="p-1 rounded-lg text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Course Title *
              </label>
              <input
                type="text"
                {...register('title')}
                placeholder="e.g. Distributed Systems & Consensus Mastery"
                className="w-full px-3.5 py-2.5 rounded-xl border bg-background text-sm text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              {errors.title && (
                <p className="text-xs text-rose-500 mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Description / Learning Goals
              </label>
              <textarea
                rows={2}
                {...register('description')}
                placeholder="Brief summary of topics covered in this track..."
                className="w-full px-3.5 py-2 rounded-xl border bg-background text-xs text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            {/* Icon Picker */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Course Icon
              </label>
              <div className="grid grid-cols-7 gap-2">
                {ICONS.map(({ id, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setValue('icon', id)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      selectedIcon === id
                        ? 'border-primary bg-primary/10 text-primary shadow-xs'
                        : 'border-muted hover:border-foreground/30 text-muted-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            {/* Color Palette */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Theme Color
              </label>
              <div className="flex flex-wrap gap-2">
                {COLOR_PRESETS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setValue('color', color)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform ${
                      selectedColor === color ? 'scale-110 ring-2 ring-offset-2 ring-primary' : ''
                    }`}
                    style={{ backgroundColor: color }}
                  >
                    {selectedColor === color && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Status
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 rounded-xl border bg-background text-xs text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="active">Active (Currently Learning)</option>
                <option value="completed">Completed (Curriculum Finished)</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Footer buttons */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
              >
                {initialData ? 'Save Changes' : 'Create Course'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
