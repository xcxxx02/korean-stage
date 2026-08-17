import { CheckCircle, VideoCamera } from '@phosphor-icons/react'
import type { MediaSource } from '../content/types'

type MemberVideoProps = {
  source: MediaSource
  memberName: string
  transcript: string
}

const recordingChecks = [
  'Speak clearly',
  'Check pronunciation',
  'Use good lighting',
  'Minimize background noise',
]

export function MemberVideo({ source, memberName, transcript }: MemberVideoProps) {
  return (
    <figure className="m-0 grid gap-4">
      {source.src ? (
        <video
          aria-label={`${memberName} vocabulary video`}
          className="aspect-video w-full rounded-2xl bg-slate-950 object-cover shadow-sm"
          controls
        >
          <source src={source.src} />
          {source.captionSrc ? (
            <track default kind="captions" label="English captions" src={source.captionSrc} srcLang="en" />
          ) : null}
          Your browser cannot play this video. Use the transcript below.
        </video>
      ) : (
        <div className="flex aspect-video min-h-72 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-8 py-10 text-center">
          <span className="mb-4 grid size-16 place-items-center rounded-full bg-blue-600 text-white">
            <VideoCamera aria-hidden="true" size={34} weight="fill" />
          </span>
          <h2 className="text-2xl font-bold text-slate-950">Member video coming soon</h2>
          <p className="mt-2 max-w-md text-slate-600">This word still needs a real recording from {memberName}.</p>
          <ul aria-label="Recording checklist" className="mt-6 grid gap-2 text-left sm:grid-cols-2">
            {recordingChecks.map((check) => (
              <li className="flex items-center gap-2 text-sm font-medium text-slate-700" key={check}>
                <CheckCircle aria-hidden="true" className="text-emerald-600" size={20} weight="fill" />
                {check}
              </li>
            ))}
          </ul>
        </div>
      )}
      <figcaption className="border-l-4 border-emerald-500 pl-4 text-sm leading-6 text-slate-700">
        <span className="block font-semibold text-slate-950">Transcript</span>
        {transcript}
      </figcaption>
    </figure>
  )
}
