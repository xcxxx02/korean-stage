import { cleanup, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { renderApp } from '../test/renderApp'

describe('LearnPage', () => {
  afterEach(cleanup)

  it('shows learning content immediately without progress language', () => {
    renderApp(['/learn/lesson-1'])

    expect(screen.getByRole('heading', { name: 'Hello & Self-introduction' })).toBeVisible()
    expect(screen.getByText('안녕하세요?')).toHaveAttribute('lang', 'ko')
    expect(screen.getByText('Lesson 1 of 7')).toBeVisible()
    expect(screen.queryByText(/ready to continue|mark.*complete|continue learning/i)).not.toBeInTheDocument()
  })

  it('dispatches vocabulary content for vocabulary lessons', () => {
    renderApp(['/learn/lesson-2'])

    expect(screen.getByRole('heading', { name: 'Countries & Nationalities' })).toBeVisible()
    expect(screen.getByText('Lesson 2 of 7')).toBeVisible()
    expect(screen.getAllByText('중국')[0]).toBeVisible()
    expect(screen.getAllByText('China')[0]).toBeVisible()
  })

  it('dispatches a focused guide for grammar lessons', () => {
    renderApp(['/learn/lesson-4'])

    expect(screen.getByRole('heading', { name: '이에요 / 예요 · to be', level: 2 })).toBeVisible()
    expect(screen.getByText('이에요 / 예요')).toHaveAttribute('lang', 'ko')
    expect(screen.getByText('to be')).toHaveAttribute('lang', 'en')
    expect(screen.getByText((_, element) => element?.tagName === 'LI' && element.textContent === 'Consonant-ending noun + 이에요')).toBeVisible()
    expect(screen.getByRole('link', { name: 'Practise this lesson' })).toHaveAttribute('href', '/practice/lesson-4')
    expect(screen.queryByText('Complete the sentence for Minsu.')).not.toBeInTheDocument()
  })

  it('previews the bilingual dialogue lesson without duplicating the dialogue page', () => {
    renderApp(['/learn/lesson-7'])

    expect(screen.getByRole('heading', { name: 'Dialogue & Role Play' })).toBeVisible()
    expect(screen.getByText('안녕하세요.')).toHaveAttribute('lang', 'ko')
    expect(screen.getByText('Hello.')).toHaveAttribute('lang', 'en')
    expect(screen.getByRole('link', { name: 'Watch the dialogue' })).toHaveAttribute('href', '/dialogue')
    expect(screen.queryByText('Hello. What is your name?')).not.toBeInTheDocument()
  })

  it('shows a friendly recovery state for an unknown lesson route', () => {
    renderApp(['/learn/lesson-99'])

    expect(screen.getByRole('heading', { name: 'Lesson not found' })).toBeVisible()
    expect(screen.getByText("We couldn't find that lesson.")).toBeVisible()
    expect(screen.getByRole('link', { name: 'Return to lessons' })).toHaveAttribute('href', '/learn/lesson-1')
    expect(screen.queryByRole('heading', { name: 'Hello & Self-introduction' })).not.toBeInTheDocument()
  })
})
