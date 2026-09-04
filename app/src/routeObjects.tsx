import type { ReactNode } from 'react'
import type { RouteObject } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { appRouteManifest, type AppRouteId, type RouteManifestEntry } from './navigation'
import { DialoguePage } from './pages/DialoguePage'
import { GrammarPage } from './pages/GrammarPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PracticePage } from './pages/PracticePage'
import { TeamPage } from './pages/TeamPage'
import { VocabularyPage } from './pages/VocabularyPage'

const routeElements: Record<AppRouteId, ReactNode> = {
  home: <Navigate replace to="/vocabulary" />,
  vocabulary: <VocabularyPage />,
  vocabularyLesson: <VocabularyPage />,
  grammar: <GrammarPage />,
  grammarLesson: <GrammarPage />,
  practice: <PracticePage />,
  practiceLesson: <PracticePage />,
  dialogue: <DialoguePage />,
  team: <TeamPage />,
  learnLegacy: <Navigate replace to="/vocabulary" />,
  learnLesson1Legacy: <Navigate replace to="/vocabulary/lesson-1" />,
  learnLesson2Legacy: <Navigate replace to="/vocabulary/lesson-2" />,
  learnLesson3Legacy: <Navigate replace to="/vocabulary/lesson-3" />,
  learnLesson4Legacy: <Navigate replace to="/grammar/lesson-4" />,
  learnLesson5Legacy: <Navigate replace to="/grammar/lesson-5" />,
  learnLesson6Legacy: <Navigate replace to="/grammar/lesson-6" />,
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
