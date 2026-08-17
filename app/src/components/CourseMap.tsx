import { Link } from 'react-router-dom'
import { courseUnits } from '../content/course'

type CourseMapProps = {
  completedUnitIds?: string[]
}

export function CourseMap({ completedUnitIds = [] }: CourseMapProps) {
  const completedUnits = new Set(completedUnitIds)

  return (
    <nav aria-label="Course map">
      <ol>
        {courseUnits.map((unit, index) => (
          <li key={unit.id}>
            <Link to={`/learn/${unit.id}`}>
              <span>Unit {index + 1}</span>{' '}
              <span>{unit.title}</span>
              {completedUnits.has(unit.id) ? <span> — Complete</span> : null}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}
