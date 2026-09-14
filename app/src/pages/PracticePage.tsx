import { useLayoutEffect, useRef } from 'react'
import { Link, Navigate, useLocation, useParams, useSearchParams } from 'react-router-dom'
import { FullQuiz } from '../components/FullQuiz'
import { LanguageAwareText } from '../components/LanguageAwareText'
import { practiceGroups, type PracticeGroup } from '../content/practiceCatalog'
import type { Exercise } from '../content/types'

type PracticeSelection = {
  id: string
  title: string
  exercises: Exercise[]
}

const lessonSelection = (group: PracticeGroup): PracticeSelection => ({
  id: group.id,
  title: `${group.kind} Unit ${group.unitNumber} · ${group.title}`,
  exercises: group.exercises,
})

const mixedSelection: PracticeSelection = {
  id: 'quiz',
  title: 'Quiz',
  exercises: practiceGroups.flatMap((group) => group.exercises),
}

export function PracticePage() {
  const [searchParams] = useSearchParams()
  const { lessonSlug } = useParams()
  const location = useLocation()
  const legacyPracticeRoutes: Record<string, string> = {
    'lesson-2': 'vocabulary-1', 'lesson-3': 'vocabulary-2',
    'lesson-4': 'grammar-1', 'lesson-5': 'grammar-1', 'lesson-6': 'grammar-2',
  }
  const routeGroup = practiceGroups.find((group) => group.lessonSlug === lessonSlug)
  const queryGroup = practiceGroups.find(
    (group) => group.lessonSlug === searchParams.get('lesson'),
  )
  const isMixedQuiz = lessonSlug === 'quiz'
  const activeQuiz = routeGroup ? lessonSelection(routeGroup) : isMixedQuiz ? mixedSelection : null
  const quizCardRefs = useRef<Record<string, HTMLElement | null>>({})

  useLayoutEffect(() => {
    if (activeQuiz) return
    const focusLesson = (location.state as { focusLesson?: string } | null)?.focusLesson
    if (focusLesson) quizCardRefs.current[focusLesson]?.focus()
  }, [activeQuiz, location.state])

  const legacyQuery = searchParams.get('lesson')
  if (!lessonSlug && legacyQuery && legacyPracticeRoutes[legacyQuery]) return <Navigate replace to={`/practice/${legacyPracticeRoutes[legacyQuery]}`} />
  if (lessonSlug && legacyPracticeRoutes[lessonSlug]) return <Navigate replace to={`/practice/${legacyPracticeRoutes[lessonSlug]}`} />
  if (!lessonSlug && queryGroup) return <Navigate replace to={`/practice/${queryGroup.lessonSlug}`} />
  if (lessonSlug && !routeGroup && !isMixedQuiz) return <Navigate replace to="/practice" />

  return (
    <div className={`mx-auto max-w-5xl p-5 sm:px-8 ${activeQuiz ? 'space-y-4' : 'space-y-8 sm:py-8'}`}>
      <header>
        <p className="text-sm font-bold uppercase tracking-wide text-stage-cobalt">Lec 1 practice</p>
        <h1 className={`mt-1 font-black text-stage-charcoal ${activeQuiz ? 'text-2xl' : 'text-4xl'}`}>Practice & Quiz</h1>
        {!activeQuiz ? <p className="mt-3 max-w-2xl text-stage-muted">
          Choose a topic, answer every question, then submit once to see your score and explanations.
        </p> : null}
      </header>

      {activeQuiz ? (
        <section aria-label="Active lesson quiz" className="flex flex-col items-start gap-6 [&>section]:w-full">
          <Link
            className="inline-flex rounded-xl border border-stage-cobalt px-4 py-2 font-bold text-stage-cobalt no-underline hover:bg-stage-cobalt-soft"
            state={{ focusLesson: activeQuiz.id }}
            to="/practice"
          >All practice topics</Link>
          <FullQuiz exercises={activeQuiz.exercises} title={activeQuiz.title} />
        </section>
      ) : (
        <>
          <section aria-labelledby="lesson-quiz-heading" className="space-y-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-stage-cobalt">Choose what to practise</p>
              <h2 className="mt-1 text-2xl font-bold text-stage-charcoal" id="lesson-quiz-heading">Practice by topic</h2>
            </div>
            <ul aria-label="Lesson quizzes" className="grid list-none gap-4 p-0 sm:grid-cols-2">
              {practiceGroups.map((group) => {
                return (
                  <li key={group.lessonSlug}>
                    <Link
                      className="flex h-full w-full flex-col items-start rounded-xl border border-stage-border bg-stage-white p-5 text-left no-underline transition hover:-translate-y-1 hover:border-stage-cobalt focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-stage-focus motion-reduce:transition-none"
                      ref={(element) => { quizCardRefs.current[group.lessonSlug] = element }}
                      to={`/practice/${group.lessonSlug}`}
                    >
                      <span className="text-sm font-bold uppercase tracking-wide text-stage-cobalt">{group.kind} · Unit {group.unitNumber}</span>
                      <strong className="mt-2 text-xl text-stage-charcoal"><LanguageAwareText text={group.title} /></strong>
                      <span className="mt-4 text-sm font-semibold text-stage-muted">{group.exercises.length} questions</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>

          <section aria-labelledby="mixed-quiz-heading" className="border-t border-stage-border pt-6">
            <p className="text-sm font-bold uppercase tracking-wide text-stage-vermilion">Optional final check</p>
            <h2 className="mt-1 text-2xl font-bold text-stage-charcoal" id="mixed-quiz-heading">Quiz</h2>
            <p className="mt-2 max-w-2xl text-stage-muted">All {mixedSelection.exercises.length} questions on one page. Finish and submit once to see your results.</p>
            <Link
              aria-label={`${mixedSelection.title} · ${mixedSelection.exercises.length} questions`}
              className="mt-4 inline-flex rounded-xl bg-stage-vermilion px-5 py-3 font-bold text-stage-white no-underline hover:bg-stage-vermilion-strong"
              ref={(element) => { quizCardRefs.current[mixedSelection.id] = element }}
              to="/practice/quiz"
            >
              Quiz · {mixedSelection.exercises.length} questions
            </Link>
          </section>
        </>
      )}
    </div>
  )
}
