import { useState, useRef, useEffect } from 'react'
import { MarkdownRenderer } from './MarkdownRenderer'
import { Eye, Edit3, Sparkles, Code, Bold, Italic, List, Table, CheckSquare } from 'lucide-react'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  className?: string
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Write or paste comprehensive study notes, key takeaways, formulas, or code in Markdown...',
  rows = 10,
  className = '',
}: MarkdownEditorProps) {
  const [tab, setTab] = useState<'write' | 'preview'>('write')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Local state for instant keystroke feedback
  const [localVal, setLocalVal] = useState(value || '')

  useEffect(() => {
    setLocalVal(value || '')
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value
    setLocalVal(newVal)
    onChange(newVal)
  }

  const insertSnippet = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) {
      const updated = localVal + prefix + suffix
      setLocalVal(updated)
      onChange(updated)
      return
    }

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = localVal.substring(start, end)
    const replacement = prefix + (selected || 'text') + suffix
    const updated = localVal.substring(0, start) + replacement + localVal.substring(end)
    
    setLocalVal(updated)
    onChange(updated)

    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected.length || 4))
    }, 10)
  }

  return (
    <div className={`border rounded-2xl overflow-hidden bg-card transition-all focus-within:border-primary/50 shadow-sm ${className}`}>
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
            Write Notes
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
              onClick={() => insertSnippet('- [ ] ')}
              className="p-1.5 rounded hover:bg-muted hover:text-foreground"
              title="Checklist item"
            >
              <CheckSquare className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() =>
                insertSnippet('| Concept | Key Details |\n| :--- | :--- |\n| Feature | Explanation |\n')
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
            ref={textareaRef}
            rows={rows}
            value={localVal}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full p-3.5 text-xs sm:text-sm font-mono bg-transparent border-0 resize-y focus:outline-none placeholder:text-muted-foreground/60 text-foreground min-h-[140px]"
          />
          {!localVal && (
            <div className="absolute bottom-3 right-3 text-[11px] text-muted-foreground/50 pointer-events-none flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Supports GitHub Markdown, code blocks & tables</span>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 min-h-[160px] max-h-[420px] overflow-y-auto bg-muted/10">
          {localVal ? (
            <MarkdownRenderer content={localVal} />
          ) : (
            <p className="text-xs text-muted-foreground/60 italic py-8 text-center">
              No notes entered yet. Switch to "Write Notes" to add study notes, code, or explanations.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
