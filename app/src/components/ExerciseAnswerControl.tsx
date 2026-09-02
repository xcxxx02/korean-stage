import { useId } from 'react'
import type { Exercise, ExerciseAnswer } from '../content/types'

type ExerciseAnswerControlProps = {
  exercise: Exercise
  answer: ExerciseAnswer | undefined
  disabled: boolean
  onChange: (answer: ExerciseAnswer) => void
  firstControlRef?: (element: HTMLInputElement | HTMLSelectElement | null) => void
}

export function ExerciseAnswerControl({ exercise, answer, disabled, onChange, firstControlRef }: ExerciseAnswerControlProps) {
  const matchingLabelId = useId()
  if (exercise.type === 'matching') {
    const matches = typeof answer === 'object' && answer !== null && !Array.isArray(answer) ? answer : {}
    const englishOptions = [...exercise.pairs].reverse().map((pair) => pair.english)

    return (
      <div className="mt-4 grid gap-3" role="group" aria-label="Matching answers">
        <p className="text-sm text-stage-muted" lang="en">Choose one English meaning for each Korean sentence. Complete both matches before checking your answer.</p>
        {exercise.pairs.map((pair, index) => (
          <label className="grid gap-2 rounded-xl border border-stage-border p-4 sm:grid-cols-[minmax(0,1fr)_minmax(13rem,1fr)] sm:items-center" key={pair.id}>
            <span className="sr-only" id={`${matchingLabelId}-${pair.id}-prefix`} lang="en">Match</span>
            <span className="font-bold text-stage-charcoal" data-korean-content id={`${matchingLabelId}-${pair.id}-korean`} lang="ko">{pair.korean}</span>
            <span className="sr-only" id={`${matchingLabelId}-${pair.id}-suffix`} lang="en">to its English meaning</span>
            <select
              aria-labelledby={`${matchingLabelId}-${pair.id}-prefix ${matchingLabelId}-${pair.id}-korean ${matchingLabelId}-${pair.id}-suffix`}
              className="min-h-11 rounded-xl border border-stage-border bg-stage-white px-3 py-2 text-stage-charcoal disabled:cursor-not-allowed disabled:bg-stage-disabled"
              disabled={disabled}
              onChange={(event) => onChange({ ...matches, [pair.id]: event.target.value })}
              ref={index === 0 ? firstControlRef : undefined}
              value={matches[pair.id] ?? ''}
            >
              <option lang="en" value="">Choose an English meaning</option>
              {englishOptions.map((english) => <option key={english} lang="en" value={english}>{english}</option>)}
            </select>
          </label>
        ))}
      </div>
    )
  }

  const selectedAnswer = typeof answer === 'string' ? answer : ''
  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      {exercise.choices.map((choice, choiceIndex) => (
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-stage-border p-4 font-semibold text-stage-charcoal has-checked:border-stage-cobalt has-checked:bg-stage-cobalt-soft" key={choice}>
          <input
            checked={selectedAnswer === choice}
            className="size-4 accent-stage-cobalt"
            disabled={disabled}
            name={`answer-${exercise.id}`}
            onChange={() => onChange(choice)}
            ref={choiceIndex === 0 ? firstControlRef : undefined}
            type="radio"
            value={choice}
          />
          <span lang={exercise.answerLanguage}>{choice}</span>
        </label>
      ))}
    </div>
  )
}
