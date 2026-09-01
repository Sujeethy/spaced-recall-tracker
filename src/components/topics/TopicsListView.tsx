import { useState } from 'react'
import { useTopics } from '../../hooks/useTopics'
import { useCategories } from '../../hooks/useCategories'
import { TopicCard } from './TopicCard'
import { EmptyState } from '../common/EmptyState'
import { useUIStore } from '../../store/useUIStore'
import { Search, Plus, BookOpen } from 'lucide-react'

export function TopicsListView() {
  const { data: topics = [], isLoading } = useTopics()
  const { data: categories = [] } = useCategories()
  const openQuickAdd = useUIStore((s) => s.openQuickAdd)

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'learnedAt' | 'title' | 'progress'>('learnedAt')

  // Filter topics
  const filteredTopics = topics
    .filter((t) => {
      const matchSearch =
        search === '' ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.notes?.toLowerCase().includes(search.toLowerCase()) ||
        t.tags?.some((tag) => tag.name.toLowerCase().includes(search.toLowerCase()))

      const matchCat =
        selectedCategory === 'all' || t.categoryId === selectedCategory

      const matchDiff =
        selectedDifficulty === 'all' || t.difficulty === selectedDifficulty

      return matchSearch && matchCat && matchDiff
    })
    .sort((a, b) => {
      if (sortBy === 'learnedAt') {
        const dateB = b.completedAt || b.learnedAt || b.createdAt || ''
        const dateA = a.completedAt || a.learnedAt || a.createdAt || ''
        return dateB.localeCompare(dateA)
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title)
      }
      if (sortBy === 'progress') {
        const pA = a.totalRecallCount === 0 ? 0 : a.completedRecallCount / a.totalRecallCount
        const pB = b.totalRecallCount === 0 ? 0 : b.completedRecallCount / b.totalRecallCount
        return pB - pA
      }
      return 0
    })

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 bg-muted rounded-xl w-full max-w-sm" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="h-48 bg-muted rounded-2xl" />
          <div className="h-48 bg-muted rounded-2xl" />
          <div className="h-48 bg-muted rounded-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            Topics Directory
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {topics.length} technical topic{topics.length === 1 ? '' : 's'} tracked across your learning journey
          </p>
        </div>

        <button
          type="button"
          onClick={openQuickAdd}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Topic</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3 p-4 rounded-2xl border bg-card/60">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by topic title, notes, tags..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 text-xs border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="learnedAt">Recently Learned</option>
              <option value="title">Alphabetical (A-Z)</option>
              <option value="progress">Highest Progress</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
              selectedCategory === 'all'
                ? 'bg-primary text-primary-foreground font-semibold'
                : 'hover:bg-muted text-muted-foreground'
            }`}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
                selectedCategory === c.id
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : 'hover:bg-muted text-muted-foreground'
              }`}
            >
              {c.name}
            </button>
          ))}

          <div className="hidden sm:block h-4 w-px bg-border mx-1" />

          {/* Difficulty pills */}
          {(['easy', 'medium', 'hard'] as const).map((diff) => (
            <button
              key={diff}
              type="button"
              onClick={() =>
                setSelectedDifficulty(selectedDifficulty === diff ? 'all' : diff)
              }
              className={`px-2.5 py-1 text-xs font-medium rounded-lg border capitalize transition-colors ${
                selectedDifficulty === diff
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : 'hover:bg-muted text-muted-foreground'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Topics Grid */}
      {filteredTopics.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No topics match your filters"
          description="Try adjusting your search keywords or filter settings, or add a new topic."
          actionLabel="+ Add New Topic"
          onAction={openQuickAdd}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTopics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      )}
    </div>
  )
}
