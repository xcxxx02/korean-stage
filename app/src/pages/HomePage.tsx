import { Link } from 'react-router-dom'
import { CourseMap } from '../components/CourseMap'
import { ProgressSummary } from '../components/ProgressSummary'
import { course, courseUnits } from '../content/course'
import { getCourseSummary } from '../content/courseSummary'
import { useCourseProgress } from '../hooks/useCourseProgress'

export function HomePage() {
  const { progress } = useCourseProgress()
  const summary = getCourseSummary(course)
  const firstUnitPath = `/learn/${courseUnits[0].id}`
  const hasSavedActivity = progress.lastPath !== firstUnitPath
    || progress.completedUnitIds.length > 0
    || progress.completedVocabularyIds.length > 0
    || Object.keys(progress.exerciseResults).length > 0

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-16">
      <section aria-label="Start with Lec 1" className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] lg:gap-14">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-stage-cobalt">Lec 1 · Korean for beginners</p>
          <h1 className="mt-3 max-w-3xl text-5xl font-black tracking-[-0.045em] text-stage-charcoal sm:text-6xl lg:text-7xl">{course.name}</h1>
          <p className="mt-5 max-w-2xl text-xl font-semibold leading-8 text-stage-charcoal">Learn your first Korean introduction through bilingual words, clear grammar, and role play.</p>
          <p className="mt-4 max-w-2xl leading-7 text-stage-muted">All seven units are adapted entirely from {course.sourceLesson}</p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-stage-vermilion px-6 py-3 font-black text-stage-white no-underline hover:bg-stage-vermilion-strong focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-stage-focus"
              to={hasSavedActivity ? progress.lastPath : firstUnitPath}
            >
              {hasSavedActivity ? 'Continue learning' : 'Start learning'}
            </Link>
            <ProgressSummary completedUnitIds={progress.completedUnitIds} totalUnits={courseUnits.length} />
          </div>
        </div>

        <aside aria-label="Course overview" className="border-l border-stage-jade bg-stage-jade-soft p-6 sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-stage-jade-strong">One lesson, focused practice</p>
          <p className="mt-3 text-3xl font-black leading-tight text-stage-charcoal">Build a complete self-introduction one step at a time.</p>
          <ul className="mt-6 grid list-none gap-4 p-0 text-stage-charcoal">
            <li className="border-t border-stage-jade pt-4"><strong>{summary.vocabularyCount} bilingual words</strong><span className="mt-1 block text-sm text-stage-muted">Countries, nationalities, and occupations</span></li>
            <li className="border-t border-stage-jade pt-4"><strong>{summary.grammarPointCount} grammar patterns</strong><span className="mt-1 block text-sm text-stage-muted">{summary.exercisesPerGrammarPoint === null ? 'Exercise counts need review' : `Exactly ${summary.exercisesPerGrammarPoint} exercises for each point`}</span></li>
            <li className="border-t border-stage-jade pt-4"><strong>{summary.dialogueCount} role-play dialogues</strong><span className="mt-1 block text-sm text-stage-muted">Korean lines with nearby English meaning</span></li>
          </ul>
        </aside>
      </section>

      <CourseMap completedUnitIds={progress.completedUnitIds} />
    </div>
  )
}
