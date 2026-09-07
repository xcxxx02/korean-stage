import type { ReactNode } from 'react'

type LearningShellProps = {
  heading: string
  progress: string
  progressLabel?: string
  progressMarkers?: ReactNode
  rail: ReactNode
  railLabel?: string
  media: ReactNode
  details: ReactNode
  controls: ReactNode
  layout?: 'media-center' | 'details-center'
}

export function LearningShell({ heading, progress, progressLabel = 'Lesson progress', progressMarkers, rail, railLabel = 'Ordered vocabulary words', media, details, controls, layout = 'media-center' }: LearningShellProps) {
  return (
    <section className="stage-learning-shell w-full py-8 lg:py-5">
      <div className="stage-learning-header mb-5 grid gap-4">
        <h2 className="m-0 text-3xl font-bold tracking-tight text-stage-charcoal sm:text-4xl">{heading}</h2>
        <div className="stage-learning-progress" aria-label={progress}>
          <p className="stage-learning-progress__label">
            <span>{progressLabel}</span>
            <strong>{progress}</strong>
          </p>
          {progressMarkers}
        </div>
      </div>
      <div aria-label={heading} className={`learn-layout stage-learning-grid learn-layout--${layout}`} role="region">
        <aside aria-label={railLabel} className="learn-word-rail stage-learning-rail">{rail}</aside>
        <aside aria-label="Vocabulary learning details" className="learn-details stage-learning-details">
          {details}
          {controls}
        </aside>
        <section aria-label="Member vocabulary video" className="learn-media stage-learning-media">
          {media}
        </section>
      </div>
    </section>
  )
}
