import type { Course } from '../content/types'

type TeamGridProps = {
  course: Course
}

export function TeamGrid({ course }: TeamGridProps) {
  return (
    <section aria-labelledby="team-contributions-heading" className="mt-10">
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-blue-700">Source · {course.sourceLesson}</p>
        <h2 className="mt-2 text-2xl font-black text-slate-950" id="team-contributions-heading">Team contributions</h2>
        <p className="mt-3 max-w-4xl text-slate-700">{course.purpose}</p>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {course.members.map((member) => {
          const assignedVocabulary = course.vocabulary.filter((item) => item.ownerId === member.id)
          const vocabularyCountPasses = assignedVocabulary.length >= 3 && assignedVocabulary.length <= 5
          const dialogueTitles = course.dialogues
            .filter((dialogue) => dialogue.lines.some((line) => line.speakerId === member.id))
            .map((dialogue) => dialogue.title)

          return (
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" key={member.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-black text-slate-950">{member.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-slate-600">Student ID · {member.studentId}</p>
                </div>
                {member.isDevelopmentIdentity ? (
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-900">
                    Replace before submission
                  </span>
                ) : null}
              </div>

              <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-200 pt-5">
                <span className="font-bold text-slate-800">Assigned words</span>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${vocabularyCountPasses ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                  {assignedVocabulary.length} · {vocabularyCountPasses ? '3–5 count passed' : 'Needs 3–5'}
                </span>
              </div>

              {assignedVocabulary.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {assignedVocabulary.map((item) => (
                    <li className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-800" key={item.id}>
                      <span className="font-black" lang="ko">{item.korean}</span>
                      <span aria-hidden="true"> · </span>
                      <span>{item.english}</span>
                    </li>
                  ))}
                </ul>
              ) : <p className="mt-4 text-sm text-rose-700">No vocabulary assigned yet.</p>}

              <div className="mt-5 border-t border-slate-200 pt-5">
                <h4 className="text-sm font-black uppercase tracking-wider text-slate-600">Dialogue participation</h4>
                <p className="mt-2 text-sm text-slate-800">
                  {dialogueTitles.length > 0 ? dialogueTitles.join(' · ') : 'No speaking lines assigned yet.'}
                </p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
