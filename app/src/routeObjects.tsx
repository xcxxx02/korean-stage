import type { ReactNode } from 'react'
import type { RouteObject } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { appRouteManifest, type AppRouteId, type RouteManifestEntry } from './navigation'
import { DialoguePage } from './pages/DialoguePage'
import { GrammarPage } from './pages/GrammarPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PracticePage } from './pages/PracticePage'
import { TeamPage } from './pages/TeamPage'
import { VocabularyPage } from './pages/VocabularyPage'

const routeElements: Record<AppRouteId, ReactNode> = {
  home: <HomePage />,
  vocabulary: <VocabularyPage />,
  vocabularyLesson: <VocabularyPage />,
  grammar: <GrammarPage />,
  grammarLesson: <GrammarPage />,
  practice: <PracticePage />,
  practiceLesson: <PracticePage />,
  dialogue: <DialoguePage />,
  team: <TeamPage />,
  learnLegacy: <Navigate replace to="/vocabulary" />,
  learnLesson1Legacy: <Navigate replace to="/vocabulary" />,
  learnLesson2Legacy: <Navigate replace to="/vocabulary/countries" />,
  learnLesson3Legacy: <Navigate replace to="/vocabulary/occupations" />,
  learnLesson4Legacy: <Navigate replace to="/grammar/identity" />,
  learnLesson5Legacy: <Navigate replace to="/grammar/identity" />,
  learnLesson6Legacy: <Navigate replace to="/grammar/negative-identity" />,
  learnLesson7Legacy: <Navigate replace to="/dialogue" />,
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
