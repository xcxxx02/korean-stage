import type { ReactNode } from 'react'

type LearningShellProps = {
  heading: string
  progress: string
  progressMarkers?: ReactNode
  rail: ReactNode
  media: ReactNode
  details: ReactNode
  controls: ReactNode
}

export function LearningShell({ heading, progress, progressMarkers, rail, media, details, controls }: LearningShellProps) {
  return (
    <section className="stage-learning-shell mx-auto w-full max-w-[1440px] px-5 py-8 sm:px-8 lg:px-14 lg:py-8">
      <div className="stage-learning-header mb-8 grid gap-4">
        <h1 className="m-0 text-3xl font-bold tracking-tight text-stage-charcoal sm:text-4xl">{heading}</h1>
        <div className="stage-learning-progress" aria-label={progress}>
          <p className="m-0 text-center text-sm font-semibold text-stage-charcoal">{progress}</p>
          {progressMarkers}
        </div>
      </div>
      <div className="stage-learning-grid grid gap-8">
        <aside aria-label="Ordered vocabulary words" className="stage-learning-rail">{rail}</aside>
        <section aria-label="Member vocabulary video" className="stage-learning-media min-w-0">
          {media}
          <div className="mt-7">{controls}</div>
        </section>
        <aside aria-label="Vocabulary learning details" className="stage-learning-details">{details}</aside>
      </div>
    </section>
  )
}
