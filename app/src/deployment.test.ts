import { describe, expect, it } from 'vitest'
import { normalizeRouterBase, publicAssetPath } from './deployment'

describe('normalizeRouterBase', () => {
  it.each([
    ['/', '/'],
    ['/korean-stage/', '/korean-stage'],
    ['/nested/course/site/', '/nested/course/site'],
  ])('turns Vite base %s into router basename %s', (viteBase, expected) => {
    expect(normalizeRouterBase(viteBase)).toBe(expected)
  })
})

describe('publicAssetPath', () => {
  it.each([
    ['/', '/assets/culture/logo.png', '/assets/culture/logo.png'],
    ['/korean-stage/', '/assets/culture/logo.png', '/korean-stage/assets/culture/logo.png'],
    ['/korean-stage', 'assets/flags/kr.svg', '/korean-stage/assets/flags/kr.svg'],
  ])('resolves %s and %s to %s', (viteBase, assetPath, expected) => {
    expect(publicAssetPath(assetPath, viteBase)).toBe(expected)
  })

  it.each([
    'https://cdn.example.com/video.mp4',
    'data:image/png;base64,abc',
    'blob:https://example.com/id',
  ])('leaves external media URLs unchanged: %s', (url) => {
    expect(publicAssetPath(url, '/korean-stage/')).toBe(url)
  })
})
