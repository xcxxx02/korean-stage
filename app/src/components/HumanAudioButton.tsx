import { SpeakerHigh } from '@phosphor-icons/react'
import { useRef } from 'react'
import type { MediaSource } from '../content/types'

type HumanAudioButtonProps = {
  source: MediaSource
  memberName: string
}

export function HumanAudioButton({ source, memberName }: HumanAudioButtonProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const label = `Listen to ${memberName}`
  const isMissing = source.src === null

  return (
    <div className="grid gap-2">
      <button
        className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg border-2 border-blue-600 px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-50 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-100 disabled:text-slate-500"
        disabled={isMissing}
        onClick={() => { void audioRef.current?.play() }}
        type="button"
      >
        <SpeakerHigh aria-hidden="true" size={24} weight="fill" />
        {label}
      </button>
      {isMissing ? <span className="text-sm font-medium text-slate-600">Audio coming soon</span> : null}
      {source.src ? <audio ref={audioRef} src={source.src} /> : null}
    </div>
  )
}
