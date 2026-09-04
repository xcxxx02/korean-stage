# Vocabulary information architecture

## Goal

Make vocabulary a clear, standalone beginner-learning destination. Learners choose a topic before opening the focused word-learning view. The site should not present grammar or dialogue lessons as vocabulary.

## Navigation

The primary navigation will contain these five destinations, in this order:

1. Vocabulary
2. Grammar
3. Practice
4. Dialogue
5. Team

The Learn destination is removed. Existing direct lesson URLs remain safe to visit and should redirect to the appropriate active destination rather than show an empty or broken page.

## Vocabulary home

`/vocabulary` becomes a concise topic chooser with exactly three cards:

| Unit | Label | Content type |
| --- | --- | --- |
| Unit 1 | Essential greetings | Useful expressions |
| Unit 2 | Countries & Nationalities | Vocabulary words |
| Unit 3 | Jobs & Occupations | Vocabulary words |

Each card explains the topic in plain English and links to its own vocabulary learning route. Units 4, 5, and 6 are grammar-only and Unit 7 is dialogue-only; none appears in this chooser.

## Vocabulary learning view

Each chosen unit uses the established Unit 3 learning anatomy:

- ordered, bilingual word/expression selector;
- compact, clearly labelled member-recording area;
- Korean item, English meaning, romanization, spoken pronunciation hint, example, and relevant grammar cue;
- visible Previous and Next controls;
- white background, vivid Korean-inspired palette, and restrained cultural line art.

Unit 1 reuses this exact interaction pattern but labels its entries **Useful expression**. This makes greetings discoverable while correctly distinguishing complete expressions from individual words. Units 2 and 3 remain labelled vocabulary.

## Content and course boundaries

Vocabulary will cover only material from the Lecture 1 vocabulary and introductory-expression scope. No new language content is invented. Course media remains an honest placeholder until group members supply their own recorded selfie videos and voices.

Grammar pages retain Units 4-6 and explain their own grammar items. Practice remains the quiz area. Dialogue remains the video/role-play area. Team remains the group-information area.

## Implementation boundaries

- Centralise the vocabulary unit metadata so the nav, chooser, routes, and page headings agree.
- Reuse `VocabularyJourney` instead of creating a second vocabulary learning UI.
- Preserve beginner bilingual labels and all existing keyboard/accessibility behaviour.
- Add route and UI tests for the new navigation, three-card chooser, Unit 1 expression terminology, and removal of Units 4-7 from Vocabulary.

## Acceptance checks

1. Learn is absent from visible primary navigation.
2. Vocabulary is visible between the brand and the other active destinations as the first learning destination.
3. `/vocabulary` shows only Units 1-3.
4. Each Vocabulary card opens the shared learning view and Unit 1 visibly says Useful expression.
5. Grammar, Practice, Dialogue, and Team still reach their correct content.
6. Tests, typecheck, lint, build, and responsive keyboard coverage pass.
