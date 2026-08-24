import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { courseLessons } from '../content/course'
import type { LessonSlug } from '../content/types'

export function LessonSelector({ activeSlug }: { activeSlug: LessonSlug }) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !open) return
      setOpen(false)
      triggerRef.current?.focus()
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [open])

  return (
    <div className="lesson-selector relative">
      <button
        aria-expanded={open}
        className="inline-flex min-h-12 items-center rounded-xl border border-stage-border bg-stage-white px-4 py-3 font-bold text-stage-charcoal hover:border-stage-cobalt hover:text-stage-cobalt"
        onClick={() => setOpen((value) => !value)}
        ref={triggerRef}
        type="button"
      >
        All lessons
      </button>
      {open ? (
        <ol
          aria-label="Choose a lesson"
          className="absolute right-0 z-20 mt-2 grid min-w-72 list-none gap-1 rounded-xl border border-stage-border bg-stage-white p-2"
        >
          {courseLessons.map((lesson, index) => (
            <li key={lesson.slug}>
              <Link
                aria-current={lesson.slug === activeSlug ? 'page' : undefined}
                className="grid rounded-xl px-3 py-2 text-stage-charcoal no-underline hover:bg-stage-cobalt-soft hover:text-stage-cobalt"
                onClick={() => setOpen(false)}
                to={`/learn/${lesson.slug}`}
              >
                <span className="text-xs font-bold uppercase tracking-wide text-stage-muted">
                  Lesson {index + 1} of {courseLessons.length}
                </span>
                <strong>{lesson.title}</strong>
              </Link>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  )
}
