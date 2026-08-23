import { CaretLeft, CaretRight, ChatCircleText, Cloud, GraduationCap } from '@phosphor-icons/react'
import { useState } from 'react'
import { course, courseUnits } from '../content/course'
import type { VocabularyItem } from '../content/types'
import { useCourseProgress } from '../hooks/useCourseProgress'
import { HumanAudioButton } from './HumanAudioButton'
import { LearningShell } from './LearningShell'
import { MemberVideo } from './MemberVideo'

type VocabularyJourneyProps = {
  items: VocabularyItem[]
  initialItemId?: string
  progressPath?: string
}

function grammarTip(item: VocabularyItem): { heading: string; explanation: string } {
  const noun = item.unitId === 'unit-2' ? '사람' : item.korean
  if (item.koreanExample.endsWith('이에요.')) {
    return {
      heading: '이에요 / 예요 — to be',
      explanation: `${noun} ends in a consonant, so use 이에요.`,
    }
  }

  return {
    heading: '이에요 / 예요 — to be',
    explanation: `${noun} ends in a vowel, so use 예요.`,
  }
}

export function VocabularyJourney({ items, initialItemId, progressPath }: VocabularyJourneyProps) {
  const { progress, markUnitComplete, markVocabularyComplete } = useCourseProgress()
  const firstUnfinishedIndex = items.findIndex((item) => !progress.completedVocabularyIds.includes(item.id))
  const unlockedIndex = firstUnfinishedIndex === -1 ? Math.max(0, items.length - 1) : firstUnfinishedIndex
  const requestedIndex = Math.max(0, items.findIndex((item) => item.id === initialItemId))
  const initialIndex = Math.min(requestedIndex, unlockedIndex)
  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const [isFinished, setIsFinished] = useState(false)

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold text-stage-charcoal">Vocabulary unavailable</h1>
        <p className="mt-3 text-stage-muted">There are no words in this unit yet. Return to the course map and choose another unit.</p>
      </section>
    )
  }

  const item = items[Math.min(activeIndex, items.length - 1)]
  const replacementItem = items[(activeIndex + 1) % items.length]
  const member = course.members.find((candidate) => candidate.id === item.ownerId)
  const memberName = member?.name ?? 'Course member'
  const tip = grammarTip(item)
  const unitNumber = item.unitId === 'unit-2' ? 2 : 3
  const unitTitle = courseUnits.find((unit) => unit.id === item.unitId)?.title ?? 'Vocabulary'

  const showNext = () => {
    markVocabularyComplete(item.id, progressPath)
    if (activeIndex === items.length - 1) {
      markUnitComplete(item.unitId)
      setIsFinished(true)
    } else {
      setActiveIndex((current) => current + 1)
    }
  }

  const rail = (
    <>
      <fieldset className="rounded-xl border border-stage-border p-4 lg:hidden">
        <legend className="px-1 font-bold text-stage-charcoal">Compact vocabulary progress</legend>
        <label className="mb-2 block text-sm font-semibold text-stage-muted" htmlFor="compact-vocabulary-selector">Choose vocabulary word</label>
        <select
          aria-label="Choose vocabulary word"
          className="min-h-12 w-full rounded-xl border border-stage-border-strong bg-stage-white px-3 text-stage-charcoal focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-stage-focus"
          id="compact-vocabulary-selector"
          onChange={(event) => {
            const nextIndex = items.findIndex((word) => word.id === event.target.value)
            if (nextIndex >= 0 && nextIndex <= unlockedIndex) {
              setIsFinished(false)
              setActiveIndex(nextIndex)
            }
          }}
          value={item.id}
        >
          {items.map((word, index) => (
            <option disabled={index > unlockedIndex} key={word.id} value={word.id}>{index + 1}. {word.korean} — {word.english}</option>
          ))}
        </select>
        <p aria-current="step" className="mb-0 mt-3 text-sm font-semibold text-stage-cobalt">
          {activeIndex + 1} of {items.length} · {item.korean} · {item.english}
        </p>
      </fieldset>
      <ol aria-label="Vocabulary progress" className="m-0 hidden list-none gap-1 p-0 lg:grid">
        {items.map((word, index) => {
          const isActive = index === activeIndex
          return (
            <li
              aria-current={isActive ? 'step' : undefined}
              aria-label={`${index + 1}. ${word.korean}, ${word.english}`}
              className={`relative grid grid-cols-[2.5rem_1fr] gap-3 border-l py-2 pl-2 ${isActive ? 'border-stage-cobalt' : 'border-transparent'}`}
              key={word.id}
            >
              <span className={`grid size-9 place-items-center rounded-full border text-sm font-bold ${isActive ? 'border-stage-cobalt bg-stage-cobalt text-stage-white' : 'border-stage-border bg-stage-white text-stage-muted'}`}>
                {index + 1}
              </span>
              <span>
                <span className={`block text-lg font-bold ${isActive ? 'text-stage-cobalt' : 'text-stage-charcoal'}`}>{word.korean}</span>
                <span className="block text-sm text-stage-muted">{word.english}</span>
                {isActive ? <span className="mt-1 inline-block rounded-full bg-stage-cobalt px-2 py-0.5 text-xs font-semibold text-stage-white">Now learning</span> : null}
              </span>
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
        key={`${item.id}:${item.video.kind}:${item.video.src ?? 'missing'}`}
        memberName={memberName}
        source={item.video}
        transcript={`${item.koreanExample} ${item.englishExample}`}
      />
      <p className="stage-media-presenter">Presented by {memberName}</p>
      <section aria-label="Use it in conversation" className="conversation-use-card">
        <div className="conversation-use-card__intro">
          <ChatCircleText aria-hidden="true" size={28} weight="duotone" />
          <div>
            <h2>Use it in conversation</h2>
            <p>Introduce your job or role.</p>
          </div>
        </div>
        <div className="conversation-use-card__pattern">
          <span>Sentence pattern</span>
          <strong>저는 ___이에요 / 예요.</strong>
        </div>
        <div className="conversation-use-card__swap">
          <span>Try another word</span>
          <strong>{replacementItem.koreanExample}</strong>
          <small>{replacementItem.englishExample}</small>
        </div>
      </section>
    </div>
  )

  const details = (
    <div className="grid gap-5">
      <div>
        <p className="m-0 text-5xl font-black tracking-tight text-stage-cobalt lg:text-6xl">{item.korean}</p>
        <p className="mt-2 text-2xl font-bold text-stage-charcoal lg:text-3xl">{item.english}</p>
      </div>
      <dl className="m-0 grid gap-2 border-y border-stage-jade py-4 text-stage-charcoal">
        <div className="flex flex-wrap gap-2">
          <dt className="font-semibold text-stage-jade-strong">Romanization:</dt>
          <dd className="m-0">{item.romanization}</dd>
        </div>
        {item.pronunciationHint ? (
          <div className="flex flex-wrap gap-2">
            <dt className="font-semibold text-stage-jade-strong">Pronunciation:</dt>
            <dd className="m-0">{item.pronunciationHint}</dd>
          </div>
        ) : null}
      </dl>
      <HumanAudioButton
        key={`${item.id}:${item.audio.kind}:${item.audio.src ?? 'missing'}`}
        memberName={memberName}
        source={item.audio}
      />
      <div className="border-y border-stage-jade py-4">
        <p className="m-0 text-xl font-bold text-stage-charcoal">{item.koreanExample}</p>
        <p className="mt-2 text-stage-muted">{item.englishExample}</p>
      </div>
      <div className="rounded-xl border border-stage-jade p-4">
        <div className="flex gap-3">
          <GraduationCap aria-hidden="true" className="shrink-0 text-stage-jade-strong" size={28} weight="fill" />
          <div>
            <h2 className="m-0 text-base font-bold text-stage-jade-strong">{tip.heading}</h2>
            <p className="mt-2 text-sm leading-6 text-stage-muted">{tip.explanation}</p>
          </div>
        </div>
      </div>
    </div>
  )

  const controls = (
    <nav aria-label="Word navigation" className="grid grid-cols-2 gap-4">
      <button
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-stage-cobalt px-5 py-3 font-semibold text-stage-cobalt hover:bg-stage-cobalt-soft focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-stage-focus disabled:cursor-not-allowed disabled:border-stage-border disabled:text-stage-faint"
        disabled={activeIndex === 0}
        onClick={() => {
          setIsFinished(false)
          setActiveIndex((current) => Math.max(0, current - 1))
        }}
        type="button"
      >
        <CaretLeft aria-hidden="true" weight="bold" />
        Previous word
      </button>
      <button
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-stage-vermilion px-5 py-3 font-semibold text-stage-white hover:bg-stage-vermilion-strong focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-stage-focus disabled:cursor-not-allowed disabled:bg-stage-disabled"
        disabled={isFinished}
        onClick={showNext}
        type="button"
      >
        {isFinished ? 'Vocabulary complete' : activeIndex === items.length - 1 ? 'Finish vocabulary' : 'Next word'}
        {isFinished ? null : <CaretRight aria-hidden="true" weight="bold" />}
      </button>
    </nav>
  )

  const progressMarkers = (
    <div className="word-progress-line">
      <Cloud aria-hidden="true" className="word-progress-cloud" size={30} weight="duotone" />
      <ol aria-label="Word progress markers" className="word-progress-markers">
        {items.map((word, index) => (
          <li
            aria-current={index === activeIndex ? 'step' : undefined}
            aria-label={`Word ${index + 1}: ${word.korean}, ${word.english}${index === activeIndex ? ', now learning' : ''}`}
            className={index === activeIndex ? 'is-active' : index < activeIndex ? 'is-complete' : undefined}
            key={word.id}
          >
            <span aria-hidden="true">{index + 1}</span>
          </li>
        ))}
      </ol>
      <Cloud aria-hidden="true" className="word-progress-cloud" size={30} weight="duotone" />
    </div>
  )

  return (
    <LearningShell
      controls={controls}
      details={details}
      heading={`Unit ${unitNumber} · ${unitTitle}`}
      media={media}
      progress={`Word ${activeIndex + 1} of ${items.length}`}
      progressLabel="Vocabulary path"
      progressMarkers={progressMarkers}
      rail={rail}
    />
  )
}
