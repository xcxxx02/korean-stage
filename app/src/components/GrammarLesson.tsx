import type { GrammarPoint } from '../content/types'
import { ExerciseEngine } from './ExerciseEngine'
import { LearningShell } from './LearningShell'

type GrammarLessonProps = {
  grammarPoint: GrammarPoint
  completed?: boolean
  onResult?: (exerciseId: string, correct: boolean) => void
}

export function GrammarLesson({ grammarPoint, completed = false, onResult }: GrammarLessonProps) {
  const unitNumber = Number(grammarPoint.unitId.split('-')[1])

  return (
    <LearningShell
      controls={<ExerciseEngine exercises={grammarPoint.exercises} onResult={onResult} />}
      details={(
        <section aria-labelledby="lesson-rule-heading" className="rounded-2xl bg-yellow-50 p-5">
          <h2 className="text-lg font-bold text-slate-950" id="lesson-rule-heading">Rule at a glance</h2>
          <ul className="mt-3 space-y-2 pl-5 text-slate-800">
            {grammarPoint.rules.map((rule) => <li key={rule}>{rule}</li>)}
          </ul>
          <p className="mt-5 border-t border-yellow-200 pt-4 font-semibold text-slate-800">{completed ? 'Unit complete' : 'Complete all three exercises correctly to finish this unit.'}</p>
        </section>
      )}
      heading={`${grammarPoint.korean} - ${grammarPoint.englishFunction}`}
      media={(
        <section aria-labelledby="lesson-explanation-heading" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-700">English explanation</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950" id="lesson-explanation-heading">How this grammar works</h2>
          <p className="mt-4 text-lg leading-8 text-slate-700">{grammarPoint.explanation}</p>
          <h3 className="mt-7 text-lg font-bold text-slate-950">Examples with English meaning</h3>
          <ul aria-label="Bilingual examples" className="mt-3 space-y-3">
            {grammarPoint.examples.map((example) => (
              <li aria-label={`${example.korean} — ${example.english}`} className="rounded-xl bg-slate-50 p-4" key={example.korean}>
                <p className="text-xl font-bold text-blue-800" lang="ko">{example.korean}</p>
                <p className="mt-1 text-slate-700">{example.english}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
      progress={`Unit ${unitNumber} · ${completed ? 'Complete' : '3 exercises'}`}
      rail={(
        <nav aria-label="Grammar lesson steps" className="rounded-2xl bg-slate-950 p-5 text-white">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-200">Unit {unitNumber}</p>
          <ol className="mt-4 space-y-3 pl-5 text-sm">
            <li>Read the English rule</li>
            <li>Compare bilingual examples</li>
            <li>Answer three exercises</li>
          </ol>
        </nav>
      )}
    />
  )
}
