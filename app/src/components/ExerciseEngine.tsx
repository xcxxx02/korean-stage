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
          <p className="text-sm font-bold uppercase tracking-wide text-stage-cobalt">Check your understanding</p>
          <h2 className="mt-1 text-2xl font-bold text-stage-charcoal" id="exercise-heading">Grammar exercises</h2>
        </div>
        <p className="rounded-full bg-stage-cobalt-soft px-4 py-2 font-semibold text-stage-cobalt">Score: {correctCount} of {exercises.length} correct</p>
      </div>

      {exercises.map((exercise, index) => {
        const result = feedback[exercise.id]
        return (
          <form className="rounded-xl border border-stage-border bg-stage-white p-5" key={exercise.id} onSubmit={(event) => checkAnswer(event, exercise)}>
            <fieldset>
              <legend className="w-full text-lg font-bold text-stage-charcoal">
                <span className="block text-sm font-semibold text-stage-faint">{index + 1} of {exercises.length}</span>
                <span className="mt-1 block">{exercise.prompt}</span>
                <span className="mt-2 block rounded-xl bg-stage-soft p-3 text-xl text-stage-cobalt" lang="ko">{exercise.koreanContext}</span>
              </legend>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {exercise.choices.map((choice, choiceIndex) => (
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-stage-border p-4 font-semibold text-stage-charcoal has-checked:border-stage-cobalt has-checked:bg-stage-cobalt-soft" key={choice}>
                    <input
                      checked={answers[exercise.id] === choice}
                      className="size-4 accent-stage-cobalt"
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
                <div aria-live="polite" className={`mt-4 rounded-xl p-4 ${result.isCorrect ? 'bg-stage-jade-soft text-stage-jade-strong' : 'bg-stage-yellow-soft text-stage-yellow-strong'}`} role="status">
                  <p className="font-bold">{result.isCorrect ? 'Correct' : 'Not quite'}</p>
                  {!result.isCorrect ? <p className="mt-1">Correct answer: <span lang="ko">{exercise.answer}</span></p> : null}
                  <p className="mt-1">{exercise.explanation}</p>
                </div>
              ) : null}

              <div className="mt-4 flex gap-3">
                {result && !result.isCorrect ? (
                  <button className="rounded-xl border border-stage-cobalt px-4 py-2 font-semibold text-stage-cobalt" onClick={() => retry(exercise.id)} type="button">
                    Try again
                  </button>
                ) : (
                  <button className="rounded-xl bg-stage-cobalt px-4 py-2 font-semibold text-stage-white disabled:cursor-not-allowed disabled:bg-stage-disabled" disabled={!answers[exercise.id] || result?.isCorrect} type="submit">
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
