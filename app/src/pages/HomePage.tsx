import { course } from '../content/course'

export function HomePage() {
  return <><h1>{course.name}</h1><p>A beginner course adapted entirely from {course.sourceLesson}.</p></>
}
