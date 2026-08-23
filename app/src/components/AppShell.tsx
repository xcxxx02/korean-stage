import { List, Users } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { course } from '../content/course'
import { getPrimaryNavigationItems } from '../navigation'

const navigationItems = getPrimaryNavigationItems()

function currentSection(pathname: string): string | null {
  if (pathname === '/learn' || pathname === '/learn/unit-1') return 'Learn'
  if (pathname === '/learn/unit-2' || pathname === '/learn/unit-3') return 'Vocabulary'
  if (/^\/learn\/unit-[4-6]$/.test(pathname)) return 'Grammar'
  if (pathname === '/learn/unit-7') return 'Dialogue'
  return null
}

export function AppShell() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const learningSection = currentSection(location.pathname)
  const mainContentRef = useRef<HTMLElement>(null)
  const initialLocationKeyRef = useRef(location.key)

  useEffect(() => {
    if (location.key === initialLocationKeyRef.current) return
    const heading = mainContentRef.current?.querySelector('h1')
    if (heading instanceof HTMLElement) {
      heading.tabIndex = -1
      heading.focus()
    }
  }, [location.key])

  useEffect(() => {
    const closeMenuOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    window.addEventListener('keydown', closeMenuOnEscape)
    return () => window.removeEventListener('keydown', closeMenuOnEscape)
  }, [])

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="site-header">
        <div className="site-header__inner">
          <Link className="site-brand" to="/">
            <span aria-hidden="true" className="site-brand__mark">
              <img alt="" className="site-brand__image" src="/assets/culture/palace-gate-mark-v2.png" />
            </span>
            <span>{course.name}</span>
          </Link>
          <button aria-controls="primary-navigation-list" aria-expanded={isMenuOpen} className="mobile-menu-button" onClick={() => setIsMenuOpen((open) => !open)} type="button">
            <List aria-hidden="true" size={24} />
            <span>Menu</span>
          </button>
          <nav aria-label="Primary navigation">
            <ul className="desktop-navigation">
              {navigationItems.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    aria-current={learningSection === label || (learningSection === null && location.pathname === to) ? 'page' : undefined}
                    onClick={() => setIsMenuOpen(false)}
                    to={to}
                  >
                    {label === 'Team' ? <Users aria-hidden="true" size={22} /> : null}
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="mobile-navigation" hidden={!isMenuOpen} id="primary-navigation-list">
              {navigationItems.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    aria-current={learningSection === label || (learningSection === null && location.pathname === to) ? 'page' : undefined}
                    onClick={() => setIsMenuOpen(false)}
                    to={to}
                  >
                    {label === 'Team' ? <Users aria-hidden="true" size={22} /> : null}
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <img alt="" aria-hidden="true" className="obangsaek-band" src="/assets/culture/obangsaek-band-v2.png" />
      </header>
      <div className="app-stage">
        <img alt="" aria-hidden="true" className="korean-stage-background" src="/assets/culture/korean-stage-background-v2.png" />
        <main id="main-content" ref={mainContentRef} tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
