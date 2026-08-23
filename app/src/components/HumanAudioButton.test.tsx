import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { MediaSource } from '../content/types'
import { HumanAudioButton } from './HumanAudioButton'

afterEach(cleanup)

describe('HumanAudioButton', () => {
  const missingMedia: MediaSource = { src: null, kind: 'development-missing' }

  it('keeps missing human audio honest and unavailable', () => {
    render(<HumanAudioButton memberName="Member 1" source={missingMedia} />)

    expect(screen.getByRole('button', { name: 'Listen to Member 1' })).toBeDisabled()
    expect(screen.getByText('Audio coming soon')).toBeVisible()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(document.querySelector('audio')).not.toBeInTheDocument()
  })

  it('never renders or enables AI-generated audio', () => {
    render(<HumanAudioButton
      memberName="Member 1"
      source={{ src: '/media/generated.mp3', kind: 'ai-generated' }}
    />)

    expect(screen.getByRole('button', { name: 'Listen to Member 1' })).toBeDisabled()
    expect(screen.getByText('AI-generated audio is prohibited')).toBeVisible()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(document.querySelector('audio')).not.toBeInTheDocument()
  })

  it('rejects development-missing audio that inconsistently includes a source', () => {
    render(<HumanAudioButton
      memberName="Member 1"
      source={{ src: '/media/not-approved.mp3', kind: 'development-missing' }}
    />)

    expect(screen.getByRole('button', { name: 'Listen to Member 1' })).toBeDisabled()
    expect(screen.getByText('Audio unavailable: invalid media source')).toBeVisible()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(document.querySelector('audio')).not.toBeInTheDocument()
  })

  it('reports a supplied human audio playback error in plain English', () => {
    render(<HumanAudioButton
      memberName="Member 1"
      source={{ src: '/media/student.mp3', kind: 'human-recording' }}
    />)

    const audio = document.querySelector('audio')!
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    fireEvent.error(audio)
    expect(screen.getByRole('status')).toHaveTextContent('Audio playback unavailable. Continue with the written example.')
    expect(screen.getByRole('button', { name: 'Listen to Member 1' })).toBeDisabled()
  })

  it('handles rejected playback and resets the fallback when the source changes', async () => {
    const user = userEvent.setup()
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockRejectedValueOnce(new Error('Playback blocked'))
    const view = render(<HumanAudioButton
      memberName="Member 1"
      source={{ src: '/media/student.mp3', kind: 'human-recording' }}
    />)

    await user.click(screen.getByRole('button', { name: 'Listen to Member 1' }))

    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(
      'Audio playback unavailable. Continue with the written example.',
    ))
    expect(screen.getByRole('button', { name: 'Listen to Member 1' })).toBeDisabled()

    view.rerender(<HumanAudioButton
      memberName="Member 2"
      source={{ src: '/media/teacher.mp3', kind: 'human-recording' }}
    />)

    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())
    expect(screen.getByRole('button', { name: 'Listen to Member 2' })).toBeEnabled()
    expect(document.querySelector('audio')).toHaveAttribute('src', '/media/teacher.mp3')
  })
})
