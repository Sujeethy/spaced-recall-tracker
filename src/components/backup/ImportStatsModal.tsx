import * as Dialog from '@radix-ui/react-dialog'
import type { ImportPreviewStats } from '../../types'
import type { BackupData } from '../../services/exportImport'
import { Database, X, Replace, GitMerge } from 'lucide-react'

interface ImportStatsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  backupData: BackupData | null
  stats: ImportPreviewStats | null
  onConfirm: (mode: 'replace' | 'merge') => void
}

export function ImportStatsModal({
  open,
  onOpenChange,
  backupData,
  stats,
  onConfirm,
}: ImportStatsModalProps) {
  if (!stats || !backupData) return null

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border rounded-2xl shadow-2xl p-6 w-[90vw] max-w-md z-50 focus:outline-none">
          <div className="flex items-center justify-between pb-3 border-b mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-500 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <Dialog.Title className="text-base font-bold text-foreground">
                Backup File Inspection
              </Dialog.Title>
            </div>
            <Dialog.Close className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </Dialog.Close>
          </div>

          <div className="p-4 rounded-xl border bg-muted/30 space-y-2 mb-4">
            <div className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>Topics Found:</span>
              <span className="font-bold text-primary">{stats.topicsCount}</span>
            </div>
            <div className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>Categories:</span>
              <span className="font-bold">{stats.categoriesCount}</span>
            </div>
            <div className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>Recall Sessions:</span>
              <span className="font-bold text-amber-500">{stats.recallSessionsCount}</span>
            </div>
            {stats.exportedAt && (
              <div className="text-[11px] text-muted-foreground pt-1 border-t">
                Exported: {stats.exportedAt}
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground mb-4">
            How would you like to restore this backup?
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                onConfirm('merge')
                onOpenChange(false)
              }}
              className="p-3 rounded-xl border hover:border-primary/50 text-left space-y-1 transition-colors group"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground group-hover:text-primary">
                <GitMerge className="w-4 h-4 text-indigo-500" />
                <span>Merge</span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Keep existing topics and add new items from backup
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                onConfirm('replace')
                onOpenChange(false)
              }}
              className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:border-rose-500/40 text-left space-y-1 transition-colors group"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                <Replace className="w-4 h-4" />
                <span>Replace All</span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Overwrite local database completely with backup
              </p>
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
