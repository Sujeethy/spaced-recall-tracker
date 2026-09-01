import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './routes/router'
import { Toaster } from 'sonner'
import { useUIStore } from './store/useUIStore'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
})

export function App() {
  const theme = useUIStore((s) => s.theme)

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster
        position="bottom-right"
        theme={theme === 'dark' ? 'dark' : theme === 'light' ? 'light' : 'system'}
        richColors
        closeButton
      />
    </QueryClientProvider>
  )
}
