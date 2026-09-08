import { Circle, Prohibit, Warning } from '@phosphor-icons/react'
import { useRef, useState } from 'react'
import type { MediaSource } from '../content/types'
import { publicAssetPath } from '../deployment'

type MemberVideoProps = {
  source: MediaSource
  memberName: string
  transcript?: {
    korean: string
    english: string
  }
  mediaLabel?: string
  missingDescription?: string
  missingHeading?: string
  playbackErrorDescription?: string
  playbackErrorHeading?: string
  primaryControlLabel?: string
  showRecordingChecklist?: boolean
  mode?: 'default' | 'learner'
  className?: string
}

const recordingChecks = [
  'Speak clearly',
  'Check pronunciation',
  'Use good lighting',
  'Minimize background noise',
]

export function MemberVideo({
  source,
  memberName,
  transcript,
  mediaLabel = `${memberName} vocabulary video`,
  missingDescription = `This word still needs a real recording from ${memberName}.`,
  missingHeading = 'Member video coming soon',
  playbackErrorDescription = 'Use the transcript below and continue to the next word.',
  playbackErrorHeading = 'Video playback unavailable',
  primaryControlLabel,
  showRecordingChecklist = true,
  mode = 'default',
  className = '',
}: MemberVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playbackErrorKey, setPlaybackErrorKey] = useState<string | null>(null)
  const sourceKey = `${source.kind}:${source.src ?? 'missing'}:${memberName}:${mediaLabel}`
  const hasPlaybackError = playbackErrorKey === sourceKey
  const canPlay = source.kind === 'human-recording' && Boolean(source.src?.trim())
  const isComingSoon = source.kind === 'development-missing' && source.src === null

  let mediaPanel
  if (source.kind === 'ai-generated') {
    mediaPanel = (
      <div className="flex aspect-video min-h-72 flex-col items-center justify-center rounded-xl border border-stage-vermilion bg-stage-vermilion-soft px-8 py-10 text-center">
        <Prohibit aria-hidden="true" className="mb-4 text-stage-vermilion-strong" size={52} weight="fill" />
        <h2 className="text-2xl font-bold text-stage-charcoal">AI-generated video is prohibited</h2>
        <p className="mt-2 max-w-md text-stage-muted">Use a real recording from {memberName}. This source will not be played.</p>
      </div>
    )
  } else if (isComingSoon) {
    mediaPanel = mode === 'learner' ? (
      <div className="member-video-missing" role="alert">
        <Warning aria-hidden="true" size={32} weight="fill" />
        <div>
          <h2>{missingHeading}</h2>
          <p>{missingDescription}</p>
        </div>
      </div>
    ) : (
      <div className="coming-soon-state">
        <div className="coming-soon-artwork-frame">
          <img
            alt=""
            aria-hidden="true"
            className="coming-soon-artwork"
            src={publicAssetPath('/assets/culture/video-coming-soon.png')}
          />
        </div>
        <div className="coming-soon-copy">
          <h2>{missingHeading}</h2>
          <p>{missingDescription}</p>
          {showRecordingChecklist ? (
            <ul aria-label="Recording checklist">
              {recordingChecks.map((check) => (
                <li key={check}>
                  <Circle aria-label="Not yet reviewed" size={18} weight="bold" />
                  {check}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    )
  } else if (!canPlay) {
    mediaPanel = (
      <div className="flex aspect-video min-h-72 flex-col items-center justify-center rounded-xl border border-stage-yellow bg-stage-yellow-soft px-8 py-10 text-center">
        <Warning aria-hidden="true" className="mb-4 text-stage-yellow-strong" size={52} weight="fill" />
        <h2 className="text-2xl font-bold text-stage-charcoal">Member video unavailable</h2>
        <p className="mt-2 max-w-md text-stage-muted">This media source is invalid. Ask a course editor to replace it with a human recording.</p>
      </div>
    )
  } else if (hasPlaybackError) {
    mediaPanel = (
      <div className="flex aspect-video min-h-72 flex-col items-center justify-center rounded-xl border border-stage-yellow bg-stage-yellow-soft px-8 py-10 text-center" role="alert">
        <Warning aria-hidden="true" className="mb-4 text-stage-yellow-strong" size={52} weight="fill" />
        <h2 className="text-2xl font-bold text-stage-charcoal">{playbackErrorHeading}</h2>
        <p className="mt-2 max-w-md text-stage-muted">{playbackErrorDescription}</p>
      </div>
    )
  } else {
    mediaPanel = (
      <video
        aria-label={mediaLabel}
        className="aspect-video w-full rounded-xl bg-stage-charcoal object-cover"
        controls
        key={sourceKey}
        onError={() => setPlaybackErrorKey(sourceKey)}
        ref={videoRef}
      >
        <source src={source.src ? publicAssetPath(source.src) : undefined} />
        {source.captionSrc ? (
          <track default kind="captions" label="English captions" src={publicAssetPath(source.captionSrc)} srcLang="en" />
        ) : null}
        Your browser cannot play this video. Use the transcript below.
      </video>
    )
  }

  return (
    <figure aria-label={transcript ? `${mediaLabel} transcript` : undefined} className={`member-video m-0 grid gap-4 ${className}`}>
      {primaryControlLabel ? (
        <button
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-stage-cobalt px-5 py-3 font-bold text-stage-white hover:bg-stage-cobalt-strong focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-stage-focus disabled:cursor-not-allowed disabled:bg-stage-disabled disabled:text-stage-muted"
          disabled={!canPlay || hasPlaybackError}
          onClick={() => {
            const playback = videoRef.current?.play()
            if (playback) void playback.catch(() => setPlaybackErrorKey(sourceKey))
          }}
          type="button"
        >
          {primaryControlLabel}
        </button>
      ) : null}
      {mediaPanel}
      {transcript ? (
        <figcaption className="border-l border-stage-jade pl-4 text-sm leading-6 text-stage-muted">
          <span className="block font-semibold text-stage-charcoal">Transcript</span>
          <span className="block" data-korean-content lang="ko">{transcript.korean}</span>
          <span className="block" lang="en">{transcript.english}</span>
        </figcaption>
      ) : null}
    </figure>
  )
}
