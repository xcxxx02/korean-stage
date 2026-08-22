import { describe, expect, it } from 'vitest'
import {
  courseWithAiVoice,
  courseWithFiveLineDialogue,
  courseWithTwoWordsForMember,
  validCourse,
} from '../test/fixtures'
import { course } from './course'
import { validateCourse } from './validateCourse'

describe('validateCourse', () => {
  it('accepts a complete submission course', () => {
    expect(validateCourse(validCourse)).toEqual([])
  })

  it('reports a member with fewer than three recorded vocabulary items', () => {
    expect(validateCourse(courseWithTwoWordsForMember)).toContainEqual(
      expect.objectContaining({ code: 'member-vocabulary-count', memberId: 'member-1' }),
    )
  })

  it('reports a dialogue with fewer than six lines', () => {
    expect(validateCourse(courseWithFiveLineDialogue)).toContainEqual(
      expect.objectContaining({ code: 'dialogue-line-count', dialogueId: 'dialogue-1' }),
    )
  })

  it('prohibits AI-generated voice media', () => {
    expect(validateCourse(courseWithAiVoice)).toContainEqual(
      expect.objectContaining({ code: 'ai-voice-prohibited' }),
    )
  })

  it.each([
    ['missing', { src: null, kind: 'development-missing' as const }],
    ['AI-generated', { src: '/media/introduction/ai.mp3', kind: 'ai-generated' as const }],
    ['inconsistent development', { src: '/media/introduction/placeholder.mp3', kind: 'development-missing' as const }],
  ])('requires human-recorded audio for an introduction model with %s media', (_label, audio) => {
    const invalidCourse = {
      ...validCourse,
      introductionModels: [
        { ...validCourse.introductionModels[0], audio },
        validCourse.introductionModels[1],
      ],
    }

    expect(validateCourse(invalidCourse)).toContainEqual(expect.objectContaining({
      code: 'introduction-model-media',
      introductionModelId: 'greeting',
      memberId: 'member-1',
      severity: 'error',
    }))
    expect(validateCourse(invalidCourse, 'development')).toContainEqual(expect.objectContaining({
      code: 'introduction-model-media',
      introductionModelId: 'greeting',
      memberId: 'member-1',
      severity: 'warning',
    }))
  })

  it('keeps the global AI prohibition alongside the introduction-model media issue', () => {
    const invalidCourse = {
      ...validCourse,
      introductionModels: validCourse.introductionModels.map((model, index) => index === 0
        ? { ...model, audio: { src: '/media/introduction/ai.mp3', kind: 'ai-generated' as const } }
        : model),
    }

    expect(validateCourse(invalidCourse)).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'introduction-model-media', introductionModelId: 'greeting' }),
      expect.objectContaining({ code: 'ai-voice-prohibited', severity: 'prohibited' }),
    ]))
  })

  it('reports incorrect course metadata and missing member details', () => {
    const invalidCourse = {
      ...validCourse,
      sourceLesson: 'Lec 2' as never,
      name: 'Another Korean Course' as never,
      purpose: '',
      members: [{ ...validCourse.members[0], name: '', studentId: '', isDevelopmentIdentity: true }, validCourse.members[1]],
    }

    expect(validateCourse(invalidCourse)).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'source-lesson' }),
      expect.objectContaining({ code: 'course-name' }),
      expect.objectContaining({ code: 'course-purpose' }),
      expect.objectContaining({ code: 'member-details', memberId: 'member-1', severity: 'error' }),
    ]))
    expect(validateCourse(invalidCourse, 'development')).toContainEqual(
      expect.objectContaining({ code: 'member-details', memberId: 'member-1', severity: 'warning' }),
    )
  })

  it('requires bilingual fields and human media only for recorded vocabulary', () => {
    const invalidCourse = {
      ...validCourse,
      vocabulary: [
        {
          ...validCourse.vocabulary[0],
          korean: '',
          english: '',
          koreanExample: '',
          englishExample: '',
          video: { src: null, kind: 'development-missing' as const },
          audio: { src: null, kind: 'development-missing' as const },
        },
        {
          ...validCourse.vocabulary[1],
          ownerId: null,
          video: { src: null, kind: 'development-missing' as const },
          audio: { src: null, kind: 'development-missing' as const },
        },
        ...validCourse.vocabulary.slice(2),
      ],
    }

    expect(validateCourse(invalidCourse)).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'vocabulary-bilingual-fields', vocabularyId: 'word-1' }),
      expect.objectContaining({ code: 'vocabulary-media', vocabularyId: 'word-1', severity: 'error' }),
    ]))
    expect(validateCourse(invalidCourse)).not.toContainEqual(
      expect.objectContaining({ code: 'vocabulary-media', vocabularyId: 'word-2' }),
    )
    expect(validateCourse(invalidCourse, 'development')).toContainEqual(
      expect.objectContaining({ code: 'vocabulary-media', vocabularyId: 'word-1', severity: 'warning' }),
    )
  })

  it('reports invalid grammar and dialogue coursework limits', () => {
    const invalidCourse = {
      ...validCourse,
      grammar: validCourse.grammar.slice(0, 2).map((grammar) => ({ ...grammar, exercises: grammar.exercises.slice(0, 1) })),
      dialogues: [{
        ...validCourse.dialogues[0],
        speakerIds: ['member-1'],
        lines: validCourse.dialogues[0].lines.map((line, index) => index === 0 ? { ...line, speakerId: '', korean: '', english: '' } : line),
        video: { ...validCourse.dialogues[0].video, durationSeconds: 45 },
      }],
    }

    expect(validateCourse(invalidCourse)).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: 'grammar-count' }),
      expect.objectContaining({ code: 'exercise-count', grammarId: 'grammar-1' }),
      expect.objectContaining({ code: 'dialogue-count' }),
      expect.objectContaining({ code: 'dialogue-speaker-count', dialogueId: 'dialogue-1' }),
      expect.objectContaining({ code: 'dialogue-line-details', dialogueId: 'dialogue-1' }),
      expect.objectContaining({ code: 'dialogue-video-duration', dialogueId: 'dialogue-1' }),
    ]))
  })

  it('requires exactly three exercises for every grammar point', () => {
    const courseWithTwoExercises = {
      ...validCourse,
      grammar: validCourse.grammar.map((grammar) =>
        grammar.id === 'grammar-1' ? { ...grammar, exercises: grammar.exercises.slice(0, 2) } : grammar,
      ),
    }
    const courseWithFourExercises = {
      ...validCourse,
      grammar: validCourse.grammar.map((grammar) =>
        grammar.id === 'grammar-1' ? { ...grammar, exercises: [...grammar.exercises, { ...grammar.exercises[0], id: 'grammar-1-exercise-4' }] } : grammar,
      ),
    }

    expect(validateCourse(courseWithTwoExercises)).toContainEqual(
      expect.objectContaining({ code: 'exercise-count', grammarId: 'grammar-1' }),
    )
    expect(validateCourse(courseWithFourExercises)).toContainEqual(
      expect.objectContaining({ code: 'exercise-count', grammarId: 'grammar-1' }),
    )
  })

  it('requires the nine exercises to cover multiple choice, particle selection, matching, and sentence completion', () => {
    expect(validateCourse(validCourse)).not.toContainEqual(
      expect.objectContaining({ code: 'exercise-mode-coverage' }),
    )

    const courseWithoutMatching = {
      ...validCourse,
      grammar: validCourse.grammar.map((grammarPoint) => ({
        ...grammarPoint,
        exercises: grammarPoint.exercises.map((exercise) => exercise.type === 'matching'
          ? {
              id: exercise.id,
              grammarId: exercise.grammarId,
              type: 'multiple-choice' as const,
              prompt: exercise.prompt,
              koreanContext: exercise.koreanContext,
              choices: ['정답'],
              answer: '정답',
              explanation: exercise.explanation,
            }
          : { ...exercise, type: 'multiple-choice' as const }),
      })),
    }
    expect(validateCourse(courseWithoutMatching)).toContainEqual(
      expect.objectContaining({ code: 'exercise-mode-coverage' }),
    )
  })

  it('rejects a matching exercise without two complete, uniquely identified bilingual pairs', () => {
    const invalidMatchingCourse = {
      ...validCourse,
      grammar: validCourse.grammar.map((grammarPoint, grammarIndex) => grammarIndex === 0
        ? {
            ...grammarPoint,
            exercises: grammarPoint.exercises.map((exercise, exerciseIndex) => exerciseIndex === 0
              ? {
                  id: exercise.id,
                  grammarId: exercise.grammarId,
                  type: 'matching' as const,
                  prompt: 'Match each sentence.',
                  koreanContext: '문장을 연결하세요.',
                  pairs: [
                    { id: 'duplicate', korean: '학생이에요.', english: 'I am a student.' },
                    { id: 'duplicate', korean: '', english: '' },
                  ],
                  explanation: 'Read both meanings.',
                }
              : exercise),
          }
        : grammarPoint),
    }

    expect(validateCourse(invalidMatchingCourse)).toContainEqual(
      expect.objectContaining({ code: 'exercise-matching', grammarId: 'grammar-1' }),
    )
  })

  it('rejects duplicate Korean prompts in an otherwise complete matching exercise', () => {
    const duplicateKoreanCourse = {
      ...validCourse,
      grammar: validCourse.grammar.map((grammarPoint) => ({
        ...grammarPoint,
        exercises: grammarPoint.exercises.map((exercise) => exercise.type === 'matching'
          ? {
              ...exercise,
              pairs: [exercise.pairs[0], { ...exercise.pairs[1], korean: exercise.pairs[0].korean }],
            }
          : exercise),
      })),
    }

    expect(validateCourse(duplicateKoreanCourse)).toContainEqual(
      expect.objectContaining({ code: 'exercise-matching', grammarId: 'grammar-1' }),
    )
  })

  it('derives member dialogue participation from dialogue lines', () => {
    const courseWithSilentDeclaredMember = {
      ...validCourse,
      dialogues: validCourse.dialogues.map((dialogue) => ({
        ...dialogue,
        lines: dialogue.lines.map((line) => ({ ...line, speakerId: 'member-1' })),
      })),
    }

    expect(validateCourse(courseWithSilentDeclaredMember)).toContainEqual(
      expect.objectContaining({ code: 'member-dialogue-participation', memberId: 'member-2' }),
    )
  })

  it('rejects dialogue lines with unknown or undeclared speakers', () => {
    const courseWithInvalidLineSpeaker = {
      ...validCourse,
      dialogues: validCourse.dialogues.map((dialogue) =>
        dialogue.id === 'dialogue-1'
          ? { ...dialogue, lines: dialogue.lines.map((line, index) => index === 0 ? { ...line, speakerId: 'member-unknown' } : line) }
          : dialogue,
      ),
    }

    expect(validateCourse(courseWithInvalidLineSpeaker)).toContainEqual(
      expect.objectContaining({ code: 'dialogue-line-speaker', dialogueId: 'dialogue-1' }),
    )
  })

  it('rejects every non-human media source in submission mode', () => {
    const invalidCourse = {
      ...validCourse,
      dialogues: [{ ...validCourse.dialogues[0], video: { src: '/media/dialogues/one.mp4', kind: 'development-missing' as const, durationSeconds: 90 } }, validCourse.dialogues[1]],
    }

    expect(validateCourse(invalidCourse)).toContainEqual(
      expect.objectContaining({ code: 'dialogue-video-media', dialogueId: 'dialogue-1', severity: 'error' }),
    )
  })

  it.each([
    ['missing', { src: null, kind: 'development-missing' as const }],
    ['AI-generated', { src: '/media/dialogues/ai.mp4', kind: 'ai-generated' as const, durationSeconds: 90 }],
    ['inconsistent development', { src: '/media/dialogues/placeholder.mp4', kind: 'development-missing' as const, durationSeconds: 90 }],
  ])('treats a %s dialogue video as a media failure without duplicating a duration issue', (_label, video) => {
    const invalidCourse = {
      ...validCourse,
      dialogues: [{ ...validCourse.dialogues[0], video }, validCourse.dialogues[1]],
    }

    const issues = validateCourse(invalidCourse)
    expect(issues).toContainEqual(
      expect.objectContaining({ code: 'dialogue-video-media', dialogueId: 'dialogue-1' }),
    )
    expect(issues).not.toContainEqual(
      expect.objectContaining({ code: 'dialogue-video-duration', dialogueId: 'dialogue-1' }),
    )
  })

  it.each([undefined, 45, 181])('requires a verified 60-180 second duration for a real human dialogue video (%s)', (durationSeconds) => {
    const video = {
      src: '/media/dialogues/dialogue-1.mp4',
      kind: 'human-recording' as const,
      ...(durationSeconds === undefined ? {} : { durationSeconds }),
    }
    const invalidCourse = {
      ...validCourse,
      dialogues: [{ ...validCourse.dialogues[0], video }, validCourse.dialogues[1]],
    }

    expect(validateCourse(invalidCourse)).toContainEqual(
      expect.objectContaining({ code: 'dialogue-video-duration', dialogueId: 'dialogue-1' }),
    )
  })

  it('provides the complete Lec 1 development dataset without structural errors', () => {
    expect(course.sourceLesson).toBe('Lec 1')
    expect(course.vocabulary.filter((item) => item.ownerId !== null).map((item) => item.korean)).toEqual([
      '학생', '선생님', '회사원', '기자', '의사', '가수', '군인', '요리사',
    ])
    expect(course.vocabulary.filter((item) => item.ownerId === null).map((item) => item.korean)).toEqual([
      '중국', '일본', '미국', '한국', '프랑스', '독일', '호주', '영국',
    ])
    expect(course.grammar.map((grammar) => grammar.exercises.map((exercise) => exercise.type === 'matching' ? undefined : exercise.answer))).toEqual([
      ['민수예요', '학생이에요', undefined],
      ['저는 학생이에요', '선생님은 한국 사람이에요', '제니는 가수예요'],
      ['미국 사람이 아니에요', '가수가 아니에요', '회사원이 아니에요'],
    ])
    expect(course.grammar.flatMap((grammar) => grammar.exercises.map((exercise) => exercise.type))).toEqual([
      'sentence-completion', 'sentence-completion', 'matching',
      'particle', 'particle', 'particle',
      'multiple-choice', 'multiple-choice', 'multiple-choice',
    ])
    expect(course.dialogues).toHaveLength(2)
    expect(course.dialogues.every((dialogue) => dialogue.lines.length === 8)).toBe(true)
    expect(course.dialogues.every((dialogue) => dialogue.video.durationSeconds === undefined)).toBe(true)
    expect(validateCourse(course, 'development').filter((courseIssue) => courseIssue.severity !== 'warning')).toEqual([])
  })
})
