# LMPU3282 Coursework Coverage

Verified: 2026-08-22

Coursework source: `C:\Users\Nitro\Downloads\T2620_LMPU3282_Coursework Specification.pdf`

Lesson source: `C:\Users\Nitro\Downloads\04_LMPU3282_Note_L1.pdf`

## Overall status

**The structural website passes the verified development checks, but the project is not ready for coursework submission.** Real member identities, final human recordings, synchronized captions/transcripts, and human qualitative/content review remain required.

Status terms:

- **PASS** - implemented and verified in the current build.
- **STRUCTURE PASS / USER MEDIA BLOCKED** - data model, count, route, and honest missing state pass, but assessed human media is absent.
- **HUMAN REVIEW REQUIRED** - code and screenshots cannot decide the rubric criterion.
- **USER ACTION REQUIRED** - operational submission work outside the website.

## Authority and explicit user rulings

The coursework PDF is the grading source. The Lec 1 PDF is the selected lesson source. The following are current user/product decisions, not claims about wording in the coursework PDF:

| Decision | Relationship to source |
|---|---|
| Use Lec 1 only and adapt it into seven website **units** | The PDF requires one selected lesson from Lessons 1-6; the seven-unit split is the approved site organization. |
| Use exactly **3 exercises for each of 3 grammar points** (9 total) | The PDF allows 2-5 exercises per chosen grammar point; exactly 3 is within that range and is the binding user ruling. |
| Teach Unit 3 vocabulary as one sequential word journey | Product decision; the PDF does not prescribe sequence. |
| Configure 2 current members and keep components data-driven for 2-6 | The current submission has 2 placeholder members; six-member rendering is automated-test covered. Final content still must be adjusted to the actual enrolled group. |

## Coursework requirement traceability

| Coursework requirement | Route | Visible evidence | Automated / browser evidence | Status |
|---|---|---|---|---|
| Assignment is a group or permitted special-student individual recorded speech presented as an educational Korean website | `/`, `/team` | Korean Stage purpose, team contributions, and recording readiness | Home, TeamGrid, readiness tests; browser steps 1 and 10 | PASS as a group-site structure; recordings blocked |
| Select one lesson from Lessons 1-6 and use a beginner-friendly theme | All routes | Home and Team say all seven units are adapted entirely from Lec 1; beginner English support throughout | Course validator/source tests; Home/Team tests; all 30 browser checkpoints | PASS |
| Lec 1 country/nationality vocabulary | `/learn/unit-2`, `/vocabulary`, `/practice` | 8 bilingual items: China, Japan, USA, Korea, France, Germany, Australia, United Kingdom | VocabularyJourney, VocabularyPage, FlashcardDeck, Practice tests; browser Unit 2/Practice | PASS |
| Lec 1 occupation vocabulary | `/learn/unit-3`, `/vocabulary`, `/practice` | 8 ordered items: 학생, 선생님, 회사원, 기자, 의사, 가수, 군인, 요리사 | Course data and journey tests; browser proves 8 distinct sequential states at all viewports | PASS |
| Each member records 3-5 vocabulary words | `/team`, `/learn/unit-3` | Member 1 owns 4 and Member 2 owns 4; Team shows `3-5 count passed` | Validator rejects outside 3-5; Team/readiness tests | STRUCTURE PASS / USER MEDIA BLOCKED |
| Every recorded word includes Korean, English, and a Korean example sentence | `/learn/unit-3` | Detail panel shows Korean, adjacent English, Korean example, and English learner translation; romanization/pronunciation are additional support | Course validator/data tests and VocabularyJourney tests | PASS |
| Vocabulary video uses that member's own face and voice | `/learn/unit-3`, `/team` | Honest `Member video coming soon` state and owner label; no fake media | Human-only media tests; readiness remains `Not ready for submission` | USER MEDIA BLOCKED - 8 real selfie videos required |
| Speak clearly with correct pronunciation | `/learn/unit-3`, `/team` | Recording checklist says Speak clearly and Check pronunciation | Missing-media UI tests; readiness qualitative checks | HUMAN REVIEW REQUIRED after recordings |
| Ensure good lighting and minimal background noise | `/learn/unit-3`, `/team` | Recording checklist includes both rules | Missing-media UI tests; browser media-state captures | HUMAN REVIEW REQUIRED after recordings |
| Explain grammar from the selected lesson in clear English with examples | `/grammar`, `/learn/unit-4`, `/learn/unit-5`, `/learn/unit-6` | Three Lec 1 forms, English explanations, consonant/vowel rules, at least two bilingual examples each | GrammarLesson tests cover all three exact rule/example sets; browser Unit 4 | PASS structurally; fluent-human content review required |
| Create 2-5 exercises for every selected grammar point | Units 4-6, `/practice` | **Exactly 3 exercises per grammar point**, 9 total, with genuine sentence-completion, particle-selection, multiple-choice, and Korean-to-English matching modes | Validator requires exactly 3, all four modes, and complete unique matching pairs; engine/lesson/practice tests cover feedback, retry, persistence, hydration, scoring, completion, and review; browser exercises matching by keyboard in both contexts | PASS - exact user ruling satisfied |
| Add quizzes, flashcards, and other engaging activities | `/practice`, Units 4-6 | 16-card bilingual deck, accessible two-pair matching, per-unit feedback/retry, and a 9-question final challenge/results/review | ExerciseEngine, FlashcardDeck, GrammarLesson, Practice tests; browser flashcard and matching-challenge states | PASS |
| Create 2-3 dialogues adjusted to group size | `/dialogue`, `/learn/unit-7` | 2 dialogues for the current two-person group | Validator and source-data tests; browser Dialogue state | PASS structurally |
| Each dialogue has 2-3 clearly labeled speakers | `/dialogue` | Each dialogue has 2 named development speakers and explicit line-owner labels | Validator speaker/line tests; DialoguePlayer tests | PASS structurally; replace identities |
| Each dialogue is 6-8 lines | `/dialogue` | Both configured dialogues contain exactly 8 lines | Validator/source-data tests; DialoguePlayer transcript tests | PASS |
| Dialogue is written in Korean with English translations | `/dialogue` | Every line keeps Korean and English together | Validator rejects incomplete bilingual lines; DialoguePlayer tests | PASS structurally; fluent-human review required |
| Record a short drama-style video showing faces and voices, acting naturally | `/dialogue`, `/team` | Honest `Full role-play video coming soon` state; checklist includes faces, real voice, and natural acting | Human-only media tests; readiness reports missing video | USER MEDIA BLOCKED - 2 real drama videos required |
| Dialogue video duration is 1-3 minutes | `/dialogue`, `/team` | UI labels the 1-3 minute requirement; development data makes no duration claim, and Team does **not** show duration as passed while a real video is absent | Validator accepts duration only for a non-null `human-recording` video within 60-180 seconds and rejects missing/out-of-range real duration; browser asserts the missing-video state cannot show a duration pass | USER MEDIA BLOCKED - actual file duration is unverified until final videos exist |
| Create a website name and briefly explain its purpose | `/`, `/team` | Korean Stage name and Lec 1 beginner purpose | Validator, Home, TeamGrid, readiness tests | PASS |
| Introduce each member, including name and student ID | `/team` | Member cards deliberately say Member 1/2 and `Add your student ID`, marked `Replace before submission` | Identity validator and readiness tests | USER MEDIA/DATA BLOCKED - real names and IDs required |
| Website is user-friendly and visually appealing | All primary routes | Consistent bilingual hierarchy, responsive Stage visual system, clear missing states | Root `design-qa.md`; 30 fresh screenshots; no open P0-P2 | PASS for tested development states; grader decides final creativity |
| Include audio playback | `/learn/unit-1`, `/learn/unit-3`, `/dialogue` | Typed greeting/self-introduction and vocabulary/dialogue models have accessible `Listen to ...` controls; controls are disabled with written fallbacks while audio is absent | Validator/readiness require and precisely identify each Unit 1 model's human audio; HumanAudioButton, exact learner-content/audio-state, and media tests cover the UI; browser verifies both Unit 1 missing-audio controls and fallbacks | USER MEDIA BLOCKED - 2 Unit 1 and 8 vocabulary human-audio files are required |
| Provide clear navigation | Global header, `/` course map | Six primary destinations, active route, mobile Menu, seven-unit map, Previous/Next | Shared manifest tests, accessibility keyboard audit, mutation test, 3-viewport browser journey | PASS |
| Keep content well organized | All routes | Seven units, dedicated Vocabulary/Grammar/Practice/Dialogue/Team views, English task instructions | Route/accessibility tests; design QA; browser journey | PASS structurally |
| Late submission loses 0.5 marks per working day | No route; submission process | Not a website behavior | Source-PDF verification only | USER ACTION REQUIRED - submit by the lecturer's deadline |
| AI-generated voices are strictly prohibited and receive 0 marks | `/team` and every media component | Red alert: `AI-generated voices receive 0 marks and must never be added`; AI media never renders a playable control | Validator prohibition tests, media rejection tests, readiness tests | PASS guard; final supplied files must remain human-only |

## Rubric traceability

Passing technical evidence does not predict or guarantee a mark; the lecturer applies the rubric.

| Rubric criterion | Route / evidence | Automated / browser evidence | Status |
|---|---|---|---|
| Organization of responses and paragraph | Seven-unit progression, bilingual explanations, line labels, nearby translations, final review | Course structure tests, route-specific heading/axe audit, full browser journey | PASS structurally; lecturer grades the final content |
| Pronunciation and intonation of Korean | Vocabulary and dialogue recordings | UI checklist and readiness warnings only | HUMAN REVIEW REQUIRED after final human recordings |
| Flow of verbal communication | Full uninterrupted dialogue videos | Full-video slot, 6-8-line transcript, 60-180-second validator | USER MEDIA BLOCKED, then HUMAN REVIEW REQUIRED |
| Creativity | Obangsaek Stage palette, dancheong strip, cultural raster art, sequential interaction, practice modes | Fresh source/build comparison and responsive screenshots; no P0-P2 | PASS development QA; lecturer assigns the rubric mark |

## Lec 1 source-content traceability

| Lec 1 PDF content | Site evidence | Status |
|---|---|---|
| Nationalities/countries: 중국, 일본, 미국, 한국, 프랑스, 독일, 호주, 영국 | Unit 2 and Vocabulary review | PASS |
| Occupations: 선생님, 회사원, 기자, 의사, 가수, 학생, 군인, 요리사 | Sequential Unit 3 and Vocabulary review | PASS |
| `N은/는 N이에요/예요` identification ending | Unit 4 | PASS |
| `N은/는` topic marker | Unit 5 | PASS |
| `N이/가 아니에요` negative identification | Unit 6 | PASS |
| Informal greeting and self-introduction models | Typed Unit 1 models show Korean, English, romanization/pronunciation support, owner, and human-audio slots; two original Unit 7 dialogues extend them | PASS structurally; Unit 1 audio is visibly missing and fluent-human review remains required |

## Product/accessibility requirements beyond the coursework PDF

These are approved user/design requirements and must not be misattributed to the coursework PDF.

| Requirement | Evidence | Status |
|---|---|---|
| Exactly 3 exercises for each grammar point | 3 + 3 + 3 in Units 4-6; 9-question challenge; four genuine interaction modes including matching | PASS |
| Only Lec 1 split into 7 units | Home/Team source statement and seven-unit map | PASS |
| Sequential vocabulary | Browser advances all eight distinct Unit 3 states in order at every viewport | PASS |
| Current 2 members; UI supports 2-6 | Team shows 2; TeamGrid test renders 6 without component changes | PASS structurally |
| Human audio for both Unit 1 models | Validator/readiness identify the Korean/English model and owner for each missing file | USER MEDIA BLOCKED - 2 human-audio files required |
| Matching human audio for all 8 vocabulary videos | Missing states and readiness report | USER MEDIA BLOCKED |
| Captions or synchronized transcripts for all 8 vocabulary videos | Component supports caption tracks and adjacent transcript; no final recordings/captions exist | USER MEDIA BLOCKED |
| Two complete 1-3 minute human drama videos | Missing states, duration validator | USER MEDIA BLOCKED |
| Responsive, keyboard-complete flow | 1440 x 1024, 834 x 1194, 390 x 844 Playwright audit | PASS for tested states |

## Automated and browser evidence summary

- Initial gates before Task 12 fixes: 20/20 Vitest files and 142/142 tests passed; typecheck, lint, build, and 4/4 Sites worker tests passed.
- Route-harness TDD: expected red (`createAppRouteObjects is not a function`), then 17/17 accessibility tests passed using production route objects. The test uses `route.index === true`, route-specific headings, and a mutated Team path so wildcard NotFound cannot pass silently.
- Visual-consistency TDD: Home/Unit 1 checks produced 2 expected failures, then Home/Learn/accessibility passed 23/23.
- Review-fix TDD: duration/readiness, typed Unit 1 audio models, derived Home summary, matching validation/interaction/persistence, and qualitative checks moved through focused RED/GREEN runs; the complete suite contains 21 files and 159 tests.
- Final re-review TDD: five focused expectations first proved missing/AI/inconsistent Unit 1 audio did not block readiness, then 40/40 passed after typed `introduction-model-media` validation and precise owner/model remediation. A separate duplicate-Korean matching test moved RED to 41/41 GREEN after pair uniqueness was completed.
- Current full verification after the re-review: 21/21 files and 165/165 tests, typecheck, lint, production build, and 4/4 Sites tests passed.
- Final browser run: 10 primary-journey states at each of 3 exact viewports; 0 real axe violations, 0 console/page errors, 0 horizontal-overflow failures; keyboard matching in Unit 4 and Practice, both Unit 1 missing-audio states, honest unverified duration readiness, qualitative-check presence, and the eight-item sequence all passed.
- Final full command results are recorded in `.superpowers/sdd/2026-08-17-korean-stage-implementation/task-12-report.md`.

## Remaining user-supplied submission dependencies

1. Replace Member 1 and Member 2 with every current member's real name and student ID.
2. Supply 2 human-recorded audio files for the typed Unit 1 greeting and self-introduction models, one from each assigned owner.
3. Supply 8 real member selfie vocabulary videos, four per current member, showing the assigned member's face and using that member's own voice.
4. Supply matching human audio for those 8 vocabulary items.
5. Supply synchronized captions or transcripts for all 8 vocabulary videos.
6. Supply 2 complete 1-3 minute drama videos showing the participating members' faces and using their own voices.
7. Have a person review pronunciation, intonation, lighting, background noise, natural acting, and uninterrupted verbal flow.
8. Have the lecturer or a fluent Korean reviewer check every Korean word, example, explanation, answer, and dialogue line.
9. Confirm every final media file is human-recorded. **Any AI-generated voice receives 0 marks.**

Until all nine submission items are complete and the readiness report is rerun against the real files, do not submit the site as coursework-ready.
