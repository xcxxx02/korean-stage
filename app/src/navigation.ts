type IndexRouteManifestEntry = {
  id: string
  index: true
  path?: never
  primaryNavigationLabel?: never
}

type PathRouteManifestEntry = {
  id: string
  index?: false
  path: string
  primaryNavigationLabel?: string
}

export type RouteManifestEntry = IndexRouteManifestEntry | PathRouteManifestEntry

const requiredPrimaryDestinations = [
  { id: 'learn', path: 'learn', primaryNavigationLabel: 'Learn' },
  { id: 'vocabulary', path: 'vocabulary', primaryNavigationLabel: 'Vocabulary' },
  { id: 'grammar', path: 'grammar', primaryNavigationLabel: 'Grammar' },
  { id: 'practice', path: 'practice', primaryNavigationLabel: 'Practice' },
  { id: 'dialogue', path: 'dialogue', primaryNavigationLabel: 'Dialogue' },
  { id: 'team', path: 'team', primaryNavigationLabel: 'Team' },
] as const satisfies readonly PathRouteManifestEntry[]

export const appRouteManifest = [
  { id: 'home', index: true },
  requiredPrimaryDestinations[0],
  { id: 'unit', path: 'learn/:unitId' },
  ...requiredPrimaryDestinations.slice(1),
  { id: 'not-found', path: '*' },
] as const satisfies readonly RouteManifestEntry[]

export type AppRouteId = typeof appRouteManifest[number]['id']

export type PrimaryNavigationIssue = {
  id: string
  message: string
}

export function getPrimaryNavigationItems(routes: readonly RouteManifestEntry[] = appRouteManifest) {
  return routes.flatMap((route) => {
    if (route.index || !route.primaryNavigationLabel) return []
    return [{ id: route.id, label: route.primaryNavigationLabel, to: `/${route.path}` }]
  })
}

export function validatePrimaryNavigation(routes: readonly RouteManifestEntry[] = appRouteManifest): PrimaryNavigationIssue[] {
  return requiredPrimaryDestinations.flatMap((required) => {
    const registered = routes.find((route) => route.id === required.id)
    const matches = registered
      && !registered.index
      && registered.path === required.path
      && registered.primaryNavigationLabel === required.primaryNavigationLabel

    return matches ? [] : [{
      id: required.id,
      message: `Restore the ${required.primaryNavigationLabel} primary navigation route at /${required.path}.`,
    }]
  })
}
