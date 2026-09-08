import type { Course, CourseIssue } from '../content/types'
import { validateCourse } from '../content/validateCourse'
import { appRouteManifest, type RouteManifestEntry, validatePrimaryNavigation } from '../navigation'

type SubmissionReadinessProps = {
  course: Course
  routes?: readonly RouteManifestEntry[]
}

type PassedCheck = {
  label: string
  issueCodes: Array<CourseIssue['code']>
}

const passedChecks: PassedCheck[] = [
  { label: 'Lec 1 source', issueCodes: ['source-lesson'] },
  { label: 'Website name', issueCodes: ['course-name'] },
  { label: 'Course purpose', issueCodes: ['course-purpose'] },
  { label: 'Unit 1 introduction models', issueCodes: ['introduction-model-structure', 'introduction-model-content', 'introduction-model-media'] },
  { label: 'Member vocabulary counts', issueCodes: ['member-vocabulary-count'] },
  { label: 'Bilingual vocabulary content', issueCodes: ['vocabulary-bilingual-fields', 'vocabulary-owner'] },
  { label: 'Grammar point count', issueCodes: ['grammar-count'] },
  { label: 'Exercises per grammar point', issueCodes: ['exercise-count', 'exercise-mode-coverage', 'exercise-matching'] },
  { label: 'Dialogue count', issueCodes: ['dialogue-count'] },
  { label: 'Dialogue speaker counts', issueCodes: ['dialogue-speaker-count'] },
  { label: 'Dialogue line counts', issueCodes: ['dialogue-line-count', 'dialogue-line-details', 'dialogue-line-speaker'] },
  { label: 'Dialogue video durations', issueCodes: ['dialogue-video-media', 'dialogue-video-duration'] },
  { label: 'Member dialogue participation', issueCodes: ['member-dialogue-participation'] },
]

const qualitativeChecks = [
  'Pronunciation accuracy',
  'Intonation',
  'Dialogue acting',
  'Video lighting',
  'Background noise',
  'Uninterrupted verbal flow',
]

const needsHumanMedia = (media: { kind: string, src: string | null }) => media.kind !== 'human-recording' || !media.src?.trim()

function joinWithAnd(names: string[]) {
  if (names.length > 2) return `${names.slice(0, -1).join(', ')}, and ${names.at(-1)}`
  if (names.length === 2) return `${names[0]} and ${names[1]}`
  return names[0]
}

function formatLineNumbers(numbers: number[]) {
  if (numbers.length === 1) return `line ${numbers[0]}`
  if (numbers.length === 2) return `lines ${numbers[0]} and ${numbers[1]}`
  return `lines ${numbers.slice(0, -1).join(', ')}, and ${numbers.at(-1)}`
}

function issueAction(course: Course, issue: CourseIssue) {
  const member = course.members.find((candidate) => candidate.id === issue.memberId)
  const vocabulary = course.vocabulary.find((candidate) => candidate.id === issue.vocabularyId)
  const introductionModel = course.introductionModels.find((candidate) => candidate.id === issue.introductionModelId)
  const grammar = course.grammar.find((candidate) => candidate.id === issue.grammarId)
  const dialogue = course.dialogues.find((candidate) => candidate.id === issue.dialogueId)
  const memberName = member?.fullName?.trim() || member?.name.trim() || member?.studentId.trim() || 'Unknown member'
  const vocabularyName = vocabulary ? `${vocabulary.korean} / ${vocabulary.english}` : 'Unknown vocabulary item'
  const grammarName = grammar ? `${grammar.korean} / ${grammar.englishFunction}` : 'Unknown grammar point'
  const dialogueName = dialogue?.title ?? 'Unknown dialogue'

  switch (issue.code) {
    case 'source-lesson': return 'Set the course source to Lec 1.'
    case 'course-name': return 'Use Korean Stage as the website name.'
    case 'course-purpose': return 'Add the website purpose.'
    case 'member-details': {
      if (!member || member.isDevelopmentIdentity) return `${memberName} — add a real name and student ID.`
      const missingFields = [
        ...(!member.name.trim() ? ['name'] : []),
        ...(!member.studentId.trim() ? ['student ID'] : []),
      ]
      return `${memberName} — add a real ${joinWithAnd(missingFields)}.`
    }
    case 'member-vocabulary-count': return `${memberName} — assign 3–5 recorded vocabulary items.`
    case 'introduction-model-structure': return 'Keep exactly two distinct Unit 1 models: greeting and self-introduction.'
    case 'introduction-model-content': {
      const modelName = issue.introductionModelId === 'greeting' ? 'Greeting model' : 'Self-introduction model'
      const missingFields = introductionModel
        ? [
            ...(!introductionModel.korean.trim() ? ['Korean'] : []),
            ...(!introductionModel.english.trim() ? ['English'] : []),
            ...(!introductionModel.romanization.trim() ? ['romanization'] : []),
            ...(!introductionModel.pronunciationHint.trim() ? ['pronunciation guidance'] : []),
            ...(!introductionModel.audioLabel.trim() ? ['audio label'] : []),
          ]
        : ['Korean', 'English', 'romanization', 'pronunciation guidance', 'audio label']
      const actions = [
        ...(missingFields.length > 0 ? [`add ${joinWithAnd(missingFields)}`] : []),
        ...(!member ? ['assign an existing member'] : []),
      ]
      return `${modelName} — ${joinWithAnd(actions)}.`
    }
    case 'introduction-model-media': return `${introductionModel?.korean ?? 'Unknown Unit 1 model'} / ${introductionModel?.english ?? 'Unknown meaning'} — ${memberName}: add human-recorded audio.`
    case 'vocabulary-bilingual-fields': return `${vocabularyName} — complete the Korean, English, romanization, and bilingual examples.`
    case 'vocabulary-owner': return `${vocabularyName} — assign an existing member only when the word is assessed and requires recording.`
    case 'vocabulary-media': {
      const missingMedia = vocabulary
        ? [
            ...(needsHumanMedia(vocabulary.video) ? ['video'] : []),
            ...(needsHumanMedia(vocabulary.audio) ? ['audio'] : []),
          ]
        : ['video', 'audio']
      return `${vocabularyName} — add human-recorded ${joinWithAnd(missingMedia)}.`
    }
    case 'grammar-count': return 'Keep exactly three grammar points.'
    case 'exercise-count': return `${grammarName} — keep exactly three exercises.`
    case 'exercise-mode-coverage': return 'Include multiple choice, particle selection, matching, and sentence completion across the nine exercises.'
    case 'exercise-matching': return `${grammarName} — add at least two complete, unique Korean-to-English matching pairs.`
    case 'dialogue-count': return 'Keep 2–3 dialogues.'
    case 'dialogue-speaker-count': return `${dialogueName} — include 2–3 speakers.`
    case 'dialogue-line-count': return `${dialogueName} — include 6–8 lines.`
    case 'dialogue-line-details': return `${dialogueName} — complete every speaker label and bilingual line.`
    case 'dialogue-line-speaker': return `${dialogueName} — use only declared team members as line speakers.`
    case 'dialogue-video-media': return `${dialogueName} — add a human-recorded dialogue video.`
    case 'dialogue-video-duration': return `${dialogueName} — keep the video between 60 and 180 seconds.`
    case 'dialogue-line-media': {
      const missingLineNumbers = dialogue?.lines.flatMap((line, index) => needsHumanMedia(line.audio) ? [index + 1] : []) ?? []
      return `${dialogueName} — add human-recorded audio to ${formatLineNumbers(missingLineNumbers)}.`
    }
    case 'member-dialogue-participation': return `${memberName} — add at least one dialogue speaking line.`
    case 'ai-voice-prohibited': return 'Remove every AI-generated voice before submission.'
    default: return issue.message
  }
}

export function SubmissionReadiness({ course, routes = appRouteManifest }: SubmissionReadinessProps) {
  const issues = validateCourse(course, 'development')
  const navigationIssues = validatePrimaryNavigation(routes)
  const issueCodes = new Set(issues.map((issue) => issue.code))
  const prohibitedIssues = issues.filter((issue) => issue.severity === 'prohibited')
  const contentIssues = issues.filter((issue) => issue.severity !== 'prohibited')
  const structurallyPassed = [
    ...passedChecks.filter((check) => check.issueCodes.every((code) => !issueCodes.has(code))),
    ...(navigationIssues.length === 0 ? [{ label: 'Primary navigation', issueCodes: [] }] : []),
  ]
  const isNotReady = issues.length > 0 || navigationIssues.length > 0

  return (
    <section aria-labelledby="readiness-heading" className="mt-14">
      <div className="rounded-t-xl border border-stage-vermilion bg-stage-vermilion-strong px-5 py-4 text-stage-white" role="alert">
        <p className="font-black">AI-generated voices receive 0 marks and must never be added.</p>
      </div>

      <div className="rounded-b-xl border-x border-b border-stage-border bg-stage-soft p-6 sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-stage-muted">Submission readiness</p>
        <h2 className="mt-2 text-3xl font-black text-stage-charcoal" id="readiness-heading">
          {isNotReady ? 'Not ready for submission' : 'Ready for human review'}
        </h2>
        <p className="mt-3 max-w-3xl text-stage-muted">
          Automated checks confirm structure and identify missing content. Qualitative performance always needs a person to review it.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <section aria-labelledby="passed-heading" className="rounded-xl border border-stage-jade bg-stage-white p-5">
            <h3 className="text-xl font-black text-stage-jade-strong" id="passed-heading">Passed</h3>
            <ul className="mt-4 space-y-3">
              {structurallyPassed.map((check) => (
                <li className="flex items-center justify-between gap-3 text-sm text-stage-charcoal" key={check.label}>
                  <span>{check.label}</span>
                  <span className="rounded-full bg-stage-jade-soft px-2 py-1 text-xs font-black text-stage-jade-strong">Passed</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="needs-content-heading" className="rounded-xl border border-stage-yellow bg-stage-white p-5 lg:col-span-2">
            <h3 className="text-xl font-black text-stage-yellow-strong" id="needs-content-heading">Needs content</h3>
            {contentIssues.length > 0 || navigationIssues.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {contentIssues.map((contentIssue, index) => (
                  <li className="rounded-xl bg-stage-yellow-soft px-4 py-3 text-sm font-semibold text-stage-charcoal" key={`${contentIssue.code}-${contentIssue.introductionModelId ?? contentIssue.memberId ?? contentIssue.vocabularyId ?? contentIssue.grammarId ?? contentIssue.dialogueId ?? index}`}>
                    {issueAction(course, contentIssue)}
                  </li>
                ))}
                {navigationIssues.map((navigationIssue) => (
                  <li className="rounded-xl bg-stage-yellow-soft px-4 py-3 text-sm font-semibold text-stage-charcoal" key={`navigation-${navigationIssue.id}`}>
                    {navigationIssue.message}
                  </li>
                ))}
              </ul>
            ) : <p className="mt-4 text-sm text-stage-muted">No automated content gaps detected.</p>}

            <h4 className="mt-7 border-t border-stage-border pt-5 font-black text-stage-charcoal">Qualitative checks</h4>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {qualitativeChecks.map((check) => (
                <li className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-stage-soft px-4 py-3 text-sm" key={check}>
                  <span className="font-semibold text-stage-charcoal">{check}</span>
                  <span className="rounded-full bg-stage-disabled px-2 py-1 text-xs font-black text-stage-muted">Human review required</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="prohibited-heading" className="rounded-xl border border-stage-vermilion bg-stage-white p-5 lg:col-span-3">
            <h3 className="text-xl font-black text-stage-vermilion-strong" id="prohibited-heading">Prohibited</h3>
            {prohibitedIssues.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {prohibitedIssues.map((prohibitedIssue, index) => (
                  <li className="rounded-xl bg-stage-vermilion-soft px-4 py-3 text-sm font-bold text-stage-vermilion-strong" key={`${prohibitedIssue.code}-${index}`}>
                    {issueAction(course, prohibitedIssue)}
                  </li>
                ))}
              </ul>
            ) : <p className="mt-3 text-sm text-stage-muted">No prohibited media detected. Keep all voices human-recorded.</p>}
          </section>
        </div>
      </div>
    </section>
  )
}
