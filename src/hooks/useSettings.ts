import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { Settings } from '../types'
import { toast } from 'sonner'
import { useUIStore } from '../store/useUIStore'

export const SETTINGS_QUERY_KEY = ['settings']

export function useSettings() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: () => api.getSettings(),
  })
}

export function useUpdateSettings() {
  const queryClient = useQueryClient()
  const setTheme = useUIStore((s) => s.setTheme)

  return useMutation({
    mutationFn: (updates: Partial<Settings>) => api.updateSettings(updates),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY })
      if (updated.theme) {
        setTheme(updated.theme)
      }
      toast.success('Settings saved')
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update settings')
    },
  })
}
