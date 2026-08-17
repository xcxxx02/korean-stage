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

export function VocabularyJourney({ items, initialItemId }: VocabularyJourneyProps) {
  const initialIndex = Math.max(0, items.findIndex((item) => item.id === initialItemId))
  const [activeIndex, setActiveIndex] = useState(initialIndex)
  const { markVocabularyComplete } = useCourseProgress()

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
    markVocabularyComplete(item.id)
    setActiveIndex((current) => Math.min(current + 1, items.length - 1))
  }

  const rail = (
    <ol aria-label="Vocabulary progress" className="m-0 grid list-none gap-1 p-0">
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
  )

  const media = (
    <div>
      <MemberVideo
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
      <HumanAudioButton memberName={memberName} source={item.audio} />
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
        onClick={() => setActiveIndex((current) => Math.max(0, current - 1))}
        type="button"
      >
        <CaretLeft aria-hidden="true" weight="bold" />
        Previous word
      </button>
      <button
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:bg-slate-300"
        disabled={activeIndex === items.length - 1}
        onClick={showNext}
        type="button"
      >
        Next word
        <CaretRight aria-hidden="true" weight="bold" />
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
