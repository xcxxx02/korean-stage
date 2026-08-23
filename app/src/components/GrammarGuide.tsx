import { Link } from 'react-router-dom'
import { courseLessons } from '../content/course'
import type { GrammarPoint } from '../content/types'

export function GrammarGuide({ grammarPoint }: { grammarPoint: GrammarPoint }) {
  const lesson = courseLessons.find((candidate) => candidate.id === grammarPoint.unitId)!

  return (
    <article aria-labelledby={`${grammarPoint.id}-heading`} className="mt-8 rounded-xl border border-stage-border bg-stage-white p-6 sm:p-8">
      <h2 className="m-0 text-2xl font-black text-stage-charcoal" id={`${grammarPoint.id}-heading`}>
        <span lang="ko">{grammarPoint.korean}</span> · {grammarPoint.englishFunction}
      </h2>
      <p className="mt-4 text-lg leading-8 text-stage-muted">{grammarPoint.explanation}</p>
      <ul className="mt-5 grid gap-2 pl-5 text-stage-charcoal">
        {grammarPoint.rules.map((rule) => <li key={rule}>{rule}</li>)}
      </ul>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {grammarPoint.examples.map((example) => (
          <div className="rounded-xl bg-stage-cobalt-soft p-5" key={example.korean}>
            <p className="m-0 text-xl font-bold text-stage-cobalt" data-korean-content lang="ko">{example.korean}</p>
            <p className="mt-2 text-stage-muted" lang="en">{example.english}</p>
          </div>
        ))}
      </div>
      <Link
        className="mt-6 inline-flex rounded-xl bg-stage-vermilion px-5 py-3 font-bold text-stage-white no-underline hover:bg-stage-vermilion-strong"
        to={`/practice?lesson=${lesson.slug}`}
      >
        Practise this lesson
      </Link>
    </article>
  )
}
