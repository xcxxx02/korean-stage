/// <reference types="node" />

import { readFileSync, readdirSync } from 'node:fs'
import { extname, relative, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const srcRoot = resolve(process.cwd(), 'src')
const styles = readFileSync(resolve(srcRoot, 'styles.css'), 'utf8')

function productionTsxFiles(directory = srcRoot): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name)
    if (entry.isDirectory()) return productionTsxFiles(path)
    if (extname(entry.name) !== '.tsx' || entry.name.endsWith('.test.tsx')) return []
    return [path]
  })
}

const sources = productionTsxFiles().map((path) => ({
  path: relative(srcRoot, path).replaceAll('\\', '/'),
  source: readFileSync(path, 'utf8'),
}))

const sourceViolations = (pattern: RegExp) => sources.flatMap(({ path, source }) =>
  [...source.matchAll(pattern)].map((match) => `${path}: ${match[0]}`),
)

describe('Korean Stage visual-system contract', () => {
  it('keeps the compact navigation until the header has 1120px of safe width', () => {
    expect(styles.match(/\.desktop-navigation\s*\{\s*display:\s*none;/g)).toHaveLength(1)
    expect(styles).toMatch(/@media \(min-width: 70rem\)[\s\S]*?\.desktop-navigation\s*\{[\s\S]*?display:\s*flex;/)
    expect(styles).not.toMatch(/@media \(min-width: (?:768px|48rem)\)[\s\S]{0,800}?\.desktop-navigation/)
    expect(styles).toMatch(/\.mobile-menu-button\s*\{[\s\S]*?margin-left:\s*auto;/)
  })

  it('does not suppress every programmatic focus target', () => {
    expect(styles).not.toContain('.app-stage [tabindex="-1"]:focus')
    expect(styles).toContain('.app-stage h1[tabindex="-1"]:focus')
    expect(styles).toMatch(/\.practice-focus-target:focus\s*\{[\s\S]*?outline:\s*3px solid var\(--stage-focus\);/)
    expect(styles).toMatch(/\.mobile-navigation\s*\{[\s\S]*?overflow:\s*visible;/)
    expect(styles).toMatch(/\.mobile-navigation a:focus-visible\s*\{[\s\S]*?outline-offset:\s*-3px;/)
  })

  it('uses Stage semantic colors instead of generic Tailwind accents', () => {
    const genericColor = /\b(?:accent|bg|border|outline|text)-(?:amber|black|blue|emerald|red|rose|slate|white|yellow)(?:-\d{2,3})?\b/g
    expect(sourceViolations(genericColor)).toEqual([])
  })

  it('uses the 12px surface radius, one-pixel borders, and menu-only elevation', () => {
    const inconsistentGeometry = /\b(?:border(?:-[lrtbxy])?-[248]|rounded-(?:[trbl]{1,2}-)?(?:md|lg|2xl|3xl)|shadow-(?:sm|md|lg|xl|2xl))\b/g
    expect(sourceViolations(inconsistentGeometry)).toEqual([])
  })

  it('reserves full rounding for true status and progress indicators', () => {
    const allowedStatusPills: Record<string, number> = {
      'components/DialoguePlayer.tsx': 1,
      'components/ExerciseEngine.tsx': 1,
      'components/LearningShell.tsx': 1,
      'components/SubmissionReadiness.tsx': 2,
      'components/TeamGrid.tsx': 2,
      'components/VocabularyJourney.tsx': 2,
      'pages/DialoguePage.tsx': 1,
    }

    const actual = Object.fromEntries(sources.flatMap(({ path, source }) => {
      const count = source.match(/\brounded-full\b/g)?.length ?? 0
      return count > 0 ? [[path, count]] : []
    }))

    expect(actual).toEqual(allowedStatusPills)
  })
})
