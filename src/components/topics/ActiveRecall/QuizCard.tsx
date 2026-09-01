import { useState } from 'react'
import type { ActiveRecallQuestion } from '../../../types'
import { Eye, Check, X } from 'lucide-react'

interface QuizCardProps {
  question: ActiveRecallQuestion
  index: number
  total: number
  onAnswer: (correct: boolean) => void
}

export function QuizCard({ question, index, total, onAnswer }: QuizCardProps) {
  const [isRevealed, setIsRevealed] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
        <span>Question {index + 1} of {total}</span>
        <span>Correct: {question.correctCount} / Incorrect: {question.incorrectCount}</span>
      </div>

      {/* Question Prompt */}
      <div className="p-5 rounded-2xl border bg-card text-foreground font-medium text-sm sm:text-base min-h-24 flex items-center justify-center text-center shadow-sm">
        {question.question}
      </div>

      {/* Answer reveal */}
      {isRevealed ? (
        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 rounded-xl border bg-muted/40 text-xs sm:text-sm text-foreground">
            <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
              Answer Key
            </div>
            {question.answer}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => onAnswer(false)}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold text-xs hover:bg-rose-500/20 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Needs Review (Missed)</span>
            </button>
            <button
              type="button"
              onClick={() => onAnswer(true)}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-xs hover:bg-emerald-500/20 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Got it Right!</span>
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsRevealed(true)}
          className="w-full py-3 px-4 rounded-xl border bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <Eye className="w-4 h-4 text-primary" />
          <span>Reveal Answer</span>
        </button>
      )}
    </div>
  )
}
