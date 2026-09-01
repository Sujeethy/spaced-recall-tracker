import { JsonBackupCard } from './JsonBackupCard'
import { CsvImportCard } from './CsvImportCard'

export function BackupView() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
          Backup & Restore
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Safeguard your learning repository with local JSON backups or bulk import topics via CSV
        </p>
      </div>

      <JsonBackupCard />
      <CsvImportCard />
    </div>
  )
}
