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

  it('keeps the desktop vocabulary study view inside one viewport with persistent word controls', () => {
    expect(styles).toMatch(/@media \(min-width: 70rem\)[\s\S]*?\.vocabulary-study-page\s*\{[^}]*height:\s*calc\(100dvh - 6\.5rem\);[^}]*overflow:\s*hidden;/s)
    expect(styles).toMatch(/@media \(min-width: 70rem\)[\s\S]*?\.stage-learning-shell\s*\{[^}]*min-height:\s*0;[^}]*flex:\s*1;[^}]*padding-block:\s*1\.65rem 0;/s)
    expect(styles).toMatch(/@media \(min-width: 70rem\)[\s\S]*?\.vocabulary-study-page\s*\{[^}]*position:\s*relative;/s)
    expect(styles).toMatch(/@media \(min-width: 70rem\)[\s\S]*?\.stage-learning-header\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\);[^}]*margin-bottom:\s*1\.1rem;/s)
    expect(styles).toMatch(/@media \(min-width: 70rem\)[\s\S]*?\.stage-learning-progress\s*\{[^}]*position:\s*absolute;[^}]*top:\s*2\.5rem;[^}]*right:\s*2\.25rem;/s)
    expect(styles).toMatch(/@media \(min-width: 70rem\)[\s\S]*?\.stage-learning-rail,\s*\.stage-learning-details\s*\{[^}]*overflow:\s*visible;/s)
    expect(styles).toMatch(/@media \(min-width: 70rem\)[\s\S]*?\.vocabulary-word-button\s*\{[^}]*min-height:\s*clamp\(3\.55rem, 6\.8vh, 4\.55rem\);/s)
    expect(styles).toMatch(/@media \(min-width: 70rem\)[\s\S]*?\.stage-learning-details\s*\{[^}]*align-content:\s*space-between;/s)
    expect(styles).not.toMatch(/@media \(min-width: 90rem\)[\s\S]*?\.stage-learning-header\s*\{[^}]*display:\s*block;/s)
  })

  it('preserves the approved framed three-column composition on shorter laptop screens', () => {
    expect(styles).toMatch(/@media \(min-width: 70rem\)[\s\S]*?\.vocabulary-study-page\s*\{[^}]*border:\s*1px solid var\(--stage-border\);[^}]*border-radius:\s*0 0 0\.75rem 0\.75rem;/s)
    expect(styles).toMatch(/@media \(min-width: 70rem\)[\s\S]*?\.vocabulary-study-page\s*\{[^}]*background:\s*rgb\(255 255 255 \/ 68%\);/s)
    expect(styles).toMatch(/@media \(min-width: 70rem\)[\s\S]*?\.learn-layout--details-center\s*\{[^}]*grid-template-columns:\s*17\.25rem minmax\(20rem, 27\.5rem\) minmax\(20rem, 25\.5rem\);[^}]*justify-content:\s*start;/s)
    expect(styles).toMatch(/@media \(min-width: 70rem\) and \(max-height: 62rem\)[\s\S]*?\.vocabulary-word-list\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\);/s)
    expect(styles).toMatch(/@media \(min-width: 70rem\) and \(max-height: 62rem\)[\s\S]*?\.vocabulary-word-copy > span:first-child\s*\{[^}]*font-size:\s*0\.95rem;[^}]*line-height:\s*1\.2;/s)
    expect(styles).toMatch(/\.word-navigation__next\s*\{[^}]*background:\s*var\(--stage-cobalt\);/s)
  })

  it('restores the approved spacious proportions on tall desktop screens', () => {
    expect(styles).toMatch(/@media \(min-width: 70rem\) and \(min-height: 62\.01rem\)[\s\S]*?\.site-header__inner\s*\{[^}]*min-height:\s*6\.4rem;/s)
    expect(styles).toMatch(/@media \(min-width: 70rem\) and \(min-height: 62\.01rem\)[\s\S]*?\.app-shell:has\(\.vocabulary-study-page\) \.app-stage\s*\{[^}]*min-height:\s*0;/s)
    expect(styles).toMatch(/@media \(min-width: 70rem\) and \(min-height: 62\.01rem\)[\s\S]*?\.vocabulary-study-page\s*\{[^}]*height:\s*calc\(100dvh - 9\.4rem\);/s)
    expect(styles).toMatch(/@media \(min-width: 70rem\) and \(min-height: 62\.01rem\)[\s\S]*?\.learn-layout--details-center\s*\{[^}]*gap:\s*clamp\(4\.5rem, 6\.5vw, 6\.25rem\);/s)
  })

  it('keeps the current-word marker visually present without giving its rail card an extra row', () => {
    expect(styles).toMatch(/\.vocabulary-word-button\s*\{[^}]*position:\s*relative;/s)
    expect(styles).toMatch(/\.vocabulary-word-current\s*\{[^}]*position:\s*absolute;[^}]*width:\s*1px;/s)
    expect(styles).not.toMatch(/\.vocabulary-word-button\[aria-current="true"\] \.vocabulary-word-copy > span:first-child\s*\{[^}]*padding-right:/s)
  })

  it('keeps Korean runs in mixed Practice copy from breaking between syllables', () => {
    expect(styles).toMatch(/\.language-aware-text__ko\s*\{[^}]*display:\s*inline-block;[^}]*word-break:\s*keep-all;[^}]*overflow-wrap:\s*normal;[^}]*white-space:\s*nowrap;/s)
  })

  it('turns the lesson selector into a fixed bottom drawer on mobile and a popover on wider screens', () => {
    expect(styles).toMatch(/\.lesson-selector__backdrop\s*\{[^}]*position:\s*fixed;[^}]*inset:\s*0;/s)
    expect(styles).toMatch(/\.lesson-selector__drawer\s*\{[^}]*position:\s*fixed;[^}]*right:\s*0;[^}]*bottom:\s*0;[^}]*left:\s*0;/s)
    expect(styles).toMatch(/@media \(min-width: 40rem\)[\s\S]*?\.lesson-selector__drawer\s*\{[^}]*position:\s*absolute;/s)
  })

})
