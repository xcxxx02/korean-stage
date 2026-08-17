/// <reference types="node" />

import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const publicAsset = (name: string) => resolve(process.cwd(), 'public', 'assets', 'culture', name)
const sourceFile = (name: string) => readFileSync(resolve(process.cwd(), 'src', 'components', name), 'utf8')

describe('Korean cultural asset contract', () => {
  it.each([
    'dancheong-strip.png',
    'palace-line-art.png',
    'video-coming-soon.png',
  ])('ships %s in the public culture asset directory', (assetName) => {
    expect(existsSync(publicAsset(assetName))).toBe(true)
  })

  it('integrates the decorative shell assets', () => {
    const appShell = sourceFile('AppShell.tsx')

    expect(appShell).toContain('/assets/culture/dancheong-strip.png')
    expect(appShell).toContain('/assets/culture/palace-line-art.png')
  })

  it('integrates the coming-soon media artwork', () => {
    expect(sourceFile('MemberVideo.tsx')).toContain('/assets/culture/video-coming-soon.png')
  })
})
