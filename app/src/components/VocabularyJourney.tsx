import { CaretDown, CaretLeft, CaretRight, GraduationCap } from '@phosphor-icons/react'
import {
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
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
  const [chooserOpen, setChooserOpen] = useState(false)
  const [chooserFocusIndex, setChooserFocusIndex] = useState(0)
  const chooserTriggerRef = useRef<HTMLButtonElement>(null)
  const chooserOptionRefs = useRef<Array<HTMLButtonElement | null>>([])
  const chooserListboxId = useId()

  useEffect(() => {
    if (chooserOpen) chooserOptionRefs.current[chooserFocusIndex]?.focus()
  }, [chooserFocusIndex, chooserOpen])

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
  const memberName = member?.name
  const requiresMemberRecording = item.assessmentStatus === 'assessed'
    && item.recordingRequirement === 'member-recording-required'
  const tip = grammarTip(item)

  const closeChooser = () => {
    setChooserOpen(false)
    chooserTriggerRef.current?.focus()
  }

  const selectChooserWord = (index: number) => {
    setActiveIndex(index)
    closeChooser()
  }

  const moveChooserFocus = (event: ReactKeyboardEvent, nextIndex: number) => {
    event.preventDefault()
    setChooserFocusIndex(Math.max(0, Math.min(items.length - 1, nextIndex)))
  }

  const rail = (
    <>
      <div className="learn-word-chooser">
        <button
          aria-controls={chooserListboxId}
          aria-expanded={chooserOpen}
          aria-haspopup="listbox"
          className="learn-word-chooser__trigger"
          onClick={() => {
            setChooserFocusIndex(safeActiveIndex)
            setChooserOpen((open) => !open)
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown' || event.key === 'Home') {
              moveChooserFocus(event, event.key === 'Home' ? 0 : safeActiveIndex)
              setChooserOpen(true)
            } else if (event.key === 'ArrowUp' || event.key === 'End') {
              moveChooserFocus(event, event.key === 'End' ? items.length - 1 : safeActiveIndex)
              setChooserOpen(true)
            } else if (event.key === 'Escape' && chooserOpen) {
              event.preventDefault()
              closeChooser()
            }
          }}
          ref={chooserTriggerRef}
          type="button"
        >
          <span className="learn-word-chooser__label">Choose vocabulary word</span>
          <span className="learn-word-chooser__value">
            <span aria-hidden="true">{safeActiveIndex + 1}.</span>
            <span data-korean-content lang="ko">{item.korean}</span>
            <span aria-hidden="true">—</span>
            <span lang="en">{item.english}</span>
          </span>
          <CaretDown aria-hidden="true" size={20} weight="bold" />
        </button>
        {chooserOpen ? (
          <div aria-label="Vocabulary words" className="learn-word-listbox" id={chooserListboxId} role="listbox">
            {items.map((word, index) => {
              const isActive = index === safeActiveIndex
              return (
                <button
                  aria-selected={isActive}
                  className="learn-word-option"
                  key={word.id}
                  onClick={() => selectChooserWord(index)}
                  onFocus={() => setChooserFocusIndex(index)}
                  onKeyDown={(event) => {
                    if (event.key === 'ArrowDown') moveChooserFocus(event, index + 1)
                    else if (event.key === 'ArrowUp') moveChooserFocus(event, index - 1)
                    else if (event.key === 'Home') moveChooserFocus(event, 0)
                    else if (event.key === 'End') moveChooserFocus(event, items.length - 1)
                    else if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      selectChooserWord(index)
                    } else if (event.key === 'Escape') {
                      event.preventDefault()
                      closeChooser()
                    }
                  }}
                  ref={(node) => { chooserOptionRefs.current[index] = node }}
                  role="option"
                  tabIndex={index === chooserFocusIndex ? 0 : -1}
                  type="button"
                >
                  <span aria-hidden="true" className="learn-word-option__number">{index + 1}</span>
                  <span className="learn-word-option__copy">
                    <span data-korean-content lang="ko">{word.korean}</span>
                    <span lang="en">{word.english}</span>
                  </span>
                  {isActive ? <span className="learn-word-option__current">Now learning</span> : null}
                </button>
              )
            })}
          </div>
        ) : null}
      </div>
      <ol aria-label="Vocabulary words" className="vocabulary-word-list">
        {items.map((word, index) => {
          const isActive = index === safeActiveIndex
          return (
            <li key={word.id}>
              <button
                aria-current={isActive ? 'true' : undefined}
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

  const media = requiresMemberRecording && memberName ? (
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
    ) : (
      <section className="supporting-vocabulary-media" aria-labelledby={`${item.id}-supporting-heading`}>
        <GraduationCap aria-hidden="true" size={42} weight="fill" />
        <div>
          <h2 id={`${item.id}-supporting-heading`}>Supporting vocabulary</h2>
          <p>These country words support the lesson and Practice. They are not assessed member recordings.</p>
        </div>
      </section>
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
