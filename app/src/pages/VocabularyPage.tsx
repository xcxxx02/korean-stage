import { VocabularyJourney } from '../components/VocabularyJourney'
import { course } from '../content/course'

export function VocabularyPage() {
  return <VocabularyJourney items={course.vocabulary.filter((item) => item.unitId === 'unit-3')} />
}
