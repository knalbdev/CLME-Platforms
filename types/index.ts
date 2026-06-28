export type UserRole = 'peserta' | 'ahli' | 'peneliti' | 'admin'

export interface User {
  id: string
  email: string
  role: UserRole
  name: string
  avatar: string
  school?: string
  institution?: string
  subject?: string
}

export interface UserProgress {
  uid: string
  xp: number
  level: number
  streak: number
  badges: string[]
  done: string[]      // completed lesson IDs
  modules: string[]   // completed module IDs
  scores: Record<string, number>
  dates: string[]
}

export interface LevelInfo {
  level: number
  name: string
  emoji: string
  minXP: number
}

export interface BadgeInfo {
  name: string
  emoji: string
  color: string
  desc: string
}

export type ContentSectionType = 'intro' | 'text' | 'case' | 'stat' | 'warning' | 'tip'

export interface ContentSection {
  type: ContentSectionType
  title?: string
  text: string
}

export interface QuizOption {
  id: string
  text: string
  correct?: boolean
}

export interface QuizQuestion {
  id: string
  text: string
  opts: QuizOption[]
  explain: string
}

export interface SimScenario {
  id: string
  verdict: 'phishing' | 'safe'
  msg: { from: string; subj: string; body: string }
  flags: string[]
  explain: string
}

export interface ScenarioChoice {
  id: string
  text: string
  correct: boolean
  fb: string
}

export interface Lesson {
  id: string
  title: string
  type: 'reading' | 'interactive' | 'scenario' | 'simulation'
  emoji: string
  typeLabel: string
  dur: string
  xp: number
  content: {
    sections?: ContentSection[]
    intro?: string
    items?: { pw: string; label: string; bar: number; time: string; color: string }[]
    tips?: string[]
    checks?: { label: string; good: string; bad: string; note: string }[]
    setup?: string
    question?: string
    choices?: ScenarioChoice[]
    instruction?: string
    scenarios?: SimScenario[]
    theory?: string
    steps?: { step: number; question: string; choices: ScenarioChoice[] }[]
  }
}

export interface Module {
  id: string
  title: string
  icon: string
  color: string
  colorLight: string
  badge: string | null
  time: string
  dimension: string
  status: 'active' | 'coming' | 'draft'
  desc: string
  objective: string
  facilitatorNote: string
  lessons: Lesson[]
  pretest: { id: string; questions: QuizQuestion[] }
  posttest: { id: string; questions: QuizQuestion[] }
}

export interface DiscussionReply {
  id: string
  userId: string
  userName: string
  avatar: string
  expert?: boolean
  body: string
  time: string
  likes: number
}

export interface Discussion {
  id: string
  moduleId: string
  userId: string
  userName: string
  avatar: string
  title: string
  body: string
  time: string
  likes: number
  replies: DiscussionReply[]
}

export type PesertaScreen =
  | 'dashboard'
  | 'modules'
  | 'module-detail'
  | 'lesson'
  | 'test'
  | 'simulation'
  | 'chat'
  | 'discussion'
  | 'new-post'
  | 'achievements'
  | 'certificate'

export type NavTab = 'dashboard' | 'modules' | 'chat' | 'discussion' | 'achievements'
