import { useEffect } from 'react'
import { Outlet } from '@tanstack/react-router'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'
import { CommandPalette } from '../common/CommandPalette'
import { useUIStore, applyThemeToDocument } from '../../store/useUIStore'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { TopicForm } from '../topics/TopicForm/TopicForm'
import { ActiveRecallModal } from '../topics/ActiveRecall/ActiveRecallModal'

export function AppLayout() {
  const theme = useUIStore((s) => s.theme)
  const isQuickAddOpen = useUIStore((s) => s.isQuickAddOpen)
  const closeQuickAdd = useUIStore((s) => s.closeQuickAdd)

  // Sync theme
  useEffect(() => {
    applyThemeToDocument(theme)
  }, [theme])

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto pb-20 md:pb-8 px-4 sm:px-8 py-6 max-w-6xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      <MobileNav />
      <CommandPalette />
      <ActiveRecallModal />

      {/* Global Quick Add Topic Dialog */}
      <Dialog.Root open={isQuickAddOpen} onOpenChange={(open) => !open && closeQuickAdd()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border rounded-2xl shadow-2xl p-6 w-[95vw] max-w-2xl z-50 max-h-[90vh] overflow-y-auto focus:outline-none">
            <div className="flex items-center justify-between pb-4 mb-4 border-b">
              <div>
                <Dialog.Title className="text-lg font-bold text-foreground">
                  Add Learned Topic
                </Dialog.Title>
                <Dialog.Description className="text-xs text-muted-foreground mt-0.5">
                  Record what you learned today. Spaced-recall sessions will be generated automatically.
                </Dialog.Description>
              </div>
              <Dialog.Close className="p-1 rounded-lg text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </Dialog.Close>
            </div>

            <TopicForm onSuccess={closeQuickAdd} onCancel={closeQuickAdd} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
