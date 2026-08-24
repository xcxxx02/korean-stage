import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { PracticePage } from './PracticePage'

beforeEach(() => localStorage.clear())
afterEach(cleanup)

function renderPractice(entry = '/practice') {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <PracticePage />
    </MemoryRouter>,
  )
}

describe('PracticePage', () => {
  it('starts with the five exact lesson quizzes followed by an explicit mixed quiz', () => {
    renderPractice()

    expect(screen.getByRole('heading', { name: 'Practice by lesson' })).toBeVisible()
    expect(screen.getByRole('button', { name: /Lesson 2.*Countries & Nationalities.*8 questions/ })).toBeVisible()
    expect(screen.getByRole('button', { name: /Lesson 3.*Jobs & Occupations.*8 questions/ })).toBeVisible()
    expect(screen.getByRole('button', { name: /Lesson 4.*이에요 \/ 예요 - to be.*3 questions/ })).toBeVisible()
    expect(screen.getByRole('button', { name: /Lesson 5.*은 \/ 는 - topic marker.*3 questions/ })).toBeVisible()
    expect(screen.getByRole('button', { name: /Lesson 6.*이 \/ 가 아니에요 - to not be.*3 questions/ })).toBeVisible()
    expect(screen.getByRole('button', { name: /Mixed Lec 1 quiz.*25 questions/ })).toBeVisible()
    expect(screen.queryByRole('radio')).not.toBeInTheDocument()
  })

  it.each([
    ['Lesson 2', 'Countries & Nationalities', '중국', 'Japan', 'China'],
    ['Lesson 3', 'Jobs & Occupations', '학생', 'Teacher', 'Student'],
  ])('uses English language metadata for $0 vocabulary choices and feedback', async (_lessonNumber, lessonTitle, korean, wrongChoice, correctChoice) => {
    const user = userEvent.setup()
    renderPractice()

    await user.click(screen.getByRole('button', { name: new RegExp(lessonTitle) }))
    expect(screen.getByText('Question 1 of 8')).toBeVisible()
    expect(screen.getByText(wrongChoice)).toHaveAttribute('lang', 'en')

    await user.click(screen.getByRole('radio', { name: wrongChoice }))
    await user.click(screen.getByRole('button', { name: 'Check answer' }))

    const feedback = screen.getByRole('status')
    expect(feedback).toHaveTextContent('Not quite')
    expect(feedback).toHaveTextContent(`${korean} means ${correctChoice}.`)
    expect(within(feedback).getByText(correctChoice)).toHaveAttribute('lang', 'en')
    expect(screen.getByRole('button', { name: 'Try again' })).toBeVisible()
    expect(localStorage.length).toBe(0)
  })

  it('keeps mixed vocabulary prompts and feedback in explicit language boundaries', async () => {
    const user = userEvent.setup()
    renderPractice()

    await user.click(screen.getByRole('button', { name: /Lesson 3.*Jobs & Occupations/ }))
    const question = screen.getByRole('group', { name: /Question 1 of 8/ })
    const prompt = [...question.querySelectorAll('legend > span')].find(
      (element) => element.textContent === 'Choose the English meaning of 학생.',
    )
    expect(prompt).toBeDefined()
    expect(within(prompt as HTMLElement).getByText('학생')).toHaveAttribute('lang', 'ko')
    expect(within(prompt as HTMLElement).getByText(/Choose the English meaning of/)).toHaveAttribute('lang', 'en')

    await user.click(within(question).getByRole('radio', { name: 'Teacher' }))
    await user.click(within(question).getByRole('button', { name: 'Check answer' }))

    const feedback = within(question).getByRole('status')
    const explanation = [...feedback.querySelectorAll('p')].find(
      (element) => element.textContent === '학생 means Student.',
    )
    expect(explanation).toBeDefined()
    expect(within(explanation as HTMLElement).getByText('학생')).toHaveAttribute('lang', 'ko')
    expect(within(explanation as HTMLElement).getByText(/means Student\./)).toHaveAttribute('lang', 'en')

    for (const root of [prompt as HTMLElement, feedback]) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
      const untaggedHangul: string[] = []
      let textNode = walker.nextNode()
      while (textNode) {
        if (/[가-힣]/.test(textNode.textContent ?? '') && !textNode.parentElement?.closest('[lang="ko"]')) {
          untaggedHangul.push(textNode.textContent ?? '')
        }
        textNode = walker.nextNode()
      }
      expect(untaggedHangul).toEqual([])
    }
  })

  it('moves keyboard focus into a selected quiz and returns it to the originating lesson card', async () => {
    const user = userEvent.setup()
    renderPractice()
    const lessonCard = screen.getByRole('button', { name: /Lesson 3.*Jobs & Occupations/ })

    lessonCard.focus()
    await user.keyboard('[Enter]')

    await waitFor(() => expect(screen.getByText('Question 1 of 8').closest('legend')).toHaveFocus())
    const backButton = screen.getByRole('button', { name: 'All lesson quizzes' })
    backButton.focus()
    await user.keyboard('[Enter]')

    await waitFor(() => expect(screen.getByRole('button', { name: /Lesson 3.*Jobs & Occupations/ })).toHaveFocus())
  })

  it('opens the requested grammar lesson from the Learn guide query', () => {
    renderPractice('/practice?lesson=lesson-5')

    expect(screen.getByRole('heading', { name: 'Lesson 5 · 은 / 는 - topic marker quiz' })).toBeVisible()
    expect(screen.getByText('Question 1 of 3')).toBeVisible()
    expect(screen.getByText('Choose the correct topic-marked sentence.')).toBeVisible()
  })

  it('falls back to the lesson index for an unsupported lesson query', () => {
    renderPractice('/practice?lesson=lesson-7')

    expect(screen.getByRole('heading', { name: 'Practice by lesson' })).toBeVisible()
    expect(screen.queryByText('Question 1 of 3')).not.toBeInTheDocument()
  })

  it('keeps the mixed Lec 1 quiz optional and behind its own explicit card', async () => {
    const user = userEvent.setup()
    renderPractice()

    await user.click(screen.getByRole('button', { name: /Mixed Lec 1 quiz.*25 questions/ }))

    expect(screen.getByRole('heading', { name: 'Mixed Lec 1 quiz' })).toBeVisible()
    expect(screen.getByText('Question 1 of 25')).toBeVisible()
    expect(screen.getByRole('button', { name: 'All lesson quizzes' })).toBeVisible()
  })
})
