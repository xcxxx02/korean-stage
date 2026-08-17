import { useRef, useState, type FormEvent } from 'react'
import type { Exercise } from '../content/types'

type ExerciseEngineProps = {
  exercises: Exercise[]
  initialResults?: Record<string, boolean>
  onResult?: (exerciseId: string, correct: boolean) => void
}

type Feedback = {
  isCorrect: boolean
}

export function ExerciseEngine({ exercises, initialResults = {}, onResult }: ExerciseEngineProps) {
  const firstChoiceRefs = useRef<Record<string, HTMLInputElement | null>>({})
  const [answers, setAnswers] = useState<Record<string, string>>(() => Object.fromEntries(
    exercises.filter((exercise) => initialResults[exercise.id] === true).map((exercise) => [exercise.id, exercise.answer]),
  ))
  const [feedback, setFeedback] = useState<Record<string, Feedback>>(() => Object.fromEntries(
    exercises.filter((exercise) => initialResults[exercise.id] === true).map((exercise) => [exercise.id, { isCorrect: true }]),
  ))
  const correctCount = Object.values(feedback).filter((result) => result.isCorrect).length

  const checkAnswer = (event: FormEvent<HTMLFormElement>, exercise: Exercise) => {
    event.preventDefault()
    if (feedback[exercise.id]?.isCorrect) return
    const selectedAnswer = answers[exercise.id]
    if (!selectedAnswer) return

    const isCorrect = selectedAnswer === exercise.answer
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
    window.setTimeout(() => firstChoiceRefs.current[exerciseId]?.focus(), 0)
  }

  return (
    <section aria-labelledby="exercise-heading" className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-blue-700">Check your understanding</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950" id="exercise-heading">Grammar exercises</h2>
        </div>
        <p className="rounded-full bg-blue-50 px-4 py-2 font-semibold text-blue-800">Score: {correctCount} of {exercises.length} correct</p>
      </div>

      {exercises.map((exercise, index) => {
        const result = feedback[exercise.id]
        return (
          <form className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" key={exercise.id} onSubmit={(event) => checkAnswer(event, exercise)}>
            <fieldset>
              <legend className="w-full text-lg font-bold text-slate-950">
                <span className="block text-sm font-semibold text-slate-500">{index + 1} of {exercises.length}</span>
                <span className="mt-1 block">{exercise.prompt}</span>
                <span className="mt-2 block rounded-lg bg-slate-50 p-3 text-xl text-blue-800" lang="ko">{exercise.koreanContext}</span>
              </legend>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {exercise.choices.map((choice, choiceIndex) => (
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-300 p-4 font-semibold text-slate-900 has-checked:border-blue-600 has-checked:bg-blue-50" key={choice}>
                    <input
                      checked={answers[exercise.id] === choice}
                      className="size-4 accent-blue-600"
                      disabled={Boolean(result)}
                      name={`answer-${exercise.id}`}
                      onChange={() => setAnswers((current) => ({ ...current, [exercise.id]: choice }))}
                      ref={(element) => {
                        if (choiceIndex === 0) firstChoiceRefs.current[exercise.id] = element
                      }}
                      type="radio"
                      value={choice}
                    />
                    <span lang="ko">{choice}</span>
                  </label>
                ))}
              </div>

              {result ? (
                <div aria-live="polite" className={`mt-4 rounded-xl p-4 ${result.isCorrect ? 'bg-emerald-50 text-emerald-900' : 'bg-amber-50 text-amber-950'}`} role="status">
                  <p className="font-bold">{result.isCorrect ? 'Correct' : 'Not quite'}</p>
                  {!result.isCorrect ? <p className="mt-1">Correct answer: <span lang="ko">{exercise.answer}</span></p> : null}
                  <p className="mt-1">{exercise.explanation}</p>
                </div>
              ) : null}

              <div className="mt-4 flex gap-3">
                {result && !result.isCorrect ? (
                  <button className="rounded-lg border border-blue-600 px-4 py-2 font-semibold text-blue-700" onClick={() => retry(exercise.id)} type="button">
                    Try again
                  </button>
                ) : (
                  <button className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300" disabled={!answers[exercise.id] || result?.isCorrect} type="submit">
                    {result?.isCorrect ? `Answer ${index + 1} correct` : `Check answer ${index + 1}`}
                  </button>
                )}
              </div>
            </fieldset>
          </form>
        )
      })}
    </section>
  )
}
