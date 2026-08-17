# Beginner Usability Audit

**Surface:** Korean Stage vocabulary learning screen

**Primary user:** English-speaking absolute beginner who cannot yet read Korean

**Evidence:**

1. `01-vocabulary-screen.png` - selected design before the audit
2. `02-revised-beginner-screen.png` - visual revision responding to the audit

## Overall verdict

The original screen has a strong visual hierarchy and makes member video prominent, but it is not yet appropriate for an absolute beginner. The highest-impact problem is the Korean-only vocabulary rail. The original screen also conflicts with the approved seven-unit information architecture and includes vocabulary outside the selected Lec 1 occupation set.

## Step 1 - Open the vocabulary learning screen

**General health:** Needs changes

### Strengths

- The large member video makes the face-and-own-voice coursework requirement obvious.
- The main word has an English meaning, pronunciation support, a Korean example, and an English translation.
- Previous and Next controls communicate a sequential learning journey.
- The white background, restrained cultural decoration, and vivid accents are clear and visually appealing.

### UX and content findings

1. **High - The left rail is Korean-only.** A learner cannot identify or preview upcoming words. Every Korean label needs an adjacent English meaning.
2. **High - The heading and content do not match.** `학생` is an occupation, but the screen says `Lesson 1 · Self-introduction`. It should say `Unit 3 · Jobs & Occupations`.
3. **High - The rail mixes terms outside the chosen Lec 1 occupation list.** The occupation unit must use the lecturer-provided set: 선생님, 회사원, 기자, 의사, 가수, 학생, 군인, and 요리사.
4. **Medium - The top navigation conflicts with the approved architecture.** It needs Learn and Practice, and Exercises should be named Practice consistently.
5. **Medium - Next word appears twice.** One primary bottom action is enough; the duplicate top action competes for attention.
6. **Medium - The icon-only audio action is ambiguous.** It needs a visible English label such as `Listen to Member 1` and an accessible name.
7. **Medium - Romanization and spoken pronunciation are not distinguished.** Show `Romanization: haksaeng` and `Pronunciation: hak-ssaeng` as separate beginner aids.
8. **Medium - Development identity and media can look final.** Generic media and `Member 1` must be visibly marked as development content until replaced with real student information and recordings.

### Accessibility risks visible in the screenshot

- The active rail item relies heavily on blue color. Add a text label such as `Now learning`, a shape/indicator, and the filled number.
- The progress dots also rely on color. The implementation needs screen-reader progress text and a non-color completed/current state.
- Small gray helper text could be difficult to read. English support text must remain at normal readable product sizes and pass contrast checks.
- The screenshot cannot prove keyboard operation, focus order, accessible names, captions, reduced motion, or contrast ratios. These require implementation testing.

## Step 2 - Review the revised beginner screen

**General health:** Ready to become the updated visual target after user approval

The revision adds bilingual rail labels, uses only Lec 1 occupation vocabulary, corrects the unit heading, aligns navigation names, removes the duplicate action, labels human audio playback, distinguishes romanization from pronunciation, and adds a non-color current-item cue. The final implementation must apply the same beginner rule to every unit, exercise, grammar explanation, dialogue control, error message, and mobile menu.
