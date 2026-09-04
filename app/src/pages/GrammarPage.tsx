import { Link, useParams } from 'react-router-dom'
import { GrammarGuide } from '../components/GrammarGuide'
import { course, courseLessons } from '../content/course'

const grammarLessons = courseLessons.filter((lesson) =>
  lesson.id === 'unit-4' || lesson.id === 'unit-5' || lesson.id === 'unit-6',
)

function GrammarTopicChooser() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:py-12">
      <header className="max-w-2xl">
        <p className="m-0 text-sm font-black uppercase tracking-[0.16em] text-stage-cobalt">Lec 1 grammar</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-stage-charcoal sm:text-5xl">Choose a grammar topic</h1>
        <p className="mt-3 text-lg leading-8 text-stage-muted">Learn the core sentence patterns for introducing yourself and talking about people.</p>
      </header>

      <ul aria-label="Grammar topics" className="vocabulary-unit-grid mt-8 list-none p-0">
        {grammarLessons.map((lesson, index) => (
          <li key={lesson.id}>
            <Link
              aria-label={`Open grammar topic ${index + 1}: ${lesson.title}`}
              className="vocabulary-unit-card"
              to={`/grammar/${lesson.slug}`}
            >
              <span className="vocabulary-unit-card__eyebrow">Grammar {index + 1}</span>
              <strong className="vocabulary-unit-card__title">{lesson.title}</strong>
              <span className="vocabulary-unit-card__description">Read the rule, then practise it in Korean.</span>
              <span className="vocabulary-unit-card__action">Open grammar topic</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

function GrammarRecovery() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <p className="text-sm font-black uppercase tracking-[0.16em] text-stage-vermilion-strong">Grammar route</p>
      <h1 className="mt-2 text-4xl font-black text-stage-charcoal">Grammar topic not found</h1>
      <p className="mt-3 text-lg text-stage-muted">We couldn't find that grammar topic.</p>
      <Link className="mt-6 inline-flex rounded-xl bg-stage-cobalt px-5 py-3 font-black text-stage-white no-underline" to="/grammar">
        Choose a grammar topic
      </Link>
    </section>
  )
}

export function GrammarPage() {
  const { lessonSlug } = useParams()

  if (lessonSlug === undefined) return <GrammarTopicChooser />

  const lesson = grammarLessons.find((candidate) => candidate.slug === lessonSlug)
  const grammarPoint = lesson && course.grammar.find((item) => item.unitId === lesson.id)

  if (!lesson || !grammarPoint) return <GrammarRecovery />

  return (
    <section className="mx-auto max-w-5xl px-5 py-10 sm:px-8 lg:py-12">
      <header className="max-w-2xl">
        <p className="m-0 text-sm font-black uppercase tracking-[0.16em] text-stage-cobalt">Lec 1 grammar</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-stage-charcoal sm:text-5xl">{lesson.title}</h1>
      </header>
      <GrammarGuide grammarPoint={grammarPoint} />
    </section>
  )
}
