import { course } from '../content/course'

export function VocabularyPage() {
  const groups = [
    {
      unitId: 'unit-2' as const,
      heading: 'Unit 2 · Countries & Nationalities',
      label: 'Unit 2 vocabulary review',
    },
    {
      unitId: 'unit-3' as const,
      heading: 'Unit 3 · Jobs & Occupations',
      label: 'Unit 3 vocabulary review',
    },
  ]

  return (
    <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:py-14">
      <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Vocabulary review</h1>
      <p className="mt-3 max-w-2xl text-lg text-slate-700">Review every Lec 1 word with its Korean form and English meaning side by side.</p>
      <div className="mt-10 grid gap-12">
        {groups.map((group) => (
          <section aria-labelledby={`${group.unitId}-review-heading`} key={group.unitId}>
            <h2 className="text-2xl font-bold text-slate-950" id={`${group.unitId}-review-heading`}>{group.heading}</h2>
            <ul aria-label={group.label} className="mt-5 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-4">
              {course.vocabulary.filter((item) => item.unitId === group.unitId).map((item) => (
                <li aria-label={`${item.korean}, ${item.english}`} className="border-l-4 border-blue-600 bg-slate-50 p-4" key={item.id}>
                  <span className="block text-xl font-black text-blue-700">{item.korean}</span>
                  <span className="mt-1 block font-semibold text-slate-950">{item.english}</span>
                  <span className="mt-2 block text-sm text-slate-600">{item.romanization}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  )
}
