import type { Course } from '../content/types'

type TeamGridProps = {
  course: Course
}

export function TeamGrid({ course }: TeamGridProps) {
  return (
    <section aria-labelledby="team-contributions-heading" className="mt-10">
      <div className="rounded-xl border border-stage-border bg-stage-cobalt-soft p-6 sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-stage-cobalt">All seven units are adapted entirely from {course.sourceLesson}</p>
        <h2 className="mt-2 text-2xl font-black text-stage-charcoal" id="team-contributions-heading">Team contributions</h2>
        <p className="mt-3 max-w-4xl text-stage-muted">{course.purpose}</p>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {course.members.map((member) => {
          const assignedVocabulary = course.vocabulary.filter((item) =>
            item.assessmentStatus === 'assessed'
            && item.recordingRequirement === 'member-recording-required'
            && item.ownerId === member.id,
          )
          const dialogueTitles = course.dialogues
            .filter((dialogue) => dialogue.lines.some((line) => line.speakerId === member.id))
            .map((dialogue) => dialogue.title)

          return (
            <article aria-label={`${member.name.trim() || 'Unnamed member'} contribution`} className="rounded-xl border border-stage-border bg-stage-white p-6" key={member.id}>
              <div>
                <div>
                  <h3 className="text-xl font-black text-stage-charcoal">{member.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-stage-muted">Student ID · {member.studentId}</p>
                </div>
              </div>

              <div className="mt-5 border-t border-stage-border pt-5">
                <h4 className="font-bold text-stage-charcoal">Role</h4>
                <p className="mt-2 text-sm text-stage-charcoal">{member.role}</p>
                <h4 className="mt-4 font-bold text-stage-charcoal">Contribution</h4>
                <p className="mt-2 text-sm text-stage-charcoal">{member.contribution}</p>
              </div>

              <div className="mt-5 border-t border-stage-border pt-5">
                <h4 className="text-sm font-black uppercase tracking-wider text-stage-muted">Assigned words</h4>
              <p className="mt-2 text-sm font-semibold text-stage-charcoal">{assignedVocabulary.length} assigned vocabulary words</p>
              {assignedVocabulary.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {assignedVocabulary.map((item) => (
                    <li className="rounded-xl bg-stage-soft px-3 py-2 text-sm text-stage-charcoal" key={item.id}>
                      <span className="font-black" lang="ko">{item.korean}</span>
                      <span aria-hidden="true"> · </span>
                      <span>{item.english}</span>
                    </li>
                  ))}
                </ul>
              ) : <p className="mt-4 text-sm text-stage-muted">No assigned words yet.</p>}
              </div>

              <div className="mt-5 border-t border-stage-border pt-5">
                <h4 className="text-sm font-black uppercase tracking-wider text-stage-muted">Dialogue titles</h4>
                <p className="mt-2 text-sm text-stage-charcoal">
                  {dialogueTitles.length > 0 ? dialogueTitles.join(' · ') : 'No dialogue titles yet.'}
                </p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
