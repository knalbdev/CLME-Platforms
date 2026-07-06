'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getSession, logout } from '@/lib/auth'
import { getModules } from '@/lib/data'
import { getFirestoreModuleMetas, getFirestoreProgress, getFirestoreDiscussions, addFirestoreDiscussion, getFirestoreModuleLessons } from '@/lib/db'
import {
  getProgress, updateStreak, addXP, markLesson, markModule,
  saveScore, getLevelProgress, getLevel, LEVELS, BADGES,
} from '@/lib/gamification'
import type { User, UserProgress, Module, Lesson, Discussion } from '@/types'

type Screen =
  | 'dashboard' | 'modules' | 'module-detail' | 'lesson'
  | 'test' | 'chat' | 'discussion' | 'new-post' | 'achievements' | 'certificate'

type NavTab = 'dashboard' | 'modules' | 'chat' | 'discussion' | 'achievements'


interface AchievementData { title: string; sub: string; emoji: string; xp: number }

export default function PesertaPage() {
  const router = useRouter()
  const chatEndRef = useRef<HTMLDivElement>(null)

  const [screen, setScreen] = useState<Screen>('dashboard')
  const [session, setSession] = useState<User | null>(null)
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [activeModule, setActiveModule] = useState<Module | null>(null)
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)

  // test state
  const [testType, setTestType] = useState<'pre' | 'post'>('pre')
  const [testQIdx, setTestQIdx] = useState(0)
  const [testScore, setTestScore] = useState(0)
  const [testAnswered, setTestAnswered] = useState(false)
  const [testSelectedOpt, setTestSelectedOpt] = useState<string | null>(null)
  const [testDone, setTestDone] = useState(false)
  const [testFinalScore, setTestFinalScore] = useState(0)

  // simulation / scenario state
  const [simIdx, setSimIdx] = useState(0)
  const [simScore, setSimScore] = useState(0)
  const [simAnswered, setSimAnswered] = useState(false)
  const [simCorrect, setSimCorrect] = useState(false)
  const [simDone, setSimDone] = useState(false)
  const [scenarioAnswered, setScenarioAnswered] = useState(false)
  const [scenarioChoice, setScenarioChoice] = useState<string | null>(null)

  // chat state
  const [chatMsgs, setChatMsgs] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Halo! Saya AI Tutor CLME 👋\n\nSaya siap membantu Anda memahami konsep keamanan siber. Apa yang ingin Anda tanyakan?' },
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [logoutConfirm, setLogoutConfirm] = useState(false)

  // achievement popup
  const [showAchievement, setShowAchievement] = useState(false)
  const [achievementData, setAchievementData] = useState<AchievementData | null>(null)

  // discussion
  const [discFilter, setDiscFilter] = useState<string | null>(null)
  const [postTitle, setPostTitle] = useState('')
  const [postBody, setPostBody] = useState('')
  const [postModId, setPostModId] = useState('m1')

  // interactive (password checker)
  const [pwInput, setPwInput] = useState('')

  useEffect(() => {
    const load = async () => {
      const s = getSession()
      if (!s || s.role !== 'peserta') { router.push('/login'); return }
      setSession(s)
      updateStreak(s.id)

      // Restore progress from Firestore if localStorage is empty
      const localProg = getProgress(s.id)
      if (localProg.xp === 0 && localProg.done.length === 0) {
        const remoteProg = await getFirestoreProgress(s.id)
        if (remoteProg && (remoteProg.xp > 0 || remoteProg.done.length > 0)) {
          localStorage.setItem(`clme_prog_${s.id}`, JSON.stringify(remoteProg))
          setProgress(remoteProg)
        } else {
          setProgress(localProg)
        }
      } else {
        setProgress(localProg)
      }

      // Load discussions from Firestore (newest first via orderBy desc)
      const firestoreDisc = await getFirestoreDiscussions()
      setDiscussions(firestoreDisc)

      // Load modules: local defaults → apply Firestore lesson content overrides → apply status overrides
      const local = getModules()
      const [metas, lessonOverrides] = await Promise.all([
        getFirestoreModuleMetas(),
        Promise.all(local.map(m => getFirestoreModuleLessons(m.id))),
      ])
      let merged = local.map((m, i) =>
        lessonOverrides[i] ? { ...m, lessons: lessonOverrides[i]! } : m
      )
      if (metas.length > 0) {
        const statusMap: Record<string, 'active' | 'coming' | 'draft'> = {}
        metas.forEach(m => { statusMap[m.id] = m.status })
        merged = merged.map(m => statusMap[m.id] ? { ...m, status: statusMap[m.id] } : m)
      }
      setModules(merged)
    }
    load()
  }, [router])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMsgs])

  const refreshProgress = () => {
    if (session) setProgress(getProgress(session.id))
  }

  const showAch = (data: AchievementData) => {
    setAchievementData(data)
    setShowAchievement(true)
    setTimeout(() => setShowAchievement(false), 3000)
  }

  const handleCompleteLesson = (lessonId: string, xp: number, badgeId?: string, moduleId?: string) => {
    if (!session) return
    if (progress?.done.includes(lessonId)) { setScreen('module-detail'); return }
    const res = markLesson(session.id, lessonId, xp, badgeId)
    if (moduleId && activeModule) {
      const allDone = activeModule.lessons.every(l =>
        l.id === lessonId || res.p.done.includes(l.id)
      )
      if (allDone) markModule(session.id, moduleId, activeModule.badge ?? undefined)
    }
    refreshProgress()
    showAch({
      emoji: '⭐',
      title: 'Pelajaran Selesai!',
      sub: `+${xp} XP diperoleh`,
      xp,
    })
    setTimeout(() => setScreen('module-detail'), 1800)
  }

  const handleStartTest = (type: 'pre' | 'post') => {
    setTestType(type)
    setTestQIdx(0)
    setTestScore(0)
    setTestAnswered(false)
    setTestSelectedOpt(null)
    setTestDone(false)
    setTestFinalScore(0)
    setScreen('test')
  }

  const handleAnswerTest = (optId: string) => {
    if (testAnswered || !activeModule) return
    setTestSelectedOpt(optId)
    setTestAnswered(true)
    const qs = testType === 'pre' ? activeModule.pretest.questions : activeModule.posttest.questions
    const q = qs[testQIdx]
    const opt = q.opts.find(o => o.id === optId)
    if (opt?.correct) setTestScore(s => s + 1)
  }

  const handleNextTestQ = () => {
    if (!activeModule || !session) return
    const qs = testType === 'pre' ? activeModule.pretest.questions : activeModule.posttest.questions
    if (testQIdx < qs.length - 1) {
      setTestQIdx(i => i + 1)
      setTestAnswered(false)
      setTestSelectedOpt(null)
    } else {
      const final = testScore + (testAnswered && (() => {
        const q = qs[testQIdx]
        const opt = q.opts.find(o => o.id === testSelectedOpt)
        return opt?.correct ? 1 : 0
      })() || 0)
      const key = `${activeModule.id}_${testType}`
      saveScore(session.id, key, final)
      if (testType === 'pre') {
        const { p } = addXP(session.id, 50, 'pretest')
        setProgress(p)
        showAch({ emoji: '📋', title: 'Pre-Test Selesai!', sub: `Skor ${final}/${qs.length} · +50 XP`, xp: 50 })
      } else {
        const { p } = addXP(session.id, 100)
        setProgress(p)
        showAch({ emoji: '🎉', title: 'Post-Test Selesai!', sub: `Skor ${final}/${qs.length} · +100 XP`, xp: 100 })
      }
      setTestFinalScore(final)
      setTestDone(true)
    }
  }

  const handleSimAnswer = (verdict: 'phishing' | 'safe') => {
    if (!activeLesson?.content?.scenarios || simAnswered) return
    const sc = activeLesson.content.scenarios[simIdx]
    const correct = sc.verdict === verdict
    setSimAnswered(true)
    setSimCorrect(correct)
    if (correct) setSimScore(s => s + 1)
  }

  const handleNextSim = () => {
    if (!activeLesson?.content?.scenarios) return
    if (simIdx < activeLesson.content.scenarios.length - 1) {
      setSimIdx(i => i + 1)
      setSimAnswered(false)
    } else {
      setSimDone(true)
    }
  }

  const handleSendChat = async () => {
    if (!chatInput.trim() || chatLoading || !session) return
    const msg = chatInput.trim()
    setChatInput('')
    const updatedMsgs = [...chatMsgs, { role: 'user' as const, text: msg }]
    setChatMsgs(updatedMsgs)
    setChatLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history: chatMsgs }),
      })
      const data = await res.json()
      setChatMsgs(m => [...m, { role: 'ai', text: data.error ? `⚠️ ${data.error}` : data.text }])
    } catch {
      setChatMsgs(m => [...m, { role: 'ai', text: '⚠️ Tidak dapat terhubung ke AI. Periksa koneksi internet.' }])
    }
    setChatLoading(false)
    addXP(session.id, 5)
  }

  const handleSubmitPost = async () => {
    if (!session || !postTitle.trim() || !postBody.trim()) return
    await addFirestoreDiscussion({
      moduleId: postModId,
      userId: session.id,
      userName: session.name,
      avatar: session.avatar,
      title: postTitle.trim(),
      body: postBody.trim(),
    })
    const { p } = addXP(session.id, 25, 'diskusi')
    setProgress(p)
    const updated = await getFirestoreDiscussions()
    setDiscussions(updated)
    setPostTitle(''); setPostBody('')
    showAch({ emoji: '💬', title: 'Diskusi Dibuat!', sub: '+25 XP · Badge "Diskusi Aktif" diperoleh!', xp: 25 })
    setScreen('discussion')
  }

  const goTo = (s: Screen) => setScreen(s)
  const goToModule = (m: Module) => { setActiveModule(m); setScreen('module-detail') }
  const goToLesson = (l: Lesson) => {
    setActiveLesson(l)
    setScenarioAnswered(false)
    setScenarioChoice(null)
    setSimIdx(0); setSimScore(0); setSimAnswered(false); setSimDone(false)
    setScreen('lesson')
  }

  const handleLogout = () => setLogoutConfirm(true)
  const doLogout = () => { logout(); router.push('/login') }

  const mainScreens: Screen[] = ['dashboard', 'modules', 'chat', 'discussion', 'achievements']
  const showNav = mainScreens.includes(screen)

  const navItems: { tab: NavTab; label: string; emoji: string; screen: Screen }[] = [
    { tab: 'dashboard', label: 'Beranda', emoji: '🏠', screen: 'dashboard' },
    { tab: 'modules', label: 'Modul', emoji: '📚', screen: 'modules' },
    { tab: 'chat', label: 'AI Tutor', emoji: '🤖', screen: 'chat' },
    { tab: 'discussion', label: 'Diskusi', emoji: '💬', screen: 'discussion' },
    { tab: 'achievements', label: 'Pencapaian', emoji: '🏆', screen: 'achievements' },
  ]

  if (!session || !progress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-500">Memuat…</p>
        </div>
      </div>
    )
  }

  const lvInfo = getLevel(progress.xp)
  const lvPct = getLevelProgress(progress.xp)
  const activeModules = modules.filter(m => m.status === 'active')
  const filteredDisc = discFilter ? discussions.filter(d => d.moduleId === discFilter) : discussions

  // ── PASSWORD STRENGTH ──────────────────────────────────────────────────────
  const getPwStrength = (pw: string) => {
    if (!pw) return { score: 0, label: '', color: '' }
    let score = 0
    if (pw.length >= 8) score += 20
    if (pw.length >= 12) score += 20
    if (/[A-Z]/.test(pw)) score += 15
    if (/[0-9]/.test(pw)) score += 15
    if (/[^A-Za-z0-9]/.test(pw)) score += 15
    if (pw.length >= 16) score += 15
    if (score <= 20) return { score, label: 'Sangat Lemah', color: '#ef4444' }
    if (score <= 40) return { score, label: 'Lemah', color: '#f97316' }
    if (score <= 60) return { score, label: 'Cukup', color: '#eab308' }
    if (score <= 80) return { score, label: 'Kuat', color: '#22c55e' }
    return { score, label: 'Sangat Kuat', color: '#0c8568' }
  }

  // ════════════════════════════════════════════════════════════════════
  // SCREENS
  // ════════════════════════════════════════════════════════════════════

  const renderDashboard = () => (
    <div className="flex-1 overflow-y-auto scrollbar-hidden">
      {/* Header */}
      <div className="bg-gradient-to-br from-navy-900 to-navy-800 px-5 pt-10 pb-8 text-white">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs text-white/60 mb-0.5">Selamat datang,</p>
            <h2 className="text-lg font-bold leading-tight">{session.name}</h2>
            <p className="text-xs text-white/60">{session.school}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary-400/30 flex items-center justify-center text-sm font-bold border border-white/20">
              {session.avatar}
            </div>
            <button onClick={handleLogout} className="text-white/50 hover:text-white/80 text-xs px-2 py-1 rounded-lg border border-white/10 hover:border-white/30 transition">Keluar</button>
          </div>
        </div>
        {/* XP bar */}
        <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold flex items-center gap-1.5">
              <span>{lvInfo.emoji}</span> {lvInfo.name}
            </span>
            <span className="text-xs bg-primary-400/30 px-2.5 py-0.5 rounded-full font-bold">{progress.xp} XP</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-primary-400 rounded-full transition-all duration-700" style={{ width: `${lvPct}%` }} />
          </div>
          <div className="flex justify-between text-xs text-white/50 mt-1">
            <span>Level {lvInfo.level}</span>
            {lvInfo.level < 5 && <span>{LEVELS[lvInfo.level]?.minXP ?? '—'} XP untuk level berikutnya</span>}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 -mt-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Hari Streak', val: `🔥 ${progress.streak}`, color: 'bg-amber-50 border-amber-100' },
            { label: 'Pelajaran', val: `✅ ${progress.done.length}`, color: 'bg-primary-50 border-primary-100' },
            { label: 'Badge', val: `🏅 ${progress.badges.length}`, color: 'bg-violet-50 border-violet-100' },
          ].map(s => (
            <div key={s.label} className={`${s.color} border rounded-2xl p-3 text-center shadow-sm`}>
              <div className="text-base font-bold text-slate-800">{s.val}</div>
              <div className="text-[10px] text-slate-500 mt-0.5 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges mini row */}
      <div className="px-4 mt-5">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Badge Anda</p>
        <div className="flex gap-2 overflow-x-auto scrollbar-hidden pb-1">
          {Object.entries(BADGES).map(([k, b]) => {
            const earned = progress.badges.includes(k)
            return (
              <div key={k} title={b.desc} className={`flex-none flex flex-col items-center gap-1 p-2 rounded-xl border text-center min-w-[64px] transition ${earned ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-40'}`}>
                <span className="text-xl">{b.emoji}</span>
                <span className="text-[9px] font-semibold text-slate-600 leading-tight">{b.name}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Modules */}
      <div className="px-4 mt-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Modul Aktif</p>
          <button onClick={() => goTo('modules')} className="text-xs text-primary-600 font-semibold">Semua →</button>
        </div>
        <div className="space-y-3">
          {activeModules.map(m => {
            const lessonsDone = m.lessons.filter(l => progress.done.includes(l.id)).length
            const pct = Math.round((lessonsDone / m.lessons.length) * 100)
            return (
              <button key={m.id} onClick={() => goToModule(m)}
                className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-left hover:shadow-md transition">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-none" style={{ background: m.colorLight }}>
                    {m.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-sm font-bold text-slate-800 truncate pr-2">{m.title}</p>
                      <span className="text-[10px] font-bold text-primary-600 flex-none">{pct}%</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mb-2">{m.desc}</p>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: m.color }} />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">{lessonsDone}/{m.lessons.length} pelajaran · {m.time}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Recent discussions */}
      <div className="px-4 mt-5 pb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Diskusi Terbaru</p>
          <button onClick={() => goTo('discussion')} className="text-xs text-primary-600 font-semibold">Lihat Semua →</button>
        </div>
        <div className="space-y-2">
          {discussions.slice(0, 2).map(d => (
            <div key={d.id} className="bg-white rounded-xl border border-slate-100 p-3 shadow-sm">
              <p className="text-xs font-semibold text-slate-800 mb-1 line-clamp-1">{d.title}</p>
              <p className="text-[11px] text-slate-500 line-clamp-2 mb-2">{d.body}</p>
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <span className="bg-slate-100 px-2 py-0.5 rounded-full font-medium">{d.avatar}</span>
                <span>{d.replies.length} balasan</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderModules = () => (
    <div className="flex-1 overflow-y-auto scrollbar-hidden">
      <div className="px-4 pt-5 pb-3">
        <h2 className="text-lg font-bold text-slate-900">Semua Modul</h2>
        <p className="text-xs text-slate-500 mt-0.5">Pilih modul untuk mulai belajar</p>
      </div>
      <div className="px-4 pb-6 space-y-3">
        {modules.map(m => {
          const isActive = m.status === 'active'
          const lessonsDone = isActive ? m.lessons.filter(l => progress.done.includes(l.id)).length : 0
          const pct = isActive ? Math.round((lessonsDone / m.lessons.length) * 100) : 0
          return (
            <button key={m.id} onClick={() => isActive && goToModule(m)} disabled={!isActive}
              className={`w-full bg-white rounded-2xl border shadow-sm p-4 text-left transition ${isActive ? 'border-slate-100 hover:shadow-md cursor-pointer' : 'border-slate-100 opacity-60 cursor-not-allowed'}`}>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-none" style={{ background: m.colorLight }}>
                  {m.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-bold text-slate-800 truncate">{m.title}</p>
                    {!isActive && (
                      <span className="flex-none text-[9px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase">Segera</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mb-2 line-clamp-2">{m.desc}</p>
                  {isActive ? (
                    <>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-1">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: m.color }} />
                      </div>
                      <p className="text-[10px] text-slate-400">{lessonsDone}/{m.lessons.length} pelajaran · {m.time} · {m.dimension}</p>
                    </>
                  ) : (
                    <p className="text-[10px] text-slate-400">{m.time} · {m.dimension}</p>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )

  const renderModuleDetail = () => {
    if (!activeModule) return null
    const m = activeModule
    const preDone = progress.scores[`${m.id}_pre`] !== undefined
    const postDone = progress.scores[`${m.id}_post`] !== undefined
    return (
      <div className="flex-1 overflow-y-auto scrollbar-hidden">
        {/* Colored header */}
        <div className="px-5 pt-12 pb-6 text-white" style={{ background: `linear-gradient(135deg, ${m.color}, ${m.color}cc)` }}>
          <button onClick={() => goTo('modules')} className="text-white/70 hover:text-white text-sm mb-4 flex items-center gap-1">
            ← Kembali
          </button>
          <div className="text-4xl mb-3">{m.icon}</div>
          <h2 className="text-xl font-black mb-1">{m.title}</h2>
          <p className="text-sm text-white/80">{m.desc}</p>
          <div className="flex gap-2 mt-3 flex-wrap">
            <span className="bg-white/20 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">{m.time}</span>
            <span className="bg-white/20 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">{m.dimension}</span>
          </div>
        </div>

        <div className="px-4 py-4 space-y-4">
          {/* Objective */}
          <div className="bg-primary-50 rounded-xl p-4 border border-primary-100">
            <p className="text-[10px] font-bold text-primary-700 uppercase tracking-widest mb-1">Tujuan Pembelajaran</p>
            <p className="text-xs text-primary-900 leading-relaxed">{m.objective}</p>
          </div>

          {/* Facilitator note */}
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 border-dashed">
            <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mb-1">Panduan Fasilitator</p>
            <p className="text-xs text-amber-900 leading-relaxed">{m.facilitatorNote}</p>
          </div>

          {/* Pre-test */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-800">📋 Pre-Test</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {preDone ? `Selesai · Skor: ${progress.scores[`${m.id}_pre`]}/5` : '5 soal · ~5 menit'}
                </p>
              </div>
              {preDone ? (
                <span className="text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1.5 rounded-xl">✓ Selesai</span>
              ) : (
                <button onClick={() => handleStartTest('pre')}
                  className="text-xs font-bold bg-primary-600 text-white px-3 py-1.5 rounded-xl hover:bg-primary-700 transition">
                  Mulai →
                </button>
              )}
            </div>
          </div>

          {/* Lessons */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Pelajaran</p>
            <div className="space-y-2">
              {m.lessons.map((l, i) => {
                const done = progress.done.includes(l.id)
                const locked = i === 0 ? false : !progress.done.includes(m.lessons[i - 1].id)
                return (
                  <button key={l.id} disabled={locked}
                    onClick={() => !locked && goToLesson(l)}
                    className={`w-full bg-white rounded-xl border p-3.5 text-left transition shadow-sm flex items-center gap-3 ${locked ? 'opacity-50 cursor-not-allowed' : 'border-slate-100 hover:border-primary-200 hover:shadow-md cursor-pointer'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-none ${done ? 'bg-primary-500 text-white' : locked ? 'bg-slate-100 text-slate-400' : 'bg-primary-50 text-primary-600'}`}>
                      {done ? '✓' : locked ? '🔒' : l.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${locked ? 'text-slate-400' : 'text-slate-800'}`}>{l.title}</p>
                      <p className="text-[10px] text-slate-400">{l.typeLabel} · {l.dur} · +{l.xp} XP</p>
                    </div>
                    {!locked && !done && <span className="text-slate-300 flex-none">→</span>}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Post-test */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-slate-800">🏆 Post-Test</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {postDone ? `Selesai · Skor: ${progress.scores[`${m.id}_post`]}/5` : '5 soal · +100 XP'}
                </p>
              </div>
              {postDone ? (
                <span className="text-xs font-bold text-primary-600 bg-primary-50 px-3 py-1.5 rounded-xl">✓ Selesai</span>
              ) : (
                <button onClick={() => handleStartTest('post')}
                  disabled={!preDone}
                  className="text-xs font-bold bg-primary-600 text-white px-3 py-1.5 rounded-xl hover:bg-primary-700 transition disabled:opacity-40 disabled:cursor-not-allowed">
                  Mulai →
                </button>
              )}
            </div>
          </div>

          {/* Certificate */}
          {postDone && (
            <button onClick={() => goTo('certificate')}
              className="w-full bg-gradient-to-r from-navy-900 to-navy-800 text-white rounded-xl p-4 text-center shadow-lg">
              <div className="text-2xl mb-1">🎓</div>
              <p className="text-sm font-bold">Lihat Sertifikat</p>
              <p className="text-xs text-white/70 mt-0.5">Modul ini sudah selesai!</p>
            </button>
          )}
        </div>
      </div>
    )
  }

  const renderLesson = () => {
    if (!activeLesson) return null
    const l = activeLesson

    if (l.type === 'reading') {
      const sectionStyles: Record<string, string> = {
        intro: 'text-slate-700 leading-relaxed',
        text: 'text-slate-700 leading-relaxed',
        case: 'bg-blue-50 border-l-4 border-blue-400 px-4 py-3 rounded-r-xl text-sm text-blue-900',
        stat: 'bg-primary-50 border-l-4 border-primary-500 px-4 py-3 rounded-r-xl text-sm text-primary-900',
        warning: 'bg-red-50 border-l-4 border-red-400 px-4 py-3 rounded-r-xl text-sm text-red-900',
        tip: 'bg-amber-50 border-l-4 border-amber-400 px-4 py-3 rounded-r-xl text-sm text-amber-900',
      }
      return (
        <div className="flex-1 overflow-y-auto scrollbar-hidden px-4 pt-4 pb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">{l.typeLabel}</span>
            <span className="text-[10px] text-slate-400">{l.dur}</span>
          </div>
          <div className="space-y-4">
            {l.content.sections?.map((s, i) => {
              if (s.type === 'image') {
                return (
                  <div key={i} className="rounded-xl overflow-hidden border border-slate-200 bg-white">
                    <img src={s.src} alt={s.alt || ''} className="w-full h-auto" />
                    {s.caption && <p className="text-xs text-slate-500 text-center px-3 py-2">{s.caption}</p>}
                  </div>
                )
              }
              return (
              <div key={i} className={sectionStyles[s.type] || sectionStyles.text}>
                {s.title && <p className="text-xs font-bold mb-1 opacity-70 uppercase tracking-wide">{s.title}</p>}
                <div className="text-sm" dangerouslySetInnerHTML={{ __html: s.text || '' }} />
              </div>
              )
            })}
          </div>
          {progress.done.includes(l.id) ? (
            <div className="mt-6 w-full bg-primary-50 border border-primary-200 text-primary-700 font-bold py-3.5 rounded-xl text-center">
              ✓ Pelajaran Sudah Selesai
            </div>
          ) : (
            <button onClick={() => handleCompleteLesson(l.id, l.xp, undefined, activeModule?.id)}
              className="mt-6 w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl transition shadow-sm">
              Selesai & Klaim +{l.xp} XP →
            </button>
          )}
        </div>
      )
    }

    if (l.type === 'interactive') {
      const pw = getPwStrength(pwInput)
      return (
        <div className="flex-1 overflow-y-auto scrollbar-hidden px-4 pt-4 pb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">{l.typeLabel}</span>
          </div>
          <div className="bg-primary-50 rounded-xl p-4 border border-primary-100 mb-5">
            <div className="text-sm text-primary-900 leading-relaxed" dangerouslySetInnerHTML={{ __html: l.content.intro || '' }} />
          </div>

          {/* Password checker */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 mb-4">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-3">Uji Kata Sandi Anda</p>
            <input value={pwInput} onChange={e => setPwInput(e.target.value)}
              type="text" placeholder="Ketik kata sandi di sini…"
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 font-mono" />
            {pwInput && (
              <div className="mt-3">
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden mb-1.5">
                  <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pw.score}%`, background: pw.color }} />
                </div>
                <p className="text-xs font-bold" style={{ color: pw.color }}>{pw.label}</p>
              </div>
            )}
          </div>

          {/* Comparison table */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 mb-4">
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-3">Perbandingan Kata Sandi</p>
            <div className="space-y-2">
              {l.content.items?.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1">
                    <code className="text-xs text-slate-700 font-mono">{item.pw}</code>
                    <span className="text-[10px] font-bold" style={{ color: item.color }}>{item.label}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-0.5">
                    <div className="h-full rounded-full transition-all" style={{ width: `${item.bar}%`, background: item.color }} />
                  </div>
                  <p className="text-[10px] text-slate-400">{item.time} untuk diretas</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 mb-5">
            <p className="text-xs font-bold text-amber-800 uppercase tracking-wide mb-2">Tips NIST SP 800-63B</p>
            <ul className="space-y-1.5">
              {l.content.tips?.map((tip, i) => (
                <li key={i} className="text-xs text-amber-900 flex items-start gap-2">
                  <span className="mt-0.5 flex-none">✓</span>
                  <span dangerouslySetInnerHTML={{ __html: tip }} />
                </li>
              ))}
            </ul>
          </div>

          {progress.done.includes(l.id) ? (
            <div className="w-full bg-primary-50 border border-primary-200 text-primary-700 font-bold py-3.5 rounded-xl text-center">
              ✓ Pelajaran Sudah Selesai
            </div>
          ) : (
            <button onClick={() => handleCompleteLesson(l.id, l.xp, undefined, activeModule?.id)}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl transition shadow-sm">
              Selesai & Klaim +{l.xp} XP →
            </button>
          )}
        </div>
      )
    }

    if (l.type === 'scenario') {
      const choices = l.content.choices || []
      const chosen = choices.find(c => c.id === scenarioChoice)
      return (
        <div className="flex-1 overflow-y-auto scrollbar-hidden px-4 pt-4 pb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-violet-100 text-violet-700 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">{l.typeLabel}</span>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
            <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wide mb-1">Skenario</p>
            <p className="text-sm text-blue-900 leading-relaxed">{l.content.setup}</p>
          </div>
          <p className="text-sm font-bold text-slate-800 mb-3">{l.content.question}</p>
          <div className="space-y-2 mb-4">
            {choices.map(c => {
              let cls = 'border-slate-200 bg-white text-slate-700 hover:border-primary-300 hover:bg-primary-50'
              if (scenarioAnswered) {
                if (c.id === scenarioChoice) {
                  cls = c.correct ? 'border-primary-400 bg-primary-50 text-primary-800' : 'border-red-300 bg-red-50 text-red-800'
                } else if (c.correct) {
                  cls = 'border-primary-300 bg-primary-50/50 text-primary-700'
                } else {
                  cls = 'border-slate-100 bg-slate-50 text-slate-400 opacity-50'
                }
              }
              return (
                <button key={c.id} disabled={scenarioAnswered}
                  onClick={() => { setScenarioAnswered(true); setScenarioChoice(c.id) }}
                  className={`w-full border rounded-xl px-4 py-3 text-left text-sm font-medium transition ${cls}`}>
                  {c.text}
                </button>
              )
            })}
          </div>
          {scenarioAnswered && chosen && (
            <div className={`rounded-xl p-4 mb-4 border ${chosen.correct ? 'bg-primary-50 border-primary-200' : 'bg-red-50 border-red-200'}`}>
              <p className={`text-xs font-bold mb-1 ${chosen.correct ? 'text-primary-700' : 'text-red-700'}`}>
                {chosen.correct ? '✓ Pilihan Tepat!' : '✗ Kurang Tepat'}
              </p>
              <p className={`text-xs leading-relaxed ${chosen.correct ? 'text-primary-900' : 'text-red-900'}`}>{chosen.fb}</p>
            </div>
          )}
          {scenarioAnswered && (
            progress.done.includes(l.id) ? (
              <div className="w-full bg-primary-50 border border-primary-200 text-primary-700 font-bold py-3.5 rounded-xl text-center">
                ✓ Pelajaran Sudah Selesai
              </div>
            ) : (
              <button onClick={() => handleCompleteLesson(l.id, l.xp, undefined, activeModule?.id)}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl transition">
                Selesai & Klaim +{l.xp} XP →
              </button>
            )
          )}
        </div>
      )
    }

    if (l.type === 'simulation') {
      const scenarios = l.content.scenarios || []
      if (simDone) {
        const total = scenarios.length
        const pct = Math.round((simScore / total) * 100)
        return (
          <div className="flex-1 overflow-y-auto scrollbar-hidden px-4 pt-4 pb-6">
            <div className="text-center py-8">
              <div className="text-5xl mb-4">{pct >= 70 ? '🎯' : '📚'}</div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Simulasi Selesai!</h3>
              <p className="text-slate-500 mb-6">Skor Anda: {simScore}/{total} benar ({pct}%)</p>
              <div className="w-24 h-24 rounded-full border-8 border-primary-100 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-black text-primary-600">{pct}%</span>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                {pct === 100 ? 'Sempurna! Anda sangat jago mendeteksi konten berbahaya.' : pct >= 70 ? 'Bagus! Tetap waspada terhadap konten yang mencurigakan.' : 'Perlu latihan lagi. Selalu periksa detail sebelum mengambil tindakan.'}
              </p>
              {progress.done.includes(l.id) ? (
                <div className="w-full bg-primary-50 border border-primary-200 text-primary-700 font-bold py-3.5 rounded-xl text-center">
                  ✓ Pelajaran Sudah Selesai
                </div>
              ) : (
                <button onClick={() => handleCompleteLesson(l.id, l.xp, undefined, activeModule?.id)}
                  className="w-full bg-primary-600 text-white font-bold py-3.5 rounded-xl hover:bg-primary-700 transition">
                  Klaim +{l.xp} XP →
                </button>
              )}
            </div>
          </div>
        )
      }

      const sc = scenarios[simIdx]
      return (
        <div className="flex-1 overflow-y-auto scrollbar-hidden px-4 pt-4 pb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">{l.typeLabel}</span>
            <span className="text-[10px] text-slate-400">{simIdx + 1}/{scenarios.length}</span>
          </div>
          <p className="text-xs text-slate-500 mb-3">{l.content.instruction}</p>

          {/* Email card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-4 overflow-hidden">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">DARI:</span>
                <span className="text-xs text-slate-700 font-mono">{sc.msg.from}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">PERIHAL:</span>
                <span className="text-xs text-slate-800 font-semibold">{sc.msg.subj}</span>
              </div>
            </div>
            <div className="px-4 py-3">
              <pre className="text-xs text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">{sc.msg.body}</pre>
            </div>
          </div>

          {!simAnswered ? (
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => handleSimAnswer('safe')}
                className="bg-primary-50 hover:bg-primary-100 border border-primary-200 text-primary-700 font-bold py-3 rounded-xl transition text-sm">
                ✅ Aman
              </button>
              <button onClick={() => handleSimAnswer('phishing')}
                className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold py-3 rounded-xl transition text-sm">
                🚨 Tidak Aman
              </button>
            </div>
          ) : (
            <div>
              <div className={`rounded-xl p-4 mb-3 border ${simCorrect ? 'bg-primary-50 border-primary-200' : 'bg-red-50 border-red-200'}`}>
                <p className={`text-xs font-bold mb-2 ${simCorrect ? 'text-primary-700' : 'text-red-700'}`}>
                  {simCorrect
                    ? (sc.verdict === 'safe' ? '✓ Benar! Konten ini aman.' : '✓ Benar! Ini tidak aman.')
                    : (sc.verdict === 'safe' ? '✗ Salah! Konten ini sebenarnya aman.' : '✗ Salah! Ini tidak aman — waspadai ciri-cirinya.')}
                </p>
                <div className="space-y-1 mb-3">
                  {sc.flags.map((f, i) => (
                    <p key={i} className="text-[11px] text-red-800 flex items-start gap-1.5">
                      <span className="mt-0.5">🚩</span> {f}
                    </p>
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed border-t border-slate-200 pt-2 mt-2">{sc.explain}</p>
              </div>
              <button onClick={handleNextSim}
                className="w-full bg-primary-600 text-white font-bold py-3 rounded-xl hover:bg-primary-700 transition">
                {simIdx < scenarios.length - 1 ? 'Email Berikutnya →' : 'Lihat Hasil →'}
              </button>
            </div>
          )}
        </div>
      )
    }

    return null
  }

  const renderTest = () => {
    if (!activeModule) return null
    const qs = testType === 'pre' ? activeModule.pretest.questions : activeModule.posttest.questions
    const preScore = progress.scores[`${activeModule.id}_pre`]

    if (testDone) {
      const gain = testType === 'post' && preScore !== undefined
        ? ((testFinalScore - preScore) / (5 - preScore)) * 100
        : null
      return (
        <div className="flex-1 overflow-y-auto scrollbar-hidden px-4 pt-4 pb-6">
          <div className="text-center py-6">
            <div className="text-5xl mb-4">{testFinalScore >= 4 ? '🎉' : testFinalScore >= 3 ? '👍' : '📚'}</div>
            <h3 className="text-xl font-black text-slate-900 mb-1">
              {testType === 'pre' ? 'Pre-Test Selesai' : 'Post-Test Selesai'}
            </h3>
            <div className="w-28 h-28 rounded-full border-8 border-primary-100 flex items-center justify-center mx-auto my-5">
              <span className="text-3xl font-black text-primary-600">{testFinalScore}<span className="text-lg font-normal text-slate-400">/{qs.length}</span></span>
            </div>
            {gain !== null && (
              <div className="bg-primary-50 rounded-xl p-4 border border-primary-100 mb-4 text-left">
                <p className="text-xs font-bold text-primary-700 uppercase tracking-wide mb-2">Learning Gain (N-Gain)</p>
                <div className="flex justify-between text-xs text-slate-600 mb-1.5">
                  <span>Pre-test: {preScore}/5</span>
                  <span>Post-test: {testFinalScore}/5</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 rounded-full" style={{ width: `${Math.max(0, gain)}%` }} />
                </div>
                <p className="text-[10px] text-slate-500 mt-1.5">
                  N-Gain: {gain.toFixed(0)}% · {gain >= 70 ? 'Tinggi 🏆' : gain >= 30 ? 'Sedang 👍' : 'Rendah 📖'}
                </p>
              </div>
            )}
            <div className="bg-primary-600 text-white rounded-xl p-3 text-center mb-4">
              <p className="text-xs font-semibold">{testType === 'pre' ? '+50 XP diperoleh!' : '+100 XP diperoleh!'}</p>
            </div>
            <button onClick={() => setScreen('module-detail')}
              className="w-full bg-primary-600 text-white font-bold py-3.5 rounded-xl hover:bg-primary-700 transition">
              Kembali ke Modul →
            </button>
          </div>
        </div>
      )
    }

    const q = qs[testQIdx]
    return (
      <div className="flex-1 overflow-y-auto scrollbar-hidden px-4 pt-4 pb-6">
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-500">{testType === 'pre' ? 'Pre-Test' : 'Post-Test'} · Soal {testQIdx + 1}/{qs.length}</span>
            <span className="text-xs text-slate-400">{activeModule.title}</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${((testQIdx + (testAnswered ? 1 : 0)) / qs.length) * 100}%` }} />
          </div>
        </div>
        <p className="text-sm font-bold text-slate-900 mb-4 leading-relaxed">{q.text}</p>
        <div className="space-y-2 mb-4">
          {q.opts.map(o => {
            let cls = 'border-slate-200 bg-white text-slate-700 hover:border-primary-300'
            if (testAnswered) {
              if (o.id === testSelectedOpt) {
                cls = o.correct ? 'border-primary-400 bg-primary-50 text-primary-800' : 'border-red-300 bg-red-50 text-red-800'
              } else if (o.correct) {
                cls = 'border-primary-300 bg-primary-50/50 text-primary-700'
              } else {
                cls = 'border-slate-100 bg-slate-50 text-slate-400 opacity-50'
              }
            }
            return (
              <button key={o.id} disabled={testAnswered}
                onClick={() => handleAnswerTest(o.id)}
                className={`w-full border rounded-xl px-4 py-3 text-left text-sm transition flex items-center gap-3 ${cls}`}>
                <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold flex-none text-slate-500">
                  {o.id.toUpperCase()}
                </span>
                {o.text}
              </button>
            )
          })}
        </div>
        {testAnswered && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4">
            <p className="text-xs text-slate-600 leading-relaxed">{q.explain}</p>
          </div>
        )}
        {testAnswered && (
          <button onClick={handleNextTestQ}
            className="w-full bg-primary-600 text-white font-bold py-3.5 rounded-xl hover:bg-primary-700 transition">
            {testQIdx < qs.length - 1 ? 'Soal Berikutnya →' : 'Selesai →'}
          </button>
        )}
      </div>
    )
  }

  const renderChat = () => (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto scrollbar-hidden px-4 py-4 space-y-3">
        {chatMsgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'ai' && (
              <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-sm mr-2 flex-none mt-1">🤖</div>
            )}
            <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${m.role === 'user' ? 'bg-primary-600 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {chatLoading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-sm mr-2 flex-none">🤖</div>
            <div className="bg-slate-100 rounded-2xl rounded-bl-none px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-white">
        <div className="flex gap-2">
          <input value={chatInput} onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSendChat()}
            placeholder="Tanyakan sesuatu tentang keamanan siber…"
            className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100" />
          <button onClick={handleSendChat} disabled={!chatInput.trim() || chatLoading}
            className="bg-primary-600 hover:bg-primary-700 disabled:opacity-40 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition">
            →
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-1.5 text-center">Respons disimulasikan · +5 XP per pertanyaan</p>
      </div>
    </div>
  )

  const renderDiscussion = () => (
    <div className="flex-1 overflow-y-auto scrollbar-hidden">
      <div className="px-4 pt-4 pb-3 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900">Forum Diskusi</h2>
        <button onClick={() => goTo('new-post')}
          className="bg-primary-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-primary-700 transition">
          + Buat Diskusi
        </button>
      </div>
      {/* Filter */}
      <div className="px-4 mb-3 flex gap-2 overflow-x-auto scrollbar-hidden">
        {([{ id: null, label: 'Semua' }, { id: 'm1', label: 'Modul 1' }, { id: 'm2', label: 'Modul 2' }, { id: 'm3', label: 'Modul 3' }, { id: 'm4', label: 'Modul 4' }, { id: 'm5', label: 'Modul 5' }, { id: 'm6', label: 'Modul 6' }] as { id: string | null; label: string }[]).map(f => (
          <button key={String(f.id)} onClick={() => setDiscFilter(f.id)}
            className={`flex-none px-3 py-1 rounded-full text-xs font-semibold transition ${discFilter === f.id ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
            {f.label}
          </button>
        ))}
      </div>
      <div className="px-4 pb-6 space-y-3">
        {filteredDisc.map(d => (
          <div key={d.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <div className="flex items-start gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700 flex-none">{d.avatar}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 leading-tight">{d.title}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{d.userName} · {d.time}</p>
              </div>
              <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full flex-none">{`Modul ${d.moduleId.slice(1)}`}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-3 line-clamp-2">{d.body}</p>
            {/* Replies */}
            {d.replies.length > 0 && (
              <div className="border-t border-slate-50 pt-3 space-y-2">
                {d.replies.map(r => (
                  <div key={r.id} className="flex items-start gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[9px] font-bold text-blue-700 flex-none">{r.avatar}</div>
                    <div className="flex-1 bg-slate-50 rounded-xl px-3 py-2">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-bold text-slate-700">{r.userName}</span>
                        {r.expert && <span className="text-[8px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded-full">AHLI</span>}
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{r.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center gap-3 mt-3 pt-2 border-t border-slate-50">
              <span className="text-[10px] text-slate-400">💬 {d.replies.length} balasan</span>
              <button className="text-[10px] text-primary-600 font-semibold hover:underline ml-auto"
                onClick={() => alert('Fitur balas tersedia untuk Ahli Validasi')}>
                Balas →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderNewPost = () => (
    <div className="flex-1 overflow-y-auto scrollbar-hidden px-4 pt-4 pb-6">
      <h2 className="text-base font-bold text-slate-900 mb-4">Buat Diskusi Baru</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Modul Terkait</label>
          <select value={postModId} onChange={e => setPostModId(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500 bg-white">
            <option value="m1">Modul 1 — Manajemen Kata Sandi</option>
            <option value="m2">Modul 2 — Keamanan Email</option>
            <option value="m3">Modul 3 — Pelaporan Insiden</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Judul Diskusi</label>
          <input value={postTitle} onChange={e => setPostTitle(e.target.value)}
            placeholder="Apa yang ingin Anda diskusikan?"
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Isi Diskusi</label>
          <textarea value={postBody} onChange={e => setPostBody(e.target.value)}
            rows={5} placeholder="Tulis pertanyaan atau pengalaman Anda…"
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 resize-none" />
        </div>
        <div className="flex gap-2">
          <button onClick={() => goTo('discussion')}
            className="flex-1 border border-slate-200 text-slate-600 font-semibold py-3 rounded-xl hover:bg-slate-50 transition text-sm">
            Batal
          </button>
          <button onClick={handleSubmitPost} disabled={!postTitle.trim() || !postBody.trim()}
            className="flex-1 bg-primary-600 text-white font-bold py-3 rounded-xl hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition text-sm">
            Kirim +25 XP
          </button>
        </div>
      </div>
    </div>
  )

  const renderAchievements = () => (
    <div className="flex-1 overflow-y-auto scrollbar-hidden">
      {/* XP / Level header */}
      <div className="bg-gradient-to-br from-navy-900 to-navy-800 px-5 pt-10 pb-6 text-white">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">{lvInfo.emoji}</div>
          <h2 className="text-xl font-black">{lvInfo.name}</h2>
          <p className="text-sm text-white/60">Level {lvInfo.level} · {progress.xp} XP total</p>
        </div>
        <div className="bg-white/10 rounded-xl p-3">
          <div className="flex justify-between text-xs text-white/70 mb-1">
            <span>Level {lvInfo.level}</span>
            {lvInfo.level < 5 && <span>Level {lvInfo.level + 1}: {LEVELS[lvInfo.level]?.minXP} XP</span>}
          </div>
          <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-primary-400 rounded-full transition-all" style={{ width: `${lvPct}%` }} />
          </div>
          <p className="text-xs text-white/50 mt-1 text-center">{lvPct}% menuju level berikutnya</p>
        </div>
      </div>

      <div className="px-4 py-4 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Hari Streak', val: progress.streak, emoji: '🔥' },
            { label: 'Pelajaran', val: progress.done.length, emoji: '✅' },
            { label: 'Modul', val: progress.modules.length, emoji: '📚' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 text-center">
              <div className="text-2xl mb-0.5">{s.emoji}</div>
              <div className="text-xl font-black text-slate-900">{s.val}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Badge ({progress.badges.length}/{Object.keys(BADGES).length})</p>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(BADGES).map(([k, b]) => {
              const earned = progress.badges.includes(k)
              return (
                <div key={k} title={b.desc}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-center transition ${earned ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-40'}`}>
                  <span className="text-2xl">{b.emoji}</span>
                  <span className="text-[9px] font-semibold text-slate-600 leading-tight">{b.name}</span>
                  {earned && <span className="text-[8px] text-primary-600 font-bold">✓ Diperoleh</span>}
                </div>
              )
            })}
          </div>
        </div>

        {/* Level journey */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Perjalanan Level</p>
          <div className="space-y-2">
            {LEVELS.map(lv => {
              const reached = progress.xp >= lv.minXP
              return (
                <div key={lv.level} className={`flex items-center gap-3 p-3 rounded-xl border transition ${reached ? 'bg-white border-primary-100 shadow-sm' : 'bg-slate-50 border-slate-100 opacity-50'}`}>
                  <span className="text-xl">{lv.emoji}</span>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${reached ? 'text-slate-800' : 'text-slate-400'}`}>{lv.name}</p>
                    <p className="text-[10px] text-slate-400">{lv.minXP} XP</p>
                  </div>
                  {reached && <span className="text-primary-600 text-sm">✓</span>}
                </div>
              )
            })}
          </div>
        </div>

        {/* Certificate shortcut */}
        {progress.modules.length > 0 && (
          <button onClick={() => goTo('certificate')}
            className="w-full bg-gradient-to-r from-navy-900 to-navy-800 text-white rounded-xl p-4 text-center">
            <div className="text-2xl mb-1">🎓</div>
            <p className="text-sm font-bold">Lihat Sertifikat</p>
            <p className="text-xs text-white/60 mt-0.5">{progress.modules.length} modul selesai</p>
          </button>
        )}
      </div>
    </div>
  )

  const renderCertificate = () => {
    const allDone = progress.modules.length >= 3
    return (
      <div className="flex-1 overflow-y-auto scrollbar-hidden px-4 pt-4 pb-6">
        <h2 className="text-base font-bold text-slate-900 mb-1">Sertifikat</h2>
        <p className="text-xs text-slate-500 mb-4">Sertifikat diperoleh setelah menyelesaikan setiap modul</p>
        <div className="space-y-3">
          {modules.filter(m => m.status === 'active' && progress.modules.includes(m.id)).map(m => (
            <div key={m.id} className="rounded-2xl overflow-hidden shadow-lg border border-slate-200">
              <div className="p-5 text-white" style={{ background: `linear-gradient(135deg, #0f1e3c, #1a3260)` }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{m.icon}</div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest">CLME Platform</p>
                    <p className="text-[10px] text-white/70">Sertifikat Penyelesaian</p>
                  </div>
                </div>
                <p className="text-[10px] font-semibold text-white/60 uppercase tracking-widest mb-1">Diberikan Kepada</p>
                <p className="text-lg font-black mb-1">{session.name}</p>
                <p className="text-xs text-white/70 mb-3">{session.school}</p>
                <p className="text-[10px] text-white/50 mb-0.5">Telah Menyelesaikan</p>
                <p className="text-sm font-bold text-primary-300">{m.title}</p>
                <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center">
                  <p className="text-[9px] text-white/40">ID: {session.id}-{m.id.toUpperCase()}</p>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★★★★★</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {allDone && (
            <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-yellow-300">
              <div className="p-5 text-white" style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}>
                <div className="text-center">
                  <div className="text-4xl mb-2">🎓</div>
                  <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">Sertifikat Kelulusan</p>
                  <p className="text-lg font-black">{session.name}</p>
                  <p className="text-xs text-white/70 mb-3">{session.school}</p>
                  <p className="text-sm font-semibold text-yellow-300 mb-1">CLME Graduate</p>
                  <p className="text-xs text-white/60">Telah menyelesaikan seluruh program CLME</p>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-[9px] text-white/40">Diterbitkan oleh PPS PTK UPI Bandung · 2026</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {progress.modules.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🎓</div>
              <p className="text-sm font-semibold text-slate-600 mb-1">Belum Ada Sertifikat</p>
              <p className="text-xs text-slate-400">Selesaikan modul untuk mendapatkan sertifikat</p>
              <button onClick={() => goTo('modules')}
                className="mt-4 bg-primary-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-primary-700 transition">
                Mulai Belajar →
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── SCREEN HEADERS ──────────────────────────────────────────────────────────
  const screenHeaders: Partial<Record<Screen, { title: string; back: () => void }>> = {
    'module-detail': { title: activeModule?.title || 'Detail Modul', back: () => goTo('modules') },
    'lesson': { title: activeLesson?.title || 'Pelajaran', back: () => goTo('module-detail') },
    'test': { title: testType === 'pre' ? 'Pre-Test' : 'Post-Test', back: () => goTo('module-detail') },
    'certificate': { title: 'Sertifikat', back: () => goTo('achievements') },
    'new-post': { title: 'Buat Diskusi', back: () => goTo('discussion') },
  }

  const navTitles: Partial<Record<Screen, string>> = {
    dashboard: 'Beranda',
    modules: 'Modul',
    chat: 'AI Tutor',
    discussion: 'Diskusi',
    achievements: 'Pencapaian',
  }

  const header = screenHeaders[screen]
  const navTitle = navTitles[screen]

  return (
    <div className="h-screen bg-white flex overflow-hidden">

      {/* ── Desktop Sidebar ─────────────────────────────── */}
      <aside className="hidden md:flex w-60 bg-white border-r border-slate-100 flex-col flex-none shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="CLME" className="w-8 h-8 object-contain flex-none" />
            <div>
              <p className="text-sm font-black text-slate-900 leading-none">CLME</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Platform</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map(n => {
            const active = screen === n.screen
            return (
              <button key={n.tab} onClick={() => setScreen(n.screen)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                  active ? 'bg-primary-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}>
                <span className="text-base leading-none">{n.emoji}</span>
                <span>{n.label}</span>
              </button>
            )
          })}
        </nav>

        {session && (
          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-xs font-black text-primary-700 flex-none">{session.avatar}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{session.name.split(',')[0]}</p>
                <p className="text-[10px] text-slate-400 truncate">{session.school}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full text-xs text-slate-500 hover:text-red-600 py-1.5 rounded-lg border border-slate-200 hover:border-red-200 transition">
              Keluar
            </button>
          </div>
        )}
      </aside>

      {/* ── Main Area ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <div className="flex-none bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3 z-10">
          {header ? (
            <>
              <button onClick={header.back} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition text-sm font-bold">
                ←
              </button>
              <h1 className="text-sm font-bold text-slate-800 flex-1 truncate">{header.title}</h1>
            </>
          ) : (
            <>
              {/* Mobile-only logo */}
              <img src="/logo.png" alt="CLME" className="md:hidden w-7 h-7 object-contain flex-none" />
              <h1 className="text-sm font-bold text-slate-800 flex-1">{navTitle || 'CLME'}</h1>
              {progress && (
                <span className="text-xs bg-primary-100 text-primary-700 font-bold px-2.5 py-0.5 rounded-full flex-none">
                  {progress.xp} XP
                </span>
              )}
            </>
          )}
        </div>

        {/* Screen content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {screen === 'dashboard'     && renderDashboard()}
          {screen === 'modules'       && renderModules()}
          {screen === 'module-detail' && renderModuleDetail()}
          {screen === 'lesson'        && renderLesson()}
          {screen === 'test'          && renderTest()}
          {screen === 'chat'          && renderChat()}
          {screen === 'discussion'    && renderDiscussion()}
          {screen === 'new-post'      && renderNewPost()}
          {screen === 'achievements'  && renderAchievements()}
          {screen === 'certificate'   && renderCertificate()}
        </div>

        {/* Bottom nav — mobile only */}
        {showNav && (
          <div className="md:hidden flex-none border-t border-slate-100 bg-white px-2 py-2 grid grid-cols-5 gap-1">
            {navItems.map(n => {
              const active = screen === n.screen
              return (
                <button key={n.tab} onClick={() => setScreen(n.screen)}
                  className={`flex flex-col items-center gap-0.5 py-1.5 px-1 rounded-xl transition ${active ? 'bg-primary-50' : 'hover:bg-slate-50'}`}>
                  <span className="text-xl">{n.emoji}</span>
                  <span className={`text-[9px] font-semibold ${active ? 'text-primary-600' : 'text-slate-400'}`}>{n.label}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Logout confirm */}
      {logoutConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-xs w-full text-center animate-fade-in">
            <div className="text-3xl mb-3">👋</div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Keluar dari CLME?</h3>
            <p className="text-sm text-slate-500 mb-5">Sesi kamu akan diakhiri.</p>
            <div className="flex gap-3">
              <button onClick={() => setLogoutConfirm(false)}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition">
                Batal
              </button>
              <button onClick={doLogout}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 rounded-xl text-sm font-bold text-white transition">
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Achievement popup overlay */}
      {showAchievement && achievementData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-8">
          <div className="bg-white rounded-2xl p-6 shadow-2xl text-center max-w-xs w-full animate-pop">
            <div className="text-4xl mb-3">{achievementData.emoji}</div>
            <h3 className="text-lg font-black text-slate-900 mb-1">{achievementData.title}</h3>
            <p className="text-sm text-slate-500 mb-4">{achievementData.sub}</p>
            <div className="bg-primary-600 text-white rounded-xl px-4 py-2 text-sm font-bold inline-block">
              +{achievementData.xp} XP
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
