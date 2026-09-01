import { create } from 'zustand'
import type { ThemeMode } from '../types'

interface UIState {
  // Theme
  theme: ThemeMode
  setTheme: (theme: ThemeMode) => void

  // Command Palette
  isCommandPaletteOpen: boolean
  openCommandPalette: () => void
  closeCommandPalette: () => void
  toggleCommandPalette: () => void

  // Active Recall Quiz Modal
  isQuizOpen: boolean
  quizTopicId: string | null
  openQuiz: (topicId: string) => void
  closeQuiz: () => void

  // Quick Add Topic Modal
  isQuickAddOpen: boolean
  openQuickAdd: () => void
  closeQuickAdd: () => void

  // Mobile Sidebar / Menu
  isMobileNavOpen: boolean
  setMobileNavOpen: (open: boolean) => void
  toggleMobileNav: () => void
}

function getInitialTheme(): ThemeMode {
  const saved = localStorage.getItem('recall_tracker_theme') as ThemeMode | null
  if (saved && ['light', 'dark', 'system'].includes(saved)) {
    return saved
  }
  return 'system'
}

export const useUIStore = create<UIState>((set) => ({
  theme: getInitialTheme(),
  setTheme: (theme) => {
    localStorage.setItem('recall_tracker_theme', theme)
    applyThemeToDocument(theme)
    set({ theme })
  },

  isCommandPaletteOpen: false,
  openCommandPalette: () => set({ isCommandPaletteOpen: true }),
  closeCommandPalette: () => set({ isCommandPaletteOpen: false }),
  toggleCommandPalette: () => set((s) => ({ isCommandPaletteOpen: !s.isCommandPaletteOpen })),

  isQuizOpen: false,
  quizTopicId: null,
  openQuiz: (topicId) => set({ isQuizOpen: true, quizTopicId: topicId }),
  closeQuiz: () => set({ isQuizOpen: false, quizTopicId: null }),

  isQuickAddOpen: false,
  openQuickAdd: () => set({ isQuickAddOpen: true }),
  closeQuickAdd: () => set({ isQuickAddOpen: false }),

  isMobileNavOpen: false,
  setMobileNavOpen: (open) => set({ isMobileNavOpen: open }),
  toggleMobileNav: () => set((s) => ({ isMobileNavOpen: !s.isMobileNavOpen })),
}))

export function applyThemeToDocument(theme: ThemeMode): void {
  const root = document.documentElement
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

  if (theme === 'dark' || (theme === 'system' && systemPrefersDark)) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}
