import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { VocabularyJourney } from '../components/VocabularyJourney'
import { course } from '../content/course'
import { useCourseProgress } from '../hooks/useCourseProgress'
import { LearnPage } from './LearnPage'

export function UnitPage() {
  const { unitId } = useParams()
  const { visitUnit } = useCourseProgress()
  const countryItems = course.vocabulary.filter((item) => item.unitId === 'unit-2')
  const occupationItems = course.vocabulary.filter((item) => item.unitId === 'unit-3')

  useEffect(() => {
    if (unitId === 'unit-2' || unitId === 'unit-3') visitUnit(unitId)
  }, [unitId, visitUnit])

  if (unitId === 'unit-2') {
    return (
      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:py-14">
        <p className="font-semibold text-blue-700">Vocabulary foundation</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Unit 2 · Countries &amp; Nationalities</h1>
        <p className="mt-3 max-w-2xl text-lg text-slate-700">Learn each country in Korean, then use 사람 to talk about nationality.</p>
        <ul aria-label="Country and nationality vocabulary" className="mt-8 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {countryItems.map((item, index) => (
            <li className="border-t-4 border-blue-600 bg-slate-50 p-5" key={item.id}>
              <span className="text-sm font-bold text-slate-500">{String(index + 1).padStart(2, '0')}</span>
              <p className="mt-3 text-2xl font-black text-blue-700">{item.korean}</p>
              <p className="mt-1 font-semibold text-slate-950">{item.english}</p>
              <p className="mt-3 text-sm text-slate-600">Romanization: {item.romanization}</p>
              <p className="mt-4 border-t border-slate-200 pt-4 font-medium text-slate-900">{item.koreanExample}</p>
              <p className="mt-1 text-sm text-slate-600">{item.englishExample}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10 border-l-4 border-yellow-400 bg-yellow-50 p-6">
          <h2 className="text-xl font-bold text-slate-950">Ready to recall the words?</h2>
          <p className="mt-2 text-slate-700">Use bilingual flashcards after you have read all eight cards.</p>
          <Link className="mt-4 inline-flex rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-600" to="/practice">
            Practise Unit 2 with flashcards
          </Link>
        </div>
      </section>
    )
  }

  if (unitId === 'unit-3') return <VocabularyJourney items={occupationItems} />

  return <LearnPage />
}
