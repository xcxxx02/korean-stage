import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { normalizeRouterBase } from './deployment'
import { createAppRouteObjects } from './routeObjects'

const router = createBrowserRouter(createAppRouteObjects(), {
  basename: normalizeRouterBase(import.meta.env.BASE_URL),
})

export default function App() {
  return <RouterProvider router={router} />
}
