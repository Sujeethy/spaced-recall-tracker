import { useState } from 'react'
import type { TopicWithDetails } from '../../../types'
import { MarkdownRenderer } from '../../common/MarkdownRenderer'
import { TopicStatusBadge, DifficultyBadge } from '../../common/Badge'
import {
  Search,
  BookOpen,
  ExternalLink,
  Zap,
  Edit2,
  ArrowUpRight,
  FileCode,
  FileText,
  Bookmark,
  HelpCircle,
  CheckSquare,
  Square,
} from 'lucide-react'
import { useUIStore } from '../../../store/useUIStore'
import { Link } from '@tanstack/react-router'

interface CourseRevisionGuideProps {
  topics: TopicWithDetails[]
  onEditTopic: (topic: TopicWithDetails) => void
}

export function CourseRevisionGuide({ topics, onEditTopic }: CourseRevisionGuideProps) {
  const [filterQuery, setFilterQuery] = useState('')
  const [selectedSections, setSelectedSections] = useState({
    fullTopic: true,
    keyNotes: true,
    definitions: true,
    questions: true,
  })

  const openQuiz = useUIStore((s) => s.openQuiz)

  const toggleSection = (key: 'fullTopic' | 'keyNotes' | 'definitions' | 'questions') => {
    setSelectedSections((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      // Ensure at least one section remains selected
      if (!next.fullTopic && !next.keyNotes && !next.definitions && !next.questions) {
        return prev
      }
      return next
    })
  }

  const setAllSections = (val: boolean) => {
    if (!val) {
      setSelectedSections({ fullTopic: false, keyNotes: true, definitions: false, questions: false })
    } else {
      setSelectedSections({ fullTopic: true, keyNotes: true, definitions: true, questions: true })
    }
  }

  const filteredTopics = topics.filter((t) => {
    const q = filterQuery.toLowerCase()
    return (
      t.title.toLowerCase().includes(q) ||
      (t.fullTopic && t.fullTopic.toLowerCase().includes(q)) ||
      (t.markdownNotes && t.markdownNotes.toLowerCase().includes(q)) ||
      (t.keyNotes && t.keyNotes.toLowerCase().includes(q)) ||
      (t.notes && t.notes.toLowerCase().includes(q)) ||
      (t.definitions && t.definitions.toLowerCase().includes(q)) ||
      (t.questionsMarkdown && t.questionsMarkdown.toLowerCase().includes(q)) ||
      (t.description && t.description.toLowerCase().includes(q))
    )
  })

  const scrollToTopic = (id: string) => {
    const el = document.getElementById(`topic-section-${id}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and 4 Multi-Select Section Review Toolbar */}
      <div className="p-4 rounded-2xl border bg-card shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search across all 4 sections (Full Topic, Key Notes, Definitions, Questions)..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border bg-background text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground"
            />
          </div>

          <div className="text-xs text-muted-foreground font-medium shrink-0">
            Showing {filteredTopics.length} of {topics.length} topics
          </div>
        </div>

        {/* Multi-Select 4 Section Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t text-xs">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="font-bold text-foreground mr-0.5">Include in Revision:</span>

            {/* 1. Full Topic */}
            <button
              type="button"
              onClick={() => toggleSection('fullTopic')}
              className={`px-2.5 py-1.5 rounded-xl border font-semibold flex items-center gap-1.5 transition-all ${
                selectedSections.fullTopic
                  ? 'bg-primary/10 border-primary text-primary shadow-2xs'
                  : 'bg-background text-muted-foreground border-border hover:bg-muted'
              }`}
            >
              {selectedSections.fullTopic ? <CheckSquare className="w-3.5 h-3.5 text-primary" /> : <Square className="w-3.5 h-3.5" />}
              <FileCode className="w-3.5 h-3.5 text-primary" />
              <span>Full Topic</span>
            </button>

            {/* 2. Key Notes */}
            <button
              type="button"
              onClick={() => toggleSection('keyNotes')}
              className={`px-2.5 py-1.5 rounded-xl border font-semibold flex items-center gap-1.5 transition-all ${
                selectedSections.keyNotes
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 shadow-2xs'
                  : 'bg-background text-muted-foreground border-border hover:bg-muted'
              }`}
            >
              {selectedSections.keyNotes ? <CheckSquare className="w-3.5 h-3.5 text-emerald-500" /> : <Square className="w-3.5 h-3.5" />}
              <FileText className="w-3.5 h-3.5 text-emerald-500" />
              <span>Key Notes</span>
            </button>

            {/* 3. Definitions */}
            <button
              type="button"
              onClick={() => toggleSection('definitions')}
              className={`px-2.5 py-1.5 rounded-xl border font-semibold flex items-center gap-1.5 transition-all ${
                selectedSections.definitions
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300 shadow-2xs'
                  : 'bg-background text-muted-foreground border-border hover:bg-muted'
              }`}
            >
              {selectedSections.definitions ? <CheckSquare className="w-3.5 h-3.5 text-amber-500" /> : <Square className="w-3.5 h-3.5" />}
              <Bookmark className="w-3.5 h-3.5 text-amber-500" />
              <span>Definitions</span>
            </button>

            {/* 4. Questions */}
            <button
              type="button"
              onClick={() => toggleSection('questions')}
              className={`px-2.5 py-1.5 rounded-xl border font-semibold flex items-center gap-1.5 transition-all ${
                selectedSections.questions
                  ? 'bg-blue-500/15 border-blue-500/40 text-blue-700 dark:text-blue-300 shadow-2xs'
                  : 'bg-background text-muted-foreground border-border hover:bg-muted'
              }`}
            >
              {selectedSections.questions ? <CheckSquare className="w-3.5 h-3.5 text-blue-500" /> : <Square className="w-3.5 h-3.5" />}
              <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
              <span>Questions</span>
            </button>
          </div>

          <div className="flex items-center gap-1 text-[11px]">
            <button
              type="button"
              onClick={() => setAllSections(true)}
              className="text-primary hover:underline font-semibold px-1"
            >
              Select All
            </button>
            <span className="text-muted-foreground">•</span>
            <button
              type="button"
              onClick={() => setAllSections(false)}
              className="text-muted-foreground hover:underline px-1"
            >
              Key Notes Only
            </button>
          </div>
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
        {filteredTopics.map((topic, idx) => {
          const fullTopicContent = topic.fullTopic || topic.markdownNotes
          const keyNotesContent = topic.keyNotes || topic.notes

          return (
            <div
              key={topic.id}
              id={`topic-section-${topic.id}`}
              className="p-6 rounded-2xl border bg-card hover:border-primary/30 transition-all shadow-xs space-y-5 scroll-mt-20"
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

              {/* Field 1: Definitions (If selected and available) */}
              {selectedSections.definitions && (
                topic.definitions ? (
                  <div className="p-4 rounded-xl border border-amber-500/25 bg-amber-500/5 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-300">
                      <Bookmark className="w-3.5 h-3.5 text-amber-500" />
                      <span>Key Definitions & Terminology</span>
                    </div>
                    <div className="text-xs sm:text-sm">
                      <MarkdownRenderer content={topic.definitions} />
                    </div>
                  </div>
                ) : null
              )}

              {/* Field 2: Key Notes (If selected and available) */}
              {selectedSections.keyNotes && (
                keyNotesContent ? (
                  <div className="p-4 rounded-xl border border-emerald-500/25 bg-emerald-500/5 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                      <FileText className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Key Notes & Summary Takeaways</span>
                    </div>
                    <div className="text-xs sm:text-sm">
                      <MarkdownRenderer content={keyNotesContent} />
                    </div>
                  </div>
                ) : null
              )}

              {/* Field 3: Full Topic Notes (If selected and available) */}
              {selectedSections.fullTopic && (
                fullTopicContent ? (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                      <FileCode className="w-3.5 h-3.5 text-primary" />
                      <span>Full Topic Deep Dive & Explanations</span>
                    </div>
                    <MarkdownRenderer content={fullTopicContent} />
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl border border-dashed text-center text-xs text-muted-foreground">
                    No full topic deep dive notes added yet.{' '}
                    <button
                      type="button"
                      onClick={() => onEditTopic(topic)}
                      className="text-primary font-semibold hover:underline"
                    >
                      Click to add
                    </button>
                  </div>
                )
              )}

              {/* Field 4: Questions & Interview Prompts (If selected and available) */}
              {selectedSections.questions && (
                topic.questionsMarkdown ? (
                  <div className="p-4 rounded-xl border border-blue-500/25 bg-blue-500/5 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-300">
                      <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
                      <span>Interview Questions & Active-Recall Prompts</span>
                    </div>
                    <div className="text-xs sm:text-sm">
                      <MarkdownRenderer content={topic.questionsMarkdown} />
                    </div>
                  </div>
                ) : null
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
