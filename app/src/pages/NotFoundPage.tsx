import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return <><h1>Page not found</h1><p>The page you requested is not part of this course.</p><Link to="/">Return to course</Link></>
}
