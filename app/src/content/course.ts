import type { ChoiceExercise, Course, CourseLesson, DialogueLine, Exercise, MediaSource, VocabularyItem } from './types'

export const vocabularyUnits = [
  { id: 'vocabulary-1', unitId: 'vocabulary-1', slug: 'countries', lessonSlug: 'countries', title: 'Countries & Nationalities', eyebrow: 'Unit 1', itemLabel: 'Vocabulary words', description: 'Learn country names used to introduce where someone is from.' },
  { id: 'vocabulary-2', unitId: 'vocabulary-2', slug: 'occupations', lessonSlug: 'occupations', title: 'Jobs & Occupations', eyebrow: 'Unit 2', itemLabel: 'Vocabulary words', description: 'Learn common occupations for introducing yourself and others.' },
] as const

export const grammarUnits = [
  { id: 'grammar-1', slug: 'identity', title: 'Talking about who someone is', eyebrow: 'Unit 1', description: 'Use topic markers and polite “to be” endings.' },
  { id: 'grammar-2', slug: 'negative-identity', title: 'Saying what someone is not', eyebrow: 'Unit 2', description: 'Use 이/가 아니에요 to correct or clarify identity.' },
] as const

export const courseLessons = [...vocabularyUnits, ...grammarUnits] as const satisfies readonly CourseLesson[]

export const getLessonBySlug = (slug: string) =>
  courseLessons.find((lesson) => lesson.slug === slug)

const developmentMedia = (durationSeconds?: number): MediaSource => ({
  src: null,
  kind: 'development-missing',
  ...(durationSeconds === undefined ? {} : { durationSeconds }),
})

const humanRecording = (src: string, durationSeconds: number): MediaSource => ({
  src,
  kind: 'human-recording',
  durationSeconds,
})

const vocabulary = (
  id: string,
  unitId: VocabularyItem['unitId'],
  korean: string,
  english: string,
  romanization: string,
  pronunciationHint: string | undefined,
  koreanExample: string,
  englishExample: string,
  grammarTip: string,
  ownerId: string | null,
  imageKind: 'flag' | 'occupation',
  imageFile: string = id,
  recording?: { memberSlug: string; durationSeconds: number },
): VocabularyItem => ({
  id,
  unitId,
  displayKind: 'word',
  korean,
  english,
  romanization,
  ...(pronunciationHint === undefined ? {} : { pronunciationHint }),
  koreanExample,
  englishExample,
  grammarTip,
  image: { src: `/assets/${imageKind === 'flag' ? 'flags' : 'occupations'}/${imageFile}.svg`, alt: `${english} ${imageKind === 'flag' ? 'flag' : 'occupation illustration'}`, kind: imageKind },
  ownerId,
  assessmentStatus: 'assessed',
  recordingRequirement: 'member-recording-required',
  video: recording
    ? humanRecording(`/media/vocabulary/${recording.memberSlug}/${id}.mp4`, recording.durationSeconds)
    : developmentMedia(),
  audio: recording
    ? humanRecording(`/media/vocabulary/${recording.memberSlug}/${id}.m4a`, recording.durationSeconds)
    : developmentMedia(),
})

const exercise = (
  id: string,
  grammarId: string,
  type: ChoiceExercise['type'],
  prompt: string,
  koreanContext: string,
  choices: string[],
  answer: string,
  explanation: string,
): Exercise => ({ id, grammarId, answerLanguage: 'ko', type, prompt, koreanContext, choices, answer, explanation })

const matchingExercise = (
  id: string,
  grammarId: string,
  prompt: string,
  koreanContext: string,
  pairs: Array<{ id: string; korean: string; english: string }>,
  explanation: string,
): Exercise => ({ id, grammarId, answerLanguage: 'ko', type: 'matching', prompt, koreanContext, pairs, explanation })

const dialogueLine = (id: string, speakerId: string, korean: string, english: string): DialogueLine => ({
  id,
  speakerId,
  korean,
  english,
  audio: developmentMedia(),
})

export const course: Course = {
  sourceLesson: 'Lec 1',
  name: 'Korean Stage',
  purpose: 'Korean Stage helps English-speaking beginners practise introductory Korean from Lec 1 with bilingual vocabulary, grammar, and role-play dialogues.',
  members: [
    {
      id: 'member-1', name: 'Member 1', fullName: 'CHEONG XIN CHEN', studentId: '251UC250T4', studentClass: 'FCI2',
      isDevelopmentIdentity: false,
      role: 'Vocabulary presenter',
      contribution: 'Presents Thailand, Vietnam, Philippines, and Singapore in Unit 1.',
    },
    {
      id: 'member-2', name: 'Member 2', fullName: 'WONG WEI QI', studentId: '251UC250TB', studentClass: 'FCI2',
      isDevelopmentIdentity: false,
      role: 'Vocabulary presenter',
      contribution: 'Presents Indonesia, Spain, Italy, Brazil, and New Zealand in Unit 1.',
    },
    {
      id: 'member-3', name: 'Member 3', fullName: 'LIM ZHEN LONG', studentId: '252UC243GJ', studentClass: 'FCI2',
      isDevelopmentIdentity: false,
      role: 'Vocabulary presenter', contribution: 'Presents Student, Teacher, Engineer, and Designer in Unit 2.',
    },
    {
      id: 'member-4', name: 'Member 4', fullName: 'LAM YI SIANG', studentId: '262UM2630D', studentClass: 'FOM',
      isDevelopmentIdentity: false,
      role: 'Vocabulary presenter', contribution: 'Presents Doctor, Nurse, Firefighter, Pharmacist, and Police officer in Unit 2.',
    },
  ],
  introductionModels: [
    {
      id: 'greeting',
      korean: '안녕하세요?',
      english: 'Hello.',
      romanization: 'annyeonghaseyo?',
      pronunciationHint: 'an-nyeong-ha-se-yo',
      ownerId: 'member-1',
      audioLabel: 'Listen to Member 1 greeting',
      audio: developmentMedia(),
    },
    {
      id: 'self-introduction',
      korean: '저는 미나예요.',
      english: 'I am Mina.',
      romanization: 'jeoneun minayeyo.',
      pronunciationHint: 'juh-nuhn mee-na-ye-yo',
      ownerId: 'member-2',
      audioLabel: 'Listen to Member 2 self-introduction',
      audio: developmentMedia(),
    },
  ],
  vocabulary: [
    vocabulary('thailand', 'vocabulary-1', '태국', 'Thailand', 'taeguk', 'tae-guk', '민지는 태국 사람이에요.', 'Minji is Thai.', 'Add 사람 after 태국 to say “a Thai person”: 태국 사람.', 'member-1', 'flag', 'th', { memberSlug: 'xin-chen', durationSeconds: 2.07 }),
    vocabulary('vietnam', 'vocabulary-1', '베트남', 'Vietnam', 'beteunam', 'beh-teu-nam', '준호는 베트남 사람이에요.', 'Junho is Vietnamese.', '베트남 ends in a consonant, so use 은 in 베트남은.', 'member-1', 'flag', 'vn', { memberSlug: 'xin-chen', durationSeconds: 3.05 }),
    vocabulary('philippines', 'vocabulary-1', '필리핀', 'Philippines', 'pillipin', 'pil-li-pin', '유나는 필리핀 사람이에요.', 'Yuna is Filipino.', '필리핀 사람 means “a Filipino person”; 사람이에요 means “is a person.”', 'member-1', 'flag', 'ph', { memberSlug: 'xin-chen', durationSeconds: 3.39 }),
    vocabulary('singapore', 'vocabulary-1', '싱가포르', 'Singapore', 'singgaporeu', 'sing-ga-po-reu', '다니엘은 싱가포르 사람이에요.', 'Daniel is Singaporean.', '싱가포르 ends in a vowel, so use 는 in 싱가포르는.', 'member-1', 'flag', 'sg', { memberSlug: 'xin-chen', durationSeconds: 3.6 }),
    vocabulary('indonesia', 'vocabulary-1', '인도네시아', 'Indonesia', 'indonesia', 'in-do-ne-si-a', '수진은 인도네시아 사람이에요.', 'Sujin is Indonesian.', 'Use 인도네시아 사람 for “an Indonesian person.”', 'member-2', 'flag', 'id', { memberSlug: 'wei-qi', durationSeconds: 2.56 }),
    vocabulary('spain', 'vocabulary-1', '스페인', 'Spain', 'seupein', 'seu-pe-in', '마리아는 스페인 사람이에요.', 'Maria is Spanish.', '스페인 ends in a consonant, so use 은: 스페인은.', 'member-2', 'flag', 'es', { memberSlug: 'wei-qi', durationSeconds: 2.32 }),
    vocabulary('italy', 'vocabulary-1', '이탈리아', 'Italy', 'itallia', 'i-tal-li-a', '루카는 이탈리아 사람이에요.', 'Luca is Italian.', '이탈리아 ends in a vowel, so use 는: 이탈리아는.', 'member-2', 'flag', 'it', { memberSlug: 'wei-qi', durationSeconds: 1.51 }),
    vocabulary('brazil', 'vocabulary-1', '브라질', 'Brazil', 'beurajil', 'beu-ra-jil', '아나는 브라질 사람이에요.', 'Ana is Brazilian.', '브라질 ends in a consonant, so use 은: 브라질은.', 'member-2', 'flag', 'br', { memberSlug: 'wei-qi', durationSeconds: 1.91 }),
    vocabulary('new-zealand', 'vocabulary-1', '뉴질랜드', 'New Zealand', 'nyujillaendeu', 'nyu-jil-laen-deu', '소피는 뉴질랜드 사람이에요.', 'Sophie is a New Zealander.', '뉴질랜드 사람 means “a New Zealander.”', 'member-2', 'flag', 'nz', { memberSlug: 'wei-qi', durationSeconds: 2.44 }),
    vocabulary('student', 'vocabulary-2', '학생', 'Student', 'haksaeng', 'hak-ssaeng', '저는 학생이에요.', 'I am a student.', '학생 ends in a consonant, so use 이에요.', 'member-3', 'occupation', 'student', { memberSlug: 'zhen-long', durationSeconds: 2.6 }),
    vocabulary('teacher', 'vocabulary-2', '선생님', 'Teacher', 'seonsaengnim', 'seon-saeng-nim', '민지는 선생님이에요.', 'Minji is a teacher.', '선생님 ends in a consonant, so use 은 in 선생님은.', 'member-3', 'occupation', 'teacher', { memberSlug: 'zhen-long', durationSeconds: 1.98 }),
    vocabulary('engineer', 'vocabulary-2', '엔지니어', 'Engineer', 'enjinieo', 'en-ji-ni-eo', '준호는 엔지니어예요.', 'Junho is an engineer.', '엔지니어 ends in a vowel, so use 예요.', 'member-3', 'occupation', 'engineer', { memberSlug: 'zhen-long', durationSeconds: 2.86 }),
    vocabulary('designer', 'vocabulary-2', '디자이너', 'Designer', 'dijaineo', 'di-ja-i-neo', '유나는 디자이너예요.', 'Yuna is a designer.', 'To say “not a designer,” use 디자이너가 아니에요.', 'member-3', 'occupation', 'designer', { memberSlug: 'zhen-long', durationSeconds: 2.32 }),
    vocabulary('doctor', 'vocabulary-2', '의사', 'Doctor', 'uisa', 'ui-sa', '수진은 의사예요.', 'Sujin is a doctor.', '의사 ends in a vowel, so use 는 in 의사는.', 'member-4', 'occupation', 'doctor', { memberSlug: 'yi-siang', durationSeconds: 1.93 }),
    vocabulary('nurse', 'vocabulary-2', '간호사', 'Nurse', 'ganhosa', 'gan-ho-sa', '지민은 간호사예요.', 'Jimin is a nurse.', 'Combine 간호사 with 예요 to make 간호사예요.', 'member-4', 'occupation', 'nurse', { memberSlug: 'yi-siang', durationSeconds: 2.52 }),
    vocabulary('firefighter', 'vocabulary-2', '소방관', 'Firefighter', 'sobanggwan', 'so-bang-gwan', '민수는 소방관이에요.', 'Minsu is a firefighter.', 'To say “not a firefighter,” use 소방관이 아니에요.', 'member-4', 'occupation', 'firefighter', { memberSlug: 'yi-siang', durationSeconds: 3.07 }),
    vocabulary('pharmacist', 'vocabulary-2', '약사', 'Pharmacist', 'yaksa', 'yak-sa', '서연은 약사예요.', 'Seoyeon is a pharmacist.', 'To say “not a pharmacist,” use 약사가 아니에요.', 'member-4', 'occupation', 'pharmacist', { memberSlug: 'yi-siang', durationSeconds: 2.45 }),
    vocabulary('police-officer', 'vocabulary-2', '경찰관', 'Police officer', 'gyeongchalgwan', 'gyeong-chal-gwan', '현우는 경찰관이에요.', 'Hyunwoo is a police officer.', '경찰관 ends in a consonant, so use 이에요.', 'member-4', 'occupation', 'police-officer', { memberSlug: 'yi-siang', durationSeconds: 4.32 }),
  ],
  grammar: [
    {
      id: 'identity',
      unitId: 'grammar-1',
      korean: '이에요 / 예요 + 은 / 는',
      englishFunction: 'talking about identity',
      explanation: 'Use 은/는 to show who the sentence is about, then use 이에요 or 예요 to say who that person is.',
      rules: ['Consonant-ending topic + 은; vowel-ending topic + 는', 'Consonant-ending identity noun + 이에요; vowel-ending identity noun + 예요', 'Pattern: Topic + 은/는 + Noun + 이에요/예요'],
      examples: [
        { korean: '저는 학생이에요.', english: 'I am a student.' },
        { korean: '지민은 간호사예요.', english: 'Jimin is a nurse.' },
      ],
      exercises: [
        exercise('ieyo-yeyo-1', 'ieyo-yeyo', 'sentence-completion', 'Complete the sentence for Minsu.', '민수___', ['민수예요', '민수이에요'], '민수예요', '민수 ends in a vowel, so use 예요.'),
        exercise('ieyo-yeyo-2', 'ieyo-yeyo', 'sentence-completion', 'Complete the sentence for student.', '학생___', ['학생이에요', '학생예요'], '학생이에요', '학생 ends in a consonant, so use 이에요.'),
        matchingExercise(
          'ieyo-yeyo-3',
          'ieyo-yeyo',
          'Match each Korean sentence to its English meaning.',
          '이에요 / 예요 문장을 연결하세요.',
          [
            { id: 'student', korean: '저는 학생이에요.', english: 'I am a student.' },
            { id: 'nurse', korean: '지민은 간호사예요.', english: 'Jimin is a nurse.' },
          ],
          '이에요 follows consonant-ending 학생, while 예요 follows vowel-ending 간호사.',
        ),
        exercise('eun-neun-1', 'eun-neun', 'particle', 'Choose the correct topic-marked sentence.', '저 + 은/는 + 학생이에요.', ['저는 학생이에요', '저은 학생이에요'], '저는 학생이에요', '저 ends in a vowel sound, so use 는.'),
        exercise('eun-neun-2', 'eun-neun', 'particle', 'Choose the correct topic-marked sentence.', '선생님 + 은/는 + 태국 사람이에요.', ['선생님은 태국 사람이에요', '선생님는 태국 사람이에요'], '선생님은 태국 사람이에요', '선생님 ends in a consonant, so use 은.'),
        exercise('eun-neun-3', 'eun-neun', 'particle', 'Choose the correct topic-marked sentence.', '유나 + 은/는 + 디자이너예요.', ['유나는 디자이너예요', '유나은 디자이너예요'], '유나는 디자이너예요', '유나 ends in a vowel, so use 는.'),
      ],
    },
    {
      id: 'i-ga-anieyo',
      unitId: 'grammar-2',
      korean: '이 / 가 아니에요',
      englishFunction: 'is not',
      explanation: 'Use 이 아니에요 after a consonant-ending noun and 가 아니에요 after a vowel-ending noun to say that someone or something is not something.',
      rules: ['Consonant-ending noun + 이 아니에요', 'Vowel-ending noun + 가 아니에요'],
      examples: [
        { korean: '저는 태국 사람이 아니에요.', english: 'I am not Thai.' },
        { korean: '민수는 디자이너가 아니에요.', english: 'Minsu is not a designer.' },
      ],
      exercises: [
        exercise('i-ga-anieyo-1', 'i-ga-anieyo', 'multiple-choice', 'Choose the correct negative identification.', '저는 태국 ___.', ['태국 사람이 아니에요', '태국 사람 가 아니에요'], '태국 사람이 아니에요', '사람 ends in a consonant, so use 이 아니에요.'),
        exercise('i-ga-anieyo-2', 'i-ga-anieyo', 'multiple-choice', 'Choose the correct negative identification.', '민수는 ___.', ['디자이너가 아니에요', '디자이너이 아니에요'], '디자이너가 아니에요', '디자이너 ends in a vowel, so use 가 아니에요.'),
        exercise('i-ga-anieyo-3', 'i-ga-anieyo', 'multiple-choice', 'Choose the correct negative identification.', '저는 ___.', ['소방관이 아니에요', '소방관가 아니에요'], '소방관이 아니에요', '소방관 ends in a consonant, so use 이 아니에요.'),
      ],
    },
  ],
  dialogues: [
    {
      id: 'dialogue-1',
      title: 'Hello, I am Mina',
      scenario: 'Meeting someone for the first time',
      speakerIds: ['member-1', 'member-2'],
      lines: [
        dialogueLine('dialogue-1-line-1', 'member-1', '안녕하세요.', 'Hello.'),
        dialogueLine('dialogue-1-line-2', 'member-2', '안녕하세요. 이름이 뭐예요?', 'Hello. What is your name?'),
        dialogueLine('dialogue-1-line-3', 'member-1', '저는 미나예요. 이름이 뭐예요?', 'I am Mina. What is your name?'),
        dialogueLine('dialogue-1-line-4', 'member-2', '저는 다니엘이에요.', 'I am Daniel.'),
        dialogueLine('dialogue-1-line-5', 'member-1', '다니엘은 어느 나라 사람이에요?', 'Daniel, what country are you from?'),
        dialogueLine('dialogue-1-line-6', 'member-2', '저는 싱가포르 사람이에요.', 'I am Singaporean.'),
        dialogueLine('dialogue-1-line-7', 'member-2', '미나는 태국 사람이에요?', 'Mina, are you Thai?'),
        dialogueLine('dialogue-1-line-8', 'member-1', '네, 저는 태국 사람이에요.', 'Yes, I am Thai.'),
      ],
      video: developmentMedia(),
    },
    {
      id: 'dialogue-2',
      title: 'Where are you from?',
      scenario: 'Meeting a classmate and talking about where you are from and what you study',
      speakerIds: ['member-4', 'member-3'],
      lines: [
        dialogueLine('dialogue-2-line-1', 'member-4', '안녕하세요! 저는 다니엘이에요. 만나서 반가워요.', 'Hello! I’m Daniel. Nice to meet you.'),
        dialogueLine('dialogue-2-line-2', 'member-3', '안녕하세요! 저는 민수예요. 만나서 반가워요.', 'Hello! I’m Minsu. Nice to meet you.'),
        dialogueLine('dialogue-2-line-3', 'member-4', '어느 나라에서 왔어요?', 'Which country are you from?'),
        dialogueLine('dialogue-2-line-4', 'member-3', '저는 말레이시아에서 왔어요.', 'I’m from Malaysia.'),
        dialogueLine('dialogue-2-line-5', 'member-4', '학생이에요?', 'Are you a student?'),
        dialogueLine('dialogue-2-line-6', 'member-3', '네, 학생이에요.', 'Yes, I’m a student.'),
        dialogueLine('dialogue-2-line-7', 'member-4', '전공이 뭐예요?', 'What is your major?'),
        dialogueLine('dialogue-2-line-8', 'member-3', '애니메이션 전공이에요.', 'My major is animation.'),
      ],
      video: humanRecording('/media/dialogues/dialogue-2.mp4', 30),
    },
  ],
}
