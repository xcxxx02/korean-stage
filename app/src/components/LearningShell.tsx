import type { ReactNode } from 'react'

type LearningShellProps = {
  heading: string
  progress: string
  rail: ReactNode
  media: ReactNode
  details: ReactNode
  controls: ReactNode
}

export function LearningShell({ heading, progress, rail, media, details, controls }: LearningShellProps) {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
      <div className="mb-8 grid items-end gap-4 lg:grid-cols-[minmax(0,1fr)_2fr]">
        <h1 className="m-0 text-3xl font-bold tracking-tight text-stage-charcoal sm:text-4xl">{heading}</h1>
        <p className="m-0 justify-self-start rounded-full border border-stage-border px-4 py-2 text-sm font-semibold text-stage-muted lg:justify-self-center">
          {progress}
        </p>
      </div>
      <div className="grid gap-8 lg:grid-cols-[11rem_minmax(0,1fr)_19rem] xl:grid-cols-[12rem_minmax(0,1fr)_21rem]">
        <aside>{rail}</aside>
        <div className="min-w-0">
          {media}
          <div className="mt-7">{controls}</div>
        </div>
        <aside>{details}</aside>
      </div>
    </section>
  )
}
