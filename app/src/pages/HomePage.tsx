import { Link } from 'react-router-dom'
import { CourseMap } from '../components/CourseMap'
import { ProgressSummary } from '../components/ProgressSummary'
import { course, courseUnits } from '../content/course'
import { useCourseProgress } from '../hooks/useCourseProgress'

export function HomePage() {
  const { progress } = useCourseProgress()
  const firstUnitPath = `/learn/${courseUnits[0].id}`
  const hasSavedActivity = progress.lastPath !== firstUnitPath
    || progress.completedUnitIds.length > 0
    || progress.completedVocabularyIds.length > 0
    || Object.keys(progress.exerciseResults).length > 0

  return (
    <>
      <h1>{course.name}</h1>
      <p>All seven units are adapted entirely from {course.sourceLesson}</p>
      <ProgressSummary completedUnitIds={progress.completedUnitIds} totalUnits={courseUnits.length} />
      <Link to={hasSavedActivity ? progress.lastPath : firstUnitPath}>
        {hasSavedActivity ? 'Continue learning' : 'Start learning'}
      </Link>
      <CourseMap completedUnitIds={progress.completedUnitIds} />
    </>
  )
}
