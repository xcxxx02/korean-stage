export function normalizeRouterBase(viteBase: string) {
  if (viteBase === '/') return '/'
  return viteBase.replace(/\/$/, '')
}
