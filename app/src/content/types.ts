export type MediaSource = {
  src: string | null
  captionSrc?: string | null
  kind: 'human-recording' | 'development-missing' | 'ai-generated'
  durationSeconds?: number
}

export type CourseIssueCode =
  | 'source-lesson'
  | 'course-name'
  | 'course-purpose'
  | 'member-details'
  | 'member-vocabulary-count'
  | 'introduction-model-structure'
  | 'introduction-model-content'
  | 'introduction-model-media'
  | 'vocabulary-bilingual-fields'
  | 'vocabulary-media'
  | 'grammar-count'
  | 'exercise-count'
  | 'exercise-matching'
  | 'exercise-mode-coverage'
  | 'dialogue-count'
  | 'dialogue-speaker-count'
  | 'dialogue-line-count'
  | 'dialogue-line-details'
  | 'dialogue-line-speaker'
  | 'dialogue-video-media'
  | 'dialogue-video-duration'
  | 'dialogue-line-media'
  | 'member-dialogue-participation'
  | 'ai-voice-prohibited'

export type CourseIssue = {
  code: CourseIssueCode
  severity: 'warning' | 'error' | 'prohibited'
  message: string
  memberId?: string
  introductionModelId?: string
  vocabularyId?: string
  grammarId?: string
  dialogueId?: string
}

export type Member = {
  id: string
  name: string
  studentId: string
  isDevelopmentIdentity: boolean
  role: string
  contribution: string
}

export type CourseLesson = {
  id: `unit-${1 | 2 | 3 | 4 | 5 | 6 | 7}`
  slug: `lesson-${1 | 2 | 3 | 4 | 5 | 6 | 7}`
  title: string
}

export type LessonSlug = CourseLesson['slug']

export type VocabularyItem = {
  id: string
  unitId: 'unit-2' | 'unit-3'
  korean: string
  english: string
  romanization: string
  pronunciationHint?: string
  koreanExample: string
  englishExample: string
  ownerId: string | null
  video: MediaSource
  audio: MediaSource
}

export type IntroductionModel = {
  id: string
  korean: string
  english: string
  romanization: string
  pronunciationHint: string
  ownerId: string
  audioLabel: string
  audio: MediaSource
}

type ExerciseBase = {
  id: string
  grammarId: string
  answerLanguage: 'en' | 'ko'
  prompt: string
  koreanContext: string
  explanation: string
}

export type ChoiceExercise = ExerciseBase & {
  type: 'multiple-choice' | 'particle' | 'sentence-completion'
  choices: string[]
  answer: string
}

export type MatchingPair = {
  id: string
  korean: string
  english: string
}

export type MatchingExercise = ExerciseBase & {
  type: 'matching'
  pairs: MatchingPair[]
}

export type Exercise = ChoiceExercise | MatchingExercise

export type ExerciseAnswer = string | Record<string, string>

export type GrammarPoint = {
  id: string
  unitId: 'unit-4' | 'unit-5' | 'unit-6'
  korean: string
  englishFunction: string
  explanation: string
  rules: string[]
  examples: Array<{ korean: string; english: string }>
  exercises: Exercise[]
}

export type DialogueLine = {
  id: string
  speakerId: string
  korean: string
  english: string
  audio: MediaSource
}

export type Dialogue = {
  id: string
  title: string
  scenario: string
  speakerIds: string[]
  lines: DialogueLine[]
  video: MediaSource
}

export type Course = {
  sourceLesson: 'Lec 1'
  name: 'Korean Stage'
  purpose: string
  members: Member[]
  introductionModels: IntroductionModel[]
  vocabulary: VocabularyItem[]
  grammar: GrammarPoint[]
  dialogues: Dialogue[]
}
