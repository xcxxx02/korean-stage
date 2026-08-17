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

  it('uses ArrowRight and ArrowLeft to navigate and Space to flip', async () => {
    const user = userEvent.setup()
    render(<FlashcardDeck items={threeVocabularyItems} />)

    await user.keyboard('[ArrowRight]')
    expect(screen.getByText('일본')).toBeVisible()
    expect(screen.getByText('Card 2 of 3')).toBeVisible()

    await user.keyboard('[Space]')
    expect(screen.getByText('Japan')).toBeVisible()
    expect(screen.getByText('ilbon')).toBeVisible()

    await user.keyboard('[ArrowLeft]')
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
