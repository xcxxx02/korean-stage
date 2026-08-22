import type { Course } from '../content/types'
import { needsMemberIdentityReplacement } from '../content/validateCourse'

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
          const assignedVocabulary = course.vocabulary.filter((item) => item.ownerId === member.id)
          const vocabularyCountPasses = assignedVocabulary.length >= 3 && assignedVocabulary.length <= 5
          const dialogueTitles = course.dialogues
            .filter((dialogue) => dialogue.lines.some((line) => line.speakerId === member.id))
            .map((dialogue) => dialogue.title)

          return (
            <article aria-label={`${member.name.trim() || 'Unnamed member'} contribution`} className="rounded-xl border border-stage-border bg-stage-white p-6" key={member.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-black text-stage-charcoal">{member.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-stage-muted">Student ID · {member.studentId}</p>
                </div>
                {needsMemberIdentityReplacement(member) ? (
                  <span className="rounded-full bg-stage-yellow-soft px-3 py-1 text-xs font-black text-stage-yellow-strong">
                    Replace before submission
                  </span>
                ) : null}
              </div>

              <div className="mt-5 flex items-center justify-between gap-3 border-t border-stage-border pt-5">
                <span className="font-bold text-stage-charcoal">Assigned words</span>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${vocabularyCountPasses ? 'bg-stage-jade-soft text-stage-jade-strong' : 'bg-stage-vermilion-soft text-stage-vermilion-strong'}`}>
                  {assignedVocabulary.length} · {vocabularyCountPasses ? '3–5 count passed' : 'Needs 3–5'}
                </span>
              </div>

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
              ) : <p className="mt-4 text-sm text-stage-vermilion-strong">No vocabulary assigned yet. Assign 3–5 words to this member.</p>}

              <div className="mt-5 border-t border-stage-border pt-5">
                <h4 className="text-sm font-black uppercase tracking-wider text-stage-muted">Dialogue participation</h4>
                <p className="mt-2 text-sm text-stage-charcoal">
                  {dialogueTitles.length > 0 ? dialogueTitles.join(' · ') : 'No speaking lines assigned yet. Add this member to a dialogue.'}
                </p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
