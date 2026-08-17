import type { Course, CourseIssue } from '../content/types'
import { validateCourse } from '../content/validateCourse'

type SubmissionReadinessProps = {
  course: Course
}

type PassedCheck = {
  label: string
  issueCodes: string[]
}

const passedChecks: PassedCheck[] = [
  { label: 'Lec 1 source', issueCodes: ['source-lesson'] },
  { label: 'Website name', issueCodes: ['course-name'] },
  { label: 'Course purpose', issueCodes: ['course-purpose'] },
  { label: 'Member vocabulary counts', issueCodes: ['member-vocabulary-count'] },
  { label: 'Bilingual vocabulary content', issueCodes: ['vocabulary-bilingual-fields'] },
  { label: 'Grammar point count', issueCodes: ['grammar-count'] },
  { label: 'Exercises per grammar point', issueCodes: ['exercise-count'] },
  { label: 'Dialogue count', issueCodes: ['dialogue-count'] },
  { label: 'Dialogue speaker counts', issueCodes: ['dialogue-speaker-count'] },
  { label: 'Dialogue line counts', issueCodes: ['dialogue-line-count', 'dialogue-line-details', 'dialogue-line-speaker'] },
  { label: 'Dialogue video durations', issueCodes: ['dialogue-video-duration'] },
  { label: 'Member dialogue participation', issueCodes: ['member-dialogue-participation'] },
  { label: 'Primary navigation', issueCodes: [] },
]

const qualitativeChecks = ['Pronunciation accuracy', 'Dialogue acting', 'Video lighting', 'Background noise']

function issueAction(course: Course, issue: CourseIssue) {
  const member = course.members.find((candidate) => candidate.id === issue.memberId)
  const vocabulary = course.vocabulary.find((candidate) => candidate.id === issue.vocabularyId)
  const grammar = course.grammar.find((candidate) => candidate.id === issue.grammarId)
  const dialogue = course.dialogues.find((candidate) => candidate.id === issue.dialogueId)
  const memberName = member?.name ?? 'Unknown member'
  const vocabularyName = vocabulary ? `${vocabulary.korean} / ${vocabulary.english}` : 'Unknown vocabulary item'
  const grammarName = grammar ? `${grammar.korean} / ${grammar.englishFunction}` : 'Unknown grammar point'
  const dialogueName = dialogue?.title ?? 'Unknown dialogue'

  switch (issue.code) {
    case 'source-lesson': return 'Set the course source to Lec 1.'
    case 'course-name': return 'Use Korean Stage as the website name.'
    case 'course-purpose': return 'Add the website purpose.'
    case 'member-details': return `${memberName} — add a real name and student ID.`
    case 'member-vocabulary-count': return `${memberName} — assign 3–5 recorded vocabulary items.`
    case 'vocabulary-bilingual-fields': return `${vocabularyName} — complete the Korean, English, romanization, and bilingual examples.`
    case 'vocabulary-media': return `${vocabularyName} — add human-recorded video and audio.`
    case 'grammar-count': return 'Keep exactly three grammar points.'
    case 'exercise-count': return `${grammarName} — keep exactly three exercises.`
    case 'dialogue-count': return 'Keep 2–3 dialogues.'
    case 'dialogue-speaker-count': return `${dialogueName} — include 2–3 speakers.`
    case 'dialogue-line-count': return `${dialogueName} — include 6–8 lines.`
    case 'dialogue-line-details': return `${dialogueName} — complete every speaker label and bilingual line.`
    case 'dialogue-line-speaker': return `${dialogueName} — use only declared team members as line speakers.`
    case 'dialogue-video-media': return `${dialogueName} — add a human-recorded dialogue video.`
    case 'dialogue-video-duration': return `${dialogueName} — keep the video between 60 and 180 seconds.`
    case 'dialogue-line-media': return `${dialogueName} — add human-recorded audio to every dialogue line.`
    case 'member-dialogue-participation': return `${memberName} — add at least one dialogue speaking line.`
    case 'ai-voice-prohibited': return 'Remove every AI-generated voice before submission.'
    default: return issue.message
  }
}

export function SubmissionReadiness({ course }: SubmissionReadinessProps) {
  const issues = validateCourse(course, 'development')
  const issueCodes = new Set(issues.map((issue) => issue.code))
  const prohibitedIssues = issues.filter((issue) => issue.severity === 'prohibited')
  const contentIssues = issues.filter((issue) => issue.severity !== 'prohibited')
  const structurallyPassed = passedChecks.filter((check) => check.issueCodes.every((code) => !issueCodes.has(code)))
  const isNotReady = issues.length > 0

  return (
    <section aria-labelledby="readiness-heading" className="mt-14">
      <div className="rounded-t-2xl border border-rose-300 bg-rose-700 px-5 py-4 text-white" role="alert">
        <p className="font-black">AI-generated voices receive 0 marks and must never be added.</p>
      </div>

      <div className="rounded-b-2xl border-x border-b border-slate-200 bg-slate-50 p-6 sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-slate-600">Submission readiness</p>
        <h2 className="mt-2 text-3xl font-black text-slate-950" id="readiness-heading">
          {isNotReady ? 'Not ready for submission' : 'Ready for human review'}
        </h2>
        <p className="mt-3 max-w-3xl text-slate-700">
          Automated checks confirm structure and identify missing content. Qualitative performance always needs a person to review it.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <section aria-labelledby="passed-heading" className="rounded-xl border border-emerald-200 bg-white p-5">
            <h3 className="text-xl font-black text-emerald-800" id="passed-heading">Passed</h3>
            <ul className="mt-4 space-y-3">
              {structurallyPassed.map((check) => (
                <li className="flex items-center justify-between gap-3 text-sm text-slate-800" key={check.label}>
                  <span>{check.label}</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-black text-emerald-800">Passed</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="needs-content-heading" className="rounded-xl border border-amber-200 bg-white p-5 lg:col-span-2">
            <h3 className="text-xl font-black text-amber-900" id="needs-content-heading">Needs content</h3>
            {contentIssues.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {contentIssues.map((contentIssue, index) => (
                  <li className="rounded-lg bg-amber-50 px-4 py-3 text-sm font-semibold text-slate-900" key={`${contentIssue.code}-${contentIssue.memberId ?? contentIssue.vocabularyId ?? contentIssue.grammarId ?? contentIssue.dialogueId ?? index}`}>
                    {issueAction(course, contentIssue)}
                  </li>
                ))}
              </ul>
            ) : <p className="mt-4 text-sm text-slate-700">No automated content gaps detected.</p>}

            <h4 className="mt-7 border-t border-slate-200 pt-5 font-black text-slate-900">Qualitative checks</h4>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {qualitativeChecks.map((check) => (
                <li className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-100 px-4 py-3 text-sm" key={check}>
                  <span className="font-semibold text-slate-800">{check}</span>
                  <span className="rounded-full bg-slate-200 px-2 py-1 text-xs font-black text-slate-700">Human review required</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="prohibited-heading" className="rounded-xl border border-rose-200 bg-white p-5 lg:col-span-3">
            <h3 className="text-xl font-black text-rose-800" id="prohibited-heading">Prohibited</h3>
            {prohibitedIssues.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {prohibitedIssues.map((prohibitedIssue, index) => (
                  <li className="rounded-lg bg-rose-50 px-4 py-3 text-sm font-bold text-rose-900" key={`${prohibitedIssue.code}-${index}`}>
                    {issueAction(course, prohibitedIssue)}
                  </li>
                ))}
              </ul>
            ) : <p className="mt-3 text-sm text-slate-700">No prohibited media detected. Keep all voices human-recorded.</p>}
          </section>
        </div>
      </div>
    </section>
  )
}
