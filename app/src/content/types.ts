export type MediaSource = {
  src: string | null
  captionSrc?: string | null
  kind: 'human-recording' | 'development-missing' | 'ai-generated'
  durationSeconds?: number
}

export type CourseIssue = {
  code: string
  severity: 'warning' | 'error' | 'prohibited'
  message: string
  memberId?: string
  vocabularyId?: string
  grammarId?: string
  dialogueId?: string
}

export type Member = {
  id: string
  name: string
  studentId: string
  isDevelopmentIdentity: boolean
}

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

export type Exercise = {
  id: string
  grammarId: string
  type: 'multiple-choice' | 'particle' | 'sentence-completion'
  prompt: string
  koreanContext: string
  choices: string[]
  answer: string
  explanation: string
}

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
  speakerIds: string[]
  lines: DialogueLine[]
  video: MediaSource
}

export type Course = {
  sourceLesson: 'Lec 1'
  name: 'Korean Stage'
  purpose: string
  members: Member[]
  vocabulary: VocabularyItem[]
  grammar: GrammarPoint[]
  dialogues: Dialogue[]
}
