import { useLayoutEffect, useRef, useState, type FormEvent } from 'react'
import {
  createCorrectExerciseAnswer,
  formatCorrectExerciseAnswer,
  isExerciseAnswerComplete,
  isExerciseAnswerCorrect,
} from '../content/exerciseAnswers'
import type { Exercise, ExerciseAnswer } from '../content/types'
import { ExerciseAnswerControl } from './ExerciseAnswerControl'
import { LanguageAwareText } from './LanguageAwareText'

type ExerciseEngineProps = {
  exercises: Exercise[]
  initialResults?: Record<string, boolean>
  mode?: 'all' | 'quiz'
  onResult?: (exerciseId: string, correct: boolean) => void
  title?: string
}

type Feedback = {
  isCorrect: boolean
}

type QuizPhase = 'questions' | 'complete'

export function ExerciseEngine({
  exercises,
  initialResults = {},
  mode = 'all',
  onResult,
  title = 'Grammar exercises',
}: ExerciseEngineProps) {
  const firstControlRefs = useRef<Record<string, HTMLInputElement | HTMLSelectElement | null>>({})
  const feedbackRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const questionLegendRef = useRef<HTMLLegendElement>(null)
  const completionHeadingRef = useRef<HTMLHeadingElement>(null)
  const shouldFocusQuestion = useRef(mode === 'quiz')
  const [answers, setAnswers] = useState<Record<string, ExerciseAnswer>>(() => Object.fromEntries(
    exercises.filter((exercise) => initialResults[exercise.id] === true).map((exercise) => [exercise.id, createCorrectExerciseAnswer(exercise)]),
  ))
  const [feedback, setFeedback] = useState<Record<string, Feedback>>(() => Object.fromEntries(
    exercises.filter((exercise) => initialResults[exercise.id] === true).map((exercise) => [exercise.id, { isCorrect: true }]),
  ))
  const [questionIndex, setQuestionIndex] = useState(0)
  const [phase, setPhase] = useState<QuizPhase>('questions')
  const quizMode = mode === 'quiz'
  const currentExercise = exercises[questionIndex]
  const currentFeedback = currentExercise ? feedback[currentExercise.id] : undefined
  const correctCount = Object.values(feedback).filter((result) => result.isCorrect).length
  const displayedExercises = quizMode && currentExercise ? [currentExercise] : exercises

  useLayoutEffect(() => {
    if (!quizMode) return
    if (phase === 'complete') {
      completionHeadingRef.current?.focus()
    } else if (currentExercise && currentFeedback) {
      feedbackRefs.current[currentExercise.id]?.focus()
    } else if (shouldFocusQuestion.current) {
      questionLegendRef.current?.focus()
      shouldFocusQuestion.current = false
    }
  }, [currentExercise, currentFeedback, phase, quizMode])

  const checkAnswer = (event: FormEvent<HTMLFormElement>, exercise: Exercise) => {
    event.preventDefault()
    if (feedback[exercise.id]) return
    const selectedAnswer = answers[exercise.id]
    if (!isExerciseAnswerComplete(exercise, selectedAnswer)) return

    const isCorrect = isExerciseAnswerCorrect(exercise, selectedAnswer)
    setFeedback((current) => ({ ...current, [exercise.id]: { isCorrect } }))
    onResult?.(exercise.id, isCorrect)
  }

  const retry = (exerciseId: string) => {
    setFeedback((current) => {
      const next = { ...current }
      delete next[exerciseId]
      return next
    })
    setAnswers((current) => {
      const next = { ...current }
      delete next[exerciseId]
      return next
    })
    window.setTimeout(() => firstControlRefs.current[exerciseId]?.focus(), 0)
  }

  const nextQuestion = () => {
    if (questionIndex === exercises.length - 1) {
      setPhase('complete')
      return
    }
    shouldFocusQuestion.current = true
    setQuestionIndex((current) => current + 1)
  }

  const restartQuiz = () => {
    shouldFocusQuestion.current = true
    setAnswers({})
    setFeedback({})
    setQuestionIndex(0)
    setPhase('questions')
  }

  return (
    <section aria-labelledby="exercise-heading" className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-stage-cobalt">Check your understanding</p>
          <h2 className="mt-1 text-2xl font-bold text-stage-charcoal" id="exercise-heading"><LanguageAwareText text={title} /></h2>
        </div>
        {!quizMode ? (
          <p className="rounded-full bg-stage-cobalt-soft px-4 py-2 font-semibold text-stage-cobalt">Score: {correctCount} of {exercises.length} correct</p>
        ) : null}
      </div>

      {quizMode && phase === 'complete' ? (
        <div className="rounded-xl border border-stage-border bg-stage-white p-6">
          <h3 className="practice-focus-target text-2xl font-bold text-stage-charcoal" ref={completionHeadingRef} tabIndex={-1}>Quiz complete</h3>
          <p aria-live="polite" className="mt-3 text-xl font-bold text-stage-cobalt">Score: {correctCount} of {exercises.length} correct</p>
          <p className="mt-2 text-stage-muted">You finished every question in this quiz.</p>
          <button className="mt-5 rounded-xl bg-stage-cobalt px-5 py-3 font-bold text-stage-white" onClick={restartQuiz} type="button">Try again</button>
        </div>
      ) : null}

      {phase === 'questions' ? displayedExercises.map((exercise, displayedIndex) => {
        const index = quizMode ? questionIndex : displayedIndex
        const result = feedback[exercise.id]
        return (
          <form className="rounded-xl border border-stage-border bg-stage-white p-5" key={exercise.id} onSubmit={(event) => checkAnswer(event, exercise)}>
            <fieldset>
              <legend
                className={`w-full text-lg font-bold text-stage-charcoal ${quizMode ? 'practice-focus-target' : ''}`}
                ref={quizMode ? questionLegendRef : undefined}
                tabIndex={quizMode ? -1 : undefined}
              >
                <span className="block text-sm font-semibold text-stage-faint">{quizMode ? 'Question ' : ''}{index + 1} of {exercises.length}</span>
                <span className="mt-1 block"><LanguageAwareText text={exercise.prompt} /></span>
                <span className="language-aware-text__ko mt-2 block rounded-xl bg-stage-soft p-3 text-xl text-stage-cobalt" lang="ko">{exercise.koreanContext}</span>
              </legend>
              <ExerciseAnswerControl
                answer={answers[exercise.id]}
                disabled={Boolean(result)}
                exercise={exercise}
                firstControlRef={(element) => { firstControlRefs.current[exercise.id] = element }}
                onChange={(answer) => setAnswers((current) => ({ ...current, [exercise.id]: answer }))}
              />

              {result ? (
                <div
                  aria-live="polite"
                  className={`mt-4 rounded-xl p-4 ${quizMode ? 'practice-focus-target ' : ''}${result.isCorrect ? 'bg-stage-jade-soft text-stage-jade-strong' : 'bg-stage-yellow-soft text-stage-yellow-strong'}`}
                  ref={(element) => { feedbackRefs.current[exercise.id] = element }}
                  role="status"
                  tabIndex={quizMode ? -1 : undefined}
                >
                  <p className="font-bold">{result.isCorrect ? 'Correct' : 'Not quite'}</p>
                  {!result.isCorrect ? <p className="mt-1">{exercise.type === 'matching' ? 'Correct matches' : 'Correct answer'}: <LanguageAwareText text={formatCorrectExerciseAnswer(exercise)} /></p> : null}
                  <p className="mt-1"><LanguageAwareText text={exercise.explanation} /></p>
                </div>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-3">
                {result && !result.isCorrect ? (
                  <button className="rounded-xl border border-stage-cobalt px-4 py-2 font-semibold text-stage-cobalt" onClick={() => retry(exercise.id)} type="button">
                    Try again
                  </button>
                ) : null}
                {quizMode && result ? (
                  <button className="rounded-xl bg-stage-cobalt px-4 py-2 font-semibold text-stage-white" onClick={nextQuestion} type="button">
                    {questionIndex === exercises.length - 1 ? 'See results' : 'Next question'}
                  </button>
                ) : null}
                {!result ? (
                  <button className="rounded-xl bg-stage-cobalt px-4 py-2 font-semibold text-stage-white disabled:cursor-not-allowed disabled:bg-stage-disabled" disabled={!isExerciseAnswerComplete(exercise, answers[exercise.id])} type="submit">
                    {quizMode ? 'Check answer' : `Check answer ${index + 1}`}
                  </button>
                ) : null}
                {!quizMode && result?.isCorrect ? (
                  <button className="rounded-xl bg-stage-cobalt px-4 py-2 font-semibold text-stage-white" disabled type="button">
                    Answer {index + 1} correct
                  </button>
                ) : null}
              </div>
            </fieldset>
          </form>
        )
      }) : null}
    </section>
  )
}
