import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import { PracticePage } from './PracticePage'

afterEach(cleanup)

type ChallengeAnswer = string | {
  student: string
  singer: string
}

const correctAnswers: readonly ChallengeAnswer[] = [
  '민수예요',
  '학생이에요',
  { student: 'I am a student.', singer: 'Jenny is a singer.' },
  '저는 학생이에요',
  '선생님은 한국 사람이에요',
  '제니는 가수예요',
  '미국 사람이 아니에요',
  '가수가 아니에요',
  '회사원이 아니에요',
]

const wrongAnswers: readonly ChallengeAnswer[] = [
  '민수이에요',
  '학생예요',
  { student: 'Jenny is a singer.', singer: 'I am a student.' },
  '저은 학생이에요',
  '선생님는 한국 사람이에요',
  '제니은 가수예요',
  '미국 사람 가 아니에요',
  '가수이 아니에요',
  '회사원가 아니에요',
]

async function answerCurrentQuestion(user: ReturnType<typeof userEvent.setup>, answer: ChallengeAnswer) {
  if (typeof answer === 'string') {
    await user.click(screen.getByRole('radio', { name: answer }))
    return
  }

  await user.selectOptions(screen.getByRole('combobox', { name: 'Match 저는 학생이에요. to its English meaning' }), answer.student)
  await user.selectOptions(screen.getByRole('combobox', { name: 'Match 제니는 가수예요. to its English meaning' }), answer.singer)
}

async function completeChallenge(user: ReturnType<typeof userEvent.setup>, answers: readonly ChallengeAnswer[]) {
  for (const [index, answer] of answers.entries()) {
    await answerCurrentQuestion(user, answer)
    await user.click(screen.getByRole('button', { name: 'Check answer' }))
    await user.click(screen.getByRole('button', { name: index === 8 ? 'See results' : 'Next question' }))
  }
}

describe('PracticePage', () => {
  it('offers the Unit 2 and Unit 3 flashcards and the grammar challenge', async () => {
    const user = userEvent.setup()
    render(<PracticePage />)

    expect(screen.getByRole('heading', { name: 'Final practice' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Vocabulary Flashcards' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Grammar Challenge' })).toBeVisible()
    expect(screen.getByText('Card 1 of 16')).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Grammar Challenge' }))

    expect(screen.getByRole('heading', { name: 'Grammar Challenge' })).toBeVisible()
    expect(screen.getByText('Question 1 of 9')).toBeVisible()
    expect(screen.queryByText('Question 2 of 9')).not.toBeInTheDocument()
  })

  it('prevents an empty answer and gives beginner-first bilingual feedback', async () => {
    const user = userEvent.setup()
    render(<PracticePage />)
    await user.click(screen.getByRole('button', { name: 'Grammar Challenge' }))

    expect(screen.getByRole('button', { name: 'Check answer' })).toBeDisabled()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()

    await user.click(screen.getByRole('radio', { name: '민수이에요' }))
    await user.click(screen.getByRole('button', { name: 'Check answer' }))

    const feedback = screen.getByRole('status')
    expect(feedback).toHaveTextContent('아직 아니에요. Not quite.')
    expect(feedback).toHaveTextContent('Correct answer: 민수예요')
    expect(feedback).toHaveTextContent('민수 ends in a vowel, so use 예요.')
    const koreanFeedback = within(feedback).getByText('아직 아니에요.')
    expect(koreanFeedback).toHaveAttribute('lang', 'ko')
    expect(koreanFeedback.parentElement).not.toHaveAttribute('lang')
  })

  it('moves keyboard focus through feedback and the next question', async () => {
    const user = userEvent.setup()
    render(<PracticePage />)
    await user.click(screen.getByRole('button', { name: 'Grammar Challenge' }))

    await user.click(screen.getByRole('radio', { name: '민수예요' }))
    await user.tab()
    expect(screen.getByRole('button', { name: 'Check answer' })).toHaveFocus()
    await user.keyboard('[Enter]')
    expect(screen.getByRole('status')).toHaveFocus()
    expect(screen.getByRole('status')).toHaveClass('practice-focus-target')

    await user.tab()
    expect(screen.getByRole('button', { name: 'Next question' })).toHaveFocus()
    await user.keyboard('[Enter]')
    expect(screen.getByText('Question 2 of 9').closest('legend')).toHaveFocus()
    expect(screen.getByText('Question 2 of 9').closest('legend')).toHaveClass('practice-focus-target')
  })

  it('runs the matching exercise as a real two-control interaction with English feedback', async () => {
    const user = userEvent.setup()
    render(<PracticePage />)
    await user.click(screen.getByRole('button', { name: 'Grammar Challenge' }))

    for (const answer of correctAnswers.slice(0, 2)) {
      await answerCurrentQuestion(user, answer)
      await user.click(screen.getByRole('button', { name: 'Check answer' }))
      await user.click(screen.getByRole('button', { name: 'Next question' }))
    }

    expect(screen.getByText('Question 3 of 9')).toBeVisible()
    expect(screen.queryByRole('radio')).not.toBeInTheDocument()
    const studentMatch = screen.getByRole('combobox', { name: 'Match 저는 학생이에요. to its English meaning' })
    const singerMatch = screen.getByRole('combobox', { name: 'Match 제니는 가수예요. to its English meaning' })
    const submit = screen.getByRole('button', { name: 'Check answer' })
    await user.selectOptions(studentMatch, 'Jenny is a singer.')
    expect(submit).toBeDisabled()
    await user.selectOptions(singerMatch, 'I am a student.')
    await user.click(submit)

    expect(screen.getByRole('status')).toHaveTextContent('아직 아니에요. Not quite.')
    expect(screen.getByRole('status')).toHaveTextContent('Correct matches: 저는 학생이에요. — I am a student.; 제니는 가수예요. — Jenny is a singer.')
    expect(screen.getByRole('status')).toHaveTextContent('이에요 follows consonant-ending 학생, while 예요 follows vowel-ending 가수.')
  })

  it('ignores a duplicate submission instead of pre-answering the next question', async () => {
    const user = userEvent.setup()
    render(<PracticePage />)
    await user.click(screen.getByRole('button', { name: 'Grammar Challenge' }))

    await user.click(screen.getByRole('radio', { name: '민수예요' }))
    const firstQuestionForm = screen.getByRole('group', { name: /Question 1 of 9/ }).closest('form')
    expect(firstQuestionForm).not.toBeNull()
    fireEvent.submit(firstQuestionForm!)
    fireEvent.submit(firstQuestionForm!)
    await user.click(screen.getByRole('button', { name: 'Next question' }))

    expect(screen.getByText('Question 2 of 9')).toBeVisible()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Check answer' })).toBeDisabled()
  })

  it('scores 0 / 9 and reviews every incorrect answer', async () => {
    const user = userEvent.setup()
    render(<PracticePage />)
    await user.click(screen.getByRole('button', { name: 'Grammar Challenge' }))

    await completeChallenge(user, wrongAnswers)

    expect(screen.getByText('Score: 0 / 9')).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Review incorrect answers' }))
    const incorrectReviews = screen.getAllByRole('article')
    expect(incorrectReviews).toHaveLength(9)
    expect(incorrectReviews[0]).toHaveTextContent('Your answer: 민수이에요')
    expect(incorrectReviews[0]).toHaveTextContent('Correct answer: 민수예요')
    expect(incorrectReviews[8]).toHaveTextContent('Your answer: 회사원가 아니에요')
    expect(incorrectReviews[8]).toHaveTextContent('Correct answer: 회사원이 아니에요')
  })

  it('scores 9 / 9 without offering an empty incorrect-answer review', async () => {
    const user = userEvent.setup()
    render(<PracticePage />)
    await user.click(screen.getByRole('button', { name: 'Grammar Challenge' }))

    await completeChallenge(user, correctAnswers)

    expect(screen.getByText('Score: 9 / 9')).toBeVisible()
    expect(screen.queryByRole('button', { name: 'Review incorrect answers' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Try again' })).toBeVisible()
  })

  it('scores all nine exercises, reviews incorrect answers, and starts a fresh retry', async () => {
    const user = userEvent.setup()
    render(<PracticePage />)
    await user.click(screen.getByRole('button', { name: 'Grammar Challenge' }))

    await user.click(screen.getByRole('radio', { name: '민수이에요' }))
    await user.click(screen.getByRole('button', { name: 'Check answer' }))
    await user.click(screen.getByRole('button', { name: 'Next question' }))

    for (const [index, answer] of correctAnswers.slice(1).entries()) {
      await answerCurrentQuestion(user, answer)
      await user.click(screen.getByRole('button', { name: 'Check answer' }))
      if (index < 7) await user.click(screen.getByRole('button', { name: 'Next question' }))
    }

    expect(screen.getByRole('status')).toHaveTextContent('맞았어요! Correct!')
    await user.click(screen.getByRole('button', { name: 'See results' }))
    const completionHeading = screen.getByRole('heading', { name: 'Challenge complete' })
    expect(completionHeading).toBeVisible()
    expect(completionHeading).toHaveFocus()
    expect(completionHeading).toHaveClass('practice-focus-target')
    expect(screen.getByText('Score: 8 / 9')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Review incorrect answers' })).toBeVisible()
    expect(screen.getByRole('button', { name: 'Try again' })).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Review incorrect answers' }))
    expect(screen.getByRole('heading', { name: 'Review incorrect answers' })).toBeVisible()
    const incorrectReview = screen.getByText('민수___').closest('article')
    expect(incorrectReview).toHaveTextContent('Your answer: 민수이에요')
    expect(incorrectReview).toHaveTextContent('Correct answer: 민수예요')

    await user.click(screen.getByRole('button', { name: 'Try again' }))
    expect(screen.getByText('Question 1 of 9')).toBeVisible()
    expect(screen.getByRole('button', { name: 'Check answer' })).toBeDisabled()
    expect(screen.getByText('Question 1 of 9').closest('legend')).toHaveFocus()
  })
})
