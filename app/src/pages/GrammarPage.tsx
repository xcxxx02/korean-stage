import { Link } from 'react-router-dom'
import { course } from '../content/course'
import { useCourseProgress } from '../hooks/useCourseProgress'

export function GrammarPage() {
  const { progress } = useCourseProgress()

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:py-14">
      <p className="font-semibold text-blue-700">Beginner grammar · Units 4–6</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">Grammar</h1>
      <p className="mt-3 max-w-2xl text-lg text-slate-700">Choose a bilingual lesson, read the English rule, and complete exactly three exercises.</p>
      <ul aria-label="Grammar units" className="mt-8 grid gap-5 p-0 lg:grid-cols-3">
        {course.grammar.map((grammarPoint) => {
          const complete = progress.completedUnitIds.includes(grammarPoint.unitId)
          return (
            <li className="list-none" key={grammarPoint.id}>
              <Link className="block h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-400 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-blue-600" to={`/learn/${grammarPoint.unitId}`}>
                <p className="text-2xl font-black text-blue-800" lang="ko">{grammarPoint.korean}</p>
                <p className="mt-1 text-lg font-bold text-slate-950">{grammarPoint.englishFunction}</p>
                <p className="mt-4 text-slate-700">{grammarPoint.explanation}</p>
                <p className={`mt-5 font-bold ${complete ? 'text-emerald-700' : 'text-slate-500'}`}>{complete ? 'Complete' : 'Not complete'}</p>
              </Link>
            </li>
          )
        })}
      </ul>
    </main>
  )
}
