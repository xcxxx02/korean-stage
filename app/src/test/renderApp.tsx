import { render } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { createAppRouteObjects } from '../routeObjects'

export function renderApp(initialEntries: string[]) {
  const router = createMemoryRouter(createAppRouteObjects(), { initialEntries })
  return render(<RouterProvider router={router} />)
}
