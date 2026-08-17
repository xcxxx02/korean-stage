import { List } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { course } from '../content/course'
import { getPrimaryNavigationItems } from '../navigation'

const navigationItems = getPrimaryNavigationItems()

export function AppShell() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const mainContentRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const heading = mainContentRef.current?.querySelector('h1')
    if (heading instanceof HTMLElement) {
      heading.tabIndex = -1
      heading.focus()
    }
  }, [location.pathname])

  useEffect(() => {
    const closeMenuOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    window.addEventListener('keydown', closeMenuOnEscape)
    return () => window.removeEventListener('keydown', closeMenuOnEscape)
  }, [])

  return (
    <>
      <a href="#main-content">Skip to main content</a>
      <header>
        <Link to="/">{course.name}</Link>
        <button aria-controls="primary-navigation-list" aria-expanded={isMenuOpen} className="mobile-menu-button" onClick={() => setIsMenuOpen((open) => !open)} type="button">
          <List aria-hidden="true" />
          <span>Menu</span>
        </button>
        <nav aria-label="Primary navigation">
          <ul className="desktop-navigation">
            {navigationItems.map(({ label, to }) => (
              <li key={to}>
                <NavLink onClick={() => setIsMenuOpen(false)} to={to}>{label}</NavLink>
              </li>
            ))}
          </ul>
          <ul className="mobile-navigation" hidden={!isMenuOpen} id="primary-navigation-list">
            {navigationItems.map(({ label, to }) => (
              <li key={to}>
                <NavLink onClick={() => setIsMenuOpen(false)} to={to}>{label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main id="main-content" ref={mainContentRef} tabIndex={-1}>
        <Outlet />
      </main>
    </>
  )
}
