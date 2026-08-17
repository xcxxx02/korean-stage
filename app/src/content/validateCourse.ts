import type { Course, CourseIssue, MediaSource } from './types'

type ValidationMode = 'development' | 'submission'

const issue = (
  code: string,
  severity: CourseIssue['severity'],
  message: string,
  identifiers: Pick<CourseIssue, 'memberId' | 'vocabularyId' | 'grammarId' | 'dialogueId'> = {},
): CourseIssue => ({ code, severity, message, ...identifiers })

const hasHumanMedia = (media: MediaSource) => media.kind === 'human-recording' && Boolean(media.src)

export function validateCourse(course: Course, mode: ValidationMode = 'submission'): CourseIssue[] {
  const issues: CourseIssue[] = []
  const requiredSeverity: CourseIssue['severity'] = mode === 'development' ? 'warning' : 'error'

  if (course.sourceLesson !== 'Lec 1') {
    issues.push(issue('source-lesson', 'error', 'The course source must be Lec 1.'))
  }

  if (course.name !== 'Korean Stage') {
    issues.push(issue('course-name', 'error', 'The website name must be Korean Stage.'))
  }

  if (!course.purpose.trim()) {
    issues.push(issue('course-purpose', 'error', 'The website purpose is required.'))
  }

  for (const member of course.members) {
    if (member.isDevelopmentIdentity || !member.name.trim() || !member.studentId.trim()) {
      issues.push(issue('member-details', requiredSeverity, 'Each member needs a real name and student ID.', { memberId: member.id }))
    }

    const recordingCount = course.vocabulary.filter((item) => item.ownerId === member.id).length
    if (recordingCount < 3 || recordingCount > 5) {
      issues.push(issue('member-vocabulary-count', 'error', 'Each member must own 3-5 recorded vocabulary items.', { memberId: member.id }))
    }
  }

  for (const vocabulary of course.vocabulary) {
    if (![vocabulary.korean, vocabulary.english, vocabulary.koreanExample, vocabulary.englishExample, vocabulary.romanization].every((field) => field.trim())) {
      issues.push(issue('vocabulary-bilingual-fields', 'error', 'Vocabulary needs Korean, English, romanization, and bilingual examples.', { vocabularyId: vocabulary.id }))
    }

    if (vocabulary.ownerId !== null && (!hasHumanMedia(vocabulary.video) || !hasHumanMedia(vocabulary.audio))) {
      issues.push(issue('vocabulary-media', requiredSeverity, 'Recorded vocabulary needs human video and audio.', { vocabularyId: vocabulary.id }))
    }
  }

  if (course.grammar.length !== 3) {
    issues.push(issue('grammar-count', 'error', 'The course must have exactly three grammar points.'))
  }

  for (const grammar of course.grammar) {
    if (grammar.exercises.length !== 3) {
      issues.push(issue('exercise-count', 'error', 'Each grammar point must have exactly 3 exercises.', { grammarId: grammar.id }))
    }
  }

  if (course.dialogues.length < 2 || course.dialogues.length > 3) {
    issues.push(issue('dialogue-count', 'error', 'The course must have 2-3 dialogues.'))
  }

  const courseMemberIds = new Set(course.members.map((member) => member.id))
  const participatingMemberIds = new Set<string>()
  for (const dialogue of course.dialogues) {
    if (dialogue.speakerIds.length < 2 || dialogue.speakerIds.length > 3) {
      issues.push(issue('dialogue-speaker-count', 'error', 'Each dialogue must have 2-3 speakers.', { dialogueId: dialogue.id }))
    }

    if (dialogue.lines.length < 6 || dialogue.lines.length > 8) {
      issues.push(issue('dialogue-line-count', 'error', 'Each dialogue must have 6-8 lines.', { dialogueId: dialogue.id }))
    }

    if (dialogue.lines.some((line) => !line.speakerId.trim() || !line.korean.trim() || !line.english.trim())) {
      issues.push(issue('dialogue-line-details', 'error', 'Every dialogue line needs a speaker label, Korean text, and English translation.', { dialogueId: dialogue.id }))
    }

    if (dialogue.lines.some((line) => !dialogue.speakerIds.includes(line.speakerId) || !courseMemberIds.has(line.speakerId))) {
      issues.push(issue('dialogue-line-speaker', 'error', 'Every dialogue line speaker must be declared for the dialogue and exist in the course.', { dialogueId: dialogue.id }))
    }

    for (const line of dialogue.lines) {
      if (courseMemberIds.has(line.speakerId)) {
        participatingMemberIds.add(line.speakerId)
      }
    }

    if (!hasHumanMedia(dialogue.video)) {
      issues.push(issue('dialogue-video-media', requiredSeverity, 'Each dialogue needs a human-recorded video.', { dialogueId: dialogue.id }))
    }

    if (dialogue.video.durationSeconds === undefined || dialogue.video.durationSeconds < 60 || dialogue.video.durationSeconds > 180) {
      issues.push(issue('dialogue-video-duration', 'error', 'Dialogue videos must be 60-180 seconds long.', { dialogueId: dialogue.id }))
    }

    if (dialogue.lines.some((line) => !hasHumanMedia(line.audio))) {
      issues.push(issue('dialogue-line-media', requiredSeverity, 'Each dialogue line needs human-recorded audio.', { dialogueId: dialogue.id }))
    }
  }

  for (const member of course.members) {
    if (!participatingMemberIds.has(member.id)) {
      issues.push(issue('member-dialogue-participation', 'error', 'Each member must participate in a dialogue.', { memberId: member.id }))
    }
  }

  const media: MediaSource[] = [
    ...course.vocabulary.flatMap((item) => [item.video, item.audio]),
    ...course.dialogues.flatMap((dialogue) => [dialogue.video, ...dialogue.lines.map((line) => line.audio)]),
  ]

  if (media.some((source) => source.kind === 'ai-generated')) {
    issues.push(issue('ai-voice-prohibited', 'prohibited', 'AI-generated media is prohibited.'))
  }

  return issues
}
