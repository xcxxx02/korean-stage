import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ExerciseEngine } from '../components/ExerciseEngine'
import { practiceGroups, type PracticeGroup } from '../content/practiceCatalog'
import type { Exercise } from '../content/types'

type PracticeSelection = {
  id: string
  title: string
  exercises: Exercise[]
}

const lessonNumber = (group: PracticeGroup) => Number(group.lessonSlug.split('-')[1])

const lessonSelection = (group: PracticeGroup): PracticeSelection => ({
  id: group.lessonSlug,
  title: `Lesson ${lessonNumber(group)} · ${group.title} quiz`,
  exercises: group.exercises,
})

const mixedSelection: PracticeSelection = {
  id: 'mixed-lec-1',
  title: 'Mixed Lec 1 quiz',
  exercises: practiceGroups.flatMap((group) => group.exercises),
}

export function PracticePage() {
  const [searchParams] = useSearchParams()
  const requestedGroup = practiceGroups.find(
    (group) => group.lessonSlug === searchParams.get('lesson'),
  )
  const [activeQuiz, setActiveQuiz] = useState<PracticeSelection | null>(
    requestedGroup ? lessonSelection(requestedGroup) : null,
  )

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-5 sm:p-8">
      <header>
        <p className="text-sm font-bold uppercase tracking-wide text-stage-cobalt">Lec 1 practice</p>
        <h1 className="mt-1 text-4xl font-black text-stage-charcoal">Practice by lesson</h1>
        <p className="mt-3 max-w-2xl text-stage-muted">
          Choose a lesson you have learned. Each quiz gives immediate English feedback and lets you try again.
        </p>
      </header>

      {activeQuiz ? (
        <section aria-label="Active lesson quiz" className="space-y-6">
          <button
            className="rounded-xl border border-stage-cobalt px-4 py-2 font-bold text-stage-cobalt hover:bg-stage-cobalt-soft"
            onClick={() => setActiveQuiz(null)}
            type="button"
          >
            All lesson quizzes
          </button>
          <ExerciseEngine
            exercises={activeQuiz.exercises}
            key={activeQuiz.id}
            mode="quiz"
            title={activeQuiz.title}
          />
        </section>
      ) : (
        <>
          <section aria-labelledby="lesson-quiz-heading" className="space-y-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-stage-cobalt">Choose what to practise</p>
              <h2 className="mt-1 text-2xl font-bold text-stage-charcoal" id="lesson-quiz-heading">Lesson quizzes</h2>
            </div>
            <ul aria-label="Lesson quizzes" className="grid list-none gap-4 p-0 sm:grid-cols-2">
              {practiceGroups.map((group) => {
                const number = lessonNumber(group)
                return (
                  <li key={group.lessonSlug}>
                    <button
                      aria-label={`Lesson ${number} · ${group.title} · ${group.exercises.length} questions`}
                      className="flex h-full w-full flex-col items-start rounded-xl border border-stage-border bg-stage-white p-5 text-left transition hover:-translate-y-1 hover:border-stage-cobalt focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-stage-focus motion-reduce:transition-none"
                      onClick={() => setActiveQuiz(lessonSelection(group))}
                      type="button"
                    >
                      <span className="text-sm font-bold uppercase tracking-wide text-stage-cobalt">Lesson {number}</span>
                      <strong className="mt-2 text-xl text-stage-charcoal">{group.title}</strong>
                      <span className="mt-4 text-sm font-semibold text-stage-muted">{group.exercises.length} questions</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>

          <section aria-labelledby="mixed-quiz-heading" className="border-t border-stage-border pt-6">
            <p className="text-sm font-bold uppercase tracking-wide text-stage-vermilion">Optional final check</p>
            <h2 className="mt-1 text-2xl font-bold text-stage-charcoal" id="mixed-quiz-heading">Mix all five lessons</h2>
            <p className="mt-2 max-w-2xl text-stage-muted">Use this only when you want countries, jobs, and all three grammar points in one quiz.</p>
            <button
              aria-label={`${mixedSelection.title} · ${mixedSelection.exercises.length} questions`}
              className="mt-4 rounded-xl bg-stage-vermilion px-5 py-3 font-bold text-stage-white hover:bg-stage-vermilion-strong"
              onClick={() => setActiveQuiz(mixedSelection)}
              type="button"
            >
              Mixed Lec 1 quiz · {mixedSelection.exercises.length} questions
            </button>
          </section>
        </>
      )}
    </div>
  )
}
