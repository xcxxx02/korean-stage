import { useSearchParams } from 'react-router-dom'
import { SubmissionReadiness } from '../components/SubmissionReadiness'
import { TeamGrid } from '../components/TeamGrid'
import { course } from '../content/course'

export function TeamPage() {
  const [searchParams] = useSearchParams()
  const showReadiness = import.meta.env.DEV && searchParams.get('readiness') === '1'

  return (
    <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-14">
      <p className="font-semibold text-stage-cobalt">Korean Stage · Group 4 · {course.members.length} members</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-stage-charcoal sm:text-4xl">Meet the team</h1>
      <p className="mt-3 max-w-3xl text-lg text-stage-muted">
        Meet the people who created Korean Stage and contributed to its vocabulary and dialogues.
      </p>
      <TeamGrid course={course} />
      {showReadiness ? <SubmissionReadiness course={course} /> : null}
    </section>
  )
}
