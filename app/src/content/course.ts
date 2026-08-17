import type { Course, DialogueLine, Exercise, MediaSource, VocabularyItem } from './types'

export const courseUnits = [
  { id: 'unit-1', title: 'Hello & Self-introduction' },
  { id: 'unit-2', title: 'Countries & Nationalities' },
  { id: 'unit-3', title: 'Jobs & Occupations' },
  { id: 'unit-4', title: '이에요 / 예요 - to be' },
  { id: 'unit-5', title: '은 / 는 - topic marker' },
  { id: 'unit-6', title: '이 / 가 아니에요 - to not be' },
  { id: 'unit-7', title: 'Dialogue & Role Play' },
] as const

const developmentMedia = (durationSeconds?: number): MediaSource => ({
  src: null,
  kind: 'development-missing',
  ...(durationSeconds === undefined ? {} : { durationSeconds }),
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
  ownerId: string | null,
): VocabularyItem => ({
  id,
  unitId,
  korean,
  english,
  romanization,
  ...(pronunciationHint === undefined ? {} : { pronunciationHint }),
  koreanExample,
  englishExample,
  ownerId,
  video: developmentMedia(),
  audio: developmentMedia(),
})

const exercise = (
  id: string,
  grammarId: string,
  type: Exercise['type'],
  prompt: string,
  koreanContext: string,
  choices: string[],
  answer: string,
  explanation: string,
): Exercise => ({ id, grammarId, type, prompt, koreanContext, choices, answer, explanation })

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
    { id: 'member-1', name: 'Member 1', studentId: 'Add your student ID', isDevelopmentIdentity: true },
    { id: 'member-2', name: 'Member 2', studentId: 'Add your student ID', isDevelopmentIdentity: true },
  ],
  vocabulary: [
    vocabulary('china', 'unit-2', '중국', 'China', 'jungguk', undefined, '중국 사람이에요.', 'I am Chinese.', null),
    vocabulary('japan', 'unit-2', '일본', 'Japan', 'ilbon', undefined, '일본 사람이에요.', 'I am Japanese.', null),
    vocabulary('usa', 'unit-2', '미국', 'USA', 'miguk', undefined, '미국 사람이에요.', 'I am American.', null),
    vocabulary('korea', 'unit-2', '한국', 'Korea', 'hanguk', undefined, '한국 사람이에요.', 'I am Korean.', null),
    vocabulary('france', 'unit-2', '프랑스', 'France', 'peurangseu', undefined, '프랑스 사람이에요.', 'I am French.', null),
    vocabulary('germany', 'unit-2', '독일', 'Germany', 'dogil', undefined, '독일 사람이에요.', 'I am German.', null),
    vocabulary('australia', 'unit-2', '호주', 'Australia', 'hoju', undefined, '호주 사람이에요.', 'I am Australian.', null),
    vocabulary('united-kingdom', 'unit-2', '영국', 'United Kingdom', 'yeongguk', undefined, '영국 사람이에요.', 'I am British.', null),
    vocabulary('student', 'unit-3', '학생', 'Student', 'haksaeng', 'hak-ssaeng', '저는 학생이에요.', 'I am a student.', 'member-1'),
    vocabulary('teacher', 'unit-3', '선생님', 'Teacher', 'seonsaengnim', undefined, '저는 선생님이에요.', 'I am a teacher.', 'member-1'),
    vocabulary('office-worker', 'unit-3', '회사원', 'Office worker', 'hoesawon', undefined, '저는 회사원이에요.', 'I am an office worker.', 'member-1'),
    vocabulary('reporter', 'unit-3', '기자', 'Reporter', 'gija', undefined, '저는 기자예요.', 'I am a reporter.', 'member-1'),
    vocabulary('doctor', 'unit-3', '의사', 'Doctor', 'uisa', undefined, '저는 의사예요.', 'I am a doctor.', 'member-2'),
    vocabulary('singer', 'unit-3', '가수', 'Singer', 'gasu', undefined, '저는 가수예요.', 'I am a singer.', 'member-2'),
    vocabulary('soldier', 'unit-3', '군인', 'Soldier', 'gunin', undefined, '저는 군인이에요.', 'I am a soldier.', 'member-2'),
    vocabulary('chef', 'unit-3', '요리사', 'Chef', 'yorisa', undefined, '저는 요리사예요.', 'I am a chef.', 'member-2'),
  ],
  grammar: [
    {
      id: 'ieyo-yeyo',
      unitId: 'unit-4',
      korean: '이에요 / 예요',
      englishFunction: 'to be',
      explanation: 'Use 이에요 after a noun ending in a consonant and 예요 after a noun ending in a vowel to say what someone or something is.',
      rules: ['Consonant-ending noun + 이에요', 'Vowel-ending noun + 예요'],
      examples: [
        { korean: '저는 학생이에요.', english: 'I am a student.' },
        { korean: '제니는 가수예요.', english: 'Jenny is a singer.' },
      ],
      exercises: [
        exercise('ieyo-yeyo-1', 'ieyo-yeyo', 'sentence-completion', 'Complete the sentence for Minsu.', '민수___', ['민수예요', '민수이에요'], '민수예요', '민수 ends in a vowel, so use 예요.'),
        exercise('ieyo-yeyo-2', 'ieyo-yeyo', 'sentence-completion', 'Complete the sentence for student.', '학생___', ['학생이에요', '학생예요'], '학생이에요', '학생 ends in a consonant, so use 이에요.'),
        exercise('ieyo-yeyo-3', 'ieyo-yeyo', 'sentence-completion', 'Complete the sentence for Jenny.', '제니___', ['제니예요', '제니이에요'], '제니예요', '제니 ends in a vowel, so use 예요.'),
      ],
    },
    {
      id: 'eun-neun',
      unitId: 'unit-5',
      korean: '은 / 는',
      englishFunction: 'topic marker',
      explanation: 'Use 은 or 는 to mark what the sentence is about. Use 은 after a consonant and 는 after a vowel.',
      rules: ['Consonant-ending noun + 은', 'Vowel-ending noun + 는'],
      examples: [
        { korean: '저는 학생이에요.', english: 'As for me, I am a student.' },
        { korean: '선생님은 한국 사람이에요.', english: 'The teacher is Korean.' },
      ],
      exercises: [
        exercise('eun-neun-1', 'eun-neun', 'particle', 'Choose the correct topic-marked sentence.', '저 + 은/는 + 학생이에요.', ['저는 학생이에요', '저은 학생이에요'], '저는 학생이에요', '저 ends in a vowel sound, so use 는.'),
        exercise('eun-neun-2', 'eun-neun', 'particle', 'Choose the correct topic-marked sentence.', '선생님 + 은/는 + 한국 사람이에요.', ['선생님은 한국 사람이에요', '선생님는 한국 사람이에요'], '선생님은 한국 사람이에요', '선생님 ends in a consonant, so use 은.'),
        exercise('eun-neun-3', 'eun-neun', 'particle', 'Choose the correct topic-marked sentence.', '제니 + 은/는 + 가수예요.', ['제니는 가수예요', '제니은 가수예요'], '제니는 가수예요', '제니 ends in a vowel, so use 는.'),
      ],
    },
    {
      id: 'i-ga-anieyo',
      unitId: 'unit-6',
      korean: '이 / 가 아니에요',
      englishFunction: 'is not',
      explanation: 'Use 이 아니에요 after a consonant-ending noun and 가 아니에요 after a vowel-ending noun to say that someone or something is not something.',
      rules: ['Consonant-ending noun + 이 아니에요', 'Vowel-ending noun + 가 아니에요'],
      examples: [
        { korean: '저는 미국 사람이 아니에요.', english: 'I am not American.' },
        { korean: '민수는 가수가 아니에요.', english: 'Minsu is not a singer.' },
      ],
      exercises: [
        exercise('i-ga-anieyo-1', 'i-ga-anieyo', 'multiple-choice', 'Choose the correct negative identification.', '저는 미국 ___.', ['미국 사람이 아니에요', '미국 사람 가 아니에요'], '미국 사람이 아니에요', '사람 ends in a consonant, so use 이 아니에요.'),
        exercise('i-ga-anieyo-2', 'i-ga-anieyo', 'multiple-choice', 'Choose the correct negative identification.', '민수는 ___.', ['가수가 아니에요', '가수이 아니에요'], '가수가 아니에요', '가수 ends in a vowel, so use 가 아니에요.'),
        exercise('i-ga-anieyo-3', 'i-ga-anieyo', 'multiple-choice', 'Choose the correct negative identification.', '저는 ___.', ['회사원이 아니에요', '회사원가 아니에요'], '회사원이 아니에요', '회사원 ends in a consonant, so use 이 아니에요.'),
      ],
    },
  ],
  dialogues: [
    {
      id: 'dialogue-1',
      title: 'Hello, I am Mina',
      speakerIds: ['member-1', 'member-2'],
      lines: [
        dialogueLine('dialogue-1-line-1', 'member-1', '안녕하세요.', 'Hello.'),
        dialogueLine('dialogue-1-line-2', 'member-2', '안녕하세요. 이름이 뭐예요?', 'Hello. What is your name?'),
        dialogueLine('dialogue-1-line-3', 'member-1', '저는 미나예요. 이름이 뭐예요?', 'I am Mina. What is your name?'),
        dialogueLine('dialogue-1-line-4', 'member-2', '저는 다니엘이에요.', 'I am Daniel.'),
        dialogueLine('dialogue-1-line-5', 'member-1', '다니엘은 어느 나라 사람이에요?', 'Daniel, what country are you from?'),
        dialogueLine('dialogue-1-line-6', 'member-2', '저는 영국 사람이에요.', 'I am British.'),
        dialogueLine('dialogue-1-line-7', 'member-2', '미나는 한국 사람이에요?', 'Mina, are you Korean?'),
        dialogueLine('dialogue-1-line-8', 'member-1', '네, 저는 한국 사람이에요.', 'Yes, I am Korean.'),
      ],
      video: developmentMedia(90),
    },
    {
      id: 'dialogue-2',
      title: 'Who are you?',
      speakerIds: ['member-1', 'member-2'],
      lines: [
        dialogueLine('dialogue-2-line-1', 'member-1', '다니엘은 학생이에요?', 'Daniel, are you a student?'),
        dialogueLine('dialogue-2-line-2', 'member-2', '아니요, 저는 학생이 아니에요.', 'No, I am not a student.'),
        dialogueLine('dialogue-2-line-3', 'member-1', '그럼, 직업이 뭐예요?', 'Then, what is your job?'),
        dialogueLine('dialogue-2-line-4', 'member-2', '저는 기자예요.', 'I am a reporter.'),
        dialogueLine('dialogue-2-line-5', 'member-2', '미나는 선생님이에요?', 'Mina, are you a teacher?'),
        dialogueLine('dialogue-2-line-6', 'member-1', '아니요, 저는 선생님이 아니에요.', 'No, I am not a teacher.'),
        dialogueLine('dialogue-2-line-7', 'member-2', '그럼, 미나는 가수예요?', 'Then, Mina, are you a singer?'),
        dialogueLine('dialogue-2-line-8', 'member-1', '네, 저는 가수예요.', 'Yes, I am a singer.'),
      ],
      video: developmentMedia(90),
    },
  ],
}
