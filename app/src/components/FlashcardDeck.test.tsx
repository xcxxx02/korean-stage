import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { course } from '../content/course'
import { FlashcardDeck } from './FlashcardDeck'

afterEach(cleanup)

const threeVocabularyItems = course.vocabulary.slice(0, 3)

describe('FlashcardDeck', () => {
  it('starts with the Korean front and reveals the bilingual meaning on flip', async () => {
    const user = userEvent.setup()
    render(<FlashcardDeck items={threeVocabularyItems} />)

    expect(screen.getByText('Card 1 of 3')).toBeVisible()
    expect(screen.getByText('중국')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Show meaning' })).toBeVisible()
    expect(screen.queryByText('China')).not.toBeInTheDocument()
    expect(screen.queryByText('jungguk')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Show meaning' }))

    expect(screen.getByText('China')).toBeVisible()
    expect(screen.getByText('jungguk')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Show Korean' })).toBeVisible()
  })

  it('uses a real transform when visually flipping between card faces', async () => {
    const user = userEvent.setup()
    render(<FlashcardDeck items={threeVocabularyItems} />)

    const flipCard = screen.getByRole('button', { name: 'Show meaning' })
    expect(flipCard).toHaveStyle({ transform: 'rotateY(0deg)' })

    await user.click(flipCard)

    expect(screen.getByRole('button', { name: 'Show Korean' })).toHaveStyle({ transform: 'rotateY(180deg)' })
  })

  it('keeps native Space flip and Arrow navigation on the focused card button', async () => {
    const user = userEvent.setup()
    render(<FlashcardDeck items={threeVocabularyItems} />)

    const flipCard = screen.getByRole('button', { name: 'Show meaning' })
    flipCard.focus()
    await user.keyboard('[Space]')
    expect(screen.getByText('China')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Show Korean' })).toHaveFocus()

    await user.keyboard('[ArrowRight]')
    expect(screen.getByText('일본')).toBeVisible()
    expect(screen.getByText('Card 2 of 3')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Show meaning' })).toHaveFocus()

    await user.keyboard('[ArrowLeft]')
    expect(screen.getByText('중국')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Show meaning' })).toBeVisible()
  })

  it('does not hijack Arrow keys from controls outside the deck', async () => {
    const user = userEvent.setup()
    render(<><a href="/course">Course home</a><FlashcardDeck items={threeVocabularyItems} /></>)

    const outsideLink = screen.getByRole('link', { name: 'Course home' })
    outsideLink.focus()
    await user.keyboard('[ArrowRight]')

    expect(outsideLink).toHaveFocus()
    expect(screen.getByText('중국')).toBeVisible()
    expect(screen.getByText('Card 1 of 3')).toBeVisible()
  })

  it('bounds keyboard navigation and returns shuffled or reset cards to the Korean front', async () => {
    const user = userEvent.setup()
    render(<FlashcardDeck items={threeVocabularyItems} random={() => 0} />)

    screen.getByRole('button', { name: 'Show meaning' }).focus()
    await user.keyboard('[ArrowLeft]')
    expect(screen.getByText('Card 1 of 3')).toBeVisible()

    await user.keyboard('[ArrowRight][ArrowRight][ArrowRight]')
    expect(screen.getByText('미국')).toBeVisible()
    expect(screen.getByText('Card 3 of 3')).toBeVisible()

    await user.keyboard('[Space]')
    expect(screen.getByText('USA')).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Shuffle' }))
    expect(screen.getByText('일본')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Show meaning' })).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Show meaning' }))
    expect(screen.getByText('Japan')).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Reset cards' }))
    expect(screen.getByText('중국')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Show meaning' })).toBeVisible()
  })

  it('shuffles deterministically with injected random values and resets the original order', async () => {
    const user = userEvent.setup()
    render(<FlashcardDeck items={threeVocabularyItems} random={() => 0} />)

    await user.click(screen.getByRole('button', { name: 'Shuffle' }))
    expect(screen.getByText('일본')).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Next card' }))
    expect(screen.getByText('미국')).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Reset cards' }))
    expect(screen.getByText('중국')).toBeVisible()
    expect(screen.getByText('Card 1 of 3')).toBeVisible()
  })
})
