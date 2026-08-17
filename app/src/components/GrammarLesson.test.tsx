import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { course } from '../content/course'
import { readProgress, writeProgress } from '../progress/progressStore'
import { GrammarPage } from '../pages/GrammarPage'
import { UnitPage } from '../pages/UnitPage'
import { GrammarLesson } from './GrammarLesson'

beforeEach(() => localStorage.clear())
afterEach(cleanup)

const ieyoYeyo = course.grammar.find((grammarPoint) => grammarPoint.id === 'ieyo-yeyo')!

describe('GrammarLesson', () => {
  it('teaches the consonant and vowel rule with English support and exactly three exercises', () => {
    render(<GrammarLesson grammarPoint={ieyoYeyo} />)

    expect(screen.getByRole('heading', { name: '이에요 / 예요 - to be' })).toBeVisible()
    expect(screen.getByText(/Use 이에요 after a noun ending in a consonant and 예요 after a noun ending in a vowel/)).toBeVisible()

    const examples = screen.getByRole('list', { name: 'Bilingual examples' })
    expect(within(examples).getByRole('listitem', { name: '저는 학생이에요. — I am a student.' })).toBeVisible()
    expect(within(examples).getByRole('listitem', { name: '제니는 가수예요. — Jenny is a singer.' })).toBeVisible()

    const exercises = screen.getAllByRole('group', { name: /of 3/i })
    expect(exercises).toHaveLength(3)
    expect(exercises[0]).toHaveAccessibleName(/Complete the sentence for Minsu.*민수___/i)
    expect(exercises[1]).toHaveAccessibleName(/Complete the sentence for student.*학생___/i)
    expect(exercises[2]).toHaveAccessibleName(/Complete the sentence for Jenny.*제니___/i)
  })
})

describe('grammar routes', () => {
  it('links all three bilingual grammar units and shows completion state', () => {
    writeProgress({
      completedUnitIds: ['unit-5'],
      completedVocabularyIds: [],
      exerciseResults: {},
      lastPath: '/grammar',
    }, localStorage)

    render(<MemoryRouter><GrammarPage /></MemoryRouter>)

    expect(screen.getByRole('heading', { name: 'Grammar' })).toBeVisible()
    const units = screen.getByRole('list', { name: 'Grammar units' })
    expect(within(units).getAllByRole('listitem')).toHaveLength(3)
    expect(within(units).getByRole('link', { name: /이에요 \/ 예요.*to be/i })).toHaveAttribute('href', '/learn/unit-4')
    expect(within(units).getByRole('link', { name: /은 \/ 는.*topic marker.*Complete/i })).toHaveAttribute('href', '/learn/unit-5')
    expect(within(units).getByRole('link', { name: /이 \/ 가 아니에요.*is not/i })).toHaveAttribute('href', '/learn/unit-6')
  })

  it('records a grammar unit complete only after all three exercises are correct', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/learn/unit-4']}>
        <Routes><Route path="learn/:unitId" element={<UnitPage />} /></Routes>
      </MemoryRouter>,
    )

    const exercises = screen.getAllByRole('group', { name: /of 3/i })
    for (let index = 0; index < exercises.length; index += 1) {
      await user.click(within(exercises[index]).getByRole('radio', { name: ieyoYeyo.exercises[index].answer }))
      await user.click(within(exercises[index]).getByRole('button', { name: `Check answer ${index + 1}` }))
      await waitFor(() => expect(readProgress(localStorage).exerciseResults[ieyoYeyo.exercises[index].id]).toBe(true))
      if (index < 2) expect(readProgress(localStorage).completedUnitIds).not.toContain('unit-4')
    }

    await waitFor(() => expect(readProgress(localStorage).completedUnitIds).toContain('unit-4'))
    expect(screen.getByText('Score: 3 of 3 correct')).toBeVisible()
    expect(screen.getByText('Unit complete')).toBeVisible()
  })
})
