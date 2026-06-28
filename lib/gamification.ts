import type { UserProgress, LevelInfo, BadgeInfo } from '@/types'

export const LEVELS: LevelInfo[] = [
  { level: 1, name: 'Pemula',           emoji: '🌱', minXP: 0    },
  { level: 2, name: 'Aware Educator',   emoji: '📚', minXP: 200  },
  { level: 3, name: 'Cyber Guardian',   emoji: '🛡️', minXP: 500  },
  { level: 4, name: 'Expert Defender',  emoji: '⚔️', minXP: 800  },
  { level: 5, name: 'Security Champion',emoji: '🏆', minXP: 1200 },
]

export const BADGES: Record<string, BadgeInfo> = {
  pemula:   { name: 'Pemula',           emoji: '🎯', color: 'bg-emerald-50 text-emerald-700',  desc: 'Bergabung dengan CLME' },
  pretest:  { name: 'Pre-Test',         emoji: '📋', color: 'bg-amber-50 text-amber-700',      desc: 'Selesaikan pre-test pertama' },
  diskusi:  { name: 'Diskusi Aktif',    emoji: '💬', color: 'bg-violet-50 text-violet-700',    desc: 'Berpartisipasi dalam diskusi' },
  guardian: { name: 'Password Guardian',emoji: '🔐', color: 'bg-emerald-50 text-emerald-700',  desc: 'Selesaikan Modul 1' },
  emaildef: { name: 'Email Defender',   emoji: '🛡️', color: 'bg-blue-50 text-blue-700',        desc: 'Selesaikan Modul 2' },
  crisis:   { name: 'Crisis Responder', emoji: '🚨', color: 'bg-red-50 text-red-700',          desc: 'Selesaikan Modul 3' },
  graduate: { name: 'CLME Graduate',    emoji: '🎓', color: 'bg-navy-900 text-white',           desc: 'Selesaikan semua modul' },
}

const KEY = (uid: string) => `clme_prog_${uid}`

export function getProgress(uid: string): UserProgress {
  if (typeof window === 'undefined') return defaultProgress(uid)
  try {
    const s = localStorage.getItem(KEY(uid))
    if (s) return JSON.parse(s)
  } catch { /* ignore */ }
  const p = defaultProgress(uid)
  saveProgress(uid, p)
  return p
}

function defaultProgress(uid: string): UserProgress {
  return { uid, xp: 0, level: 1, streak: 1, badges: ['pemula'], done: [], modules: [], scores: {}, dates: [new Date().toDateString()] }
}

export function saveProgress(uid: string, p: UserProgress) {
  if (typeof window !== 'undefined') localStorage.setItem(KEY(uid), JSON.stringify(p))
}

export function getLevel(xp: number): LevelInfo {
  for (let i = LEVELS.length - 1; i >= 0; i--) if (xp >= LEVELS[i].minXP) return LEVELS[i]
  return LEVELS[0]
}

export function getLevelProgress(xp: number): number {
  const cur = getLevel(xp)
  const idx = LEVELS.findIndex(l => l.level === cur.level)
  if (idx >= LEVELS.length - 1) return 100
  const next = LEVELS[idx + 1]
  return Math.round(((xp - cur.minXP) / (next.minXP - cur.minXP)) * 100)
}

export function addXP(uid: string, amount: number, badgeId?: string): { p: UserProgress; leveledUp: boolean; newLevel: LevelInfo } {
  const p = getProgress(uid)
  const oldLevel = p.level
  p.xp += amount
  const lv = getLevel(p.xp)
  p.level = lv.level
  if (badgeId && !p.badges.includes(badgeId)) p.badges.push(badgeId)
  saveProgress(uid, p)
  return { p, leveledUp: lv.level > oldLevel, newLevel: lv }
}

export function markLesson(uid: string, lessonId: string, xp: number, badgeId?: string) {
  const p = getProgress(uid)
  if (!p.done.includes(lessonId)) p.done.push(lessonId)
  saveProgress(uid, p)
  return addXP(uid, xp, badgeId)
}

export function markModule(uid: string, moduleId: string, badgeId?: string) {
  const p = getProgress(uid)
  if (!p.modules.includes(moduleId)) p.modules.push(moduleId)
  if (badgeId && !p.badges.includes(badgeId)) p.badges.push(badgeId)
  if (p.modules.length >= 3 && !p.badges.includes('graduate')) p.badges.push('graduate')
  saveProgress(uid, p)
}

export function saveScore(uid: string, key: string, score: number) {
  const p = getProgress(uid)
  p.scores[key] = score
  saveProgress(uid, p)
}

export function updateStreak(uid: string): number {
  const p = getProgress(uid)
  const today = new Date().toDateString()
  if (!p.dates.includes(today)) {
    p.dates.push(today)
    const sorted = [...p.dates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    let streak = 1
    for (let i = sorted.length - 1; i > 0; i--) {
      const diff = (new Date(sorted[i]).getTime() - new Date(sorted[i - 1]).getTime()) / 86400000
      if (diff === 1) streak++; else break
    }
    p.streak = streak
  }
  saveProgress(uid, p)
  return p.streak
}
