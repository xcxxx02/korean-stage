import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { HumanAudioButton } from '../components/HumanAudioButton'
import { course, courseUnits } from '../content/course'
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
      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-stage-vermilion-strong">Course route</p>
        <h1 className="mt-2 text-4xl font-black text-stage-charcoal">Unit not found</h1>
        <p className="mt-3 text-lg text-stage-muted">We couldn't find that course unit.</p>
        <Link className="mt-6 inline-flex rounded-xl bg-stage-cobalt px-5 py-3 font-black text-stage-white no-underline" to="/">Return to course</Link>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:py-16">
      <header className="max-w-3xl">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-stage-cobalt">Unit {courseUnits.indexOf(unit) + 1} of {courseUnits.length}</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-stage-charcoal sm:text-5xl">{unit.title}</h1>
        <p className="mt-4 text-lg leading-8 text-stage-muted">Begin with two useful expressions from Lec 1, then check that you are ready for the vocabulary journey.</p>
      </header>

      <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)]">
        <section aria-labelledby="model-sentences-heading" className="rounded-xl border border-stage-border bg-stage-white p-6 sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-stage-cobalt">Say it aloud</p>
          <h2 className="mt-2 text-2xl font-black text-stage-charcoal" id="model-sentences-heading">Bilingual self-introduction models</h2>
          <ul aria-label="Bilingual self-introduction models" className="mt-6 grid list-none gap-4 p-0 sm:grid-cols-2">
            {course.introductionModels.map((model, index) => {
              const memberName = course.members.find((member) => member.id === model.ownerId)?.name ?? 'Unknown member'
              return (
                <li className={`border-l p-5 ${index % 2 === 0 ? 'border-stage-cobalt bg-stage-cobalt-soft' : 'border-stage-jade bg-stage-jade-soft'}`} key={model.id}>
                  <p className={`text-2xl font-black ${index % 2 === 0 ? 'text-stage-cobalt' : 'text-stage-jade-strong'}`} lang="ko">{model.korean}</p>
                  <p className="mt-2 font-semibold text-stage-charcoal">{model.english}</p>
                  <p className="mt-4 text-sm text-stage-muted"><strong>Romanization:</strong> {model.romanization}</p>
                  {model.pronunciationHint ? <p className="mt-1 text-sm text-stage-muted"><strong>Pronunciation:</strong> {model.pronunciationHint}</p> : null}
                  <div className="mt-4">
                    <HumanAudioButton label={model.audioLabel} memberName={memberName} source={model.audio} />
                  </div>
                  <p className="mt-3 text-xs font-semibold text-stage-muted">Presented by {memberName}</p>
                </li>
              )
            })}
          </ul>
          <p className="mt-6 text-stage-muted">Replace 미나 with your own name. You will practise the ending 이에요 / 예요 in Unit 4.</p>
        </section>

        <section aria-labelledby="readiness-heading" className="rounded-xl border border-stage-yellow bg-stage-yellow-soft p-6">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-stage-yellow-strong">Quick readiness check</p>
          <h2 className="mt-2 text-2xl font-black text-stage-charcoal" id="readiness-heading">Ready to continue?</h2>
          <ul className="mt-5 grid gap-3 pl-5 text-stage-charcoal">
            <li>I can find the Korean greeting.</li>
            <li>I can identify the English meaning.</li>
            <li>I can replace the model name with my own.</li>
          </ul>
          {isComplete
            ? <p className="mt-6 rounded-xl bg-stage-jade-soft px-4 py-3 font-black text-stage-jade-strong" role="status">Unit complete</p>
            : (
              <button
                className="mt-6 w-full rounded-xl bg-stage-vermilion px-5 py-3 font-black text-stage-white hover:bg-stage-vermilion-strong"
                type="button"
                onClick={() => markUnitComplete(unit.id)}
              >
                Mark unit complete
              </button>
            )}
        </section>
      </div>
    </section>
  )
}
