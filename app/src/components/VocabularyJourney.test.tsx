import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { course } from '../content/course'
import { VocabularyJourney } from './VocabularyJourney'

const occupationItems = course.vocabulary.filter((item) => item.unitId === 'unit-3')
const countryItems = course.vocabulary.filter((item) => item.unitId === 'unit-2')

afterEach(cleanup)
beforeEach(() => localStorage.clear())

describe('VocabularyJourney', () => {
  it('presents every ordered word as a freely selectable bilingual button', () => {
    render(<VocabularyJourney items={occupationItems} />)

    const rail = screen.getByRole('list', { name: 'Vocabulary words' })
    const buttons = within(rail).getAllByRole('button')
    expect(buttons).toHaveLength(8)
    expect(buttons.every((button) => !button.hasAttribute('aria-label'))).toBe(true)
    expect(buttons[0]).toHaveAccessibleName(/학생.*Student.*Now learning/)
    expect(buttons[7]).toHaveAccessibleName(/요리사.*Chef/)
    expect(within(buttons[0]).getByText('학생')).toHaveAttribute('lang', 'ko')
    expect(within(buttons[0]).getByText('Student')).toHaveAttribute('lang', 'en')
    expect(buttons[0]).toHaveAttribute('aria-current', 'true')
    expect(within(buttons[0]).getByText('Now learning')).toBeVisible()
  })

  it('lets a beginner choose any bilingual word without unlocking it first', async () => {
    const user = userEvent.setup()
    render(<VocabularyJourney items={occupationItems} />)

    await user.click(screen.getByRole('button', { name: /요리사.*Chef/ }))

    const details = screen.getByRole('complementary', { name: 'Vocabulary learning details' })
    expect(screen.getByRole('heading', { name: '요리사' })).toHaveAttribute('lang', 'ko')
    expect(within(details).getByText('Chef')).toBeVisible()
    expect(within(details).getByText('yorisa')).toBeVisible()
    expect(screen.getByRole('button', { name: /요리사.*Chef.*Now learning/ })).toHaveAttribute('aria-current', 'true')
  })

  it('supports keyboard selection in the compact bilingual listbox', async () => {
    const user = userEvent.setup()
    render(<VocabularyJourney items={occupationItems} />)

    const chooser = screen.getByRole('button', { name: /Choose vocabulary word.*학생.*Student/ })
    expect(chooser).toHaveAttribute('aria-haspopup', 'listbox')
    await user.click(chooser)
    const student = screen.getByRole('option', { name: /학생.*Student/ })
    expect(student).toHaveFocus()

    await user.keyboard('{End}')
    const chef = screen.getByRole('option', { name: /요리사.*Chef/ })
    expect(chef).toHaveFocus()
    await user.keyboard('{Enter}')

    expect(screen.queryByRole('listbox', { name: 'Vocabulary words' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '요리사' })).toHaveAttribute('lang', 'ko')
    expect(screen.getByRole('button', { name: /Choose vocabulary word.*요리사.*Chef/ })).toHaveFocus()
  })

  it('keeps the listbox mounted while Tab completes native forward focus navigation', async () => {
    const user = userEvent.setup()
    render(<VocabularyJourney items={occupationItems} />)

    const chooser = screen.getByRole('button', { name: /Choose vocabulary word.*학생.*Student/ })
    const desktopRail = screen.getByRole('list', { name: 'Vocabulary words' })
    const firstRailButton = within(desktopRail).getAllByRole('button')[0]
    await user.click(chooser)
    expect(screen.getByRole('option', { name: /학생.*Student/ })).toHaveFocus()

    await user.tab()

    expect(screen.getByRole('listbox', { name: 'Vocabulary words' })).toBeInTheDocument()
    expect(firstRailButton).toHaveFocus()
  })

  it('keeps the listbox mounted while Shift+Tab returns focus to its trigger', async () => {
    const user = userEvent.setup()
    render(<VocabularyJourney items={occupationItems} />)

    const chooser = screen.getByRole('button', { name: /Choose vocabulary word.*학생.*Student/ })
    await user.click(chooser)
    expect(screen.getByRole('option', { name: /학생.*Student/ })).toHaveFocus()

    await user.tab({ shift: true })

    expect(screen.getByRole('listbox', { name: 'Vocabulary words' })).toBeInTheDocument()
    expect(chooser).toHaveFocus()
  })

  it('uses the assigned member video and never renders a speaker or audio selector', async () => {
    const user = userEvent.setup()
    render(<VocabularyJourney items={occupationItems} />)

    expect(screen.getByText('Presented by Member 1')).toBeVisible()
    await user.click(screen.getByRole('button', { name: /의사.*Doctor/ }))
    expect(screen.getByText('Presented by Member 2')).toBeVisible()
    expect(screen.queryByRole('button', { name: /Listen to Member/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('group', { name: /speaker/i })).not.toBeInTheDocument()
    expect(document.querySelector('audio')).not.toBeInTheDocument()
  })

  it('presents supporting country vocabulary without inventing a member owner or recording obligation', () => {
    render(<VocabularyJourney items={countryItems} />)

    expect(screen.getByRole('heading', { name: 'Supporting vocabulary' })).toBeVisible()
    expect(screen.getByText(/These country words support the lesson and Practice/)).toBeVisible()
    expect(screen.queryByText(/Course member|Presented by|Member video coming soon/)).not.toBeInTheDocument()
    expect(document.querySelector('video')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '중국' })).toHaveAttribute('lang', 'ko')
    expect(screen.getAllByText('China').every((node) => node.getAttribute('lang') === 'en')).toBe(true)
  })

  it('keeps sequential navigation available without completing or persisting words', async () => {
    const user = userEvent.setup()
    render(<VocabularyJourney items={occupationItems} />)

    expect(screen.getByRole('button', { name: 'Previous word' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Next word' }))
    expect(screen.getByRole('heading', { name: '선생님' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Previous word' })).toBeEnabled()
    expect(localStorage.length).toBe(0)

    await user.click(screen.getByRole('button', { name: /요리사.*Chef/ }))
    expect(screen.getByRole('button', { name: 'Next word' })).toBeDisabled()
    expect(screen.queryByRole('button', { name: /finish vocabulary|vocabulary complete/i })).not.toBeInTheDocument()
    expect(localStorage.length).toBe(0)
  })

  it('shows every beginner support layer with Korean language metadata', () => {
    render(<VocabularyJourney items={occupationItems} />)

    const details = screen.getByRole('complementary', { name: 'Vocabulary learning details' })
    expect(screen.getByRole('heading', { name: '학생' })).toHaveAttribute('lang', 'ko')
    expect(within(details).getByText('Student')).toBeVisible()
    expect(within(details).getByText('Romanization')).toBeVisible()
    expect(within(details).getByText('haksaeng')).toBeVisible()
    expect(within(details).getByText('Say it like')).toBeVisible()
    expect(within(details).getByText('hak-ssaeng')).toBeVisible()
    expect(within(details).getByText('저는 학생이에요.')).toHaveAttribute('lang', 'ko')
    expect(within(details).getByText('I am a student.')).toHaveAttribute('lang', 'en')
    expect(within(details).getByRole('heading', { name: 'Grammar tip' })).toBeVisible()
    const grammarTip = within(details).getByRole('region', { name: 'Grammar tip' })
    expect(grammarTip).toHaveTextContent('학생 ends in a consonant, so use 이에요.')
    expect(within(grammarTip).getByText('학생')).toHaveAttribute('lang', 'ko')
    expect(within(grammarTip).getByText('이에요')).toHaveAttribute('lang', 'ko')
  })

  it('keeps Korean and English transcript runs in separate language boundaries', () => {
    render(<VocabularyJourney items={occupationItems} />)

    const transcript = screen.getByLabelText('Member 1 vocabulary video transcript')
    expect(within(transcript).getByText('저는 학생이에요.')).toHaveAttribute('lang', 'ko')
    expect(within(transcript).getByText('I am a student.')).toHaveAttribute('lang', 'en')
  })

  it('uses a compact honest alert when the assigned member video is missing', () => {
    render(<VocabularyJourney items={occupationItems} />)

    const alert = screen.getByRole('alert')
    expect(within(alert).getByRole('heading', { name: 'Member video coming soon' })).toBeVisible()
    expect(within(alert).getByText('This word still needs a real recording from Member 1.')).toBeVisible()
    expect(screen.queryByRole('list', { name: 'Recording checklist' })).not.toBeInTheDocument()
    expect(document.querySelector('video')).not.toBeInTheDocument()
  })

  it('does not introduce a second page-level heading inside Learn', () => {
    render(<VocabularyJourney items={occupationItems} />)

    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
  })

  it('keeps an empty lesson honest without creating a page-level heading', () => {
    render(<VocabularyJourney items={[]} />)

    expect(screen.getByRole('heading', { name: 'Vocabulary unavailable' })).toBeVisible()
    expect(screen.getByText('There are no words in this lesson yet. Choose another lesson from All lessons.')).toBeVisible()
    expect(screen.queryByRole('heading', { level: 1 })).not.toBeInTheDocument()
  })
})
