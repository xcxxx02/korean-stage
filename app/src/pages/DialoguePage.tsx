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
      <p className="font-semibold text-blue-700">Unit 7 · Beginner role play</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
        {unit ? 'Unit 7 · Dialogue & role play' : 'Dialogue & role play'}
      </h1>
      <p className="mt-3 max-w-3xl text-lg text-slate-700">Watch the full Lec 1 scene first, then rehearse the Korean with its English meaning always in view.</p>

      <div aria-label="Choose a dialogue" className="mt-8 grid gap-3 sm:grid-cols-2" role="group">
        {course.dialogues.map((dialogue, index) => {
          const isActive = dialogue.id === activeDialogue.id
          return (
            <button
              aria-label={dialogue.title}
              aria-pressed={isActive}
              className={`min-h-16 rounded-xl border-2 px-5 py-4 text-left font-bold focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${isActive ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white text-slate-900 hover:border-blue-400'}`}
              key={dialogue.id}
              onClick={() => setActiveDialogueId(dialogue.id)}
              type="button"
            >
              <span className="block text-xs uppercase tracking-widest opacity-80">Dialogue {index + 1}</span>
              <span className="mt-1 block text-lg">{dialogue.title}</span>
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
