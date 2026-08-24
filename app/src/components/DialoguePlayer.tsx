import type { Dialogue, Member } from '../content/types'
import { MemberVideo } from './MemberVideo'

type DialoguePlayerProps = {
  dialogue: Dialogue
  members: Member[]
}

export function DialoguePlayer({ dialogue, members }: DialoguePlayerProps) {
  const memberName = (speakerId: string) => members.find((member) => member.id === speakerId)?.name ?? 'Course member'
  const speakers = dialogue.speakerIds.map(memberName).join(' and ')

  return (
    <section aria-labelledby={`${dialogue.id}-heading`} className="grid gap-8">
      <div className="grid gap-3">
        <p className="font-bold uppercase tracking-widest text-stage-cobalt">Scenario</p>
        <h2 className="text-2xl font-black text-stage-charcoal" id={`${dialogue.id}-heading`}>{dialogue.title}</h2>
        <p className="text-lg text-stage-muted">{dialogue.scenario}</p>
        <p className="text-stage-charcoal"><strong>Roles:</strong> {speakers}</p>
      </div>

      <MemberVideo
        className="max-w-3xl"
        mediaLabel={`${dialogue.title} role-play video`}
        memberName={speakers}
        missingDescription={`This dialogue still needs a real recording from ${speakers}.`}
        missingHeading="Dialogue video coming soon"
        mode="learner"
        playbackErrorDescription="Keep practising with the bilingual transcript below."
        playbackErrorHeading="Dialogue video unavailable"
        showRecordingChecklist={false}
        source={dialogue.video}
      />

      <div>
        <h3 className="text-xl font-black text-stage-charcoal">Bilingual transcript</h3>
        <ol aria-label="Bilingual dialogue transcript" className="mt-4 grid list-none gap-3 p-0">
          {dialogue.lines.map((line, index) => {
            const speaker = memberName(line.speakerId)
            return (
              <li className="rounded-xl border-l border-stage-border bg-stage-soft p-5" key={line.id}>
                <span className="block text-sm font-black uppercase tracking-wide text-stage-cobalt">Line {index + 1} · {speaker}</span>
                <p className="mt-2 text-xl font-bold text-stage-charcoal" lang="ko">{line.korean}</p>
                <p className="mt-1 leading-6 text-stage-muted" lang="en">{line.english}</p>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
