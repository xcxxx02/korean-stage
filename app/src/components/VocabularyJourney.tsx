import { CaretLeft, CaretRight, GraduationCap } from '@phosphor-icons/react'
import { useState } from 'react'
import { course } from '../content/course'
import type { VocabularyItem } from '../content/types'
import { LearningShell } from './LearningShell'
import { MemberVideo } from './MemberVideo'

type VocabularyJourneyProps = {
  items: VocabularyItem[]
}

function grammarTip(item: VocabularyItem) {
  const noun = item.unitId === 'unit-2' ? '사람' : item.korean
  const ending = item.koreanExample.endsWith('이에요.') ? 'consonant' : 'vowel'
  const copula = ending === 'consonant' ? '이에요' : '예요'
  return { noun, ending, copula }
}

export function VocabularyJourney({ items }: VocabularyJourneyProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (items.length === 0) {
    return (
      <section className="mt-8 rounded-xl border border-stage-border bg-stage-white p-6 sm:p-8">
        <h2 className="m-0 text-2xl font-bold text-stage-charcoal">Vocabulary unavailable</h2>
        <p className="mt-3 text-stage-muted">There are no words in this lesson yet. Choose another lesson from All lessons.</p>
      </section>
    )
  }

  const safeActiveIndex = Math.min(activeIndex, items.length - 1)
  const item = items[safeActiveIndex]
  const member = course.members.find((candidate) => candidate.id === item.ownerId)
  const memberName = member?.name ?? 'Course member'
  const tip = grammarTip(item)

  const rail = (
    <>
      <label className="learn-word-chooser">
        <span>Choose vocabulary word</span>
        <select
          aria-label="Choose vocabulary word"
          onChange={(event) => {
            const nextIndex = items.findIndex((word) => word.id === event.target.value)
            if (nextIndex >= 0) setActiveIndex(nextIndex)
          }}
          value={item.id}
        >
          {items.map((word, index) => (
            <option key={word.id} lang="ko" value={word.id}>{index + 1}. {word.korean} — {word.english}</option>
          ))}
        </select>
      </label>
      <ol aria-label="Vocabulary words" className="vocabulary-word-list">
        {items.map((word, index) => {
          const isActive = index === safeActiveIndex
          return (
            <li key={word.id}>
              <button
                aria-current={isActive ? 'true' : undefined}
                aria-label={`${index + 1}. ${word.korean}, ${word.english}`}
                className="vocabulary-word-button"
                onClick={() => setActiveIndex(index)}
                type="button"
              >
                <span aria-hidden="true" className="vocabulary-word-number">{index + 1}</span>
                <span className="vocabulary-word-copy">
                  <span data-korean-content lang="ko">{word.korean}</span>
                  <span lang="en">{word.english}</span>
                  {isActive ? <span className="vocabulary-word-current">Now learning</span> : null}
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </>
  )

  const media = (
    <div className="stage-media-stack">
      <MemberVideo
        className="member-video--stage"
        memberName={memberName}
        mode="learner"
        source={item.video}
        transcript={{ korean: item.koreanExample, english: item.englishExample }}
      />
      <p className="stage-media-presenter">Presented by {memberName}</p>
    </div>
  )

  const details = (
    <div className="vocabulary-details">
      <div>
        <h2 className="vocabulary-details__word" data-korean-content lang="ko">{item.korean}</h2>
        <p className="vocabulary-details__meaning" lang="en">{item.english}</p>
      </div>

      <dl className="vocabulary-pronunciation">
        <div>
          <dt>Romanization</dt>
          <dd>{item.romanization}</dd>
        </div>
        <div>
          <dt>Say it like</dt>
          <dd>{item.pronunciationHint ?? `Try: ${item.romanization}`}</dd>
        </div>
      </dl>

      <section aria-labelledby={`${item.id}-example-heading`} className="vocabulary-example">
        <h3 id={`${item.id}-example-heading`}>Example</h3>
        <p data-korean-content lang="ko">{item.koreanExample}</p>
        <p lang="en">{item.englishExample}</p>
      </section>

      <section aria-labelledby={`${item.id}-grammar-heading`} className="vocabulary-grammar-tip">
        <GraduationCap aria-hidden="true" size={26} weight="fill" />
        <div>
          <h3 id={`${item.id}-grammar-heading`}>Grammar tip</h3>
          <p>
            <span data-korean-content lang="ko">{tip.noun}</span>
            {' '}ends in a {tip.ending}, so use{' '}
            <span data-korean-content lang="ko">{tip.copula}</span>.
          </p>
        </div>
      </section>
    </div>
  )

  const controls = (
    <nav aria-label="Word navigation" className="word-navigation">
      <button
        className="word-navigation__previous"
        disabled={safeActiveIndex === 0}
        onClick={() => setActiveIndex((current) => Math.max(0, current - 1))}
        type="button"
      >
        <CaretLeft aria-hidden="true" weight="bold" />
        Previous word
      </button>
      <button
        className="word-navigation__next"
        disabled={safeActiveIndex === items.length - 1}
        onClick={() => setActiveIndex((current) => Math.min(items.length - 1, current + 1))}
        type="button"
      >
        Next word
        <CaretRight aria-hidden="true" weight="bold" />
      </button>
    </nav>
  )

  const progressMarkers = (
    <ol aria-label="Word position" className="word-position-markers">
      {items.map((word, index) => (
        <li aria-current={index === safeActiveIndex ? 'true' : undefined} key={word.id}>
          <span aria-hidden="true">{index + 1}</span>
        </li>
      ))}
    </ol>
  )

  return (
    <LearningShell
      controls={controls}
      details={details}
      heading="Choose a word"
      media={media}
      progress={`Word ${safeActiveIndex + 1} of ${items.length}`}
      progressLabel="Vocabulary path"
      progressMarkers={progressMarkers}
      rail={rail}
    />
  )
}
