import { CheckCircle } from '@phosphor-icons/react'
import { useState } from 'react'
import type { Dialogue, Member } from '../content/types'
import { HumanAudioButton } from './HumanAudioButton'
import { MemberVideo } from './MemberVideo'

type DialoguePlayerProps = {
  dialogue: Dialogue
  members: Member[]
}

const recordingChecklist = [
  "Show every speaker's face",
  "Use each member's real voice",
  'Act naturally',
  'Record 1-3 minutes',
  'Maintain clear pronunciation and uninterrupted flow',
  'Avoid background noise',
  'Never use AI voice',
] as const

export function DialoguePlayer({ dialogue, members }: DialoguePlayerProps) {
  const [selectedLineId, setSelectedLineId] = useState(dialogue.lines[0]?.id)
  const memberName = (speakerId: string) => members.find((member) => member.id === speakerId)?.name ?? 'Course member'
  const speakers = dialogue.speakerIds.map(memberName).join(' and ')
  const fullTranscript = dialogue.lines
    .map((line) => `${memberName(line.speakerId)}: ${line.korean} ${line.english}`)
    .join(' ')

  return (
    <div className="grid gap-10">
      <section aria-labelledby={`${dialogue.id}-watch`} className="grid gap-5">
        <div>
          <p className="font-bold uppercase tracking-widest text-blue-700">Watch first</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950" id={`${dialogue.id}-watch`}>Full 1-3 minute drama</h2>
          <p className="mt-2 text-slate-700">Watch the complete scene with {speakers}, then study every line below.</p>
        </div>
        <MemberVideo
          mediaLabel={`${dialogue.title} full role-play video`}
          memberName={speakers}
          missingDescription={`This role-play still needs a real recording from ${speakers}.`}
          missingHeading="Full role-play video coming soon"
          playbackErrorDescription="Keep practising with the bilingual transcript below."
          playbackErrorHeading="Role-play video unavailable"
          primaryControlLabel="Play full role-play video"
          showRecordingChecklist={false}
          source={dialogue.video}
          transcript={fullTranscript}
        />
        <aside className="rounded-xl border border-emerald-300 bg-emerald-50 p-5" aria-labelledby={`${dialogue.id}-checklist`}>
          <h3 className="text-lg font-bold text-slate-950" id={`${dialogue.id}-checklist`}>Role-play recording checklist</h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {recordingChecklist.map((rule) => (
              <li className="flex items-start gap-2 text-sm font-semibold text-slate-800" key={rule}>
                <CheckCircle aria-hidden="true" className="mt-0.5 shrink-0 text-emerald-700" size={20} weight="fill" />
                {rule}
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <section aria-labelledby={`${dialogue.id}-study`}>
        <p className="font-bold uppercase tracking-widest text-red-700">Study second</p>
        <h2 className="mt-2 text-2xl font-black text-slate-950" id={`${dialogue.id}-study`}>Bilingual line practice</h2>
        <p className="mt-2 text-slate-700">Select any line to focus it. The Korean and English stay together while you practise.</p>
        <ol aria-label="Bilingual dialogue transcript" className="mt-6 grid list-none gap-3 p-0">
          {dialogue.lines.map((line, index) => {
            const speaker = memberName(line.speakerId)
            const isSelected = line.id === selectedLineId
            return (
              <li
                className={`grid gap-4 rounded-xl border-l-4 p-5 sm:grid-cols-[1fr_auto] sm:items-center ${isSelected ? 'border-blue-600 bg-blue-50' : 'border-slate-300 bg-slate-50'}`}
                key={line.id}
              >
                <button
                  aria-current={isSelected ? 'true' : undefined}
                  aria-label={`Select line ${index + 1} by ${speaker}`}
                  className="min-w-0 text-left focus-visible:rounded-md focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  onClick={() => setSelectedLineId(line.id)}
                  type="button"
                >
                  <span className="block text-sm font-black uppercase tracking-wide text-blue-700">Line {index + 1} · {speaker}</span>
                  {isSelected ? <span className="mt-1 inline-block rounded-full bg-blue-700 px-2 py-0.5 text-xs font-bold text-white">Current line</span> : null}
                  <span className="mt-2 block text-xl font-bold text-slate-950" lang="ko">{line.korean}</span>
                  <span className="mt-1 block leading-6 text-slate-700" lang="en">{line.english}</span>
                </button>
                <HumanAudioButton
                  label={`Listen to line ${index + 1} by ${speaker}`}
                  memberName={speaker}
                  source={line.audio}
                />
              </li>
            )
          })}
        </ol>
      </section>
    </div>
  )
}
