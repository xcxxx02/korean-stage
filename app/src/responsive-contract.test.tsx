/// <reference types="node" />

import { cleanup, render, screen, within } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { DialoguePage } from './pages/DialoguePage'
import { HumanAudioButton } from './components/HumanAudioButton'
import { VocabularyJourney } from './components/VocabularyJourney'
import { course } from './content/course'

const styles = readFileSync(resolve(process.cwd(), 'src/styles.css'), 'utf8')
const occupationItems = course.vocabulary.filter((item) => item.unitId === 'unit-3')

afterEach(cleanup)

describe('responsive beginner contracts', () => {
  it('keeps every responsive vocabulary control bilingual and identifies the current word without color alone', () => {
    render(<VocabularyJourney items={occupationItems} />)

    const rail = screen.getByRole('list', { name: 'Vocabulary words' })
    const buttons = within(rail).getAllByRole('button')
    expect(buttons.map((button) => button.getAttribute('aria-label'))).toEqual([
      '1. 학생, Student',
      '2. 선생님, Teacher',
      '3. 회사원, Office worker',
      '4. 기자, Reporter',
      '5. 의사, Doctor',
      '6. 가수, Singer',
      '7. 군인, Soldier',
      '8. 요리사, Chef',
    ])
    expect(buttons[0]).toHaveAttribute('aria-current', 'true')
    expect(within(buttons[0]).getByText('Now learning')).toBeVisible()

    cleanup()
    render(<DialoguePage />)
    const selected = within(screen.getByRole('group', { name: 'Choose a dialogue' })).getAllByRole('button')[0]
    expect(selected).toHaveAttribute('aria-pressed', 'true')
    expect(selected).toHaveTextContent('Selected dialogue')
  })

  it('gives English next-step instructions in empty and unavailable media states', () => {
    render(<VocabularyJourney items={[]} />)
    expect(screen.getByText(/There are no words/i)).toHaveTextContent(/choose another lesson from all lessons/i)

    cleanup()
    render(<HumanAudioButton memberName="Member 1" source={{ kind: 'development-missing', src: null }} />)
    expect(screen.getByText(/Audio coming soon/i).parentElement).toHaveTextContent(/use the written example/i)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('sets a 44px minimum touch target for form controls and persistent navigation links', () => {
    expect(styles).toMatch(/:where\(button, select\)\s*\{[^}]*min-height:\s*2\.75rem;/s)
    expect(styles).toMatch(/:where\(\.site-brand, \.desktop-navigation a, \.mobile-navigation a\)\s*\{[^}]*min-height:\s*2\.75rem;/s)
  })

  it('uses a bilingual mobile vocabulary chooser without horizontal scrolling', () => {
    render(<VocabularyJourney items={occupationItems} />)

    const chooser = screen.getByRole('combobox', { name: 'Choose vocabulary word' })
    expect(within(chooser).getByRole('option', { name: '1. 학생 — Student' })).toBeVisible()
    expect(within(chooser).getByRole('option', { name: '8. 요리사 — Chef' })).toBeVisible()
    expect(styles).toMatch(/\.learn-word-chooser\s*\{[^}]*display:\s*grid;/s)
    expect(styles).toMatch(/@media \(min-width: 70rem\)[\s\S]*?\.learn-word-chooser\s*\{[^}]*display:\s*none;/)
  })

  it('stacks Learn by default and uses the approved three-column anatomy at 70rem', () => {
    render(<VocabularyJourney items={occupationItems} />)

    expect(screen.getByRole('region', { name: 'Choose a word' })).toHaveClass('learn-layout')
    expect(screen.getByRole('complementary', { name: 'Ordered vocabulary words' })).toHaveClass('learn-word-rail')
    expect(screen.getByRole('region', { name: 'Member vocabulary video' })).toHaveClass('learn-media')
    const details = screen.getByRole('complementary', { name: 'Vocabulary learning details' })
    expect(details).toHaveClass('learn-details')
    expect(within(details).getByRole('navigation', { name: 'Word navigation' })).toBeVisible()

    expect(styles).toMatch(/\.learn-layout\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\);[^}]*gap:\s*1\.25rem;/s)
    expect(styles).toMatch(/@media \(min-width: 70rem\)[\s\S]*?\.learn-layout\s*\{[^}]*grid-template-columns:\s*12rem minmax\(24rem, 1fr\) minmax\(18rem, 21rem\);/)
    expect(styles).toMatch(/@media \(min-width: 70rem\)[\s\S]*?\.learn-media video,[\s\S]*?height:\s*clamp\(14rem, 28vh, 19rem\);/)
  })

})
