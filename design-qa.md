# Homepage design QA

- Source visual truth: `C:\Users\Nitro\.codex\generated_images\01a00e73-4a35-7c00-8237-c6f4815271b8\exec-e792736b-2bf2-4231-a3c9-8ee866ceb7d6.png`
- Browser implementation: `http://127.0.0.1:4177/`
- Implementation screenshot evidence: browser-rendered inline capture from Codex in-app browser tab 3. The browser surface did not expose a filesystem path for its PNG bytes.
- Viewport: 1776 × 887 CSS pixels, device scale factor 1
- Source pixels: 1774 × 887
- Implementation capture pixels: 1776 × 887
- Density normalization: source and implementation were both reviewed at approximately 1×; no density scaling was needed.
- State: homepage, first viewport, animated vocabulary showcase visible; interaction state was also checked after choosing the 태국 card.

## Full-view comparison evidence

The approved design and the live implementation were loaded into one QA comparison page at full desktop dimensions. The implementation preserves the approved two-column hierarchy, large welcome message, obangsaek header strip, hanok learning stage, rotating Korean word cards, primary vocabulary action, and connected four-step learning journey. The live version intentionally simplifies the illustrative props so the experience remains people-free and the vocabulary stays the visual focus.

## Focused region comparison evidence

The animated hanok showcase was separately captured at 850 × 500 CSS pixels. The generated frame stays sharp, the active card remains centered, supporting cards remain readable, and the waveform and selector dots have clear contrast. A 390-pixel-wide focused capture also confirmed that the active vocabulary card, supporting cards, caption plaque, and journey heading stack without horizontal overflow.

## Required fidelity surfaces

- Fonts and typography: Noto Sans/Noto Sans KR hierarchy is consistent with the existing site and closely follows the approved mock's heavy display heading and compact supporting copy. No clipping or unintended wrapping remains.
- Spacing and layout rhythm: desktop content fits within the first viewport at 1776 × 887 and 1280 × 720. The hero and journey maintain distinct vertical zones; mobile stacks cleanly.
- Colors and visual tokens: cobalt, jade, vermilion, yellow, warm cream, and charcoal remain aligned with the site palette and source direction.
- Image quality and asset fidelity: the custom 960 × 620 hanok stage is crisp, people-free, and used as a raster asset rather than reconstructed with CSS. UI cards and controls remain live HTML.
- Copy and content: greeting, learning promise, CTA, vocabulary labels, and four learning destinations are intact and beginner-friendly.

## Comparison history

1. Initial comparison found a P2 control issue: global button sizing stretched the three selector dots into tall bars. Fixed by retaining 36-pixel hit areas and rendering the visible dot through a centered pseudo-element. Post-fix focused capture shows three compact circular indicators.
2. Initial comparison found a P2 polish issue: the caption sat directly over the wooden stage base. Fixed by slightly reducing the stage height and placing the caption in a warm bordered plaque below it. Post-fix desktop and mobile captures show clear separation and legibility.

## Findings

No actionable P0, P1, or P2 findings remain.

## Primary interactions tested

- Automatic vocabulary rotation after four seconds
- Manual vocabulary selection through the three accessible selector buttons
- Reduced-motion preference keeps the preview static
- Vocabulary CTA and learning-path links remain keyboard-accessible links

## Console errors checked

No browser console errors or warnings were present after loading the homepage and selecting a vocabulary card.

## Follow-up polish

- P3: The source mock contains additional book and headphone props. The implementation intentionally omits them to keep the live animation simpler and less decorative at smaller desktop widths.

final result: passed
