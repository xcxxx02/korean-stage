import { Link } from 'react-router-dom'
import { course } from '../content/course'
import { useCourseProgress } from '../hooks/useCourseProgress'

export function GrammarPage() {
  const { progress } = useCourseProgress()

  return (
    <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:py-14">
      <p className="font-semibold text-stage-cobalt">Beginner grammar · Units 4–6</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-stage-charcoal">Grammar</h1>
      <p className="mt-3 max-w-2xl text-lg text-stage-muted">Choose a bilingual lesson, read the English rule, and complete exactly three exercises.</p>
      <ul aria-label="Grammar units" className="mt-8 grid gap-5 p-0 lg:grid-cols-3">
        {course.grammar.map((grammarPoint) => {
          const complete = progress.completedUnitIds.includes(grammarPoint.unitId)
          return (
            <li className="list-none" key={grammarPoint.id}>
              <Link className="grammar-card block h-full rounded-xl border border-stage-border bg-stage-white p-6 transition hover:-translate-y-1 hover:border-stage-cobalt focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-stage-focus" to={`/learn/${grammarPoint.unitId}`}>
                <p className="text-2xl font-black text-stage-cobalt" lang="ko">{grammarPoint.korean}</p>
                <p className="mt-1 text-lg font-bold text-stage-charcoal">{grammarPoint.englishFunction}</p>
                <p className="mt-4 text-stage-muted">{grammarPoint.explanation}</p>
                <p className={`mt-5 font-bold ${complete ? 'text-stage-jade-strong' : 'text-stage-faint'}`}>{complete ? 'Complete' : 'Not complete'}</p>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
