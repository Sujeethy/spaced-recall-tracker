import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { CourseFormValues } from '../types'
import { TOPICS_QUERY_KEY } from './useTopics'
import { toast } from 'sonner'

export const COURSES_QUERY_KEY = ['courses']

export function useCourses() {
  return useQuery({
    queryKey: COURSES_QUERY_KEY,
    queryFn: () => api.getCourses(),
  })
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: [...COURSES_QUERY_KEY, id],
    queryFn: () => api.getCourseById(id),
    enabled: Boolean(id),
  })
}

export function useCreateCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: CourseFormValues) => api.createCourse(values),
    onSuccess: (newCourse) => {
      queryClient.invalidateQueries({ queryKey: COURSES_QUERY_KEY })
      toast.success(`Course "${newCourse.title}" created successfully`)
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to create course')
    },
  })
}

export function useUpdateCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: Partial<CourseFormValues> }) =>
      api.updateCourse(id, values),
    onSuccess: (updatedCourse) => {
      queryClient.invalidateQueries({ queryKey: COURSES_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: [...COURSES_QUERY_KEY, updatedCourse.id] })
      toast.success(`Course "${updatedCourse.title}" updated`)
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update course')
    },
  })
}

export function useDeleteCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, deleteTopics = false }: { id: string; deleteTopics?: boolean }) =>
      api.deleteCourse(id, deleteTopics),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COURSES_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: TOPICS_QUERY_KEY })
      toast.success('Course deleted')
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete course')
    },
  })
}

export function useReorderTopicsInCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ courseId, orderedTopicIds }: { courseId: string; orderedTopicIds: string[] }) =>
      api.reorderTopicsInCourse(courseId, orderedTopicIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TOPICS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: COURSES_QUERY_KEY })
      toast.success('Topics reordered successfully')
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to reorder topics')
    },
  })
}
