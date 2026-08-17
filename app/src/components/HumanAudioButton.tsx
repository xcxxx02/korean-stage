import { SpeakerHigh } from '@phosphor-icons/react'
import { useRef, useState } from 'react'
import type { MediaSource } from '../content/types'

type HumanAudioButtonProps = {
  source: MediaSource
  memberName: string
  label?: string
}

export function HumanAudioButton({ source, memberName, label = `Listen to ${memberName}` }: HumanAudioButtonProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [hasPlaybackError, setHasPlaybackError] = useState(false)
  const isHumanRecording = source.kind === 'human-recording' && source.src !== null
  const canPlay = isHumanRecording && !hasPlaybackError
  const status = hasPlaybackError
    ? 'Audio playback unavailable. Continue with the written example.'
    : source.kind === 'ai-generated'
    ? 'AI-generated audio is prohibited'
    : source.kind === 'development-missing' && source.src === null
      ? 'Audio coming soon'
      : canPlay
        ? null
        : 'Audio unavailable: invalid media source'

  return (
    <div className="grid gap-2">
      <button
        className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg border-2 border-blue-600 px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-50 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-100 disabled:text-slate-500"
        disabled={!canPlay}
        onClick={() => { void audioRef.current?.play() }}
        type="button"
      >
        <SpeakerHigh aria-hidden="true" size={24} weight="fill" />
        {label}
      </button>
      {status ? <span className="text-sm font-medium text-slate-600">{status}</span> : null}
      {canPlay ? <audio onError={() => setHasPlaybackError(true)} ref={audioRef} src={source.src ?? undefined} /> : null}
    </div>
  )
}
