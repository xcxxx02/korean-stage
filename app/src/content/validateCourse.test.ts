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

  it('provides the complete Lec 1 development dataset without structural errors', () => {
    expect(course.sourceLesson).toBe('Lec 1')
    expect(course.vocabulary.filter((item) => item.ownerId !== null).map((item) => item.korean)).toEqual([
      '학생', '선생님', '회사원', '기자', '의사', '가수', '군인', '요리사',
    ])
    expect(course.vocabulary.filter((item) => item.ownerId === null).map((item) => item.korean)).toEqual([
      '중국', '일본', '미국', '한국', '프랑스', '독일', '호주', '영국',
    ])
    expect(course.grammar.map((grammar) => grammar.exercises.map((exercise) => exercise.answer))).toEqual([
      ['민수예요', '학생이에요', '제니예요'],
      ['저는 학생이에요', '선생님은 한국 사람이에요', '제니는 가수예요'],
      ['미국 사람이 아니에요', '가수가 아니에요', '회사원이 아니에요'],
    ])
    expect(course.dialogues).toHaveLength(2)
    expect(course.dialogues.every((dialogue) => dialogue.lines.length === 8)).toBe(true)
    expect(validateCourse(course, 'development').filter((courseIssue) => courseIssue.severity !== 'warning')).toEqual([])
  })
})
