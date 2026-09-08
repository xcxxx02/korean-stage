import { describe, expect, it } from 'vitest'
import { normalizeRouterBase } from './deployment'

describe('normalizeRouterBase', () => {
  it.each([
    ['/', '/'],
    ['/korean-stage/', '/korean-stage'],
    ['/nested/course/site/', '/nested/course/site'],
  ])('turns Vite base %s into router basename %s', (viteBase, expected) => {
    expect(normalizeRouterBase(viteBase)).toBe(expected)
  })
})
