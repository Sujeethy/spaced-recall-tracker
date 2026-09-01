import { useState } from 'react'
import type { TopicWithDetails } from '../../../types'
import { MarkdownRenderer } from '../../common/MarkdownRenderer'
import { TopicStatusBadge, DifficultyBadge } from '../../common/Badge'
import { Search, BookOpen, ExternalLink, Zap, Edit2, ArrowUpRight } from 'lucide-react'
import { useUIStore } from '../../../store/useUIStore'
import { Link } from '@tanstack/react-router'

interface CourseRevisionGuideProps {
  topics: TopicWithDetails[]
  onEditTopic: (topic: TopicWithDetails) => void
}

export function CourseRevisionGuide({ topics, onEditTopic }: CourseRevisionGuideProps) {
  const [filterQuery, setFilterQuery] = useState('')
  const openQuiz = useUIStore((s) => s.openQuiz)

  const filteredTopics = topics.filter(
    (t) =>
      t.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      (t.markdownNotes && t.markdownNotes.toLowerCase().includes(filterQuery.toLowerCase())) ||
      (t.description && t.description.toLowerCase().includes(filterQuery.toLowerCase()))
  )

  const scrollToTopic = (id: string) => {
    const el = document.getElementById(`topic-section-${id}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl border bg-card shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search within this course's revision notes and code..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground"
          />
        </div>

        <div className="text-xs text-muted-foreground font-medium shrink-0">
          Showing {filteredTopics.length} of {topics.length} topic notes
        </div>
      </div>

      {/* Quick Jump Table of Contents */}
      <div className="p-4 rounded-2xl border bg-muted/30 space-y-2.5">
        <div className="text-xs font-bold text-foreground flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-primary" />
          <span>Curriculum Table of Contents (Click to jump)</span>
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
          {topics.map((t, idx) => (
            <button
              key={t.id}
              type="button"
              onClick={() => scrollToTopic(t.id)}
              className="px-2.5 py-1 rounded-lg text-xs border bg-background hover:border-primary hover:text-primary transition-colors text-left flex items-center gap-1.5 shadow-2xs"
            >
              <span className="font-mono font-bold text-muted-foreground text-[10px]">
                #{idx + 1}
              </span>
              <span className="truncate max-w-[200px]">{t.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Continuous Stream of Topic Study Notes */}
      <div className="space-y-8">
        {filteredTopics.map((topic, idx) => (
          <div
            key={topic.id}
            id={`topic-section-${topic.id}`}
            className="p-6 rounded-2xl border bg-card hover:border-primary/30 transition-all shadow-xs space-y-4 scroll-mt-20"
          >
            {/* Topic Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md font-mono text-xs font-bold bg-muted text-foreground">
                    Topic #{idx + 1}
                  </span>
                  <TopicStatusBadge status={topic.status} />
                  <DifficultyBadge difficulty={topic.difficulty} />
                </div>

                <h3 className="text-lg font-bold text-foreground tracking-tight">
                  {topic.title}
                </h3>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                {topic.chatgptUrl && (
                  <a
                    href={topic.chatgptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg border hover:bg-muted text-muted-foreground hover:text-foreground"
                    title="Open ChatGPT conversation"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                {topic.questions && topic.questions.length > 0 && (
                  <button
                    type="button"
                    onClick={() => openQuiz(topic.id)}
                    className="px-2.5 py-1 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 text-xs font-semibold flex items-center gap-1"
                    title="Active Recall Quiz"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Quiz ({topic.questions.length})</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onEditTopic(topic)}
                  className="p-1.5 rounded-lg border hover:bg-muted text-muted-foreground hover:text-foreground"
                  title="Edit Notes"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <Link
                  to="/topics/$topicId"
                  params={{ topicId: topic.id }}
                  className="p-1.5 rounded-lg border hover:bg-muted text-muted-foreground hover:text-foreground"
                  title="View Dedicated Page"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Description */}
            {topic.description && (
              <p className="text-xs text-muted-foreground italic">{topic.description}</p>
            )}

            {/* Rendered Markdown Notes */}
            {topic.markdownNotes ? (
              <div className="pt-1">
                <MarkdownRenderer content={topic.markdownNotes} />
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed text-center text-xs text-muted-foreground">
                No detailed study notes added yet for this topic.{' '}
                <button
                  type="button"
                  onClick={() => onEditTopic(topic)}
                  className="text-primary font-semibold hover:underline"
                >
                  Click here to add notes & code
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
