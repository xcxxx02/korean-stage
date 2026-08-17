import { SubmissionReadiness } from '../components/SubmissionReadiness'
import { TeamGrid } from '../components/TeamGrid'
import { course } from '../content/course'

export function TeamPage() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-14">
      <p className="font-semibold text-stage-cobalt">Korean Stage · {course.sourceLesson}</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-stage-charcoal sm:text-4xl">Team & submission readiness</h1>
      <p className="mt-3 max-w-3xl text-lg text-stage-muted">
        See who owns each bilingual recording and what the team must replace, record, or review before submission.
      </p>
      <TeamGrid course={course} />
      <SubmissionReadiness course={course} />
    </section>
  )
}
