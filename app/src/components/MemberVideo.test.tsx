import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import type { MediaSource } from '../content/types'
import { MemberVideo } from './MemberVideo'

afterEach(cleanup)

describe('MemberVideo', () => {
  const missingMedia: MediaSource = { src: null, kind: 'development-missing' }

  it('can keep the contributor recording checklist available outside learner mode', () => {
    render(<MemberVideo
      memberName="Member 1"
      showRecordingChecklist
      source={missingMedia}
      transcript="저는 학생이에요. I am a student."
    />)

    expect(screen.getByRole('heading', { name: 'Member video coming soon' })).toBeVisible()
    for (const check of ['Speak clearly', 'Check pronunciation', 'Use good lighting', 'Minimize background noise']) {
      expect(screen.getByText(check)).toBeVisible()
    }
    expect(screen.getAllByLabelText('Not yet reviewed')).toHaveLength(4)
    expect(screen.getByText('저는 학생이에요. I am a student.')).toBeVisible()
    expect(document.querySelector('video')).not.toBeInTheDocument()
  })

  it('never renders AI-generated video', () => {
    render(<MemberVideo
      memberName="Member 1"
      source={{ src: '/media/generated.mp4', kind: 'ai-generated' }}
      transcript="저는 학생이에요. I am a student."
    />)

    expect(screen.getByRole('heading', { name: 'AI-generated video is prohibited' })).toBeVisible()
    expect(document.querySelector('video')).not.toBeInTheDocument()
  })

  it('rejects development-missing video that inconsistently includes a source', () => {
    render(<MemberVideo
      memberName="Member 1"
      source={{ src: '/media/not-approved.mp4', kind: 'development-missing' }}
      transcript="저는 학생이에요. I am a student."
    />)

    expect(screen.getByRole('heading', { name: 'Member video unavailable' })).toBeVisible()
    expect(screen.getByText('This media source is invalid. Ask a course editor to replace it with a human recording.')).toBeVisible()
    expect(document.querySelector('video')).not.toBeInTheDocument()
  })

  it('uses native video controls, captions, and an adjacent transcript when supplied', () => {
    render(<MemberVideo
      memberName="Member 1"
      source={{ src: '/media/student.mp4', captionSrc: '/media/student.vtt', kind: 'human-recording' }}
      transcript="저는 학생이에요. I am a student."
    />)

    const video = screen.getByLabelText('Member 1 vocabulary video')
    expect(video).toHaveAttribute('controls')
    expect(video.querySelector('track')).toHaveAttribute('src', '/media/student.vtt')
    expect(screen.getByText('저는 학생이에요. I am a student.')).toBeVisible()

    fireEvent.error(video)
    expect(screen.getByRole('heading', { name: 'Video playback unavailable' })).toBeVisible()
    expect(screen.getByText('Use the transcript below and continue to the next word.')).toBeVisible()
    expect(screen.getByText('저는 학생이에요. I am a student.')).toBeVisible()
  })

  it('remounts the native video when a different human source is supplied', () => {
    const view = render(<MemberVideo
      memberName="Member 1"
      source={{ src: '/media/student.mp4', captionSrc: '/media/student.vtt', kind: 'human-recording' }}
      transcript="저는 학생이에요. I am a student."
    />)
    const firstVideo = screen.getByLabelText('Member 1 vocabulary video')

    view.rerender(<MemberVideo
      memberName="Member 2"
      source={{ src: '/media/teacher.mp4', captionSrc: '/media/teacher.vtt', kind: 'human-recording' }}
      transcript="저는 선생님이에요. I am a teacher."
    />)

    const nextVideo = screen.getByLabelText('Member 2 vocabulary video')
    expect(nextVideo).not.toBe(firstVideo)
    expect(firstVideo).not.toBeInTheDocument()
    expect(nextVideo).toBeInTheDocument()
  })

  it('recovers from a playback error when the human video source changes', () => {
    const view = render(<MemberVideo
      memberName="Member 1"
      source={{ src: '/media/student.mp4', captionSrc: '/media/student.vtt', kind: 'human-recording' }}
      transcript="저는 학생이에요. I am a student."
    />)

    fireEvent.error(screen.getByLabelText('Member 1 vocabulary video'))
    expect(screen.getByRole('heading', { name: 'Video playback unavailable' })).toBeVisible()

    view.rerender(<MemberVideo
      memberName="Member 2"
      source={{ src: '/media/teacher.mp4', captionSrc: '/media/teacher.vtt', kind: 'human-recording' }}
      transcript="저는 선생님이에요. I am a teacher."
    />)

    const video = screen.getByLabelText('Member 2 vocabulary video')
    expect(video.querySelector('source')).toHaveAttribute('src', '/media/teacher.mp4')
    expect(video.querySelector('track')).toHaveAttribute('src', '/media/teacher.vtt')
    expect(screen.queryByRole('heading', { name: 'Video playback unavailable' })).not.toBeInTheDocument()
    expect(screen.getByText('저는 선생님이에요. I am a teacher.')).toBeVisible()
  })
})
