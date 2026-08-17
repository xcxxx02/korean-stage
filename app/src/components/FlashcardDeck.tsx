import { useState, type KeyboardEvent } from 'react'
import type { VocabularyItem } from '../content/types'

type FlashcardDeckProps = {
  items: VocabularyItem[]
  random?: () => number
}

export function FlashcardDeck({ items, random = Math.random }: FlashcardDeckProps) {
  const [cards, setCards] = useState(items)
  const [cardIndex, setCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const card = cards[cardIndex]

  const showCard = (index: number) => {
    setCardIndex(index)
    setIsFlipped(false)
  }

  const previous = () => showCard(Math.max(0, cardIndex - 1))
  const next = () => showCard(Math.min(cards.length - 1, cardIndex + 1))

  const handleCardKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      next()
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      previous()
    }
  }

  const shuffle = () => {
    const shuffled = [...cards]
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(random() * (index + 1))
      ;[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]
    }
    setCards(shuffled)
    showCard(0)
  }

  const reset = () => {
    setCards(items)
    showCard(0)
  }

  if (!card) return <p>No vocabulary cards are available. Return to the course map and choose a unit with vocabulary.</p>

  return (
    <section aria-labelledby="flashcard-heading" className="space-y-5">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-stage-cobalt">Vocabulary Flashcards</p>
        <h2 className="mt-1 text-2xl font-bold text-stage-charcoal" id="flashcard-heading">Review Korean words</h2>
        <p aria-live="polite" className="mt-2 font-semibold text-stage-muted">Card {cardIndex + 1} of {cards.length}</p>
      </div>

      <button
        aria-label={isFlipped ? 'Show Korean' : 'Show meaning'}
        aria-pressed={isFlipped}
        className="flashcard-motion flex min-h-64 w-full flex-col items-center justify-center rounded-xl border border-stage-border bg-stage-white p-8 text-center transition-transform duration-200 motion-reduce:transition-none"
        onClick={() => setIsFlipped((current) => !current)}
        onKeyDown={handleCardKeyDown}
        style={{ transform: `rotateY(${isFlipped ? 180 : 0}deg)`, transformStyle: 'preserve-3d' }}
        type="button"
      >
        <span className="flashcard-motion flex flex-col items-center" style={{ transform: `rotateY(${isFlipped ? 180 : 0}deg)` }}>
          {isFlipped ? (
            <>
              <span className="text-3xl font-bold text-stage-charcoal">{card.english}</span>
              <span className="mt-3 text-lg text-stage-cobalt">{card.romanization}</span>
              <span className="mt-6 text-sm font-bold uppercase tracking-wide text-stage-faint">Show Korean</span>
            </>
          ) : (
            <>
              <span className="text-5xl font-bold text-stage-charcoal" lang="ko">{card.korean}</span>
              <span className="mt-6 text-sm font-bold uppercase tracking-wide text-stage-cobalt">Show meaning</span>
            </>
          )}
        </span>
      </button>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <button className="rounded-xl border border-stage-cobalt px-4 py-2 font-semibold text-stage-cobalt disabled:border-stage-border disabled:text-stage-faint" disabled={cardIndex === 0} onClick={previous} type="button">Previous card</button>
        <button className="rounded-xl border border-stage-cobalt px-4 py-2 font-semibold text-stage-cobalt disabled:border-stage-border disabled:text-stage-faint" disabled={cardIndex === cards.length - 1} onClick={next} type="button">Next card</button>
        <button className="rounded-xl bg-stage-cobalt px-4 py-2 font-semibold text-stage-white" onClick={shuffle} type="button">Shuffle</button>
        <button className="rounded-xl border border-stage-border-strong px-4 py-2 font-semibold text-stage-muted" onClick={reset} type="button">Reset cards</button>
      </div>
      <p className="text-sm text-stage-faint">Keyboard: Arrow Left/Right changes cards. Space flips the current card.</p>
    </section>
  )
}
