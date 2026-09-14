# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

The selected durable design has five primary destinations: Vocabulary, Grammar, Practice, Dialogue, and Team. There is no persistent learner progress. Both vocabulary units share the bilingual word rail, central learning details, compact Listen & watch control, and circular video with a separate audio panel aligned beneath Vocabulary path. Preserve full blue selected-card borders and comfortable card spacing.

The root route is a beginner-friendly welcome page, and the Korean Stage logo always links back to it. Keep the home page concise: one welcome hero, a direct Vocabulary action, and a four-step learning journey. On desktop it should fit comfortably in one viewport; on mobile it may stack naturally.

Vocabulary items must be individual words rather than complete sentences. Keep the approved retained words 학생, 선생님, and 의사; the remaining 15 of 18 vocabulary items intentionally differ from the Lec 1 note. Keep Unit 1 countries with matching flags and Unit 2 occupations with matching illustrations synchronized with examples, unique tips, grammar exercises, practice quizzes, and dialogues.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.
