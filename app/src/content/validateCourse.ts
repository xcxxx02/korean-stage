import type { Course, CourseIssue, Exercise, MediaSource, Member } from './types'

type ValidationMode = 'development' | 'submission'

const issue = (
  code: CourseIssue['code'],
  severity: CourseIssue['severity'],
  message: string,
  identifiers: Pick<CourseIssue, 'memberId' | 'introductionModelId' | 'vocabularyId' | 'grammarId' | 'dialogueId'> = {},
): CourseIssue => ({ code, severity, message, ...identifiers })

const hasHumanMedia = (media: MediaSource) => media.kind === 'human-recording' && Boolean(media.src)

export const needsMemberIdentityReplacement = (member: Member) =>
  member.isDevelopmentIdentity || !member.name.trim() || !member.studentId.trim()

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
    if (needsMemberIdentityReplacement(member)) {
      issues.push(issue('member-details', requiredSeverity, 'Each member needs a real name and student ID.', { memberId: member.id }))
    }

    const recordingCount = course.vocabulary.filter((item) => item.ownerId === member.id).length
    if (recordingCount < 3 || recordingCount > 5) {
      issues.push(issue('member-vocabulary-count', 'error', 'Each member must own 3-5 recorded vocabulary items.', { memberId: member.id }))
    }
  }

  const courseMemberIds = new Set(course.members.map((member) => member.id))
  const requiredIntroductionModelIds = ['greeting', 'self-introduction']
  const introductionModelIds = new Set(course.introductionModels.map((model) => model.id))
  const hasExactIntroductionModels = course.introductionModels.length === requiredIntroductionModelIds.length
    && introductionModelIds.size === requiredIntroductionModelIds.length
    && requiredIntroductionModelIds.every((id) => introductionModelIds.has(id))
  if (!hasExactIntroductionModels) {
    issues.push(issue('introduction-model-structure', 'error', 'Unit 1 needs exactly one greeting and one self-introduction model.'))
  }

  for (const model of course.introductionModels) {
    const hasCompleteContent = [model.korean, model.english, model.romanization, model.pronunciationHint, model.audioLabel]
      .every((field) => field.trim())
    if (!hasCompleteContent || !courseMemberIds.has(model.ownerId)) {
      issues.push(issue('introduction-model-content', 'error', 'Each Unit 1 model needs complete bilingual guidance and an existing member owner.', {
        introductionModelId: model.id,
        memberId: model.ownerId,
      }))
    }

    if (!hasHumanMedia(model.audio)) {
      issues.push(issue('introduction-model-media', requiredSeverity, 'Each Unit 1 model needs human-recorded audio.', {
        introductionModelId: model.id,
        memberId: model.ownerId,
      }))
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

    for (const exercise of grammar.exercises) {
      if (exercise.type !== 'matching') continue
      const pairIds = new Set(exercise.pairs.map((pair) => pair.id))
      const koreanPrompts = new Set(exercise.pairs.map((pair) => pair.korean))
      const englishAnswers = new Set(exercise.pairs.map((pair) => pair.english))
      const hasCompletePairs = exercise.pairs.length >= 2
        && exercise.pairs.every((pair) => pair.id.trim() && pair.korean.trim() && pair.english.trim())
        && pairIds.size === exercise.pairs.length
        && koreanPrompts.size === exercise.pairs.length
        && englishAnswers.size === exercise.pairs.length
      if (!hasCompletePairs) {
        issues.push(issue('exercise-matching', 'error', 'Matching exercises need at least two complete pairs with unique IDs, Korean prompts, and English answers.', { grammarId: grammar.id }))
      }
    }
  }

  const exerciseModes = new Set(course.grammar.flatMap((grammar) => grammar.exercises.map((exercise) => exercise.type)))
  const requiredExerciseModes: Exercise['type'][] = ['multiple-choice', 'particle', 'matching', 'sentence-completion']
  if (!requiredExerciseModes.every((mode) => exerciseModes.has(mode))) {
    issues.push(issue('exercise-mode-coverage', 'error', 'Exercises must include multiple choice, particle selection, matching, and sentence completion.'))
  }

  if (course.dialogues.length < 2 || course.dialogues.length > 3) {
    issues.push(issue('dialogue-count', 'error', 'The course must have 2-3 dialogues.'))
  }

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

    const hasHumanDialogueVideo = hasHumanMedia(dialogue.video)
    if (!hasHumanDialogueVideo) {
      issues.push(issue('dialogue-video-media', requiredSeverity, 'Each dialogue needs a human-recorded video.', { dialogueId: dialogue.id }))
    }

    if (hasHumanDialogueVideo && (dialogue.video.durationSeconds === undefined || dialogue.video.durationSeconds < 60 || dialogue.video.durationSeconds > 180)) {
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
    ...course.introductionModels.map((model) => model.audio),
    ...course.vocabulary.flatMap((item) => [item.video, item.audio]),
    ...course.dialogues.flatMap((dialogue) => [dialogue.video, ...dialogue.lines.map((line) => line.audio)]),
  ]

  if (media.some((source) => source.kind === 'ai-generated')) {
    issues.push(issue('ai-voice-prohibited', 'prohibited', 'AI-generated media is prohibited.'))
  }

  return issues
}
