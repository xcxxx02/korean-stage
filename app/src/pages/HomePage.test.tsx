import { act, cleanup, fireEvent, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderApp } from '../test/renderApp'

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('HomePage', () => {
  it('presents a people-free Korean vocabulary showcase', async () => {
    renderApp(['/'])

    const preview = await screen.findByRole('region', { name: 'Animated vocabulary preview' })
    expect(within(preview).getByRole('heading', { name: '한국어' })).toHaveAttribute('lang', 'ko')
    expect(within(preview).getByText('Korean')).toHaveAttribute('lang', 'en')
    expect(within(preview).getByText('Learn Korean, one word at a time.')).toBeVisible()
    expect(within(preview).queryByRole('img', { name: /person|presenter|member/i })).not.toBeInTheDocument()
    expect(preview.querySelector('video')).not.toBeInTheDocument()
    expect(preview.querySelector('audio')).not.toBeInTheDocument()
    expect(screen.getByTestId('home-hanok-stage')).toHaveAttribute(
      'src',
      expect.stringContaining('/assets/culture/home-hanok-stage.png'),
    )
  })

  it('rotates featured vocabulary and lets learners choose a card', () => {
    vi.useFakeTimers()
    renderApp(['/'])

    const preview = screen.getByRole('region', { name: 'Animated vocabulary preview' })
    expect(within(preview).getByRole('heading', { name: '한국어' })).toBeVisible()

    act(() => vi.advanceTimersByTime(4000))
    expect(within(preview).getByRole('heading', { name: '태국' })).toBeVisible()

    fireEvent.click(within(preview).getByRole('button', { name: 'Show 학생 vocabulary card' }))
    expect(within(preview).getByRole('heading', { name: '학생' })).toBeVisible()
    expect(within(preview).getByText('Student')).toBeVisible()
  })

  it('keeps the vocabulary preview still when reduced motion is preferred', () => {
    vi.useFakeTimers()
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }))
    renderApp(['/'])

    const preview = screen.getByRole('region', { name: 'Animated vocabulary preview' })
    act(() => vi.advanceTimersByTime(8000))

    expect(within(preview).getByRole('heading', { name: '한국어' })).toBeVisible()
  })
})
