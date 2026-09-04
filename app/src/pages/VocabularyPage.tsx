import { Link, useParams } from 'react-router-dom'
import { VocabularyJourney } from '../components/VocabularyJourney'
import { course, vocabularyUnits } from '../content/course'

function VocabularyUnitChooser() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:py-12">
      <header className="max-w-2xl">
        <p className="m-0 text-sm font-black uppercase tracking-[0.16em] text-stage-cobalt">Lec 1 vocabulary</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-stage-charcoal sm:text-5xl">Choose a vocabulary unit</h1>
        <p className="mt-3 text-lg leading-8 text-stage-muted">Build useful Korean words and expressions for introducing yourself and talking about people.</p>
      </header>

      <ul aria-label="Vocabulary units" className="vocabulary-unit-grid mt-8 list-none p-0">
        {vocabularyUnits.map((unit) => (
          <li key={unit.unitId}>
            <Link
              aria-label={`Open ${unit.eyebrow}: ${unit.title}`}
              className="vocabulary-unit-card"
              to={`/vocabulary/${unit.lessonSlug}`}
            >
              <span className="vocabulary-unit-card__eyebrow">{unit.eyebrow}</span>
              <strong className="vocabulary-unit-card__title">{unit.title}</strong>
              <span className="vocabulary-unit-card__description">{unit.description}</span>
              <span className="vocabulary-unit-card__action">Open {unit.eyebrow}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

function VocabularyRecovery() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <p className="text-sm font-black uppercase tracking-[0.16em] text-stage-vermilion-strong">Vocabulary route</p>
      <h1 className="mt-2 text-4xl font-black text-stage-charcoal">Vocabulary unit not found</h1>
      <p className="mt-3 text-lg text-stage-muted">We couldn't find that vocabulary unit.</p>
      <Link className="mt-6 inline-flex rounded-xl bg-stage-cobalt px-5 py-3 font-black text-stage-white no-underline" to="/vocabulary">
        Choose a vocabulary unit
      </Link>
    </section>
  )
}

export function VocabularyPage() {
  const { lessonSlug } = useParams()

  if (lessonSlug === undefined) return <VocabularyUnitChooser />

  const unit = vocabularyUnits.find((candidate) => candidate.lessonSlug === lessonSlug)
  if (!unit) return <VocabularyRecovery />

  const items = course.vocabulary.filter((item) => item.unitId === unit.unitId)
  const itemLabel = unit.itemLabel === 'Useful expressions' ? 'Useful expression' : 'Vocabulary word'

  return (
    <section className="vocabulary-study-page mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:py-12">
      <header className="max-w-3xl">
        <p className="m-0 text-sm font-black uppercase tracking-[0.16em] text-stage-cobalt">{unit.eyebrow} vocabulary</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-stage-charcoal sm:text-5xl">{unit.title}</h1>
        <p className="mt-3 text-lg leading-8 text-stage-muted">{unit.description}</p>
      </header>
      <VocabularyJourney itemLabel={itemLabel} items={items} />
    </section>
  )
}
