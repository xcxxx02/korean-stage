import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { courseLessons } from '../content/course'
import type { LessonSlug } from '../content/types'
import { LanguageAwareText } from './LanguageAwareText'

export function LessonSelector({ activeSlug }: { activeSlug: LessonSlug }) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const closeChooser = useCallback(() => {
    setOpen(false)
    triggerRef.current?.focus()
  }, [])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !open) return
      closeChooser()
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [closeChooser, open])

  return (
    <div className="lesson-selector">
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
        <>
          <button aria-label="Close lesson drawer" className="lesson-selector__backdrop" onClick={closeChooser} tabIndex={-1} type="button" />
          <ol aria-label="Choose a lesson" className="lesson-selector__drawer">
            {courseLessons.map((lesson, index) => (
              <li key={lesson.slug}>
                <Link
                  aria-current={lesson.slug === activeSlug ? 'page' : undefined}
                  className="grid rounded-xl px-3 py-2 text-stage-charcoal no-underline hover:bg-stage-cobalt-soft hover:text-stage-cobalt"
                  onClick={closeChooser}
                  to={`/learn/${lesson.slug}`}
                >
                  <span className="text-xs font-bold uppercase tracking-wide text-stage-muted">
                    Lesson {index + 1} of {courseLessons.length}
                  </span>
                  <strong><LanguageAwareText text={lesson.title} /></strong>
                </Link>
              </li>
            ))}
          </ol>
        </>
      ) : null}
    </div>
  )
}
