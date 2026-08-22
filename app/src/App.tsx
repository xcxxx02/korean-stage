import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { createAppRouteObjects } from './routeObjects'

const router = createBrowserRouter(createAppRouteObjects())

export default function App() {
  return <RouterProvider router={router} />
}
