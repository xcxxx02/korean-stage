import { CaretLeft, CaretRight, GraduationCap } from '@phosphor-icons/react'
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
  const { progress, markVocabularyComplete } = useCourseProgress()
  const firstUnfinishedIndex = items.findIndex((item) => !progress.completedVocabularyIds.includes(item.id))
  const unlockedIndex = firstUnfinishedIndex === -1 ? Math.max(0, items.length - 1) : firstUnfinishedIndex
  const requestedIndex = Math.max(0, items.findIndex((item) => item.id === initialItemId))
  const initialIndex = Math.min(requestedIndex, unlockedIndex)
  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const [isFinished, setIsFinished] = useState(false)

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-3xl font-bold text-slate-950">Vocabulary unavailable</h1>
        <p className="mt-3 text-slate-700">There are no words in this unit yet.</p>
      </section>
    )
  }

  const item = items[Math.min(activeIndex, items.length - 1)]
  const member = course.members.find((candidate) => candidate.id === item.ownerId)
  const memberName = member?.name ?? 'Course member'
  const tip = grammarTip(item)
  const unitNumber = item.unitId === 'unit-2' ? 2 : 3
  const unitTitle = courseUnits.find((unit) => unit.id === item.unitId)?.title ?? 'Vocabulary'

  const showNext = () => {
    markVocabularyComplete(item.id, progressPath)
    if (activeIndex === items.length - 1) {
      setIsFinished(true)
    } else {
      setActiveIndex((current) => current + 1)
    }
  }

  const rail = (
    <>
      <fieldset className="rounded-lg border border-slate-300 p-4 lg:hidden">
        <legend className="px-1 font-bold text-slate-950">Compact vocabulary progress</legend>
        <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="compact-vocabulary-selector">Choose vocabulary word</label>
        <select
          aria-label="Choose vocabulary word"
          className="min-h-12 w-full rounded-lg border border-slate-400 bg-white px-3 text-slate-950 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
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
        <p aria-current="step" className="mb-0 mt-3 text-sm font-semibold text-blue-700">
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
              className={`relative grid grid-cols-[2.5rem_1fr] gap-3 border-l-4 py-2 pl-2 ${isActive ? 'border-blue-600' : 'border-transparent'}`}
              key={word.id}
            >
              <span className={`grid size-9 place-items-center rounded-full border text-sm font-bold ${isActive ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white text-slate-700'}`}>
                {index + 1}
              </span>
              <span>
                <span className={`block text-lg font-bold ${isActive ? 'text-blue-700' : 'text-slate-950'}`}>{word.korean}</span>
                <span className="block text-sm text-slate-700">{word.english}</span>
                {isActive ? <span className="mt-1 inline-block rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">Now learning</span> : null}
              </span>
            </li>
          )
        })}
      </ol>
    </>
  )

  const media = (
    <div>
      <MemberVideo
        key={`${item.id}:${item.video.kind}:${item.video.src ?? 'missing'}`}
        memberName={memberName}
        source={item.video}
        transcript={`${item.koreanExample} ${item.englishExample}`}
      />
      <p className="mt-4 text-center text-sm font-medium text-slate-700">Presented by {memberName}</p>
    </div>
  )

  const details = (
    <div className="grid gap-5">
      <div>
        <p className="m-0 text-5xl font-black tracking-tight text-blue-700">{item.korean}</p>
        <p className="mt-2 text-2xl font-bold text-slate-950">{item.english}</p>
      </div>
      <dl className="m-0 grid gap-2 border-y border-emerald-300 py-4 text-slate-800">
        <div className="flex flex-wrap gap-2">
          <dt className="font-semibold text-emerald-700">Romanization:</dt>
          <dd className="m-0">{item.romanization}</dd>
        </div>
        {item.pronunciationHint ? (
          <div className="flex flex-wrap gap-2">
            <dt className="font-semibold text-emerald-700">Pronunciation:</dt>
            <dd className="m-0">{item.pronunciationHint}</dd>
          </div>
        ) : null}
      </dl>
      <HumanAudioButton
        key={`${item.id}:${item.audio.kind}:${item.audio.src ?? 'missing'}`}
        memberName={memberName}
        source={item.audio}
      />
      <div className="border-y border-emerald-300 py-4">
        <p className="m-0 text-xl font-bold text-slate-950">{item.koreanExample}</p>
        <p className="mt-2 text-slate-700">{item.englishExample}</p>
      </div>
      <div className="rounded-lg border border-emerald-300 p-4">
        <div className="flex gap-3">
          <GraduationCap aria-hidden="true" className="shrink-0 text-emerald-700" size={28} weight="fill" />
          <div>
            <h2 className="m-0 text-base font-bold text-emerald-700">{tip.heading}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">{tip.explanation}</p>
          </div>
        </div>
      </div>
    </div>
  )

  const controls = (
    <nav aria-label="Word navigation" className="grid grid-cols-2 gap-4">
      <button
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border-2 border-blue-600 px-5 py-3 font-semibold text-blue-700 hover:bg-blue-50 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400"
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
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:bg-slate-300"
        disabled={isFinished}
        onClick={showNext}
        type="button"
      >
        {isFinished ? 'Vocabulary complete' : activeIndex === items.length - 1 ? 'Finish vocabulary' : 'Next word'}
        {isFinished ? null : <CaretRight aria-hidden="true" weight="bold" />}
      </button>
    </nav>
  )

  return (
    <LearningShell
      controls={controls}
      details={details}
      heading={`Unit ${unitNumber} · ${unitTitle}`}
      media={media}
      progress={`Word ${activeIndex + 1} of ${items.length}`}
      rail={rail}
    />
  )
}
