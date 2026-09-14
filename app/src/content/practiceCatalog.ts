import { course, grammarUnits, vocabularyUnits } from './course'
import type { Exercise, VocabularyUnitId } from './types'

export type PracticeGroup = {
  id: 'vocabulary-1' | 'vocabulary-2' | 'grammar-1' | 'grammar-2'
  lessonSlug: string
  kind: 'Vocabulary' | 'Grammar'
  unitNumber: 1 | 2
  title: string
  exercises: Exercise[]
}

const vocabularyGroup = (id: 'vocabulary-1' | 'vocabulary-2', unitId: VocabularyUnitId, unitNumber: 1 | 2): PracticeGroup => {
  const unit = vocabularyUnits.find((candidate) => candidate.id === unitId)!
  const items = course.vocabulary.filter((item) => item.unitId === unitId)
  return {
    id, lessonSlug: id, kind: 'Vocabulary', unitNumber, title: unit.title,
    exercises: items.map((item, index) => ({
      id: `${item.id}-meaning`, grammarId: id, answerLanguage: 'en', type: 'multiple-choice',
      prompt: `Choose the English meaning of ${item.korean}.`, koreanContext: item.korean,
      choices: [item.english, items[(index + 1) % items.length].english, items[(index + 2) % items.length].english],
      answer: item.english, explanation: `${item.korean} means ${item.english}.`,
    })),
  }
}

const grammarGroup = (id: 'grammar-1' | 'grammar-2', unitNumber: 1 | 2): PracticeGroup => {
  const unit = grammarUnits.find((candidate) => candidate.id === id)!
  const grammar = course.grammar.find((candidate) => candidate.unitId === id)!
  return { id, lessonSlug: id, kind: 'Grammar', unitNumber, title: unit.title, exercises: grammar.exercises }
}

export const practiceGroups: PracticeGroup[] = [
  vocabularyGroup('vocabulary-1', 'vocabulary-1', 1),
  vocabularyGroup('vocabulary-2', 'vocabulary-2', 2),
  grammarGroup('grammar-1', 1),
  grammarGroup('grammar-2', 2),
]
