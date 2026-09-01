import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Copy, Check } from 'lucide-react'

interface MarkdownRendererProps {
  content: string
  className?: string
}

function CodeBlock({ children, className }: { children: React.ReactNode; className?: string }) {
  const [copied, setCopied] = useState(false)
  const codeString = String(children).replace(/\n$/, '')
  const language = className ? className.replace(/language-/, '') : ''

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative my-3 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900/90 text-zinc-100 group shadow-md">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-zinc-800/80 border-b border-zinc-800 text-[11px] font-mono text-zinc-400">
        <span>{language || 'code'}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 hover:text-white transition-colors"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-sans">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="font-sans">Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3.5 overflow-x-auto text-xs font-mono leading-relaxed">
        <code>{children}</code>
      </pre>
    </div>
  )
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  if (!content || !content.trim()) {
    return null
  }

  return (
    <div className={`prose prose-sm dark:prose-invert max-w-none text-foreground text-xs sm:text-sm leading-relaxed ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const isInline = !className
            if (isInline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded-md bg-muted font-mono text-[11px] text-primary font-semibold border"
                  {...props}
                >
                  {children}
                </code>
              )
            }
            return <CodeBlock className={className}>{children}</CodeBlock>
          },
          h1: ({ children }) => <h1 className="text-lg sm:text-xl font-bold mt-4 mb-2 text-foreground border-b pb-1.5">{children}</h1>,
          h2: ({ children }) => <h2 className="text-base sm:text-lg font-bold mt-3.5 mb-2 text-foreground">{children}</h2>,
          h3: ({ children }) => <h3 className="text-sm sm:text-base font-bold mt-3 mb-1.5 text-foreground">{children}</h3>,
          h4: ({ children }) => <h4 className="text-xs sm:text-sm font-bold mt-2 mb-1 text-foreground">{children}</h4>,
          p: ({ children }) => <p className="my-2 leading-relaxed text-muted-foreground">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside my-2 space-y-1 text-muted-foreground pl-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside my-2 space-y-1 text-muted-foreground pl-1">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/60 bg-primary/5 pl-3 py-1.5 my-2.5 rounded-r-lg italic text-muted-foreground text-xs sm:text-sm">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-3 border rounded-xl bg-card">
              <table className="w-full text-xs text-left border-collapse">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-muted/60 border-b font-semibold text-foreground">{children}</thead>,
          th: ({ children }) => <th className="px-3 py-2 border-r last:border-r-0">{children}</th>,
          td: ({ children }) => <td className="px-3 py-2 border-t border-r last:border-r-0 text-muted-foreground">{children}</td>,
          hr: () => <hr className="my-4 border-border" />,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-medium underline underline-offset-2 hover:opacity-80"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
