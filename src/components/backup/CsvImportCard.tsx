import { useRef } from 'react'
import { parseTopicsCsv } from '../../services/exportImport'
import { api } from '../../lib/api'
import { FileSpreadsheet, Download, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { TOPICS_QUERY_KEY, SESSIONS_QUERY_KEY } from '../../hooks/useTopics'
import { CATEGORIES_QUERY_KEY } from '../../hooks/useCategories'

export function CsvImportCard() {
  const queryClient = useQueryClient()
  const csvInputRef = useRef<HTMLInputElement>(null)

  const handleDownloadSample = () => {
    const sampleCsv = `title,description,learnedAt,category,tags,chatgptUrl
"PostgreSQL Partitioning","Declarative range and hash partitioning strategy","2026-09-01","Databases","postgres;partitioning","https://chatgpt.com"
"Kubernetes Ingress Controllers","Traefik vs NGINX ingress comparison","2026-09-01","Web Architecture","k8s;networking",""
`
    const blob = new Blob([sampleCsv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sample-topics-import.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string
        const parsed = parseTopicsCsv(text)

        if (parsed.topics.length === 0) {
          toast.error('No valid topics found in CSV file')
          return
        }

        // Import parsed topics
        for (const topic of parsed.topics) {
          if (!topic.title) continue

          // Find or create category
          const categories = await api.getCategories()
          let category = categories.find((c) => c.name.toLowerCase() === (topic.category as any)?.toLowerCase())
          if (!category) {
            category = await api.createCategory((topic as any).category || 'General')
          }

          await api.createTopic({
            title: topic.title,
            orderIndex: 0,
            description: topic.description || '',
            notes: topic.notes || '',
            markdownNotes: '',
            learnedAt: topic.learnedAt || new Date().toISOString().slice(0, 10),
            categoryId: category.id,
            difficulty: topic.difficulty || 'medium',
            chatgptUrl: topic.chatgptUrl || '',
            tags: '',
            questions: [],
          })
        }

        queryClient.invalidateQueries({ queryKey: TOPICS_QUERY_KEY })
        queryClient.invalidateQueries({ queryKey: SESSIONS_QUERY_KEY })
        queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY })

        toast.success(`Imported ${parsed.topics.length} topics from CSV!`)
      } catch (err: any) {
        toast.error(err.message || 'Failed to import CSV')
      } finally {
        if (csvInputRef.current) csvInputRef.current.value = ''
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="p-5 sm:p-6 rounded-2xl border bg-card/60 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
        <h3 className="text-sm font-bold text-foreground">
          Bulk CSV Import
        </h3>
      </div>

      <p className="text-xs text-muted-foreground">
        Batch import multiple topics from spreadsheets (Excel, Google Sheets, Notion CSV exports). Spaced recall schedules will be calculated automatically for every topic!
      </p>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => csvInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm"
        >
          <Upload className="w-4 h-4" />
          <span>Upload CSV File</span>
        </button>

        <button
          type="button"
          onClick={handleDownloadSample}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold hover:bg-muted"
        >
          <Download className="w-4 h-4" />
          <span>Download Sample CSV</span>
        </button>

        <input
          ref={csvInputRef}
          type="file"
          accept=".csv"
          onChange={handleCsvUpload}
          className="hidden"
        />
      </div>
    </div>
  )
}
