import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { course } from '../content/course'
import { VocabularyJourney } from './VocabularyJourney'

const occupationItems = course.vocabulary.filter((item) => item.unitId === 'unit-3')

afterEach(cleanup)
beforeEach(() => localStorage.clear())

describe('VocabularyJourney', () => {
  it('presents every ordered word as a freely selectable bilingual button', () => {
    render(<VocabularyJourney items={occupationItems} />)

    const rail = screen.getByRole('list', { name: 'Vocabulary words' })
    const buttons = within(rail).getAllByRole('button')
    expect(buttons).toHaveLength(8)
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
  })

  it('lets a beginner choose any bilingual word without unlocking it first', async () => {
    const user = userEvent.setup()
    render(<VocabularyJourney items={occupationItems} />)

    await user.click(screen.getByRole('button', { name: '8. 요리사, Chef' }))

    const details = screen.getByRole('complementary', { name: 'Vocabulary learning details' })
    expect(screen.getByRole('heading', { name: '요리사' })).toHaveAttribute('lang', 'ko')
    expect(within(details).getByText('Chef')).toBeVisible()
    expect(within(details).getByText('yorisa')).toBeVisible()
    expect(screen.getByRole('button', { name: '8. 요리사, Chef' })).toHaveAttribute('aria-current', 'true')
  })

  it('uses the assigned member video and never renders a speaker or audio selector', async () => {
    const user = userEvent.setup()
    render(<VocabularyJourney items={occupationItems} />)

    expect(screen.getByText('Presented by Member 1')).toBeVisible()
    await user.click(screen.getByRole('button', { name: '5. 의사, Doctor' }))
    expect(screen.getByText('Presented by Member 2')).toBeVisible()
    expect(screen.queryByRole('button', { name: /Listen to Member/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('group', { name: /speaker/i })).not.toBeInTheDocument()
    expect(document.querySelector('audio')).not.toBeInTheDocument()
  })

  it('keeps sequential navigation available without completing or persisting words', async () => {
    const user = userEvent.setup()
    render(<VocabularyJourney items={occupationItems} />)

    expect(screen.getByRole('button', { name: 'Previous word' })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: 'Next word' }))
    expect(screen.getByRole('heading', { name: '선생님' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Previous word' })).toBeEnabled()
    expect(localStorage.length).toBe(0)

    await user.click(screen.getByRole('button', { name: '8. 요리사, Chef' }))
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
    expect(within(details).getByText('학생 ends in a consonant, so use 이에요.')).toBeVisible()
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
