import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { DialoguePage } from './pages/DialoguePage'
import { GrammarPage } from './pages/GrammarPage'
import { HomePage } from './pages/HomePage'
import { LearnPage } from './pages/LearnPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PracticePage } from './pages/PracticePage'
import { TeamPage } from './pages/TeamPage'
import { VocabularyPage } from './pages/VocabularyPage'

const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'learn', element: <LearnPage /> },
      { path: 'learn/:unitId', element: <LearnPage /> },
      { path: 'vocabulary', element: <VocabularyPage /> },
      { path: 'grammar', element: <GrammarPage /> },
      { path: 'practice', element: <PracticePage /> },
      { path: 'dialogue', element: <DialoguePage /> },
      { path: 'team', element: <TeamPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
