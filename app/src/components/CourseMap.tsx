import { Link } from 'react-router-dom'
import { courseUnits } from '../content/course'

type CourseMapProps = {
  completedUnitIds?: string[]
}

export function CourseMap({ completedUnitIds = [] }: CourseMapProps) {
  const completedUnits = new Set(completedUnitIds)

  return (
    <nav aria-label="Course map" className="mt-14 border-t border-stage-border pt-8">
      <p className="text-sm font-black uppercase tracking-[0.16em] text-stage-cobalt">Seven-unit sequence</p>
      <h2 className="mt-2 text-3xl font-black tracking-tight text-stage-charcoal">Choose your learning path</h2>
      <p className="mt-3 max-w-2xl text-stage-muted">Follow the units in order or revisit any topic. Every unit stays within Lec 1.</p>
      <ol className="mt-8 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
        {courseUnits.map((unit, index) => (
          <li key={unit.id}>
            <Link
              aria-label={`Unit ${index + 1} ${unit.title}${completedUnits.has(unit.id) ? ' — Complete' : ''}`}
              className="group grid min-h-32 grid-cols-[2.75rem_1fr] gap-4 rounded-xl border border-stage-border bg-stage-white p-5 text-stage-charcoal no-underline transition hover:border-stage-cobalt hover:bg-stage-cobalt-soft focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-stage-focus"
              to={`/learn/${unit.id}`}
            >
              <span className="grid size-11 place-items-center rounded-full bg-stage-cobalt-soft text-sm font-black text-stage-cobalt group-hover:bg-stage-cobalt group-hover:text-stage-white">{index + 1}</span>
              <span>
                <span className="block text-xs font-black uppercase tracking-[0.14em] text-stage-faint">Unit {index + 1}</span>
                <span className="mt-2 block text-lg font-black leading-snug">{unit.title}</span>
                {completedUnits.has(unit.id) ? <span className="mt-3 inline-block rounded-full bg-stage-jade-soft px-2 py-1 text-xs font-black text-stage-jade-strong">Complete</span> : null}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}
