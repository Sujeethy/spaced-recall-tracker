import { useUIStore } from '../../store/useUIStore'
import { Search, Plus, Moon, Sun, Menu, BrainCircuit } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export function Header() {
  const openCommandPalette = useUIStore((s) => s.openCommandPalette)
  const openQuickAdd = useUIStore((s) => s.openQuickAdd)
  const theme = useUIStore((s) => s.theme)
  const setTheme = useUIStore((s) => s.setTheme)
  const toggleMobileNav = useUIStore((s) => s.toggleMobileNav)

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light')
    } else {
      setTheme('dark')
    }
  }

  return (
    <header className="sticky top-0 z-30 h-14 border-b bg-background/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleMobileNav}
          className="md:hidden p-1.5 rounded-lg hover:bg-muted text-muted-foreground"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/" className="flex items-center gap-2 font-semibold text-foreground tracking-tight">
          <div className="w-7 h-7 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <span className="hidden sm:inline">RecallMaster</span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={openCommandPalette}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground bg-muted/60 hover:bg-muted rounded-lg border transition-colors w-36 sm:w-48 justify-between"
        >
          <span className="flex items-center gap-1.5 truncate">
            <Search className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Search...</span>
          </span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-background border rounded text-muted-foreground">
            ⌘K
          </kbd>
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={openQuickAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Topic</span>
        </button>
      </div>
    </header>
  )
}
