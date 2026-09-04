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
  primaryNavigationTo?: `/${string}`
}

export type RouteManifestEntry = IndexRouteManifestEntry | PathRouteManifestEntry

const requiredPrimaryDestinations = [
  { id: 'vocabulary', path: 'vocabulary', primaryNavigationLabel: 'Vocabulary' },
  { id: 'grammar', path: 'grammar', primaryNavigationLabel: 'Grammar' },
  { id: 'practice', path: 'practice', primaryNavigationLabel: 'Practice' },
  { id: 'dialogue', path: 'dialogue', primaryNavigationLabel: 'Dialogue' },
  { id: 'team', path: 'team', primaryNavigationLabel: 'Team' },
] as const satisfies readonly PathRouteManifestEntry[]

export const appRouteManifest = [
  { id: 'home', index: true },
  requiredPrimaryDestinations[0],
  { id: 'vocabularyLesson', path: 'vocabulary/:lessonSlug' },
  requiredPrimaryDestinations[1],
  { id: 'grammarLesson', path: 'grammar/:lessonSlug' },
  requiredPrimaryDestinations[2],
  { id: 'practiceLesson', path: 'practice/:lessonSlug' },
  ...requiredPrimaryDestinations.slice(3),
  { id: 'learnLegacy', path: 'learn' },
  { id: 'learnLesson1Legacy', path: 'learn/lesson-1' },
  { id: 'learnLesson2Legacy', path: 'learn/lesson-2' },
  { id: 'learnLesson3Legacy', path: 'learn/lesson-3' },
  { id: 'learnLesson4Legacy', path: 'learn/lesson-4' },
  { id: 'learnLesson5Legacy', path: 'learn/lesson-5' },
  { id: 'learnLesson6Legacy', path: 'learn/lesson-6' },
  { id: 'learnLesson7Legacy', path: 'learn/lesson-7' },
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
    return [{ id: route.id, label: route.primaryNavigationLabel, to: route.primaryNavigationTo ?? `/${route.path}` }]
  })
}

export function validatePrimaryNavigation(routes: readonly RouteManifestEntry[] = appRouteManifest): PrimaryNavigationIssue[] {
  return requiredPrimaryDestinations.flatMap((required) => {
    const registered = routes.find((route) => route.id === required.id)
    const requiredDestination = 'primaryNavigationTo' in required ? required.primaryNavigationTo : undefined
    const matches = registered
      && !registered.index
      && registered.path === required.path
      && registered.primaryNavigationLabel === required.primaryNavigationLabel
      && registered.primaryNavigationTo === requiredDestination

    return matches ? [] : [{
      id: required.id,
      message: `Restore the ${required.primaryNavigationLabel} primary navigation route at ${requiredDestination ?? `/${required.path}`}.`,
    }]
  })
}
