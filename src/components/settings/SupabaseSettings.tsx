import { useState } from 'react'
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  isSupabaseConfigured,
  getSupabaseClient,
} from '../../lib/supabase'
import { Database, Check, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'

export function SupabaseSettings() {
  const current = getSupabaseConfig()
  const [url, setUrl] = useState(current.url || '')
  const [key, setKey] = useState(current.key || '')
  const [isTesting, setIsTesting] = useState(false)
  const isConfigured = isSupabaseConfigured()

  const handleSave = () => {
    saveSupabaseConfig(url, key)
    toast.success('Supabase configuration saved')
  }

  const handleTestConnection = async () => {
    setIsTesting(true)
    try {
      const client = getSupabaseClient()
      if (!client) {
        toast.error('Supabase client not initialized. Check your URL & Key.')
        return
      }
      const { error } = await client.from('topics').select('id').limit(1)
      if (error) {
        toast.error(`Connection failed: ${error.message}`)
      } else {
        toast.success('Successfully connected to Supabase database!')
      }
    } catch (err: any) {
      toast.error(`Connection error: ${err.message || 'Unknown'}`)
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className="p-5 sm:p-6 rounded-2xl border bg-card/60 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-500" />
          <h3 className="text-sm font-bold text-foreground">
            Supabase Multi-Device Cloud Sync
          </h3>
        </div>
        {isConfigured ? (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <Check className="w-3 h-3" /> Configured
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
            <ShieldCheck className="w-3 h-3" /> Local-First Mode (Active)
          </span>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Connect your free Supabase PostgreSQL database to sync reviews in real-time across your Laptop and Mobile phone. If left blank, the app functions 100% offline via local storage.
      </p>

      <div className="space-y-3 pt-1">
        <div>
          <label className="text-xs font-semibold text-foreground block mb-1">
            Supabase Project URL
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://your-project.supabase.co"
            className="w-full px-3 py-1.5 text-xs border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-foreground block mb-1">
            Supabase Anon Public Key
          </label>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            className="w-full px-3 py-1.5 text-xs border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono"
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 shadow-sm"
          >
            Save Credentials
          </button>
          <button
            type="button"
            disabled={isTesting || !url || !key}
            onClick={handleTestConnection}
            className="px-3.5 py-1.5 rounded-xl border text-xs font-medium hover:bg-muted disabled:opacity-50"
          >
            {isTesting ? 'Testing...' : 'Test Connection'}
          </button>
        </div>
      </div>
    </div>
  )
}
