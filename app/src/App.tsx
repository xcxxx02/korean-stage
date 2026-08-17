import type { ReactNode } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { appRouteManifest, type AppRouteId } from './navigation'
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

const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: appRouteManifest.map((route) => 'index' in route
      ? { index: true as const, element: routeElements[route.id] }
      : { path: route.path, element: routeElements[route.id] }),
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
