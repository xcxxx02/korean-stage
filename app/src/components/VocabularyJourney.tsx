import { CaretDown, CaretLeft, CaretRight, GraduationCap, SpeakerHigh } from '@phosphor-icons/react'
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
import { VocabularyMemberMedia } from './VocabularyMemberMedia'
import { LanguageAwareText } from './LanguageAwareText'

type VocabularyJourneyProps = {
  items: VocabularyItem[]
  itemLabel?: 'Vocabulary word' | 'Useful expression'
}

const countryFlags: Record<string, string> = { china: 'cn', japan: 'jp', usa: 'us', korea: 'kr', france: 'fr', germany: 'de', australia: 'au', 'united-kingdom': 'gb' }

function CountryFlag({ item }: { item: VocabularyItem }) {
  const code = countryFlags[item.id]
  return code ? <img className="vocabulary-country-flag" src={`/assets/flags/${code}.svg`} alt={`${item.english} flag`} /> : null
}

function grammarTip(item: VocabularyItem) {
  const noun = item.unitId === 'unit-2' ? '사람' : item.korean
  const ending = item.koreanExample.endsWith('이에요.') ? 'consonant' : 'vowel'
  const copula = ending === 'consonant' ? '이에요' : '예요'
  return { noun, ending, copula }
}

export function VocabularyJourney({ items, itemLabel = 'Vocabulary word' }: VocabularyJourneyProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [chooserOpen, setChooserOpen] = useState(false)
  const [chooserFocusIndex, setChooserFocusIndex] = useState(0)
  const chooserTriggerRef = useRef<HTMLButtonElement>(null)
  const chooserOptionRefs = useRef<Array<HTMLButtonElement | null>>([])
  const chooserListboxId = useId()
  const memberAudioRef = useRef<HTMLAudioElement>(null)
  const memberVideoRef = useRef<HTMLVideoElement>(null)
  const isVocabularyWord = itemLabel === 'Vocabulary word'
  const lowerLabel = isVocabularyWord ? 'word' : itemLabel.toLowerCase()
  const pluralLabel = isVocabularyWord ? 'Vocabulary words' : 'Useful expressions'
  const lowerPluralLabel = isVocabularyWord ? 'words' : 'useful expressions'
  const capitalizedLabel = isVocabularyWord ? 'Word' : itemLabel
  const chooserLabel = isVocabularyWord ? 'Choose vocabulary word' : `Choose a ${lowerLabel}`

  useEffect(() => {
    if (chooserOpen) chooserOptionRefs.current[chooserFocusIndex]?.focus()
  }, [chooserFocusIndex, chooserOpen])

  if (items.length === 0) {
    return (
      <section className="mt-8 rounded-xl border border-stage-border bg-stage-white p-6 sm:p-8">
        <h2 className="m-0 text-2xl font-bold text-stage-charcoal">Vocabulary unavailable</h2>
        <p className="mt-3 text-stage-muted">There are no {lowerPluralLabel} in this lesson yet. Choose another lesson from All lessons.</p>
      </section>
    )
  }

  const safeActiveIndex = Math.min(activeIndex, items.length - 1)
  const item = items[safeActiveIndex]
  const member = course.members.find((candidate) => candidate.id === item.ownerId)
  const memberName = member?.name
  const tip = grammarTip(item)
  const canPlayMemberRecording = item.video.kind === 'human-recording'
    && Boolean(item.video.src?.trim())
    && item.audio.kind === 'human-recording'
    && Boolean(item.audio.src?.trim())

  const playMemberRecording = () => {
    if (!canPlayMemberRecording) return
    const audioPlayback = memberAudioRef.current?.play()
    const videoPlayback = memberVideoRef.current?.play()
    if (audioPlayback) void audioPlayback
    if (videoPlayback) void videoPlayback
  }

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
          <span className="learn-word-chooser__label">{chooserLabel}</span>
          <span className="learn-word-chooser__value">
            <span aria-hidden="true">{safeActiveIndex + 1}.</span>
            <span data-korean-content lang="ko">{item.korean}</span>
            <span aria-hidden="true">—</span>
            <span lang="en">{item.english}</span>
          </span>
          <CaretDown aria-hidden="true" size={20} weight="bold" />
        </button>
        {chooserOpen ? (
          <div aria-label={pluralLabel} className="learn-word-listbox" id={chooserListboxId} role="listbox">
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
      <ol aria-label={pluralLabel} className="vocabulary-word-list">
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
                <CountryFlag item={word} />
              </button>
            </li>
          )
        })}
      </ol>
    </>
  )

  const media = (
      <VocabularyMemberMedia
        key={item.id}
        audio={item.audio}
        audioRef={memberAudioRef}
        memberName={memberName ?? 'Pronunciation'}
        video={item.video}
        videoRef={memberVideoRef}
      />
    )

  const details = (
    <div className="vocabulary-details">
      <div>
        <div className="vocabulary-details__word-row">
          <CountryFlag item={item} />
          <h2 className="vocabulary-details__word" data-korean-content lang="ko">{item.korean}</h2>
          {(
            <button aria-label="Listen & watch" className="vocabulary-listen-button" disabled={!canPlayMemberRecording} onClick={playMemberRecording} type="button">
              <SpeakerHigh aria-hidden="true" size={24} weight="fill" />
              <span>Listen &amp;<br />watch</span>
            </button>
          )}
        </div>
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
          {item.unitId === 'unit-1' ? <p>{item.korean.startsWith('안녕')
            ? 'Use this polite greeting when meeting someone. It means “Hello.”'
            : 'Replace 미나 (Mina) with your name. Use 예요 after a vowel, or 이에요 after a consonant.'}</p> : item.unitId === 'unit-2' ? <p><LanguageAwareText text={`${item.korean} + 사람 → ${item.korean} 사람 (${item.englishExample.replace(/^I am /, '').replace(/\.$/, '')}). Add 이에요 to say “${item.englishExample}”`} /></p> : <><p>
            <span data-korean-content lang="ko">{tip.noun}</span>
            {' '}ends in a {tip.ending}, so use{' '}
            <span data-korean-content lang="ko">{tip.copula}</span>.
          </p><p className="mt-1"><LanguageAwareText text={`${item.korean} + ${tip.copula} → ${item.korean}${tip.copula}.`} /></p></>}
        </div>
      </section>
    </div>
  )

  const controls = (
    <nav aria-label={`${capitalizedLabel} navigation`} className="word-navigation">
      <button
        aria-label={`Previous ${lowerLabel}`}
        className="word-navigation__previous"
        disabled={safeActiveIndex === 0}
        onClick={() => setActiveIndex((current) => Math.max(0, current - 1))}
        type="button"
      >
        <CaretLeft aria-hidden="true" weight="bold" />
        Previous {isVocabularyWord ? 'word' : 'expression'}
      </button>
      {safeActiveIndex === items.length - 1 ? <a
        className="word-navigation__next"
        href={item.unitId === 'unit-1' ? '/vocabulary/lesson-2' : item.unitId === 'unit-2' ? '/vocabulary/lesson-3' : '/vocabulary'}
      >{item.unitId === 'unit-3' ? 'All units' : 'Next unit'}<CaretRight aria-hidden="true" weight="bold" /></a> : <button
        aria-label={`Next ${lowerLabel}`}
        className="word-navigation__next"
        disabled={safeActiveIndex === items.length - 1}
        onClick={() => setActiveIndex((current) => Math.min(items.length - 1, current + 1))}
        type="button"
      >
        Next {isVocabularyWord ? 'word' : 'expression'}
        <CaretRight aria-hidden="true" weight="bold" />
      </button>}
    </nav>
  )

  const progressMarkers = (
    <ol aria-label={`${capitalizedLabel} position`} className="word-position-markers">
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
      heading={`Choose a ${lowerLabel}`}
      layout="details-center"
      media={media}
      progress={`${capitalizedLabel} ${safeActiveIndex + 1} of ${items.length}`}
      progressLabel="Vocabulary path"
      progressMarkers={progressMarkers}
      rail={rail}
      railLabel={`Ordered ${pluralLabel.toLowerCase()}`}
    />
  )
}
