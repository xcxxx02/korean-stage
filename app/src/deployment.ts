export function normalizeRouterBase(viteBase: string) {
  if (viteBase === '/') return '/'
  return viteBase.replace(/\/$/, '')
}

export function publicAssetPath(path: string, viteBase = import.meta.env.BASE_URL) {
  if (/^(?:[a-z]+:)?\/\//i.test(path) || /^(?:data|blob):/i.test(path)) return path

  const base = viteBase === '/' ? '/' : `/${viteBase.replace(/^\/+|\/+$/g, '')}/`
  return `${base}${path.replace(/^\/+/, '')}`
}
