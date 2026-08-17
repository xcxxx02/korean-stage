import { useState } from 'react'
import { DialoguePlayer } from '../components/DialoguePlayer'
import { course } from '../content/course'

type DialoguePageProps = {
  unit?: boolean
}

export function DialoguePage({ unit = false }: DialoguePageProps) {
  const [activeDialogueId, setActiveDialogueId] = useState(course.dialogues[0].id)
  const activeDialogue = course.dialogues.find((dialogue) => dialogue.id === activeDialogueId) ?? course.dialogues[0]

  return (
    <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:py-14">
      <p className="font-semibold text-stage-cobalt">Unit 7 · Beginner role play</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-stage-charcoal sm:text-4xl">
        {unit ? 'Unit 7 · Dialogue & role play' : 'Dialogue & role play'}
      </h1>
      <p className="mt-3 max-w-3xl text-lg text-stage-muted">Watch the full Lec 1 scene first, then rehearse the Korean with its English meaning always in view.</p>

      <div aria-label="Choose a dialogue" className="mt-8 grid gap-3 sm:grid-cols-2" role="group">
        {course.dialogues.map((dialogue, index) => {
          const isActive = dialogue.id === activeDialogue.id
          return (
            <button
              aria-label={dialogue.title}
              aria-pressed={isActive}
              className={`min-h-16 rounded-xl border px-5 py-4 text-left font-bold focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-stage-focus ${isActive ? 'border-stage-cobalt bg-stage-cobalt text-stage-white' : 'border-stage-border bg-stage-white text-stage-charcoal hover:border-stage-cobalt'}`}
              key={dialogue.id}
              onClick={() => setActiveDialogueId(dialogue.id)}
              type="button"
            >
              <span className="block text-xs uppercase tracking-widest opacity-80">Dialogue {index + 1}</span>
              <span className="mt-1 block text-lg">{dialogue.title}</span>
              {isActive ? <span className="mt-2 inline-block rounded-full bg-stage-white px-2 py-0.5 text-xs font-bold text-stage-cobalt">Selected dialogue</span> : null}
            </button>
          )
        })}
      </div>

      <div className="mt-10">
        <DialoguePlayer dialogue={activeDialogue} key={activeDialogue.id} members={course.members} />
      </div>
    </section>
  )
}
