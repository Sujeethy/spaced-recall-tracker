import { useRef, useState } from 'react'
import { api } from '../../lib/api'
import { validateBackupData, type BackupData } from '../../services/exportImport'
import type { ImportPreviewStats } from '../../types'
import { ImportStatsModal } from './ImportStatsModal'
import { Download, Upload, FileJson } from 'lucide-react'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { TOPICS_QUERY_KEY, SESSIONS_QUERY_KEY } from '../../hooks/useTopics'
import { CATEGORIES_QUERY_KEY } from '../../hooks/useCategories'
import { SETTINGS_QUERY_KEY } from '../../hooks/useSettings'

export function JsonBackupCard() {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [inspectModalOpen, setInspectModalOpen] = useState(false)
  const [loadedBackup, setLoadedBackup] = useState<BackupData | null>(null)
  const [loadedStats, setLoadedStats] = useState<ImportPreviewStats | null>(null)

  const handleExport = async () => {
    try {
      const backup = await api.exportBackup()
      const jsonStr = JSON.stringify(backup, null, 2)
      const blob = new Blob([jsonStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      const today = new Date().toISOString().slice(0, 10)
      a.href = url
      a.download = `spaced-recall-backup-${today}.json`
      a.click()
      URL.revokeObjectURL(url)

      toast.success('Backup file downloaded successfully!')
    } catch {
      toast.error('Failed to export backup')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const raw = JSON.parse(event.target?.result as string)
        const validation = validateBackupData(raw)

        if (!validation.valid || !validation.stats) {
          toast.error(validation.error || 'Invalid backup JSON file')
          return
        }

        setLoadedBackup(raw as BackupData)
        setLoadedStats(validation.stats)
        setInspectModalOpen(true)
      } catch {
        toast.error('Failed to parse file: Invalid JSON')
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    }
    reader.readAsText(file)
  }

  const handleRestore = async (mode: 'replace' | 'merge') => {
    if (!loadedBackup) return
    try {
      await api.restoreBackup(loadedBackup, mode)
      queryClient.invalidateQueries({ queryKey: TOPICS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: SESSIONS_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY })
      toast.success(`Backup restored successfully (${mode} mode)`)
    } catch (err: any) {
      toast.error(err.message || 'Failed to restore backup')
    }
  }

  return (
    <div className="p-5 sm:p-6 rounded-2xl border bg-card/60 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <FileJson className="w-4 h-4 text-indigo-500" />
        <h3 className="text-sm font-bold text-foreground">
          Complete JSON Snapshot Backup
        </h3>
      </div>

      <p className="text-xs text-muted-foreground">
        Export your complete learning history, topics, categories, active recall flashcards, and review records into a standardized JSON file, or restore from a previous backup.
      </p>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 shadow-sm"
        >
          <Download className="w-4 h-4" />
          <span>Export JSON Backup</span>
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold hover:bg-muted"
        >
          <Upload className="w-4 h-4" />
          <span>Restore from JSON</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <ImportStatsModal
        open={inspectModalOpen}
        onOpenChange={setInspectModalOpen}
        backupData={loadedBackup}
        stats={loadedStats}
        onConfirm={handleRestore}
      />
    </div>
  )
}
