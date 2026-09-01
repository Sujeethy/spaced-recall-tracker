import { useEffect } from 'react'
import { Command } from 'cmdk'
import { useUIStore } from '../../store/useUIStore'
import { useTopics } from '../../hooks/useTopics'
import { useNavigate } from '@tanstack/react-router'
import {
  Search,
  PlusCircle,
  Calendar,
  Clock,
  BookOpen,
  Settings,
  Database,
  BarChart3,
  Moon,
  Sun,
  Laptop,
} from 'lucide-react'

export function CommandPalette() {
  const isOpen = useUIStore((s) => s.isCommandPaletteOpen)
  const close = useUIStore((s) => s.closeCommandPalette)
  const openQuickAdd = useUIStore((s) => s.openQuickAdd)
  const setTheme = useUIStore((s) => s.setTheme)
  const navigate = useNavigate()
  const { data: topics = [] } = useTopics()

  // Keyboard shortcut Ctrl+K / Cmd+K listener
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        useUIStore.getState().toggleCommandPalette()
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  if (!isOpen) return null

  const handleSelect = (callback: () => void) => {
    close()
    callback()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="fixed inset-0"
        onClick={close}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-xl bg-card border rounded-xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[70vh]">
        <Command label="Global Command Palette">
          <div className="flex items-center px-3.5 border-b">
            <Search className="w-4 h-4 text-muted-foreground mr-2 shrink-0" />
            <Command.Input
              autoFocus
              placeholder="Search topics, views, actions... (Esc to close)"
              className="w-full py-3 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
            />
          </div>

          <Command.List className="p-2 overflow-y-auto max-h-[50vh] text-sm">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>

            <Command.Group heading="Navigation" className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Command.Item
                onSelect={() => handleSelect(() => navigate({ to: '/today' }))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer hover:bg-muted text-foreground aria-selected:bg-muted"
              >
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Today's Recalls</span>
              </Command.Item>
              <Command.Item
                onSelect={() => handleSelect(() => navigate({ to: '/topics' }))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer hover:bg-muted text-foreground aria-selected:bg-muted"
              >
                <BookOpen className="w-4 h-4 text-indigo-500" />
                <span>Topics Directory</span>
              </Command.Item>
              <Command.Item
                onSelect={() => handleSelect(() => navigate({ to: '/calendar' }))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer hover:bg-muted text-foreground aria-selected:bg-muted"
              >
                <Calendar className="w-4 h-4 text-emerald-500" />
                <span>Calendar Schedule</span>
              </Command.Item>
              <Command.Item
                onSelect={() => handleSelect(() => navigate({ to: '/stats' }))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer hover:bg-muted text-foreground aria-selected:bg-muted"
              >
                <BarChart3 className="w-4 h-4 text-purple-500" />
                <span>Recall Statistics</span>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Actions" className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2">
              <Command.Item
                onSelect={() => handleSelect(() => openQuickAdd())}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer hover:bg-muted text-foreground aria-selected:bg-muted"
              >
                <PlusCircle className="w-4 h-4 text-primary" />
                <span>Add New Topic</span>
              </Command.Item>
              <Command.Item
                onSelect={() => handleSelect(() => navigate({ to: '/settings' }))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer hover:bg-muted text-foreground aria-selected:bg-muted"
              >
                <Settings className="w-4 h-4 text-muted-foreground" />
                <span>Settings & Intervals</span>
              </Command.Item>
              <Command.Item
                onSelect={() => handleSelect(() => navigate({ to: '/backup' }))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer hover:bg-muted text-foreground aria-selected:bg-muted"
              >
                <Database className="w-4 h-4 text-muted-foreground" />
                <span>Backup & Export/Import</span>
              </Command.Item>
            </Command.Group>

            {topics.length > 0 && (
              <Command.Group heading="Learned Topics" className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2">
                {topics.slice(0, 8).map((t) => (
                  <Command.Item
                    key={t.id}
                    value={t.title}
                    onSelect={() => handleSelect(() => navigate({ to: '/topics/$topicId', params: { topicId: t.id } }))}
                    className="flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-muted text-foreground aria-selected:bg-muted"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      <span className="truncate">{t.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0 ml-2">
                      {t.category?.name}
                    </span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            <Command.Group heading="Theme" className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-2">
              <Command.Item
                onSelect={() => handleSelect(() => setTheme('light'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer hover:bg-muted text-foreground aria-selected:bg-muted"
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light Theme</span>
              </Command.Item>
              <Command.Item
                onSelect={() => handleSelect(() => setTheme('dark'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer hover:bg-muted text-foreground aria-selected:bg-muted"
              >
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>Dark Theme</span>
              </Command.Item>
              <Command.Item
                onSelect={() => handleSelect(() => setTheme('system'))}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer hover:bg-muted text-foreground aria-selected:bg-muted"
              >
                <Laptop className="w-4 h-4 text-zinc-400" />
                <span>System Preference</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  )
}
