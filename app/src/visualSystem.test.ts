/// <reference types="node" />

import { readFileSync, readdirSync } from 'node:fs'
import { extname, relative, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { contrastRatio, stageColorTokens } from './test/contrast'

const srcRoot = resolve(process.cwd(), 'src')
const styles = readFileSync(resolve(srcRoot, 'styles.css'), 'utf8')
const colors = stageColorTokens(styles)
const variantPrefix = String.raw`(?:(?:[\w-]+(?:-\[[^\]\s]+\])?|\[[^\]\s]+\]):)*`
const colorUtility = String.raw`(?:accent|bg|border|decoration|fill|outline|ring|stroke|text)`
const genericColor = new RegExp(String.raw`\b${variantPrefix}${colorUtility}-(?:amber|black|blue|cyan|emerald|fuchsia|gray|green|indigo|lime|neutral|orange|pink|purple|red|rose|sky|slate|stone|teal|violet|white|yellow|zinc)(?:-[\w./%-]+)?\b|\b${variantPrefix}${colorUtility}-(?:\[[^\]]+\]|\(--[\w-]+\))`, 'g')
const roundedTokens = new RegExp(String.raw`\b${variantPrefix}rounded(?:-(?:t|r|b|l|s|e|tl|tr|br|bl|ss|se|ee|es))?(?:-(?:none|xs|sm|md|lg|xl|2xl|3xl|full|\[[^\]\s"'\`}]+\]))?(?=[\s"'\`}])`, 'g')
const thickBorders = new RegExp(String.raw`\b${variantPrefix}border(?:-[trblxyse])?-(?:[2-9]\d*|\[[^\]]+\])(?=[\s"'\`}])`, 'g')
const shadows = new RegExp(String.raw`\b${variantPrefix}shadow(?:-(?:[\w-]+|\[[^\]]+\]))?(?=[\s"'\`}])`, 'g')
const inlineSurfaceProperty = String.raw`(?:background(?:Color|Image)?|border(?:Color|Radius|Width)?|border(?:Top|Right|Bottom|Left|Block(?:Start|End)?|Inline(?:Start|End)?)(?:Color|Style|Width)?|boxShadow|color)`
const inlineSurfaceStyles = new RegExp(String.raw`style\s*=\s*\{\{(?:(?!\}\})[\s\S])*?['"]?${inlineSurfaceProperty}['"]?\s*:(?:(?!\}\})[\s\S])*?\}\}`, 'g')

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

const invalidRadii = (source: string) => [...source.matchAll(roundedTokens)]
  .map((match) => match[0])
  .filter((token) => !/^rounded-(?:(?:(?:t|r|b|l|s|e|tl|tr|br|bl|ss|se|ee|es)-)?xl|full)$/.test(token.slice(token.lastIndexOf(':') + 1)))

function cssRuleBodies(css: string): Array<{ selector: string, body: string }> {
  return [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((match) => ({
    selector: match[1].trim(),
    body: match[2],
  }))
}

function elevationViolations(css: string): string[] {
  const rules = cssRuleBodies(css)
  const menuRules = rules.filter(({ selector }) => selector === '.mobile-navigation')
  const violations = menuRules.length === 1 ? [] : [`mobile-navigation: expected one exact rule, found ${menuRules.length}`]

  if (menuRules.length === 1) {
    const menuShadows = menuRules[0].body.match(/\bbox-shadow\s*:[^;]+;/g) ?? []
    if (menuShadows.length !== 1 || !/^box-shadow:\s*var\(--stage-shadow-menu\);$/.test(menuShadows[0])) {
      violations.push('mobile-navigation: expected approved menu elevation')
    }
  }

  rules.forEach(({ selector, body }) => {
    if (selector !== '.mobile-navigation' && /\bbox-shadow\s*:/.test(body)) {
      violations.push(`${selector}: box-shadow outside approved menu`)
    }
  })

  return violations
}

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

  it('keeps strong focus treatment and removes nonessential motion when requested', () => {
    expect(styles).toMatch(/:where\(a, button, select, input\):focus-visible\s*\{[^}]*outline:\s*3px solid var\(--stage-focus\);[^}]*outline-offset:\s*3px;/s)
    expect(styles).toMatch(/@media \(prefers-reduced-motion: reduce\)\s*\{[\s\S]*?transition-duration:\s*0\.01ms !important;/)
    expect(styles).toMatch(/@media \(prefers-reduced-motion: reduce\)\s*\{[\s\S]*?scroll-behavior:\s*auto !important;/)
  })

  it('allows elevation only on the compact navigation menu', () => {
    const rules = cssRuleBodies(styles)
    const menuRules = rules.filter(({ selector }) => selector === '.mobile-navigation')
    const otherShadowSelectors = rules
      .filter(({ selector, body }) => selector !== '.mobile-navigation' && /\bbox-shadow\s*:/.test(body))
      .map(({ selector }) => selector)

    expect(menuRules).toHaveLength(1)
    expect(menuRules[0].body.match(/\bbox-shadow:\s*var\(--stage-shadow-menu\);/g)).toEqual([
      'box-shadow: var(--stage-shadow-menu);',
    ])
    expect(otherShadowSelectors).toEqual([])
    expect(elevationViolations(styles)).toEqual([])
  })

  it('rejects moving the sole elevation into a later unrelated rule', () => {
    const misplacedElevation = styles
      .replace(/ {2}box-shadow: var\(--stage-shadow-menu\);\r?\n/, '')
      .concat('\n.unrelated-surface {\n  box-shadow: var(--stage-shadow-menu);\n}\n')

    expect(misplacedElevation.match(/\bbox-shadow\s*:/g)).toHaveLength(1)
    expect(elevationViolations(misplacedElevation)).toEqual([
      'mobile-navigation: expected approved menu elevation',
      '.unrelated-surface: box-shadow outside approved menu',
    ])
  })

  it('uses Stage semantic colors instead of generic Tailwind accents', () => {
    expect(sourceViolations(genericColor)).toEqual([])
  })

  it('uses the 12px surface radius, one-pixel borders, and menu-only elevation', () => {
    expect(sources.flatMap(({ path, source }) => invalidRadii(source).map((token) => `${path}: ${token}`))).toEqual([])
    expect(sourceViolations(thickBorders)).toEqual([])
    expect(sourceViolations(shadows)).toEqual([])
    expect(sourceViolations(inlineSurfaceStyles)).toEqual([])
  })

  it('rejects generic utility variants and non-token inline surface styling', () => {
    const fixture = `
      <div className="rounded rounded-sm rounded-s-sm rounded-tr-[7px] 2xl:hover:rounded-e-md shadow shadow-[0_2px_8px_#000] data-[state=open]:shadow-lg border-2 sm:border-x-[3px] focus-visible:border-s-4 hover:bg-teal-500 text-[#fff] data-[tone=warn]:text-orange-700" />
      <div style={{ borderRadius: '1rem' }} />
      <div className="rounded-xl rounded-t-xl rounded-full" />
    `

    expect(invalidRadii(fixture)).toEqual(['rounded', 'rounded-sm', 'rounded-s-sm', 'rounded-tr-[7px]', '2xl:hover:rounded-e-md'])
    expect([...fixture.matchAll(thickBorders)].map((match) => match[0])).toEqual(['border-2', 'sm:border-x-[3px]', 'focus-visible:border-s-4'])
    expect([...fixture.matchAll(shadows)].map((match) => match[0])).toEqual(['shadow', 'shadow-[0_2px_8px_#000]', 'data-[state=open]:shadow-lg'])
    expect([...fixture.matchAll(genericColor)].map((match) => match[0])).toEqual(['hover:bg-teal-500', 'text-[#fff]', 'data-[tone=warn]:text-orange-700'])
    expect([...fixture.matchAll(inlineSurfaceStyles)]).toHaveLength(1)
  })

  it('rejects Tailwind v4 custom-property color shorthand', () => {
    const fixture = '<div className="bg_TOKEN_(--brand-color) text_TOKEN_(--brand-ink) border_TOKEN_(--brand-line) focus:ring_TOKEN_(--brand-focus)" />'
      .replaceAll('_TOKEN_', '-')

    expect([...fixture.matchAll(genericColor)].map((match) => match[0])).toEqual([
      'bg\u002d(--brand-color)',
      'text\u002d(--brand-ink)',
      'border\u002d(--brand-line)',
      'focus:ring\u002d(--brand-focus)',
    ])
  })

  it('rejects multi-segment named shadows', () => {
    const fixture = '<div className="shadow_TOKEN_stage-menu hover:shadow_TOKEN_brand-raised" />'
      .replaceAll('_TOKEN_', '-')

    expect([...fixture.matchAll(shadows)].map((match) => match[0])).toEqual(['shadow\u002dstage-menu', 'hover:shadow\u002dbrand-raised'])
  })

  it('rejects inline shorthand and directional surface styles', () => {
    const fixture = `
      <div style={{
        background: '#fff',
      }} />
      <div style = {{ backgroundColor: '#fff' }} />
      <div style={{ border: '2px solid red' }} />
      <div style={{ borderTop: '2px solid red' }} />
      <div style={{ borderRight: '2px solid red' }} />
      <div style={{ borderBottom: '2px solid red' }} />
      <div style={{ borderLeft: '2px solid red' }} />
      <div style={{ borderWidth: '2px' }} />
      <div style={{ borderTopWidth: '2px' }} />
      <div style={{ borderRightWidth: '2px' }} />
      <div style={{ borderBottomWidth: '2px' }} />
      <div style={{ borderLeftWidth: '2px' }} />
      <div style={{ borderBlockWidth: '2px' }} />
      <div style={{ borderBlockStartWidth: '2px' }} />
      <div style={{ borderBlockEndWidth: '2px' }} />
      <div style={{ borderInlineWidth: '2px' }} />
      <div style={{ borderInlineStartWidth: '2px' }} />
      <div style={{ borderInlineEndWidth: '2px' }} />
      <div style={{ boxShadow: '0 2px 8px #000' }} />
      <div style={{ borderRadius: '4px' }} />
    `

    expect([...fixture.matchAll(inlineSurfaceStyles)].map((match) => match[0])).toHaveLength(20)
  })

  it('reserves full rounding for true status and progress indicators', () => {
    const allowedStatusPills: Record<string, RegExp> = {
      'components/DialoguePlayer.tsx': /Current line/,
      'components/ExerciseEngine.tsx': /Score:/,
      'components/LearningShell.tsx': /\{progress\}/,
      'components/SubmissionReadiness.tsx': /Passed|Human review required/,
      'components/TeamGrid.tsx': /Replace before submission|assignedVocabulary\.length/,
      'components/VocabularyJourney.tsx': /\{index \+ 1\}|Now learning/,
      'pages/DialoguePage.tsx': /Selected dialogue/,
    }

    const invalidPills = sources.flatMap(({ path, source }) => [...source.matchAll(/\brounded-full\b/g)].flatMap((match) => {
      const component = source.slice(match.index, match.index + 400)
      return allowedStatusPills[path]?.test(component) ? [] : [`${path}: ${component.split('\n')[0]}`]
    }))

    expect(invalidPills).toEqual([])
  })

  it('meets WCAG contrast for meaningful normal text token pairings', () => {
    const textPairs = [
      ['stage-faint', 'stage-white'],
      ['stage-faint', 'stage-soft'],
      ['stage-white', 'stage-vermilion'],
      ['stage-charcoal', 'stage-white'],
      ['stage-charcoal', 'stage-soft'],
      ['stage-muted', 'stage-white'],
      ['stage-muted', 'stage-soft'],
      ['stage-muted', 'stage-disabled'],
      ['stage-cobalt', 'stage-white'],
      ['stage-cobalt', 'stage-cobalt-soft'],
      ['stage-white', 'stage-cobalt'],
      ['stage-white', 'stage-cobalt-strong'],
      ['stage-white', 'stage-vermilion-strong'],
      ['stage-white', 'stage-charcoal'],
      ['stage-cobalt-soft', 'stage-charcoal'],
      ['stage-vermilion-strong', 'stage-white'],
      ['stage-vermilion-strong', 'stage-vermilion-soft'],
      ['stage-yellow-strong', 'stage-white'],
      ['stage-yellow-strong', 'stage-yellow-soft'],
      ['stage-jade-strong', 'stage-white'],
      ['stage-jade-strong', 'stage-jade-soft'],
    ] as const

    const failures = textPairs.flatMap(([foreground, background]) => {
      const ratio = contrastRatio(colors[foreground], colors[background])
      return ratio >= 4.5 ? [] : [`${foreground} on ${background}: ${ratio.toFixed(2)}:1`]
    })

    expect(failures).toEqual([])
  })

  it('meets WCAG non-text contrast for interactive and semantic boundaries', () => {
    const boundaryPairs = [
      ['stage-border-strong', 'stage-white'],
      ['stage-border-strong', 'stage-soft'],
      ['stage-cobalt', 'stage-white'],
      ['stage-cobalt', 'stage-soft'],
      ['stage-focus', 'stage-white'],
      ['stage-focus', 'stage-soft'],
      ['stage-vermilion', 'stage-white'],
      ['stage-vermilion', 'stage-soft'],
      ['stage-yellow', 'stage-white'],
      ['stage-yellow', 'stage-soft'],
      ['stage-jade', 'stage-white'],
      ['stage-jade', 'stage-soft'],
    ] as const

    const failures = boundaryPairs.flatMap(([foreground, background]) => {
      const ratio = contrastRatio(colors[foreground], colors[background])
      return ratio >= 3 ? [] : [`${foreground} on ${background}: ${ratio.toFixed(2)}:1`]
    })

    expect(failures).toEqual([])
  })
})
