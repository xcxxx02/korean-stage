import type { ReactNode } from 'react'
import type { RouteObject } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { appRouteManifest, type AppRouteId, type RouteManifestEntry } from './navigation'
import { DialoguePage } from './pages/DialoguePage'
import { GrammarPage } from './pages/GrammarPage'
import { HomePage } from './pages/HomePage'
import { LearnPage } from './pages/LearnPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PracticePage } from './pages/PracticePage'
import { TeamPage } from './pages/TeamPage'
import { UnitPage } from './pages/UnitPage'
import { VocabularyPage } from './pages/VocabularyPage'

const routeElements: Record<AppRouteId, ReactNode> = {
  home: <HomePage />,
  learn: <LearnPage />,
  unit: <UnitPage />,
  vocabulary: <VocabularyPage />,
  grammar: <GrammarPage />,
  practice: <PracticePage />,
  dialogue: <DialoguePage />,
  team: <TeamPage />,
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
