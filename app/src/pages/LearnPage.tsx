import { useParams } from 'react-router-dom'
import { courseUnits } from '../content/course'
import { useCourseProgress } from '../hooks/useCourseProgress'

export function LearnPage() {
  const { unitId } = useParams()
  const unit = courseUnits.find((candidate) => candidate.id === unitId) ?? courseUnits[0]
  const { progress, markUnitComplete } = useCourseProgress()
  const isComplete = progress.completedUnitIds.includes(unit.id)

  return (
    <>
      <p>Unit {courseUnits.indexOf(unit) + 1} of {courseUnits.length}</p>
      <h1>{unit.title}</h1>
      <p>Work through this introductory Korean unit adapted from Lec 1.</p>
      {isComplete
        ? <p>Unit complete</p>
        : <button type="button" onClick={() => markUnitComplete(unit.id)}>Mark unit complete</button>}
    </>
  )
}
