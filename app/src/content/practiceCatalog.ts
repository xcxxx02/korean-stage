import { course, courseLessons } from './course'
import type { Exercise, LessonSlug, VocabularyItem } from './types'

export type PracticeGroup = {
  lessonSlug: LessonSlug
  title: string
  exercises: Exercise[]
}

const lessonTitle = (lessonSlug: LessonSlug) =>
  courseLessons.find((lesson) => lesson.slug === lessonSlug)!.title

const vocabularyGroup = (
  lessonSlug: LessonSlug,
  unitId: VocabularyItem['unitId'],
): PracticeGroup => ({
  lessonSlug,
  title: lessonTitle(lessonSlug),
  exercises: course.vocabulary
    .filter((item) => item.unitId === unitId)
    .map((item, index, items) => ({
      id: `${item.id}-meaning`,
      grammarId: lessonSlug,
      answerLanguage: 'en',
      type: 'multiple-choice',
      prompt: `Choose the English meaning of ${item.korean}.`,
      koreanContext: item.korean,
      choices: [
        item.english,
        items[(index + 1) % items.length].english,
        items[(index + 2) % items.length].english,
      ],
      answer: item.english,
      explanation: `${item.korean} means ${item.english}.`,
    })),
})

const grammarGroup = (lessonSlug: LessonSlug): PracticeGroup => {
  const lesson = courseLessons.find((candidate) => candidate.slug === lessonSlug)!
  const grammarPoint = course.grammar.find((candidate) => candidate.unitId === lesson.id)!

  return {
    lessonSlug,
    title: lesson.title,
    exercises: grammarPoint.exercises,
  }
}

export const practiceGroups: PracticeGroup[] = [
  vocabularyGroup('lesson-2', 'unit-2'),
  vocabularyGroup('lesson-3', 'unit-3'),
  grammarGroup('lesson-4'),
  grammarGroup('lesson-5'),
  grammarGroup('lesson-6'),
]
