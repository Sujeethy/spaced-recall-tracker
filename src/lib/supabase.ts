import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null
let currentUrl: string | null = null
let currentKey: string | null = null

export function getSupabaseConfig(): { url: string | null; key: string | null } {
  // Check localStorage override first
  try {
    const saved = localStorage.getItem('recall_tracker_supabase_config')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (parsed.url && parsed.key) {
        return { url: parsed.url, key: parsed.key }
      }
    }
  } catch {
    // Ignore JSON errors
  }

  // Fallback to env vars
  const envUrl = import.meta.env.VITE_SUPABASE_URL || null
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || null

  return { url: envUrl, key: envKey }
}

export function saveSupabaseConfig(url: string, key: string): void {
  if (!url.trim() || !key.trim()) {
    localStorage.removeItem('recall_tracker_supabase_config')
    supabaseInstance = null
    currentUrl = null
    currentKey = null
    return
  }
  localStorage.setItem('recall_tracker_supabase_config', JSON.stringify({ url: url.trim(), key: key.trim() }))
  supabaseInstance = null
  currentUrl = null
  currentKey = null
}

export function getSupabaseClient(): SupabaseClient | null {
  const { url, key } = getSupabaseConfig()

  if (!url || !key) {
    return null
  }

  if (supabaseInstance && currentUrl === url && currentKey === key) {
    return supabaseInstance
  }

  try {
    supabaseInstance = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
    currentUrl = url
    currentKey = key
    return supabaseInstance
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err)
    return null
  }
}

export function isSupabaseConfigured(): boolean {
  const { url, key } = getSupabaseConfig()
  return Boolean(url && key)
}