/// <reference types="node" />

import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
    expect(buttons.every((button) => !button.hasAttribute('aria-label'))).toBe(true)
    expect(buttons[0]).toHaveAccessibleName(/학생.*Student.*Now learning/)
    expect(buttons[7]).toHaveAccessibleName(/요리사.*Chef/)
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

  it('uses a compact bilingual mobile listbox chooser without horizontal scrolling', async () => {
    const user = userEvent.setup()
    render(<VocabularyJourney items={occupationItems} />)

    const chooser = screen.getByRole('button', { name: /Choose vocabulary word.*학생.*Student/ })
    expect(chooser).toHaveAttribute('aria-haspopup', 'listbox')
    expect(chooser).toHaveAttribute('aria-expanded', 'false')
    expect(within(chooser).getByText('학생')).toHaveAttribute('lang', 'ko')
    expect(within(chooser).getByText('Student')).toHaveAttribute('lang', 'en')
    await user.click(chooser)

    const listbox = screen.getByRole('listbox', { name: 'Vocabulary words' })
    const firstOption = within(listbox).getByRole('option', { name: /학생.*Student/ })
    const lastOption = within(listbox).getByRole('option', { name: /요리사.*Chef/ })
    expect(within(firstOption).getByText('학생')).toHaveAttribute('lang', 'ko')
    expect(within(firstOption).getByText('Student')).toHaveAttribute('lang', 'en')
    expect(within(lastOption).getByText('요리사')).toHaveAttribute('lang', 'ko')
    expect(within(lastOption).getByText('Chef')).toHaveAttribute('lang', 'en')
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
