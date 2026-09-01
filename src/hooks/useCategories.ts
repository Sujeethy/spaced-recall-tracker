import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import { toast } from 'sonner'

export const CATEGORIES_QUERY_KEY = ['categories']
export const TAGS_QUERY_KEY = ['tags']

export function useCategories() {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: () => api.getCategories(),
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ name, color }: { name: string; color?: string }) =>
      api.createCategory(name, color),
    onSuccess: (newCat) => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY })
      toast.success(`Category "${newCat.name}" created`)
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to create category')
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY })
      toast.success('Category deleted')
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete category')
    },
  })
}

export function useTags() {
  return useQuery({
    queryKey: TAGS_QUERY_KEY,
    queryFn: () => api.getTags(),
  })
}
