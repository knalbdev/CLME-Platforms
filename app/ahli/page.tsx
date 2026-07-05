'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSession, logout } from '@/lib/auth'
import {
  getFirestoreUsers, getFirestoreProgress, getFirestoreDiscussions,
  getFieldNotes, saveFieldNote, saveFasilitatorReport,
  type FieldNote as FSFieldNote,
} from '@/lib/db'
import type { User, Discussion, UserProgress } from '@/types'

type Section = 'dashboard' | 'keterlibatan' | 'jadwal' | 'catatan' | 'diskusi' | 'laporan'
type NoteCategory = 'aktivitas' | 'kendala' | 'temuan' | 'rekomendasi'

type FieldNote = FSFieldNote & { id: string }

interface ScheduleEvent {
  id: string
  title: string
  date: string
  time: string
  peserta: string[]
  note: string
  done: boolean
}

const CAT_COLORS: Record<NoteCategory, string> = {
  aktivitas: 'bg-sky-100 text-sky-700 border-sky-200',
  kendala:   'bg-red-100 text-red-700 border-red-200',
  temuan:    'bg-amber-100 text-amber-700 border-amber-200',
  rekomendasi: 'bg-primary-100 text-primary-700 border-primary-200',
}
const CAT_LABELS: Record<NoteCategory, string> = {
  aktivitas: 'Aktivitas', kendala: 'Kendala', temuan: 'Temuan', rekomendasi: 'Rekomendasi',
}

const INITIAL_SCHEDULE: ScheduleEvent[] = [
  { id: 's1', title: 'Sesi Pendampingan Modul 3', date: '2026-07-02', time: '09:00', peserta: ['Sari Rahayu', 'Budi Hartono', 'Rini Wulandari'], note: 'Ingatkan peserta untuk menyelesaikan pre-test sebelum sesi dimulai', done: false },
  { id: 's2', title: 'Check-in Progress Peserta', date: '2026-07-05', time: '14:00', peserta: ['Sari Rahayu', 'Rini Wulandari'], note: 'Fokus pada peserta yang belum menyelesaikan Modul 2', done: false },
  { id: 's3', title: 'Rapat Koordinasi Fasilitator', date: '2026-06-15', time: '10:00', peserta: ['Semua Peserta'], note: '', done: true },
]


export default function FasilitatorPage() {
  const router = useRouter()
  const [section, setSection] = useState<Section>('dashboard')
  const [session, setSession] = useState<User | null>(null)
  const [pesertaList, setPesertaList] = useState<User[]>([])
  const [progressMap, setProgressMap] = useState<Record<string, UserProgress>>({})
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [logoutConfirm, setLogoutConfirm] = useState(false)
  const [notes, setNotes] = useState<FieldNote[]>([])
  const [schedule, setSchedule] = useState<ScheduleEvent[]>(INITIAL_SCHEDULE)

  const [showNoteForm, setShowNoteForm] = useState(false)
  const [noteForm, setNoteForm] = useState<{ category: NoteCategory; body: string; location: string }>({
    category: 'aktivitas', body: '', location: '',
  })

  const [reminderTarget, setReminderTarget] = useState('')
  const [reminderMsg, setReminderMsg] = useState('')
  const [remindersSent, setRemindersSent] = useState<{ id: string; to: string; msg: string; time: string }[]>([])

  const [reportForm, setReportForm] = useState({ period: '', highlights: '', obstacles: '', recommendation: '', nextPlan: '' })
  const [sentReports, setSentReports] = useState<{ id: string; period: string; sentAt: string }[]>([])

  const [saveMsg, setSaveMsg] = useState('')

  const flash = (msg: string) => { setSaveMsg(msg); setTimeout(() => setSaveMsg(''), 3000) }

  useEffect(() => {
    const load = async () => {
      const s = getSession()
      if (!s || s.role !== 'ahli') { router.push('/login'); return }
      setSession(s)
      const [disc, fieldNotes, fsUsers] = await Promise.all([
        getFirestoreDiscussions(),
        getFieldNotes(s.id),
        getFirestoreUsers(),
      ])
      setDiscussions(disc)
      setNotes(fieldNotes as FieldNote[])
      const users = fsUsers
      const peserta = users.filter((u: User) => u.role === 'peserta')
      setPesertaList(peserta)
      const map: Record<string, UserProgress> = {}
      await Promise.all(peserta.map(async (u: User) => {
        const p = await getFirestoreProgress(u.id)
        if (p) map[u.id] = p
      }))
      setProgressMap(map)
    }
    load()
  }, [router])

  const handleLogout = () => setLogoutConfirm(true)
  const doLogout = () => { logout(); router.push('/login') }

  const getLastActiveDays = (userId: string) => {
    const prog = progressMap[userId]
    if (!prog?.dates?.length) return 0
    const lastMs = Math.max(...prog.dates.map(d => new Date(d).getTime()))
    return Math.floor((Date.now() - lastMs) / 86_400_000)
  }
  const getLastActiveLabel = (userId: string) => {
    const days = getLastActiveDays(userId)
    const d = new Date()
    d.setDate(d.getDate() - days)
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  }
  const needsFollowUp = (userId: string) => getLastActiveDays(userId) >= 3

  const emptyProg = (uid: string): UserProgress => ({ uid, xp: 0, level: 1, streak: 1, badges: [], done: [], modules: [], scores: {}, dates: [] })
  const progresses = pesertaList.map(u => ({ user: u, progress: progressMap[u.id] ?? emptyProg(u.id) }))
  const avgXP = progresses.length ? Math.round(progresses.reduce((s, p) => s + p.progress.xp, 0) / progresses.length) : 0
  const activeCount = progresses.filter(p => !needsFollowUp(p.user.id)).length
  const followUpCount = progresses.filter(p => needsFollowUp(p.user.id)).length

  const handleAddNote = async () => {
    if (!noteForm.body.trim() || !session) return
    const payload = {
      facilitatorId: session.id,
      date: new Date().toISOString().split('T')[0],
      category: noteForm.category,
      body: noteForm.body.trim(),
      location: noteForm.location.trim() || 'Tidak disebutkan',
    }
    const id = await saveFieldNote(payload)
    setNotes(prev => [{ id, ...payload }, ...prev])
    setNoteForm({ category: 'aktivitas', body: '', location: '' })
    setShowNoteForm(false)
    flash('Catatan lapangan berhasil disimpan.')
  }

  const handleSendReminder = () => {
    if (!reminderTarget || !reminderMsg.trim()) return
    const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) +
      ', ' + new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
    setRemindersSent(prev => [{ id: `r_${Date.now()}`, to: reminderTarget, msg: reminderMsg.trim(), time }, ...prev])
    setReminderTarget('')
    setReminderMsg('')
    flash('Pengingat berhasil dikirim.')
  }

  const handleSendReport = async () => {
    if (!reportForm.highlights.trim() || !session) return
    const sentAt = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    const period = reportForm.period || 'Periode tidak disebutkan'
    await saveFasilitatorReport({
      facilitatorId: session.id,
      facilitatorName: session.name,
      period,
      highlights: reportForm.highlights.trim(),
      obstacles: reportForm.obstacles.trim(),
      recommendation: reportForm.recommendation.trim(),
      nextPlan: reportForm.nextPlan.trim(),
      sentAt,
    })
    setSentReports(prev => [{ id: `rep_${Date.now()}`, period, sentAt }, ...prev])
    setReportForm({ period: '', highlights: '', obstacles: '', recommendation: '', nextPlan: '' })
    flash('Laporan berhasil dikirim ke Peneliti.')
  }

  const navItems: { id: Section; label: string; emoji: string }[] = [
    { id: 'dashboard',    label: 'Dasbor Program',        emoji: '📊' },
    { id: 'keterlibatan', label: 'Keterlibatan Peserta',   emoji: '👥' },
    { id: 'jadwal',       label: 'Jadwal & Reminder',      emoji: '📅' },
    { id: 'catatan',      label: 'Catatan Lapangan',       emoji: '📝' },
    { id: 'diskusi',      label: 'Forum Diskusi',          emoji: '💬' },
    { id: 'laporan',      label: 'Laporan ke Peneliti',    emoji: '📤' },
  ]

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* ── Sidebar ─────────────────────────────────── */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-100 flex-col shadow-sm flex-none">
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="CLME" className="w-9 h-9 object-contain flex-none" />
            <div>
              <p className="text-sm font-black text-slate-900 leading-none">CLME</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Fasilitator</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map(n => (
            <button key={n.id} onClick={() => setSection(n.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                section === n.id
                  ? 'bg-primary-600 text-white shadow-sm shadow-primary-200'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}>
              <span className="text-base leading-none">{n.emoji}</span>
              <span className="leading-none">{n.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-xs font-black text-primary-700 flex-none">{session.avatar}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{session.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{session.institution}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full text-xs text-slate-500 hover:text-red-600 py-1.5 rounded-lg border border-slate-200 hover:border-red-200 transition">
            Keluar
          </button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        {/* Mobile section header */}
        <div className="md:hidden sticky top-0 z-10 bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3">
          <img src="/logo.png" alt="CLME" className="w-7 h-7 object-contain flex-none" />
          <p className="text-sm font-bold text-slate-800">CLME · Fasilitator</p>
          <span className="ml-auto text-base">{navItems.find(n => n.id === section)?.emoji}</span>
        </div>
        <div className="p-4 md:p-6 max-w-5xl mx-auto">

          {saveMsg && (
            <div className="mb-4 bg-primary-50 border border-primary-200 text-primary-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
              ✅ {saveMsg}
            </div>
          )}

          {/* ── DASBOR ─────────────────────────────── */}
          {section === 'dashboard' && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-black text-slate-900">Dasbor Program</h1>
                <p className="text-slate-500 text-sm mt-1">
                  Koordinasi lapangan · {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total Peserta',    val: pesertaList.length, emoji: '👥', border: 'border-blue-100',    bg: 'bg-blue-50' },
                  { label: 'Peserta Aktif',    val: activeCount,        emoji: '✅', border: 'border-primary-100', bg: 'bg-primary-50' },
                  { label: 'Perlu Follow-up',  val: followUpCount,      emoji: '⚠️', border: 'border-amber-100',   bg: 'bg-amber-50' },
                  { label: 'Catatan Lapangan', val: notes.length,       emoji: '📝', border: 'border-violet-100',  bg: 'bg-violet-50' },
                ].map(s => (
                  <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 shadow-sm`}>
                    <div className="text-2xl mb-1">{s.emoji}</div>
                    <div className="text-2xl font-black text-slate-900">{s.val}</div>
                    <div className="text-xs text-slate-500 mt-0.5 font-medium">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Follow-up list */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-4 rounded-full bg-amber-400 inline-block" />
                    Perlu Follow-up
                  </h3>
                  {followUpCount === 0 ? (
                    <p className="text-xs text-slate-400 italic">Semua peserta aktif dalam 3 hari terakhir.</p>
                  ) : (
                    <div className="space-y-2">
                      {progresses.filter(p => needsFollowUp(p.user.id)).map(({ user }) => (
                        <div key={user.id} className="flex items-center justify-between bg-amber-50 border border-amber-100 rounded-xl p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-[10px] font-bold text-amber-700 flex-none">{user.avatar}</div>
                            <div>
                              <p className="text-xs font-semibold text-slate-800">{user.name.split(',')[0]}</p>
                              <p className="text-[10px] text-slate-500">Aktif: {getLastActiveLabel(user.id)}</p>
                            </div>
                          </div>
                          <span className="text-[9px] bg-amber-200 text-amber-800 font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                            Tidak Aktif {getLastActiveDays(user.id)}h
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Upcoming schedule */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-4 rounded-full bg-primary-400 inline-block" />
                    Jadwal Mendatang
                  </h3>
                  <div className="space-y-2">
                    {schedule.filter(s => !s.done).slice(0, 3).map(ev => (
                      <div key={ev.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                        <div className="text-center flex-none bg-primary-100 rounded-lg px-2 py-1">
                          <div className="text-sm font-black text-primary-700 leading-none">
                            {new Date(ev.date).getDate()}
                          </div>
                          <div className="text-[9px] font-bold text-primary-500 uppercase">
                            {new Date(ev.date).toLocaleDateString('id-ID', { month: 'short' })}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-800">{ev.title}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{ev.time} · {ev.peserta.length} peserta</p>
                        </div>
                      </div>
                    ))}
                    {schedule.filter(s => !s.done).length === 0 && (
                      <p className="text-xs text-slate-400 italic">Tidak ada jadwal mendatang.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent notes */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-4 rounded-full bg-violet-400 inline-block" />
                  Catatan Lapangan Terbaru
                </h3>
                <div className="space-y-2">
                  {notes.slice(0, 3).map(n => (
                    <div key={n.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                      <span className={`text-[9px] font-bold px-2 py-1 rounded-lg border flex-none mt-0.5 ${CAT_COLORS[n.category]}`}>
                        {CAT_LABELS[n.category]}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-700 leading-relaxed line-clamp-2">{n.body}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(n.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── KETERLIBATAN ───────────────────────── */}
          {section === 'keterlibatan' && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-black text-slate-900">Keterlibatan Peserta</h1>
                <p className="text-slate-500 text-sm mt-1">Monitor aktivitas dan keterlibatan seluruh peserta program</p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Rata-rata Modul Selesai', val: `${progresses.length ? (progresses.reduce((s, p) => s + p.progress.modules.length, 0) / progresses.length).toFixed(1) : '0.0'}/3`, emoji: '📚' },
                  { label: 'Rata-rata Pelajaran',     val: progresses.length ? Math.round(progresses.reduce((s, p) => s + p.progress.done.length, 0) / progresses.length) : 0, emoji: '📖' },
                  { label: 'Rata-rata XP',            val: `${avgXP} XP`, emoji: '⭐' },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                    <div className="text-xl mb-1">{s.emoji}</div>
                    <div className="text-xl font-black text-slate-900">{s.val}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-4">
                <div className="px-5 py-4 border-b border-slate-50">
                  <h3 className="text-sm font-bold text-slate-800">Detail Per Peserta</h3>
                </div>
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      {['Peserta', 'Sekolah', 'Terakhir Aktif', 'Modul', 'Pelajaran', 'XP', 'Streak', 'Status'].map(h => (
                        <th key={h} className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-wide px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {progresses.map(({ user, progress }) => (
                      <tr key={user.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-[10px] font-bold text-primary-700 flex-none">{user.avatar}</div>
                            <div>
                              <p className="text-xs font-semibold text-slate-800">{user.name.split(',')[0]}</p>
                              <p className="text-[10px] text-slate-400">{user.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600 max-w-[110px]">
                          <p className="truncate">{user.school}</p>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{getLastActiveLabel(user.id)}</td>
                        <td className="px-4 py-3 text-xs font-semibold text-slate-700">{progress.modules.length}/3</td>
                        <td className="px-4 py-3 text-xs text-slate-600">{progress.done.length}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-bold text-primary-600">{progress.xp}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600">🔥 {progress.streak}</td>
                        <td className="px-4 py-3">
                          {needsFollowUp(user.id)
                            ? <span className="text-[9px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Follow-up</span>
                            : <span className="text-[9px] font-bold bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">Aktif</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="text-sm font-bold text-slate-800 mb-4">Visualisasi Progress XP</h3>
                <div className="space-y-4">
                  {progresses.map(({ user, progress }) => (
                    <div key={user.id}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-semibold text-slate-700">{user.name.split(',')[0]}</span>
                        <span className="text-primary-600 font-bold">{progress.xp} XP · Level {progress.level}</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all"
                          style={{ width: `${Math.min((progress.xp / 1200) * 100, 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── JADWAL & REMINDER ──────────────────── */}
          {section === 'jadwal' && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-black text-slate-900">Jadwal & Reminder</h1>
                <p className="text-slate-500 text-sm mt-1">Kirim pengingat kepada peserta dan kelola jadwal sesi lapangan</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Reminder form */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <h3 className="text-sm font-bold text-slate-800 mb-4">Kirim Pengingat</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Kepada</label>
                      <select value={reminderTarget} onChange={e => setReminderTarget(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 bg-white">
                        <option value="">-- Pilih Peserta --</option>
                        {pesertaList.map(u => (
                          <option key={u.id} value={u.name}>{u.name.split(',')[0]} — {u.school}</option>
                        ))}
                        <option value="Semua Peserta">📢 Semua Peserta</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Pesan</label>
                      <textarea value={reminderMsg} onChange={e => setReminderMsg(e.target.value)}
                        rows={3} placeholder="Tulis pesan pengingat untuk peserta..."
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 resize-none" />
                    </div>
                    <button onClick={handleSendReminder} disabled={!reminderTarget || !reminderMsg.trim()}
                      className="w-full bg-primary-600 text-white font-bold py-2.5 rounded-xl hover:bg-primary-700 transition disabled:opacity-40 disabled:cursor-not-allowed text-sm">
                      Kirim Pengingat
                    </button>
                  </div>
                </div>

                {/* Reminder history */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <h3 className="text-sm font-bold text-slate-800 mb-3">Riwayat Pengingat</h3>
                  {remindersSent.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Belum ada pengingat yang dikirim.</p>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {remindersSent.map(r => (
                        <div key={r.id} className="bg-slate-50 rounded-xl p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-primary-600">→ {r.to}</span>
                            <span className="text-[10px] text-slate-400">{r.time}</span>
                          </div>
                          <p className="text-xs text-slate-600">{r.msg}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Schedule */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="text-sm font-bold text-slate-800 mb-4">Jadwal Sesi</h3>
                <div className="space-y-3">
                  {schedule.map(ev => (
                    <div key={ev.id} className={`flex items-start gap-4 p-4 rounded-xl border transition ${ev.done ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-200 hover:border-primary-200'}`}>
                      <div className={`flex-none text-center rounded-xl p-2.5 ${ev.done ? 'bg-slate-100' : 'bg-primary-50'}`}>
                        <div className={`text-base font-black leading-none ${ev.done ? 'text-slate-400' : 'text-primary-700'}`}>
                          {new Date(ev.date).getDate()}
                        </div>
                        <div className={`text-[9px] font-bold uppercase mt-0.5 ${ev.done ? 'text-slate-400' : 'text-primary-500'}`}>
                          {new Date(ev.date).toLocaleDateString('id-ID', { month: 'short' })}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-slate-800">{ev.title}</p>
                          {ev.done && <span className="text-[9px] bg-slate-200 text-slate-500 font-bold px-2 py-0.5 rounded-full">Selesai</span>}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{ev.time} · {ev.peserta.join(', ')}</p>
                        {ev.note && <p className="text-[10px] text-slate-400 mt-1 italic">📌 {ev.note}</p>}
                      </div>
                      {!ev.done && (
                        <button onClick={() => setSchedule(prev => prev.map(s => s.id === ev.id ? { ...s, done: true } : s))}
                          className="flex-none text-xs font-semibold border border-slate-200 text-slate-500 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 px-3 py-1.5 rounded-lg transition">
                          Tandai Selesai
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── CATATAN LAPANGAN ───────────────────── */}
          {section === 'catatan' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-black text-slate-900">Catatan Lapangan</h1>
                  <p className="text-slate-500 text-sm mt-1">Dokumentasikan observasi dan temuan selama pendampingan di lapangan</p>
                </div>
                <button onClick={() => setShowNoteForm(v => !v)}
                  className="bg-primary-600 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-primary-700 transition">
                  + Catatan Baru
                </button>
              </div>

              {showNoteForm && (
                <div className="bg-white rounded-2xl border border-primary-200 shadow-sm p-5 mb-4">
                  <h3 className="text-sm font-bold text-slate-800 mb-4">Tambah Catatan Baru</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Kategori</label>
                      <div className="flex gap-2 flex-wrap">
                        {(Object.entries(CAT_LABELS) as [NoteCategory, string][]).map(([k, v]) => (
                          <button key={k} onClick={() => setNoteForm(f => ({ ...f, category: k }))}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${noteForm.category === k ? CAT_COLORS[k] : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Lokasi (opsional)</label>
                      <input value={noteForm.location} onChange={e => setNoteForm(f => ({ ...f, location: e.target.value }))}
                        placeholder="Nama sekolah atau lokasi sesi"
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Catatan *</label>
                      <textarea value={noteForm.body} onChange={e => setNoteForm(f => ({ ...f, body: e.target.value }))}
                        rows={4} placeholder="Tuliskan observasi, temuan, kendala, atau rekomendasi..."
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 resize-none" />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setShowNoteForm(false)}
                        className="flex-1 border border-slate-200 text-slate-600 font-semibold py-2 rounded-xl hover:bg-slate-50 transition text-sm">
                        Batal
                      </button>
                      <button onClick={handleAddNote} disabled={!noteForm.body.trim()}
                        className="flex-1 bg-primary-600 text-white font-bold py-2 rounded-xl hover:bg-primary-700 transition text-sm disabled:opacity-40">
                        Simpan Catatan
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {notes.map(n => (
                  <div key={n.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <div className="flex items-start gap-3">
                      <span className={`flex-none mt-0.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${CAT_COLORS[n.category]}`}>
                        {CAT_LABELS[n.category]}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm text-slate-800 leading-relaxed">{n.body}</p>
                        <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
                          <span>📍 {n.location}</span>
                          <span>·</span>
                          <span>🗓 {new Date(n.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── FORUM DISKUSI ──────────────────────── */}
          {section === 'diskusi' && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-black text-slate-900">Forum Diskusi</h1>
                <p className="text-slate-500 text-sm mt-1">Pantau diskusi peserta dan teruskan pertanyaan teknis ke Peneliti</p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5 flex items-start gap-3">
                <span className="text-amber-500 text-lg flex-none mt-0.5">ℹ️</span>
                <div>
                  <p className="text-sm font-semibold text-amber-900">Peran Fasilitator dalam Diskusi</p>
                  <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                    Anda memfasilitasi diskusi antar peserta, bukan menjawab pertanyaan teknis secara langsung.
                    Untuk pertanyaan yang membutuhkan keahlian konten, gunakan tombol <strong>"Teruskan ke Peneliti"</strong>.
                  </p>
                </div>
              </div>

              {discussions.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
                  <p className="text-slate-300 text-4xl mb-3">💬</p>
                  <p className="text-sm text-slate-500">Belum ada diskusi dari peserta.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {discussions.map(d => (
                    <div key={d.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 flex-none">{d.avatar}</div>
                        <div className="flex-1">
                          <h3 className="text-sm font-bold text-slate-900">{d.title}</h3>
                          <p className="text-xs text-slate-500">{d.userName} · {d.time}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-none">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${d.replies.length > 0 ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-500'}`}>
                            {d.replies.length > 0 ? `${d.replies.length} Balasan` : 'Belum ada balasan'}
                          </span>
                          <button className="text-[10px] font-bold border border-slate-200 text-slate-500 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 px-3 py-1 rounded-lg transition">
                            Teruskan ke Peneliti
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-xl px-4 py-3">{d.body}</p>
                      {d.replies.length > 0 && (
                        <div className="mt-3 space-y-2 border-l-2 border-primary-100 pl-4">
                          {d.replies.map(r => (
                            <div key={r.id} className="bg-slate-50 rounded-xl p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-bold text-slate-700">{r.userName}</span>
                                {r.expert && <span className="text-[8px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded-full">AHLI</span>}
                                <span className="text-[10px] text-slate-400 ml-auto">{r.time}</span>
                              </div>
                              <p className="text-xs text-slate-600">{r.body}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── LAPORAN KE PENELITI ────────────────── */}
          {section === 'laporan' && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-black text-slate-900">Laporan ke Peneliti</h1>
                <p className="text-slate-500 text-sm mt-1">Kirim laporan perkembangan lapangan secara berkala kepada tim peneliti</p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Laporan Terkirim', val: sentReports.length, emoji: '📤' },
                  { label: 'Catatan Lapangan', val: notes.length,       emoji: '📝' },
                  { label: 'Reminder Terkirim', val: remindersSent.length, emoji: '🔔' },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
                    <div className="text-2xl mb-2">{s.emoji}</div>
                    <div className="text-2xl font-black text-slate-900">{s.val}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-4">
                <h3 className="text-sm font-bold text-slate-800 mb-4">Buat Laporan Baru</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Periode Laporan</label>
                    <input value={reportForm.period} onChange={e => setReportForm(f => ({ ...f, period: e.target.value }))}
                      placeholder="Contoh: Minggu ke-3, Juni 2026"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
                  </div>
                  {[
                    { key: 'highlights' as const,    label: 'Poin Penting *', placeholder: 'Apa yang terjadi selama periode ini? Pencapaian apa yang diraih peserta?', rows: 3 },
                    { key: 'obstacles' as const,     label: 'Kendala & Hambatan', placeholder: 'Apakah ada kendala teknis, kehadiran, atau hambatan lainnya?', rows: 2 },
                    { key: 'recommendation' as const,label: 'Rekomendasi', placeholder: 'Rekomendasi untuk perbaikan atau perubahan pada program', rows: 2 },
                    { key: 'nextPlan' as const,      label: 'Rencana Selanjutnya', placeholder: 'Apa yang akan dilakukan pada periode berikutnya?', rows: 2 },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">{f.label}</label>
                      <textarea value={reportForm[f.key]} onChange={e => setReportForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                        rows={f.rows} placeholder={f.placeholder}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 resize-none" />
                    </div>
                  ))}
                  <button onClick={handleSendReport} disabled={!reportForm.highlights.trim()}
                    className="w-full bg-primary-600 text-white font-bold py-3 rounded-xl hover:bg-primary-700 transition disabled:opacity-40 disabled:cursor-not-allowed">
                    Kirim Laporan ke Peneliti
                  </button>
                </div>
              </div>

              {sentReports.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <h3 className="text-sm font-bold text-slate-800 mb-3">Laporan Terkirim</h3>
                  <div className="space-y-2">
                    {sentReports.map(r => (
                      <div key={r.id} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{r.period}</p>
                          <p className="text-xs text-slate-400">Dikirim: {r.sentAt}</p>
                        </div>
                        <span className="text-[9px] font-bold bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">Terkirim ✓</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-30 flex">
        {navItems.map(n => {
          const active = section === n.id
          return (
            <button key={n.id} onClick={() => setSection(n.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 transition ${active ? 'text-primary-600' : 'text-slate-400'}`}>
              <span className="text-lg leading-none">{n.emoji}</span>
              <span className="text-[8px] font-semibold leading-none">{n.label.split(' ')[0]}</span>
            </button>
          )
        })}
      </nav>

      {/* Logout confirm modal */}
      {logoutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-base font-black text-slate-900 mb-1">Keluar dari akun?</h2>
            <p className="text-sm text-slate-500 mb-5">Sesi Anda akan diakhiri. Pastikan semua pekerjaan sudah tersimpan.</p>
            <div className="flex gap-3">
              <button onClick={() => setLogoutConfirm(false)}
                className="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition text-sm">
                Batal
              </button>
              <button onClick={doLogout}
                className="flex-1 bg-red-600 text-white font-bold py-2.5 rounded-xl hover:bg-red-700 transition text-sm">
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
