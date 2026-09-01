import type { UseFieldArrayReturn, UseFormReturn } from 'react-hook-form'
import type { TopicFormValues } from '../../../types'
import { Plus, Trash2, HelpCircle } from 'lucide-react'

interface QuestionBuilderProps {
  form: UseFormReturn<TopicFormValues>
  fieldArray: UseFieldArrayReturn<TopicFormValues, 'questions', 'id'>
}

export function QuestionBuilder({ form, fieldArray }: QuestionBuilderProps) {
  const { fields, append, remove } = fieldArray
  const { register } = form

  const handleAddQuestion = () => {
    append({
      id: crypto.randomUUID(),
      question: '',
      answer: '',
      correctCount: 0,
      incorrectCount: 0,
    })
  }

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
          <span>Active Recall Questions (Optional Self-Quiz)</span>
        </div>
        <button
          type="button"
          onClick={handleAddQuestion}
          className="flex items-center gap-1 text-xs text-primary hover:underline font-medium"
        >
          <Plus className="w-3 h-3" /> Add Question
        </button>
      </div>

      {fields.length === 0 && (
        <p className="text-xs text-muted-foreground italic">
          No quiz questions added yet. Add flashcard-style prompts to quiz yourself during reviews.
        </p>
      )}

      <div className="space-y-3">
        {fields.map((field, idx) => (
          <div key={field.id} className="p-3 border rounded-xl bg-card/40 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground uppercase">
                Question {idx + 1}
              </span>
              <button
                type="button"
                onClick={() => remove(idx)}
                className="text-muted-foreground hover:text-rose-500 p-1 rounded"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <input
              {...register(`questions.${idx}.question` as const)}
              placeholder="e.g. What is the difference between B-Tree and GIN?"
              className="w-full px-3 py-1.5 text-xs border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <textarea
              {...register(`questions.${idx}.answer` as const)}
              rows={2}
              placeholder="Answer: GIN is an inverted index for containment (@>), B-Tree is for scalar ordering."
              className="w-full px-3 py-1.5 text-xs border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
