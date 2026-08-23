import type { ReactNode } from 'react'
import type { RouteObject } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { appRouteManifest, type AppRouteId, type RouteManifestEntry } from './navigation'
import { DialoguePage } from './pages/DialoguePage'
import { LearnPage } from './pages/LearnPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PracticePage } from './pages/PracticePage'
import { TeamPage } from './pages/TeamPage'

const routeElements: Record<AppRouteId, ReactNode> = {
  home: <Navigate replace to="/learn/lesson-1" />,
  learn: <Navigate replace to="/learn/lesson-1" />,
  lesson: <LearnPage />,
  practice: <PracticePage />,
  dialogue: <DialoguePage />,
  team: <TeamPage />,
  vocabularyLegacy: <Navigate replace to="/learn/lesson-2" />,
  grammarLegacy: <Navigate replace to="/learn/lesson-4" />,
  'not-found': <NotFoundPage />,
}

export function createAppRouteObjects(routes: readonly RouteManifestEntry[] = appRouteManifest): RouteObject[] {
  return [{
    element: <AppShell />,
    children: routes.map((route) => {
      const element = routeElements[route.id as AppRouteId]
      if (!element) throw new Error(`No page element is registered for route ${route.id}.`)
      return route.index === true
        ? { index: true as const, element }
        : { path: route.path, element }
    }),
  }]
}
