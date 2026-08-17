import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { courseUnits } from '../content/course'
import { useCourseProgress } from '../hooks/useCourseProgress'

export function LearnPage() {
  const { unitId } = useParams()
  const unit = unitId === undefined
    ? courseUnits[0]
    : courseUnits.find((candidate) => candidate.id === unitId)
  const { progress, visitUnit, markUnitComplete } = useCourseProgress()
  const isComplete = unit ? progress.completedUnitIds.includes(unit.id) : false

  useEffect(() => {
    if (unit) visitUnit(unit.id)
  }, [unit, visitUnit])

  if (!unit) {
    return (
      <>
        <h1>Unit not found</h1>
        <p>We couldn't find that course unit.</p>
        <Link to="/">Return to course</Link>
      </>
    )
  }

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
