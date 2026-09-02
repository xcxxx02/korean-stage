/// <reference types="node" />

import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const publicAsset = (name: string) => resolve(process.cwd(), 'public', 'assets', 'culture', name)
const componentSource = (name: string) => readFileSync(resolve(process.cwd(), 'src', 'components', name), 'utf8')

describe('Korean cultural asset contract', () => {
  it.each([
    'dancheong-strip.png',
    'palace-line-art.png',
    'video-coming-soon.png',
    'palace-gate-mark-v2.png',
    'obangsaek-band-v2.png',
    'korean-stage-background-v2.png',
  ])('ships %s in the public culture asset directory', (assetName) => {
    expect(existsSync(publicAsset(assetName))).toBe(true)
  })

  it('integrates the coming-soon media artwork', () => {
    expect(componentSource('MemberVideo.tsx')).toContain('/assets/culture/video-coming-soon.png')
  })

  it('keeps the approved palace gate, obangsaek band, and palace line art in the application shell', () => {
    const shell = componentSource('AppShell.tsx')

    expect(shell).toContain('/assets/culture/palace-gate-mark-v2.png')
    expect(shell).toContain('/assets/culture/obangsaek-band-v2.png')
    expect(shell).toContain('/assets/culture/korean-stage-background-v2.png')
  })
})
