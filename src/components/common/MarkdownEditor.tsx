import { useState } from 'react'
import { MarkdownRenderer } from './MarkdownRenderer'
import { Eye, Edit3, Sparkles, Code, Bold, Italic, List, Table } from 'lucide-react'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Paste ChatGPT explanation, key formulas, code snippets, or notes in Markdown...',
  rows = 8,
}: MarkdownEditorProps) {
  const [tab, setTab] = useState<'write' | 'preview'>('write')

  const insertSnippet = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('markdown-textarea') as HTMLTextAreaElement | null
    if (!textarea) {
      onChange(value + prefix + suffix)
      return
    }

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = value.substring(start, end)
    const replacement = prefix + (selected || 'text') + suffix
    const updated = value.substring(0, start) + replacement + value.substring(end)
    onChange(updated)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected.length || 4))
    }, 10)
  }

  return (
    <div className="border rounded-2xl overflow-hidden bg-card transition-all focus-within:border-primary/50 shadow-sm">
      {/* Header Tabs & Quick Format Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-muted/40 border-b">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setTab('write')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
              tab === 'write'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            Write
          </button>
          <button
            type="button"
            onClick={() => setTab('preview')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
              tab === 'preview'
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Live Preview
          </button>
        </div>

        {tab === 'write' && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <button
              type="button"
              onClick={() => insertSnippet('**', '**')}
              className="p-1.5 rounded hover:bg-muted hover:text-foreground"
              title="Bold"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSnippet('*', '*')}
              className="p-1.5 rounded hover:bg-muted hover:text-foreground"
              title="Italic"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSnippet('```typescript\n', '\n```')}
              className="p-1.5 rounded hover:bg-muted hover:text-foreground"
              title="Code block"
            >
              <Code className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSnippet('- ')}
              className="p-1.5 rounded hover:bg-muted hover:text-foreground"
              title="Bullet list"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() =>
                insertSnippet('| Concept | Explanation |\n| :--- | :--- |\n| Key | Value |\n')
              }
              className="p-1.5 rounded hover:bg-muted hover:text-foreground"
              title="Table"
            >
              <Table className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Editor Content Area */}
      {tab === 'write' ? (
        <div className="relative">
          <textarea
            id="markdown-textarea"
            rows={rows}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-3.5 text-xs sm:text-sm font-mono bg-transparent border-0 resize-y focus:outline-none placeholder:text-muted-foreground/60 text-foreground"
          />
          {!value && (
            <div className="absolute bottom-3 right-3 text-[11px] text-muted-foreground/50 pointer-events-none flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Supports ChatGPT Markdown & Code snippets</span>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 min-h-[160px] max-h-[360px] overflow-y-auto bg-muted/10">
          {value ? (
            <MarkdownRenderer content={value} />
          ) : (
            <p className="text-xs text-muted-foreground/60 italic py-6 text-center">
              Nothing to preview. Switch to "Write" tab and paste your notes!
            </p>
          )}
        </div>
      )}
    </div>
  )
}
