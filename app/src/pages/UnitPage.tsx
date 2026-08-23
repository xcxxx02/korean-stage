import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { GrammarLesson } from '../components/GrammarLesson'
import { VocabularyJourney } from '../components/VocabularyJourney'
import { course } from '../content/course'
import { useCourseProgress } from '../hooks/useCourseProgress'
import { DialoguePage } from './DialoguePage'
import { LearnPage } from './LearnPage'

export function UnitPage() {
  const { unitId } = useParams()
  const { progress, visitUnit, markUnitComplete, recordExerciseResult } = useCourseProgress()
  const countryItems = course.vocabulary.filter((item) => item.unitId === 'unit-2')
  const occupationItems = course.vocabulary.filter((item) => item.unitId === 'unit-3')

  useEffect(() => {
    if (unitId && course.grammar.some((grammarPoint) => grammarPoint.unitId === unitId)) visitUnit(unitId)
    if (unitId === 'unit-2' || unitId === 'unit-3') visitUnit(unitId)
    if (unitId === 'unit-7') visitUnit(unitId)
  }, [unitId, visitUnit])

  if (unitId === 'unit-2') {
    return (
      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:py-14">
        <p className="font-semibold text-stage-cobalt">Vocabulary foundation</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-stage-charcoal sm:text-4xl">Unit 2 · Countries &amp; Nationalities</h1>
        <p className="mt-3 max-w-2xl text-lg text-stage-muted">Learn each country in Korean, then use 사람 to talk about nationality.</p>
        <ul aria-label="Country and nationality vocabulary" className="mt-8 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {countryItems.map((item, index) => (
            <li className="border-t border-stage-cobalt bg-stage-soft p-5" key={item.id}>
              <span className="text-sm font-bold text-stage-faint">{String(index + 1).padStart(2, '0')}</span>
              <p className="mt-3 text-2xl font-black text-stage-cobalt">{item.korean}</p>
              <p className="mt-1 font-semibold text-stage-charcoal">{item.english}</p>
              <p className="mt-3 text-sm text-stage-muted">Romanization: {item.romanization}</p>
              <p className="mt-4 border-t border-stage-border pt-4 font-medium text-stage-charcoal">{item.koreanExample}</p>
              <p className="mt-1 text-sm text-stage-muted">{item.englishExample}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10 border-l border-stage-yellow bg-stage-yellow-soft p-6">
          <h2 className="text-xl font-bold text-stage-charcoal">Ready to recall the words?</h2>
          <p className="mt-2 text-stage-muted">Use bilingual flashcards after you have read all eight cards.</p>
          <Link className="mt-4 inline-flex rounded-xl bg-stage-cobalt px-5 py-3 font-semibold text-stage-white hover:bg-stage-cobalt-strong focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-stage-focus" to="/practice">
            Practise Unit 2 with flashcards
          </Link>
        </div>
        <div className="mt-6 border-l border-stage-jade bg-stage-jade-soft p-6">
          <h2 className="text-xl font-black text-stage-charcoal">Finish Unit 2</h2>
          <p className="mt-2 text-stage-muted">After reviewing all eight country and nationality cards, mark this unit complete.</p>
          <button
            className="mt-4 inline-flex min-h-12 items-center justify-center rounded-xl bg-stage-vermilion px-5 py-3 font-bold text-stage-white hover:bg-stage-vermilion-strong focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-stage-focus disabled:cursor-not-allowed disabled:bg-stage-disabled"
            disabled={progress.completedUnitIds.includes('unit-2')}
            onClick={() => markUnitComplete('unit-2')}
            type="button"
          >
            Mark Unit 2 complete
          </button>
          {progress.completedUnitIds.includes('unit-2') ? <p className="mt-3 font-bold text-stage-jade-strong" role="status">Unit 2 complete</p> : null}
        </div>
      </section>
    )
  }

  if (unitId === 'unit-3') return <VocabularyJourney items={occupationItems} />

  if (unitId === 'unit-7') {
    return <DialoguePage
      onUnitComplete={() => markUnitComplete('unit-7')}
      unit
      unitComplete={progress.completedUnitIds.includes('unit-7')}
    />
  }

  const grammarPoint = course.grammar.find((candidate) => candidate.unitId === unitId)
  if (grammarPoint) {
    const grammarComplete = grammarPoint.exercises.every((exercise) => progress.exerciseResults[exercise.id] === true)
    const handleResult = (exerciseId: string, correct: boolean) => {
      recordExerciseResult(exerciseId, correct)
      visitUnit(grammarPoint.unitId)
      const nextResults = { ...progress.exerciseResults, [exerciseId]: correct }
      if (grammarPoint.exercises.every((exercise) => nextResults[exercise.id] === true)) {
        markUnitComplete(grammarPoint.unitId)
      }
    }

    return (
      <GrammarLesson
        completed={grammarComplete}
        grammarPoint={grammarPoint}
        initialResults={progress.exerciseResults}
        onResult={handleResult}
      />
    )
  }

  return <LearnPage />
}
