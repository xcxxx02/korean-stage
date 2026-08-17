import { useLayoutEffect, useRef, useState, type FormEvent } from 'react'
import { FlashcardDeck } from '../components/FlashcardDeck'
import { course } from '../content/course'
import type { Exercise } from '../content/types'

const exercises = course.grammar.flatMap((grammarPoint) => grammarPoint.exercises)

type AnswerResult = {
  exercise: Exercise
  answer: string
  isCorrect: boolean
}

type ChallengePhase = 'questions' | 'complete' | 'review'

export function PracticePage() {
  const [mode, setMode] = useState<'flashcards' | 'challenge'>('flashcards')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [results, setResults] = useState<AnswerResult[]>([])
  const [phase, setPhase] = useState<ChallengePhase>('questions')
  const questionLegendRef = useRef<HTMLLegendElement>(null)
  const feedbackRef = useRef<HTMLDivElement>(null)
  const completionHeadingRef = useRef<HTMLHeadingElement>(null)
  const shouldFocusQuestion = useRef(false)
  const currentExercise = exercises[questionIndex]
  const currentResult = results[questionIndex]

  useLayoutEffect(() => {
    if (phase === 'complete') {
      completionHeadingRef.current?.focus()
    } else if (currentResult) {
      feedbackRef.current?.focus()
    } else if (shouldFocusQuestion.current) {
      questionLegendRef.current?.focus()
      shouldFocusQuestion.current = false
    }
  }, [currentResult, phase, questionIndex])

  const checkAnswer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedAnswer || currentResult) return

    const result = {
      exercise: currentExercise,
      answer: selectedAnswer,
      isCorrect: selectedAnswer === currentExercise.answer,
    }
    const nextResults = [...results, result]
    setResults(nextResults)
  }

  const nextQuestion = () => {
    shouldFocusQuestion.current = true
    setQuestionIndex((current) => current + 1)
    setSelectedAnswer('')
  }

  const tryAgain = () => {
    shouldFocusQuestion.current = true
    setQuestionIndex(0)
    setSelectedAnswer('')
    setResults([])
    setPhase('questions')
  }

  const correctCount = results.filter((result) => result.isCorrect).length
  const incorrectResults = results.filter((result) => !result.isCorrect)

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-5 sm:p-8">
      <header>
        <p className="text-sm font-bold uppercase tracking-wide text-blue-700">Lec 1 review</p>
        <h1 className="mt-1 text-4xl font-black text-slate-950">Final practice</h1>
        <p className="mt-3 max-w-2xl text-slate-600">Review countries and jobs, then complete all nine grammar questions.</p>
      </header>

      <nav aria-label="Practice activities" className="grid gap-3 sm:grid-cols-2">
        <button
          aria-pressed={mode === 'flashcards'}
          className="rounded-xl border border-blue-600 px-5 py-3 font-bold text-blue-800 aria-pressed:bg-blue-600 aria-pressed:text-white"
          onClick={() => setMode('flashcards')}
          type="button"
        >
          Vocabulary Flashcards
        </button>
        <button
          aria-pressed={mode === 'challenge'}
          className="rounded-xl border border-blue-600 px-5 py-3 font-bold text-blue-800 aria-pressed:bg-blue-600 aria-pressed:text-white"
          onClick={() => setMode('challenge')}
          type="button"
        >
          Grammar Challenge
        </button>
      </nav>

      {mode === 'flashcards' ? <FlashcardDeck items={course.vocabulary} /> : null}

      {mode === 'challenge' ? (
        <section aria-labelledby="challenge-heading" className="space-y-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-blue-700">Final check</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-950" id="challenge-heading">Grammar Challenge</h2>
          </div>

          {phase === 'questions' ? (
            <form className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" onSubmit={checkAnswer}>
              <fieldset>
                <legend className="w-full text-lg font-bold text-slate-950" ref={questionLegendRef} tabIndex={-1}>
                  <span className="block text-sm font-semibold text-slate-500">Question {questionIndex + 1} of {exercises.length}</span>
                  <span className="mt-2 block">{currentExercise.prompt}</span>
                  <span className="mt-3 block rounded-lg bg-slate-50 p-4 text-xl text-blue-800" lang="ko">{currentExercise.koreanContext}</span>
                </legend>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {currentExercise.choices.map((choice) => (
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-300 p-4 font-semibold text-slate-900 has-checked:border-blue-600 has-checked:bg-blue-50" key={choice}>
                      <input
                        checked={selectedAnswer === choice}
                        className="size-4 accent-blue-600"
                        disabled={Boolean(currentResult)}
                        name={`answer-${currentExercise.id}`}
                        onChange={() => setSelectedAnswer(choice)}
                        type="radio"
                        value={choice}
                      />
                      <span lang="ko">{choice}</span>
                    </label>
                  ))}
                </div>

                {currentResult ? (
                  <div
                    aria-live="polite"
                    className={`mt-5 rounded-xl p-4 ${currentResult.isCorrect ? 'bg-emerald-50 text-emerald-950' : 'bg-amber-50 text-amber-950'}`}
                    ref={feedbackRef}
                    role="status"
                    tabIndex={-1}
                  >
                    <p className="font-bold">
                      {currentResult.isCorrect ? <><span lang="ko">맞았어요!</span> Correct!</> : <><span lang="ko">아직 아니에요.</span> Not quite.</>}
                    </p>
                    {!currentResult.isCorrect ? <p className="mt-1">Correct answer: <span lang="ko">{currentExercise.answer}</span></p> : null}
                    <p className="mt-1">{currentExercise.explanation}</p>
                  </div>
                ) : null}

                <div className="mt-5">
                  {currentResult ? (
                    <button
                      className="rounded-lg bg-blue-600 px-5 py-3 font-bold text-white"
                      onClick={questionIndex === exercises.length - 1 ? () => setPhase('complete') : nextQuestion}
                      type="button"
                    >
                      {questionIndex === exercises.length - 1 ? 'See results' : 'Next question'}
                    </button>
                  ) : (
                    <button className="rounded-lg bg-blue-600 px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:bg-slate-300" disabled={!selectedAnswer} type="submit">Check answer</button>
                  )}
                </div>
              </fieldset>
            </form>
          ) : null}

          {phase === 'complete' ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-950" ref={completionHeadingRef} tabIndex={-1}>Challenge complete</h3>
              <p aria-live="polite" className="mt-3 text-xl font-bold text-blue-800">Score: {correctCount} / {exercises.length}</p>
              <p className="mt-2 text-slate-600"><span lang="ko">잘했어요!</span> Nice work completing every grammar question.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {incorrectResults.length > 0 ? (
                  <button className="rounded-lg border border-blue-600 px-5 py-3 font-bold text-blue-700" onClick={() => setPhase('review')} type="button">Review incorrect answers</button>
                ) : null}
                <button className="rounded-lg bg-blue-600 px-5 py-3 font-bold text-white" onClick={tryAgain} type="button">Try again</button>
              </div>
            </div>
          ) : null}

          {phase === 'review' ? (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-950">Review incorrect answers</h3>
              {incorrectResults.map((result) => (
                <article className="rounded-2xl border border-amber-200 bg-amber-50 p-5" key={result.exercise.id}>
                  <p className="text-xl font-bold text-slate-950" lang="ko">{result.exercise.koreanContext}</p>
                  <p className="mt-3">Your answer: <span lang="ko">{result.answer}</span></p>
                  <p className="mt-1">Correct answer: <span lang="ko">{result.exercise.answer}</span></p>
                  <p className="mt-2 text-slate-700">{result.exercise.explanation}</p>
                </article>
              ))}
              <button className="rounded-lg bg-blue-600 px-5 py-3 font-bold text-white" onClick={tryAgain} type="button">Try again</button>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  )
}
