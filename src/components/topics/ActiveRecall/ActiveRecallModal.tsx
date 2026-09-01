import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { useUIStore } from '../../../store/useUIStore'
import { useTopic, useUpdateTopic, useRecallSessions, useCompleteRecall } from '../../../hooks/useTopics'
import { QuizCard } from './QuizCard'
import { Zap, X, Trophy, CheckCircle2, RotateCcw, ExternalLink } from 'lucide-react'
import confetti from 'canvas-confetti'

export function ActiveRecallModal() {
  const isOpen = useUIStore((s) => s.isQuizOpen)
  const topicId = useUIStore((s) => s.quizTopicId)
  const closeQuiz = useUIStore((s) => s.closeQuiz)

  const { data: topic } = useTopic(topicId || '')
  const { data: sessions = [] } = useRecallSessions()
  const updateTopicMutation = useUpdateTopic()
  const completeMutation = useCompleteRecall()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [isFinished, setIsFinished] = useState(false)

  const questions = topic?.questions || []
  const currentSession = sessions.find(
    (s) => s.topicId === topicId && (s.status === 'due' || s.status === 'overdue')
  )

  const handleAnswer = async (correct: boolean) => {
    if (!topic) return

    const updatedQuestions = [...topic.questions]
    const currentQ = updatedQuestions[currentIndex]
    if (currentQ) {
      if (correct) {
        currentQ.correctCount = (currentQ.correctCount || 0) + 1
        setCorrectAnswers((prev) => prev + 1)
      } else {
        currentQ.incorrectCount = (currentQ.incorrectCount || 0) + 1
      }
      currentQ.lastReviewedAt = new Date().toISOString()
    }

    await updateTopicMutation.mutateAsync({
      id: topic.id,
      values: { questions: updatedQuestions },
    })

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      setIsFinished(true)
      try {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 },
        })
      } catch {}
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setCorrectAnswers(0)
    setIsFinished(false)
  }

  const handleMarkSessionComplete = async () => {
    if (currentSession) {
      await completeMutation.mutateAsync({ sessionId: currentSession.id })
    }
    closeQuiz()
  }

  const handleClose = () => {
    handleRestart()
    closeQuiz()
  }

  if (!topic) return null

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border rounded-2xl shadow-2xl p-6 w-[95vw] max-w-lg z-50 focus:outline-none">
          <div className="flex items-center justify-between pb-3 border-b mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center font-bold">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <Dialog.Title className="text-base font-bold text-foreground">
                  Active Self-Recall
                </Dialog.Title>
                <Dialog.Description className="text-xs text-muted-foreground truncate max-w-xs sm:max-w-sm">
                  {topic.title}
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close className="p-1 rounded-lg text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </Dialog.Close>
          </div>

          {questions.length === 0 ? (
            <div className="py-8 text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                No active recall questions have been added for this topic yet.
              </p>
              {topic.notes && (
                <div className="p-4 rounded-xl border bg-muted/30 text-left text-xs">
                  <div className="font-bold text-muted-foreground uppercase text-[10px] mb-1">
                    Topic Notes
                  </div>
                  {topic.notes}
                </div>
              )}
              {topic.chatgptUrl && (
                <a
                  href={topic.chatgptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open ChatGPT Conversation</span>
                </a>
              )}
            </div>
          ) : isFinished ? (
            <div className="py-6 text-center space-y-4 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-amber-500/15 text-amber-500 flex items-center justify-center mx-auto">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Quiz Completed!</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  You answered {correctAnswers} out of {questions.length} questions correctly.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-medium border hover:bg-muted flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>

                {currentSession && (
                  <button
                    type="button"
                    onClick={handleMarkSessionComplete}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Complete Today's Recall</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <QuizCard
              key={questions[currentIndex]?.id || currentIndex}
              question={questions[currentIndex]}
              index={currentIndex}
              total={questions.length}
              onAnswer={handleAnswer}
            />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
