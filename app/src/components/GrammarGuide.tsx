import { Link } from 'react-router-dom'
import { grammarUnits } from '../content/course'
import type { GrammarPoint } from '../content/types'
import { LanguageAwareText } from './LanguageAwareText'

export function GrammarGuide({ grammarPoint }: { grammarPoint: GrammarPoint }) {
  const lesson = grammarUnits.find((candidate) => candidate.id === grammarPoint.unitId)!

  return (
    <article aria-labelledby={`${grammarPoint.id}-heading`} className="mt-8 rounded-xl border border-stage-border bg-stage-white p-6 sm:p-8">
      <h2 className="m-0 text-2xl font-black text-stage-charcoal" id={`${grammarPoint.id}-heading`}>
        <span lang="ko">{grammarPoint.korean}</span>{' '}<span lang="en">·</span>{' '}<span lang="en">{grammarPoint.englishFunction}</span>
      </h2>
      <section className="mt-6">
        <h3 className="text-lg font-black text-stage-cobalt">Meaning</h3>
        <p className="mt-2 text-lg leading-8 text-stage-muted"><LanguageAwareText text={grammarPoint.explanation} /></p>
      </section>
      <section className="mt-6">
        <h3 className="text-lg font-black text-stage-cobalt">Rule</h3>
        <ul className="mt-3 grid gap-2 pl-5 text-stage-charcoal">
        {grammarPoint.rules.map((rule) => <li key={rule}><LanguageAwareText text={rule} /></li>)}
        </ul>
      </section>
      <section className="mt-6">
        <h3 className="text-lg font-black text-stage-cobalt">Examples</h3>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {grammarPoint.examples.map((example) => (
          <div className="rounded-xl bg-stage-cobalt-soft p-5" key={example.korean}>
            <p className="m-0 text-xl font-bold text-stage-cobalt" data-korean-content lang="ko">{example.korean}</p>
            <p className="mt-2 text-stage-muted" lang="en">{example.english}</p>
          </div>
        ))}
      </div>
      </section>
      <section className="mt-6 rounded-xl border border-stage-yellow bg-stage-yellow-soft p-5">
        <h3 className="text-lg font-black text-stage-charcoal">Put it together</h3>
        <p className="mt-2 font-bold text-stage-cobalt"><LanguageAwareText text={grammarPoint.unitId === 'grammar-1' ? 'Topic + 은/는 + Noun + 이에요/예요' : 'Topic + 은/는 + Noun + 이/가 아니에요'} /></p>
        <p className="mt-2 text-stage-muted"><LanguageAwareText text={grammarPoint.unitId === 'grammar-1' ? '민수는 소방관이에요. — Minsu is a firefighter.' : '아나는 태국 사람이 아니에요. — Ana is not Thai.'} /></p>
      </section>
      <section className="mt-6 rounded-xl bg-stage-jade-soft p-5">
        <h3 className="text-lg font-black text-stage-jade-strong">Quick wrap-up</h3>
        <p className="mt-2 text-stage-charcoal"><LanguageAwareText text={grammarPoint.unitId === 'grammar-1' ? 'Mark the topic, then choose 이에요 or 예요 from the final sound of the identity noun.' : 'Choose 이 or 가 from the final sound of the noun, then add 아니에요.'} /></p>
      </section>
      <Link
        className="mt-6 inline-flex rounded-xl bg-stage-vermilion px-5 py-3 font-bold text-stage-white no-underline hover:bg-stage-vermilion-strong"
        to={`/practice/${lesson.id}`}
      >
        Practise this lesson
      </Link>
    </article>
  )
}
