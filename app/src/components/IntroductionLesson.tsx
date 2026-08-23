import { course } from '../content/course'

export function IntroductionLesson() {
  return (
    <ul aria-label="Bilingual self-introduction models" className="introduction-models mt-8 grid list-none gap-5 p-0 sm:grid-cols-2">
      {course.introductionModels.map((model) => (
        <li className="rounded-xl border border-stage-border bg-stage-white p-6" key={model.id}>
          <p className="m-0 text-3xl font-black text-stage-cobalt" data-korean-content lang="ko">{model.korean}</p>
          <p className="mt-3 text-lg font-semibold text-stage-charcoal" lang="en">{model.english}</p>
          <p className="mt-5 text-sm text-stage-muted"><strong>Romanization:</strong> {model.romanization}</p>
          <p className="mt-1 text-sm text-stage-muted"><strong>Say it like:</strong> {model.pronunciationHint}</p>
        </li>
      ))}
    </ul>
  )
}
