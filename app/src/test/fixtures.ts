import type { Course, Exercise, MediaSource } from '../content/types'

const humanMedia = (src: string, durationSeconds?: number): MediaSource => ({
  src,
  kind: 'human-recording',
  ...(durationSeconds === undefined ? {} : { durationSeconds }),
})

export const validCourse: Course = {
  sourceLesson: 'Lec 1',
  name: 'Korean Stage',
  purpose: 'A beginner-friendly Korean course adapted from Lec 1.',
  members: [
    { id: 'member-1', name: 'Amina Rahman', studentId: 'A12345', isDevelopmentIdentity: false, role: 'Vocabulary presenter', contribution: 'Presents vocabulary and performs dialogue lines.' },
    { id: 'member-2', name: 'Daniel Lee', studentId: 'B67890', isDevelopmentIdentity: false, role: 'Dialogue performer', contribution: 'Presents vocabulary and performs dialogue lines.' },
  ],
  introductionModels: [
    {
      id: 'greeting',
      korean: '안녕하세요?',
      english: 'Hello.',
      romanization: 'annyeonghaseyo?',
      pronunciationHint: 'an-nyeong-ha-se-yo',
      ownerId: 'member-1',
      audioLabel: 'Listen to Amina greeting',
      audio: humanMedia('/media/introduction/greeting.mp3'),
    },
    {
      id: 'self-introduction',
      korean: '저는 다니엘이에요.',
      english: 'I am Daniel.',
      romanization: 'jeoneun danierieyo.',
      pronunciationHint: 'juh-nuhn da-nee-el-ee-eh-yo',
      ownerId: 'member-2',
      audioLabel: 'Listen to Daniel self-introduction',
      audio: humanMedia('/media/introduction/self-introduction.mp3'),
    },
  ],
  vocabulary: [
    ...['word-1', 'word-2', 'word-3', 'word-4'].map((id, index) => ({
      id,
      unitId: 'unit-3' as const,
      korean: `한국어 ${index + 1}`,
      english: `Word ${index + 1}`,
      romanization: `word-${index + 1}`,
      koreanExample: `저는 한국어 ${index + 1}이에요.`,
      englishExample: `I am word ${index + 1}.`,
      ownerId: 'member-1',
      video: humanMedia(`/media/vocabulary/${id}.mp4`),
      audio: humanMedia(`/media/vocabulary/${id}.mp3`),
    })),
    ...['word-5', 'word-6', 'word-7', 'word-8'].map((id, index) => ({
      id,
      unitId: 'unit-3' as const,
      korean: `한국어 ${index + 5}`,
      english: `Word ${index + 5}`,
      romanization: `word-${index + 5}`,
      koreanExample: `저는 한국어 ${index + 5}이에요.`,
      englishExample: `I am word ${index + 5}.`,
      ownerId: 'member-2',
      video: humanMedia(`/media/vocabulary/${id}.mp4`),
      audio: humanMedia(`/media/vocabulary/${id}.mp3`),
    })),
  ],
  grammar: ['grammar-1', 'grammar-2', 'grammar-3'].map((id, grammarIndex) => ({
    id,
    unitId: (`unit-${grammarIndex + 4}` as 'unit-4' | 'unit-5' | 'unit-6'),
    korean: `문법 ${grammarIndex + 1}`,
    englishFunction: `Grammar ${grammarIndex + 1}`,
    explanation: 'A clear explanation.',
    rules: ['A useful rule.'],
    examples: [{ korean: '예문이에요.', english: 'This is an example.' }],
    exercises: ['1', '2', '3'].map((number): Exercise => {
      if (grammarIndex === 0 && number === '3') {
        return {
          id: `${id}-exercise-${number}`,
          grammarId: id,
          type: 'matching',
          prompt: 'Match each sentence.',
          koreanContext: '문장을 연결하세요.',
          pairs: [
            { id: 'student', korean: '학생이에요.', english: 'I am a student.' },
            { id: 'teacher', korean: '선생님이에요.', english: 'I am a teacher.' },
          ],
          explanation: 'Match each Korean sentence with its English meaning.',
        }
      }

      return {
        id: `${id}-exercise-${number}`,
        grammarId: id,
        type: grammarIndex === 0 ? 'sentence-completion' : grammarIndex === 1 ? 'particle' : 'multiple-choice',
        prompt: 'Choose the correct answer.',
        koreanContext: '문장을 완성하세요.',
        choices: ['정답'],
        answer: '정답',
        explanation: 'This is the correct answer.',
      }
    }),
  })),
  dialogues: ['dialogue-1', 'dialogue-2'].map((id) => ({
    id,
    title: `Dialogue ${id.slice(-1)}`,
    scenario: 'Practising a beginner Korean conversation.',
    speakerIds: ['member-1', 'member-2'],
    lines: Array.from({ length: 8 }, (_, index) => ({
      id: `${id}-line-${index + 1}`,
      speakerId: index % 2 === 0 ? 'member-1' : 'member-2',
      korean: `한국어 대사 ${index + 1}`,
      english: `English line ${index + 1}`,
      audio: humanMedia(`/media/dialogues/${id}-line-${index + 1}.mp3`),
    })),
    video: humanMedia(`/media/dialogues/${id}.mp4`, 90),
  })),
}

export const courseWithTwoWordsForMember: Course = {
  ...validCourse,
  vocabulary: validCourse.vocabulary.filter((item) => item.ownerId !== 'member-1' || item.id === 'word-1' || item.id === 'word-2'),
}

export const courseWithFiveLineDialogue: Course = {
  ...validCourse,
  dialogues: validCourse.dialogues.map((dialogue) =>
    dialogue.id === 'dialogue-1' ? { ...dialogue, lines: dialogue.lines.slice(0, 5) } : dialogue,
  ),
}

export const courseWithAiVoice: Course = {
  ...validCourse,
  vocabulary: validCourse.vocabulary.map((item) =>
    item.id === 'word-1' ? { ...item, audio: { ...item.audio, kind: 'ai-generated' } } : item,
  ),
}
