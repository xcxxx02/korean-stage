/// <reference types="node" />

import { cleanup, render, screen, within } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { DialoguePage } from './pages/DialoguePage'
import { FlashcardDeck } from './components/FlashcardDeck'
import { HumanAudioButton } from './components/HumanAudioButton'
import { VocabularyJourney } from './components/VocabularyJourney'
import { course } from './content/course'

const styles = readFileSync(resolve(process.cwd(), 'src/styles.css'), 'utf8')
const occupationItems = course.vocabulary.filter((item) => item.unitId === 'unit-3')

beforeEach(() => localStorage.clear())
afterEach(cleanup)

describe('responsive beginner contracts', () => {
  it('keeps every compact vocabulary option bilingual and identifies the current step without color alone', () => {
    render(<VocabularyJourney items={occupationItems} />)

    const compact = screen.getByRole('group', { name: 'Compact vocabulary progress' })
    const selector = within(compact).getByRole('combobox', { name: 'Choose vocabulary word' })
    expect(within(selector).getAllByRole('option').map((option) => option.textContent)).toEqual([
      '1. 학생 — Student',
      '2. 선생님 — Teacher',
      '3. 회사원 — Office worker',
      '4. 기자 — Reporter',
      '5. 의사 — Doctor',
      '6. 가수 — Singer',
      '7. 군인 — Soldier',
      '8. 요리사 — Chef',
    ])
    expect(within(compact).getByText('1 of 8 · 학생 · Student')).toHaveAttribute('aria-current', 'step')

    cleanup()
    render(<DialoguePage />)
    const selected = within(screen.getByRole('group', { name: 'Choose a dialogue' })).getAllByRole('button')[0]
    expect(selected).toHaveAttribute('aria-pressed', 'true')
    expect(selected).toHaveTextContent('Selected dialogue')
  })

  it('gives English next-step instructions in empty and unavailable media states', () => {
    render(<VocabularyJourney items={[]} />)
    expect(screen.getByText(/There are no words/i)).toHaveTextContent(/return to the course map/i)

    cleanup()
    render(<FlashcardDeck items={[]} />)
    expect(screen.getByText(/No vocabulary cards/i)).toHaveTextContent(/return to the course map/i)

    cleanup()
    render(<HumanAudioButton memberName="Member 1" source={{ kind: 'development-missing', src: null }} />)
    expect(screen.getByRole('status')).toHaveTextContent(/use the written example/i)
  })

  it('sets a 44px minimum touch target for buttons and selectors', () => {
    expect(styles).toMatch(/:where\(button, select\)\s*\{[^}]*min-height:\s*2\.75rem;/s)
  })

  it('removes nonessential flashcard transforms and transitions for reduced motion', () => {
    const reducedMotion = styles.match(/@media \(prefers-reduced-motion: reduce\)\s*\{([\s\S]*)\}\s*$/)?.[1] ?? ''
    expect(reducedMotion).toMatch(/\.flashcard-motion\s*\{[^}]*transition:\s*none !important;/s)
    expect(reducedMotion).toMatch(/\.flashcard-motion\s*\{[^}]*transform:\s*none !important;/s)
  })
})
