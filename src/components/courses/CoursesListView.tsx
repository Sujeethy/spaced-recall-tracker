import { useState } from 'react'
import { useCourses } from '../../hooks/useCourses'
import { CourseCard } from './CourseCard'
import { CourseFormModal } from './CourseFormModal'
import { EmptyState } from '../common/EmptyState'
import { Search, Plus, GraduationCap } from 'lucide-react'
import type { CourseWithDetails } from '../../types'

export function CoursesListView() {
  const { data: courses = [], isLoading } = useCourses()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all')

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<CourseWithDetails | null>(null)

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(search.toLowerCase()))

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-primary" />
            Learning Courses & Tracks
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Organize topics into structured curricula and track end-to-end recall progress
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 flex items-center justify-center gap-2 shadow-sm transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Course
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses and curricula..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border bg-card text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'active', 'completed'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                statusFilter === status
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-muted/60 text-muted-foreground hover:text-foreground'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Courses */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-muted-foreground animate-pulse">
          Loading courses...
        </div>
      ) : filteredCourses.length === 0 ? (
        <EmptyState
          title={search ? 'No courses match your search' : 'No courses created yet'}
          description={
            search
              ? 'Try changing your search terms or filters.'
              : 'Create structured courses to organize your technical learning topics into tracks.'
          }
          actionLabel="Create First Course"
          onAction={() => setIsCreateModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={(c) => setEditingCourse(c)}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <CourseFormModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />

      {/* Edit Modal */}
      <CourseFormModal
        open={Boolean(editingCourse)}
        onOpenChange={(open) => !open && setEditingCourse(null)}
        initialData={editingCourse}
      />
    </div>
  )
}
