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
  const [playbackErrorKey, setPlaybackErrorKey] = useState<string | null>(null)
  const sourceKey = `${source.kind}:${source.src ?? 'missing'}:${memberName}:${label}`
  const hasPlaybackError = playbackErrorKey === sourceKey
  const isHumanRecording = source.kind === 'human-recording' && source.src !== null
  const canPlay = isHumanRecording && !hasPlaybackError
  const status = hasPlaybackError
    ? <span>Audio playback unavailable. Continue with the written example.</span>
    : source.kind === 'ai-generated'
    ? <><span>AI-generated audio is prohibited</span><span> Use a human recording instead.</span></>
    : source.kind === 'development-missing' && source.src === null
      ? <><span>Audio coming soon</span><span> Use the written example for now.</span></>
      : canPlay
        ? null
        : <><span>Audio unavailable: invalid media source</span><span>. Continue with the written example.</span></>

  const handlePlay = () => {
    const playback = audioRef.current?.play()
    if (playback) {
      void playback.catch(() => setPlaybackErrorKey(sourceKey))
    }
  }

  return (
    <div className="grid gap-2">
      <button
        className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl border border-stage-cobalt px-5 py-3 font-semibold text-stage-cobalt transition hover:bg-stage-cobalt-soft focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-stage-focus disabled:cursor-not-allowed disabled:border-stage-border disabled:bg-stage-soft disabled:text-stage-faint"
        disabled={!canPlay}
        onClick={handlePlay}
        type="button"
      >
        <SpeakerHigh aria-hidden="true" size={24} weight="fill" />
        {label}
      </button>
      {status ? <span className="text-sm font-medium text-stage-muted" role={hasPlaybackError ? 'status' : undefined}>{status}</span> : null}
      {canPlay ? <audio onError={() => setPlaybackErrorKey(sourceKey)} ref={audioRef} src={source.src ?? undefined} /> : null}
    </div>
  )
}
