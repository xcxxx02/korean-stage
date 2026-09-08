import { useLayoutEffect, useRef, useState } from 'react'
import type { Exercise, ExerciseAnswer } from '../content/types'
import { formatCorrectExerciseAnswer, isExerciseAnswerComplete, isExerciseAnswerCorrect } from '../content/exerciseAnswers'
import { ExerciseAnswerControl } from './ExerciseAnswerControl'
import { LanguageAwareText } from './LanguageAwareText'

export function FullQuiz({ exercises }: { exercises: Exercise[] }) {
  const [answers, setAnswers] = useState<Record<string, ExerciseAnswer>>({})
  const [submitted, setSubmitted] = useState(false)
  const summary = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    summary.current?.focus()
    summary.current?.scrollIntoView?.({ block: 'center' })
  }, [])
  const answered = exercises.filter((exercise) => isExerciseAnswerComplete(exercise, answers[exercise.id])).length
  const score = exercises.filter((exercise) => isExerciseAnswerCorrect(exercise, answers[exercise.id])).length

  return <section aria-labelledby="full-quiz-heading" className="space-y-5">
    <header>
      <h2 id="full-quiz-heading" className="text-3xl font-bold">Quiz</h2>
      <p className="mt-2 text-stage-muted">Answer all {exercises.length} questions, then submit to see your score and explanations.</p>
    </header>
    <div ref={summary} tabIndex={-1} className="rounded-xl border border-stage-border bg-stage-cobalt-soft p-4" aria-live="polite">
      {submitted ? <><h3 className="text-xl font-bold">Score: {score} of {exercises.length} correct</h3><p className="mt-1">Your answers are marked below. Review the explanations at your own pace.</p></> : <p>{answered} of {exercises.length} answered</p>}
    </div>
    <form className="space-y-5" onSubmit={(event) => {
      event.preventDefault()
      if (answered !== exercises.length) return
      setSubmitted(true)
      window.setTimeout(() => { summary.current?.focus(); summary.current?.scrollIntoView?.({ block: 'center' }) }, 0)
    }}>
      {exercises.map((exercise, index) => {
        const correct = isExerciseAnswerCorrect(exercise, answers[exercise.id])
        return <fieldset key={exercise.id} className="rounded-xl border border-stage-border bg-stage-white p-5">
          <legend className="px-2 text-sm font-bold text-stage-cobalt">Question {index + 1} of {exercises.length}</legend>
          <p className="text-lg font-bold"><LanguageAwareText text={exercise.prompt} /></p>
          <p className="mt-3 rounded-xl bg-stage-soft p-3 text-lg font-bold text-stage-cobalt" lang="ko">{exercise.koreanContext}</p>
          <ExerciseAnswerControl exercise={exercise} answer={answers[exercise.id]} disabled={submitted} onChange={(answer) => setAnswers((current) => ({ ...current, [exercise.id]: answer }))} />
          {submitted ? <div className={`mt-4 rounded-xl p-4 ${correct ? 'bg-stage-jade-soft text-stage-jade-strong' : 'bg-stage-yellow-soft text-stage-yellow-strong'}`}>
            <p className="font-bold">{correct ? 'Correct' : 'Incorrect'}</p>
            {!correct ? <p className="mt-1">Correct answer: <LanguageAwareText text={formatCorrectExerciseAnswer(exercise)} /></p> : null}
            <p className="mt-1"><LanguageAwareText text={exercise.explanation} /></p>
          </div> : null}
        </fieldset>
      })}
      <div className="rounded-xl border border-stage-border bg-stage-white p-5">
        {submitted ? <button type="button" className="rounded-xl bg-stage-cobalt px-6 py-3 font-bold text-stage-white" onClick={() => {
          setSubmitted(false); setAnswers({}); summary.current?.focus(); summary.current?.scrollIntoView?.({ block: 'center' })
        }}>Try Quiz again</button> : <>
          <p className="mb-3 text-stage-muted">{answered === exercises.length ? 'All questions answered. Ready to submit.' : `Answer ${exercises.length - answered} more questions to submit.`}</p>
          <button type="submit" disabled={answered !== exercises.length} className="rounded-xl bg-stage-cobalt px-6 py-3 font-bold text-stage-white disabled:opacity-40">Submit Quiz</button>
        </>}
      </div>
    </form>
  </section>
}
