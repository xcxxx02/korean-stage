import { Link, useParams } from 'react-router-dom'
import { GrammarGuide } from '../components/GrammarGuide'
import { IntroductionLesson } from '../components/IntroductionLesson'
import { LessonSelector } from '../components/LessonSelector'
import { VocabularyJourney } from '../components/VocabularyJourney'
import { course, courseLessons, getLessonBySlug } from '../content/course'

export function LearnPage() {
  const { lessonSlug } = useParams()
  const lesson = lessonSlug === undefined ? undefined : getLessonBySlug(lessonSlug)

  if (!lesson) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-stage-vermilion-strong">Course route</p>
        <h1 className="mt-2 text-4xl font-black text-stage-charcoal">Lesson not found</h1>
        <p className="mt-3 text-lg text-stage-muted">We couldn't find that lesson.</p>
        <Link className="mt-6 inline-flex rounded-xl bg-stage-cobalt px-5 py-3 font-black text-stage-white no-underline" to="/learn/lesson-1">
          Return to lessons
        </Link>
      </section>
    )
  }

  const vocabulary = course.vocabulary.filter((item) => item.unitId === lesson.id)
  const grammarPoint = course.grammar.find((item) => item.unitId === lesson.id)
  const lessonNumber = courseLessons.indexOf(lesson) + 1

  const lessonContent = lesson.id === 'unit-1'
    ? <IntroductionLesson />
    : lesson.id === 'unit-2' || lesson.id === 'unit-3'
      ? <VocabularyJourney items={vocabulary} />
      : grammarPoint
        ? <GrammarGuide grammarPoint={grammarPoint} />
        : (
          <section aria-labelledby="dialogue-preview-heading" className="mt-8 rounded-xl border border-stage-border bg-stage-white p-6 sm:p-8">
            <h2 className="m-0 text-2xl font-black text-stage-charcoal" id="dialogue-preview-heading">Bring the lessons together</h2>
            <p className="mt-3 text-lg leading-8 text-stage-muted">Listen for the greetings, introductions, vocabulary, and grammar you have met across the course.</p>
            <div className="mt-5 rounded-xl bg-stage-cobalt-soft p-5">
              <p className="m-0 text-2xl font-black text-stage-cobalt" data-korean-content lang="ko">안녕하세요.</p>
              <p className="mt-2 text-stage-charcoal" lang="en">Hello.</p>
            </div>
            <Link className="mt-6 inline-flex rounded-xl bg-stage-vermilion px-5 py-3 font-bold text-stage-white no-underline hover:bg-stage-vermilion-strong" to="/dialogue">
              Watch the dialogue
            </Link>
          </section>
        )

  return (
    <section className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:py-12">
      <header className="flex flex-wrap items-start justify-between gap-5">
        <div className="max-w-3xl">
          <p className="m-0 text-sm font-black uppercase tracking-[0.16em] text-stage-cobalt">
            Lesson {lessonNumber} of {courseLessons.length}
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-stage-charcoal sm:text-5xl">{lesson.title}</h1>
        </div>
        <LessonSelector activeSlug={lesson.slug} />
      </header>

      {lessonContent}
    </section>
  )
}
