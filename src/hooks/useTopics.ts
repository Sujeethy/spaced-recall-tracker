import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import type { TopicFormValues } from '../types'
import { toast } from 'sonner'
import confetti from 'canvas-confetti'

export const TOPICS_QUERY_KEY = ['topics']
export const SESSIONS_QUERY_KEY = ['recall_sessions']

export function useTopics() {
  return useQuery({
    queryKey: TOPICS_QUERY_KEY,
    queryFn: () => api.getTopics(),
  })
}

export function useTopic(id: string) {
  return useQuery({
    queryKey: ['topic', id],
    queryFn: () => api.getTopicById(id),
    enabled: Boolean(id),
  })
}

export function useCreateTopic() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: TopicFormValues) => api.createTopic(values),
    onSuccess: (newTopic) => {
      queryClient.invalidateQueries({ queryKey: TOPICS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: SESSIONS_QUERY_KEY })
      toast.success(`Created "${newTopic.title}" with spaced-recall schedule!`)
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to create topic')
    },
  })
}

export function useUpdateTopic() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: Partial<TopicFormValues> }) =>
      api.updateTopic(id, values),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: TOPICS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ['topic', updated.id] })
      queryClient.invalidateQueries({ queryKey: SESSIONS_QUERY_KEY })
      toast.success('Topic updated successfully')
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update topic')
    },
  })
}

export function useDeleteTopic() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.deleteTopic(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TOPICS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: SESSIONS_QUERY_KEY })
      toast.success('Topic deleted')
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete topic')
    },
  })
}

export function useRecallSessions() {
  return useQuery({
    queryKey: SESSIONS_QUERY_KEY,
    queryFn: () => api.getRecallSessions(),
  })
}

export function useCompleteRecall() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ sessionId, notes }: { sessionId: string; notes?: string }) =>
      api.completeRecallSession(sessionId, notes),
    onSuccess: (completedSession) => {
      queryClient.invalidateQueries({ queryKey: TOPICS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: SESSIONS_QUERY_KEY })

      // Small confetti celebration
      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.8 },
        })
      } catch {
        // Ignore in headless/SSR
      }

      toast.success('Recall completed! Knowledge reinforced.', {
        action: {
          label: 'Undo',
          onClick: async () => {
            await api.uncompleteRecallSession(completedSession.id)
            queryClient.invalidateQueries({ queryKey: TOPICS_QUERY_KEY })
            queryClient.invalidateQueries({ queryKey: SESSIONS_QUERY_KEY })
            toast.info('Recall marked uncompleted')
          },
        },
      })
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to complete recall')
    },
  })
}

export function useRescheduleRecall() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ sessionId, newDate }: { sessionId: string; newDate: string }) =>
      api.rescheduleRecallSession(sessionId, newDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TOPICS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: SESSIONS_QUERY_KEY })
      toast.success('Recall session rescheduled')
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to reschedule recall')
    },
  })
}

export function useSkipRecall() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (sessionId: string) => api.skipRecallSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TOPICS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: SESSIONS_QUERY_KEY })
      toast.info('Recall session skipped')
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to skip recall')
    },
  })
}
