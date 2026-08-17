import { Circle, Prohibit, VideoCamera, Warning } from '@phosphor-icons/react'
import { useRef, useState } from 'react'
import type { MediaSource } from '../content/types'

type MemberVideoProps = {
  source: MediaSource
  memberName: string
  transcript: string
  mediaLabel?: string
  missingDescription?: string
  missingHeading?: string
  primaryControlLabel?: string
  showRecordingChecklist?: boolean
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
  primaryControlLabel,
  showRecordingChecklist = true,
}: MemberVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasPlaybackError, setHasPlaybackError] = useState(false)
  const canPlay = source.kind === 'human-recording' && source.src !== null
  const isComingSoon = source.kind === 'development-missing' && source.src === null

  let mediaPanel
  if (source.kind === 'ai-generated') {
    mediaPanel = (
      <div className="flex aspect-video min-h-72 flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-8 py-10 text-center">
        <Prohibit aria-hidden="true" className="mb-4 text-red-700" size={52} weight="fill" />
        <h2 className="text-2xl font-bold text-slate-950">AI-generated video is prohibited</h2>
        <p className="mt-2 max-w-md text-slate-700">Use a real recording from {memberName}. This source will not be played.</p>
      </div>
    )
  } else if (isComingSoon) {
    mediaPanel = (
      <div className="flex aspect-video min-h-72 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-8 py-10 text-center">
        <span className="mb-4 grid size-16 place-items-center rounded-full bg-blue-600 text-white">
          <VideoCamera aria-hidden="true" size={34} weight="fill" />
        </span>
        <h2 className="text-2xl font-bold text-slate-950">{missingHeading}</h2>
        <p className="mt-2 max-w-md text-slate-600">{missingDescription}</p>
        {showRecordingChecklist ? (
          <ul aria-label="Recording checklist" className="mt-6 grid gap-2 text-left sm:grid-cols-2">
            {recordingChecks.map((check) => (
              <li className="flex items-center gap-2 text-sm font-medium text-slate-700" key={check}>
                <Circle aria-label="Not yet reviewed" className="text-slate-400" size={20} weight="bold" />
                {check}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    )
  } else if (!canPlay) {
    mediaPanel = (
      <div className="flex aspect-video min-h-72 flex-col items-center justify-center rounded-2xl border border-amber-300 bg-amber-50 px-8 py-10 text-center">
        <Warning aria-hidden="true" className="mb-4 text-amber-700" size={52} weight="fill" />
        <h2 className="text-2xl font-bold text-slate-950">Member video unavailable</h2>
        <p className="mt-2 max-w-md text-slate-700">This media source is invalid. Ask a course editor to replace it with a human recording.</p>
      </div>
    )
  } else if (hasPlaybackError) {
    mediaPanel = (
      <div className="flex aspect-video min-h-72 flex-col items-center justify-center rounded-2xl border border-amber-300 bg-amber-50 px-8 py-10 text-center" role="alert">
        <Warning aria-hidden="true" className="mb-4 text-amber-700" size={52} weight="fill" />
        <h2 className="text-2xl font-bold text-slate-950">Video playback unavailable</h2>
        <p className="mt-2 max-w-md text-slate-700">Use the transcript below and continue to the next word.</p>
      </div>
    )
  } else {
    mediaPanel = (
      <video
        aria-label={mediaLabel}
        className="aspect-video w-full rounded-2xl bg-slate-950 object-cover shadow-sm"
        controls
        onError={() => setHasPlaybackError(true)}
        ref={videoRef}
      >
        <source src={source.src ?? undefined} />
        {source.captionSrc ? (
          <track default kind="captions" label="English captions" src={source.captionSrc} srcLang="en" />
        ) : null}
        Your browser cannot play this video. Use the transcript below.
      </video>
    )
  }

  return (
    <figure className="m-0 grid gap-4">
      {primaryControlLabel ? (
        <button
          className="inline-flex min-h-12 items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
          disabled={!canPlay || hasPlaybackError}
          onClick={() => { void videoRef.current?.play() }}
          type="button"
        >
          {primaryControlLabel}
        </button>
      ) : null}
      {mediaPanel}
      <figcaption className="border-l-4 border-emerald-500 pl-4 text-sm leading-6 text-slate-700">
        <span className="block font-semibold text-slate-950">Transcript</span>
        {transcript}
      </figcaption>
    </figure>
  )
}
