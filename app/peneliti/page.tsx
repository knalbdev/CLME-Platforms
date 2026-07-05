'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSession, logout } from '@/lib/auth'
import { getFirestoreUsers, getFirestoreProgress, getFasilitatorReports, type FasilitatorReport } from '@/lib/db'
import type { User } from '@/types'

type Section = 'dashboard' | 'data-log' | 'analisis' | 'efektivitas' | 'laporan' | 'ekspor'

export default function PenelitiPage() {
  const router = useRouter()
  const [section, setSection] = useState<Section>('dashboard')
  const [session, setSession] = useState<User | null>(null)
  const [pesertaData, setPesertaData] = useState<{ user: User; xp: number; done: number; modules: number; scores: Record<string, number>; streak: number; badges: number }[]>([])
  const [reports, setReports] = useState<FasilitatorReport[]>([])
  const [exportMsg, setExportMsg] = useState('')
  const [logoutConfirm, setLogoutConfirm] = useState(false)

  useEffect(() => {
    const load = async () => {
      const s = getSession()
      if (!s || s.role !== 'peneliti') { router.push('/login'); return }
      setSession(s)
      const users = await getFirestoreUsers()
      const peserta = users.filter(u => u.role === 'peserta')
      const data = await Promise.all(peserta.map(async u => {
        const p = await getFirestoreProgress(u.id)
        return {
          user: u,
          xp: p?.xp ?? 0,
          done: p?.done?.length ?? 0,
          modules: p?.modules?.length ?? 0,
          scores: p?.scores ?? {},
          streak: p?.streak ?? 0,
          badges: p?.badges?.length ?? 0,
        }
      }))
      setPesertaData(data)
      const reps = await getFasilitatorReports()
      setReports(reps)
    }
    load()
  }, [router])

  const handleLogout = () => setLogoutConfirm(true)
  const doLogout = () => { logout(); router.push('/login') }

  const getModuleScores = () => {
    const mods = ['m1', 'm2', 'm3']
    return mods.map(m => {
      const preLst = pesertaData.map(d => d.scores[`${m}_pre`] ?? null).filter(v => v !== null) as number[]
      const postLst = pesertaData.map(d => d.scores[`${m}_post`] ?? null).filter(v => v !== null) as number[]
      const avgPre = preLst.length ? preLst.reduce((a, b) => a + b, 0) / preLst.length : 0
      const avgPost = postLst.length ? postLst.reduce((a, b) => a + b, 0) / postLst.length : 0
      const nGain = avgPre < 5 ? ((avgPost - avgPre) / (5 - avgPre)) * 100 : 100
      const nGainLabel = nGain >= 70 ? 'Tinggi' : nGain >= 30 ? 'Sedang' : 'Rendah'
      return { mod: m, avgPre: +avgPre.toFixed(2), avgPost: +avgPost.toFixed(2), nGain: +nGain.toFixed(1), nGainLabel }
    })
  }

  const modScores = getModuleScores()
  const totalXP = pesertaData.reduce((s, d) => s + d.xp, 0)
  const avgXP = pesertaData.length ? Math.round(totalXP / pesertaData.length) : 0
  const avgDone = pesertaData.length ? (pesertaData.reduce((s, d) => s + d.done, 0) / pesertaData.length).toFixed(1) : 0
  const completedAll = pesertaData.filter(d => d.modules >= 3).length

  const navItems: { id: Section; label: string; emoji: string }[] = [
    { id: 'dashboard', label: 'Dashboard Riset', emoji: '📊' },
    { id: 'data-log', label: 'Log Data Mentah', emoji: '🗄️' },
    { id: 'analisis', label: 'Analisis N-Gain', emoji: '📈' },
    { id: 'efektivitas', label: 'Efektivitas', emoji: '🎯' },
    { id: 'laporan', label: 'Laporan Fasilitator', emoji: '📋' },
    { id: 'ekspor', label: 'Ekspor Data', emoji: '📥' },
  ]

  const handleExportJSON = () => {
    const data = pesertaData.map(d => ({
      id: d.user.id, name: d.user.name, school: d.user.school, subject: d.user.subject,
      xp: d.xp, lessons_done: d.done, modules_done: d.modules, streak: d.streak, badges: d.badges,
      scores: d.scores,
    }))
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'clme_data.json'; a.click()
    URL.revokeObjectURL(url)
    setExportMsg('File JSON berhasil diunduh!')
    setTimeout(() => setExportMsg(''), 3000)
  }

  const handleExportCSV = () => {
    const headers = ['ID', 'Nama', 'Sekolah', 'Mapel', 'XP', 'Pelajaran', 'Modul', 'Streak', 'Badge', 'Skor Pre M1', 'Skor Post M1', 'Skor Pre M2', 'Skor Post M2', 'Skor Pre M3', 'Skor Post M3']
    const rows = pesertaData.map(d => [
      d.user.id, d.user.name, d.user.school || '', d.user.subject || '',
      d.xp, d.done, d.modules, d.streak, d.badges,
      d.scores['m1_pre'] ?? '', d.scores['m1_post'] ?? '',
      d.scores['m2_pre'] ?? '', d.scores['m2_post'] ?? '',
      d.scores['m3_pre'] ?? '', d.scores['m3_post'] ?? '',
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'clme_data.csv'; a.click()
    URL.revokeObjectURL(url)
    setExportMsg('File CSV berhasil diunduh!')
    setTimeout(() => setExportMsg(''), 3000)
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 bg-white border-r border-slate-100 flex-col shadow-sm flex-none">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="CLME" className="w-8 h-8 object-contain flex-none" />
            <div>
              <p className="text-sm font-black text-slate-900">CLME</p>
              <p className="text-[10px] text-slate-400 font-medium">Peneliti</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3">
          {navItems.map(n => (
            <button key={n.id} onClick={() => setSection(n.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition text-left ${section === n.id ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}>
              <span>{n.emoji}</span> {n.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center text-xs font-bold text-violet-700">{session.avatar}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{session.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{session.institution}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full text-xs text-slate-500 hover:text-red-600 py-1.5 rounded-lg border border-slate-200 hover:border-red-200 transition">Keluar</button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        {/* Mobile section header */}
        <div className="md:hidden sticky top-0 z-10 bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3">
          <img src="/logo.png" alt="CLME" className="w-7 h-7 object-contain flex-none" />
          <p className="text-sm font-bold text-slate-800">CLME · Peneliti</p>
          <span className="ml-auto text-base">{navItems.find(n => n.id === section)?.emoji}</span>
        </div>
        <div className="p-4 md:p-6 max-w-5xl mx-auto">

          {/* DASHBOARD */}
          {section === 'dashboard' && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-black text-slate-900">Dashboard Riset</h1>
                <p className="text-slate-500 text-sm mt-1">Program PPS PTK UPI Bandung · {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total Peserta', val: pesertaData.length, emoji: '👥', color: 'bg-blue-50 border-blue-100' },
                  { label: 'Rata-rata XP', val: avgXP, emoji: '⭐', color: 'bg-amber-50 border-amber-100' },
                  { label: 'Rerata Pelajaran', val: avgDone, emoji: '📖', color: 'bg-primary-50 border-primary-100' },
                  { label: 'Lulus Semua Modul', val: completedAll, emoji: '🎓', color: 'bg-violet-50 border-violet-100' },
                ].map(s => (
                  <div key={s.label} className={`${s.color} border rounded-2xl p-4 shadow-sm`}>
                    <div className="text-2xl mb-1">{s.emoji}</div>
                    <div className="text-2xl font-black text-slate-900">{s.val}</div>
                    <div className="text-xs text-slate-500 mt-0.5 font-medium">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* N-Gain summary cards */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                {modScores.map(m => (
                  <div key={m.mod} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">{m.mod.toUpperCase()}</p>
                    <div className="flex items-end justify-between mb-2">
                      <div>
                        <p className="text-[10px] text-slate-400">Pre-test</p>
                        <p className="text-lg font-black text-slate-600">{m.avgPre}<span className="text-xs font-normal text-slate-400">/5</span></p>
                      </div>
                      <div className="text-slate-300 text-lg">→</div>
                      <div>
                        <p className="text-[10px] text-slate-400">Post-test</p>
                        <p className="text-lg font-black text-primary-600">{m.avgPost}<span className="text-xs font-normal text-slate-400">/5</span></p>
                      </div>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-primary-500 rounded-full" style={{ width: `${Math.min(m.nGain, 100)}%` }} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">N-Gain: {m.nGain}%</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${m.nGainLabel === 'Tinggi' ? 'bg-primary-100 text-primary-700' : m.nGainLabel === 'Sedang' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'}`}>
                        {m.nGainLabel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Timeline / Gantt chart */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="text-sm font-bold text-slate-800 mb-4">Timeline Penelitian (2026)</h3>
                <div className="space-y-2">
                  {[
                    { phase: 'Fase 1: Persiapan & Onboarding', start: 0, dur: 15, color: '#94a3b8', status: 'Selesai' },
                    { phase: 'Fase 2: Implementasi Modul 1–3', start: 15, dur: 35, color: '#0c8568', status: 'Berjalan' },
                    { phase: 'Fase 3: Pengumpulan Data', start: 50, dur: 20, color: '#f59e0b', status: 'Menunggu' },
                    { phase: 'Fase 4: Analisis & Pelaporan', start: 70, dur: 30, color: '#7c3aed', status: 'Menunggu' },
                  ].map(p => (
                    <div key={p.phase}>
                      <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                        <span className="font-medium">{p.phase}</span>
                        <span className="text-[10px] text-slate-400">{p.status}</span>
                      </div>
                      <div className="h-5 bg-slate-100 rounded-lg overflow-hidden relative">
                        <div
                          className="absolute h-full rounded-lg flex items-center px-2"
                          style={{ left: `${p.start}%`, width: `${p.dur}%`, background: p.color }}>
                          <span className="text-[9px] text-white font-bold">{p.dur}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* DATA LOG */}
          {section === 'data-log' && (
            <div>
              <h1 className="text-2xl font-black text-slate-900 mb-1">Log Data Mentah</h1>
              <p className="text-slate-500 text-sm mb-6">Data lengkap aktivitas dan progress setiap peserta</p>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
                <table className="w-full text-xs min-w-[700px]">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      {['ID', 'Nama', 'Sekolah', 'XP', 'Pelajaran', 'Modul', 'Streak', 'Pre M1', 'Post M1', 'Pre M2', 'Post M2', 'Pre M3', 'Post M3'].map(h => (
                        <th key={h} className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-wide px-3 py-3 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {pesertaData.map(d => (
                      <tr key={d.user.id} className="hover:bg-slate-50/50">
                        <td className="px-3 py-2.5 font-mono text-slate-500">{d.user.id}</td>
                        <td className="px-3 py-2.5 font-medium text-slate-800 whitespace-nowrap">{d.user.name.split(',')[0]}</td>
                        <td className="px-3 py-2.5 text-slate-500 whitespace-nowrap">{d.user.school}</td>
                        <td className="px-3 py-2.5 font-bold text-primary-600">{d.xp}</td>
                        <td className="px-3 py-2.5 text-slate-600">{d.done}</td>
                        <td className="px-3 py-2.5 text-slate-600">{d.modules}/3</td>
                        <td className="px-3 py-2.5 text-slate-600">🔥 {d.streak}</td>
                        <td className="px-3 py-2.5 text-center">{d.scores['m1_pre'] ?? '–'}</td>
                        <td className="px-3 py-2.5 text-center">{d.scores['m1_post'] ?? '–'}</td>
                        <td className="px-3 py-2.5 text-center">{d.scores['m2_pre'] ?? '–'}</td>
                        <td className="px-3 py-2.5 text-center">{d.scores['m2_post'] ?? '–'}</td>
                        <td className="px-3 py-2.5 text-center">{d.scores['m3_pre'] ?? '–'}</td>
                        <td className="px-3 py-2.5 text-center">{d.scores['m3_post'] ?? '–'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ANALISIS N-GAIN */}
          {section === 'analisis' && (
            <div>
              <h1 className="text-2xl font-black text-slate-900 mb-1">Analisis N-Gain</h1>
              <p className="text-slate-500 text-sm mb-6">Learning gain per peserta dan per modul menggunakan formula Hake (1998)</p>

              <div className="bg-primary-50 rounded-xl p-4 border border-primary-100 mb-5">
                <p className="text-xs font-bold text-primary-700 mb-1">Formula N-Gain (Hake, 1998)</p>
                <code className="text-sm text-primary-900 font-mono">N-Gain = (Skor Post – Skor Pre) / (Skor Maks – Skor Pre) × 100%</code>
                <p className="text-xs text-primary-700 mt-1">Tinggi: ≥ 70% · Sedang: 30–69% · Rendah: &lt; 30%</p>
              </div>

              <div className="space-y-4">
                {modScores.map(m => (
                  <div key={m.mod} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <h3 className="text-sm font-bold text-slate-900 mb-3">{m.mod.toUpperCase()} — Analisis N-Gain</h3>
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      {[
                        { label: 'Rerata Pre-test', val: `${m.avgPre}/5`, color: 'text-slate-600' },
                        { label: 'Rerata Post-test', val: `${m.avgPost}/5`, color: 'text-primary-600' },
                        { label: 'N-Gain', val: `${m.nGain}%`, color: 'text-violet-600' },
                        { label: 'Kategori', val: m.nGainLabel, color: m.nGainLabel === 'Tinggi' ? 'text-primary-600' : m.nGainLabel === 'Sedang' ? 'text-amber-600' : 'text-red-600' },
                      ].map(s => (
                        <div key={s.label} className="bg-slate-50 rounded-xl p-3 text-center">
                          <p className="text-[10px] text-slate-400 mb-1">{s.label}</p>
                          <p className={`text-lg font-black ${s.color}`}>{s.val}</p>
                        </div>
                      ))}
                    </div>
                    {/* Per-peserta N-gain */}
                    <div className="space-y-1.5">
                      {pesertaData.map(d => {
                        const pre = d.scores[`${m.mod}_pre`]
                        const post = d.scores[`${m.mod}_post`]
                        if (pre === undefined || post === undefined) return (
                          <div key={d.user.id} className="flex items-center gap-3 text-xs text-slate-300">
                            <span className="w-28 truncate">{d.user.name.split(',')[0]}</span>
                            <span>–</span>
                          </div>
                        )
                        const ng = pre < 5 ? ((post - pre) / (5 - pre)) * 100 : 100
                        return (
                          <div key={d.user.id} className="flex items-center gap-3">
                            <span className="text-xs text-slate-600 w-28 truncate">{d.user.name.split(',')[0]}</span>
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-primary-400 rounded-full transition-all" style={{ width: `${Math.max(0, Math.min(ng, 100))}%` }} />
                            </div>
                            <span className="text-[10px] font-bold text-primary-600 w-12 text-right">{ng.toFixed(0)}%</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EFEKTIVITAS */}
          {section === 'efektivitas' && (
            <div>
              <h1 className="text-2xl font-black text-slate-900 mb-1">Efektivitas Pembelajaran</h1>
              <p className="text-slate-500 text-sm mb-6">Indikator perubahan perilaku dan keterlibatan peserta</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <h3 className="text-sm font-bold text-slate-800 mb-4">Tingkat Keterlibatan (Engagement)</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Penyelesaian Pelajaran', val: 78, color: '#0c8568' },
                      { label: 'Partisipasi Diskusi', val: 55, color: '#7c3aed' },
                      { label: 'Penggunaan AI Tutor', val: 67, color: '#3b82f6' },
                      { label: 'Penyelesaian Simulasi', val: 82, color: '#f59e0b' },
                    ].map(item => (
                      <div key={item.label}>
                        <div className="flex justify-between text-xs text-slate-600 mb-1">
                          <span>{item.label}</span>
                          <span className="font-bold">{item.val}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${item.val}%`, background: item.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <h3 className="text-sm font-bold text-slate-800 mb-4">Distribusi Level Peserta</h3>
                  <div className="space-y-3">
                    {[
                      { label: '🌱 Pemula (0–199 XP)', count: pesertaData.filter(d => d.xp < 200).length },
                      { label: '📚 Aware Educator (200–499 XP)', count: pesertaData.filter(d => d.xp >= 200 && d.xp < 500).length },
                      { label: '🛡️ Cyber Guardian (500+ XP)', count: pesertaData.filter(d => d.xp >= 500).length },
                    ].map(l => (
                      <div key={l.label} className="flex items-center justify-between">
                        <span className="text-xs text-slate-600">{l.label}</span>
                        <span className="text-sm font-black text-slate-900">{l.count}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-600 mb-2">Total XP Platform</p>
                    <p className="text-3xl font-black text-primary-600">{totalXP.toLocaleString('id-ID')}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Dari {pesertaData.length} peserta aktif</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="text-sm font-bold text-slate-800 mb-4">Indikator Perubahan Perilaku (Self-Report)</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { emoji: '🔐', label: 'Menggunakan password manager', pct: 67, before: '22%', after: '67%' },
                    { emoji: '🔢', label: 'Mengaktifkan MFA di akun utama', pct: 78, before: '33%', after: '78%' },
                    { emoji: '🎣', label: 'Bisa mengidentifikasi phishing', pct: 89, before: '45%', after: '89%' },
                    { emoji: '📋', label: 'Tahu prosedur lapor insiden', pct: 72, before: '18%', after: '72%' },
                    { emoji: '💾', label: 'Melakukan backup data rutin', pct: 56, before: '28%', after: '56%' },
                    { emoji: '🤝', label: 'Berbagi pengetahuan ke rekan', pct: 83, before: '41%', after: '83%' },
                  ].map(i => (
                    <div key={i.label} className="bg-slate-50 rounded-xl p-3">
                      <div className="text-xl mb-2">{i.emoji}</div>
                      <p className="text-xs font-semibold text-slate-700 mb-2 leading-tight">{i.label}</p>
                      <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mb-1">
                        <div className="h-full bg-primary-500 rounded-full" style={{ width: `${i.pct}%` }} />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Sebelum: {i.before}</span>
                        <span className="font-bold text-primary-600">Sesudah: {i.after}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* LAPORAN FASILITATOR */}
          {section === 'laporan' && (
            <div>
              <h1 className="text-2xl font-black text-slate-900 mb-1">Laporan Fasilitator</h1>
              <p className="text-slate-500 text-sm mb-6">Laporan periodik yang dikirim oleh fasilitator program</p>
              {reports.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
                  <p className="text-4xl mb-3">📭</p>
                  <p className="text-slate-500 text-sm">Belum ada laporan dari fasilitator.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reports.map((r, i) => (
                    <div key={r.id ?? i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-sm font-black text-slate-900">{r.facilitatorName}</p>
                          <p className="text-xs text-slate-400">Periode: {r.period} · Dikirim: {r.sentAt}</p>
                        </div>
                        <span className="bg-primary-50 text-primary-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary-100">Laporan</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: 'Highlight', value: r.highlights },
                          { label: 'Kendala', value: r.obstacles },
                          { label: 'Rekomendasi', value: r.recommendation },
                          { label: 'Rencana Berikutnya', value: r.nextPlan },
                        ].map(f => f.value && (
                          <div key={f.label} className="bg-slate-50 rounded-xl p-3">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">{f.label}</p>
                            <p className="text-xs text-slate-700 leading-relaxed">{f.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* EKSPOR */}
          {section === 'ekspor' && (
            <div>
              <h1 className="text-2xl font-black text-slate-900 mb-1">Ekspor Data</h1>
              <p className="text-slate-500 text-sm mb-6">Unduh data penelitian dalam berbagai format</p>

              {exportMsg && (
                <div className="mb-4 bg-primary-50 border border-primary-200 text-primary-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                  <span>✅</span> {exportMsg}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <div className="text-3xl mb-3">📄</div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">CSV Format</h3>
                  <p className="text-xs text-slate-500 mb-4">Cocok untuk analisis di Excel, SPSS, atau Google Sheets. Berisi data progress, skor pre/post test, dan engagement.</p>
                  <button onClick={handleExportCSV}
                    className="w-full bg-primary-600 text-white font-bold py-2.5 rounded-xl hover:bg-primary-700 transition text-sm">
                    Unduh CSV →
                  </button>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <div className="text-3xl mb-3">📋</div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">JSON Format</h3>
                  <p className="text-xs text-slate-500 mb-4">Cocok untuk analisis data terprogram dengan Python atau R. Termasuk semua field terstruktur.</p>
                  <button onClick={handleExportJSON}
                    className="w-full bg-primary-600 text-white font-bold py-2.5 rounded-xl hover:bg-primary-700 transition text-sm">
                    Unduh JSON →
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="text-sm font-bold text-slate-800 mb-3">Preview Data ({pesertaData.length} peserta)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        {['ID', 'Nama', 'XP', 'Pelajaran', 'Modul', 'Pre M1', 'Post M1'].map(h => (
                          <th key={h} className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-wide px-3 py-2">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {pesertaData.map(d => (
                        <tr key={d.user.id} className="hover:bg-slate-50/50">
                          <td className="px-3 py-2 font-mono text-slate-500">{d.user.id}</td>
                          <td className="px-3 py-2 text-slate-800">{d.user.name.split(',')[0]}</td>
                          <td className="px-3 py-2 font-bold text-primary-600">{d.xp}</td>
                          <td className="px-3 py-2 text-slate-600">{d.done}</td>
                          <td className="px-3 py-2 text-slate-600">{d.modules}/3</td>
                          <td className="px-3 py-2 text-center">{d.scores['m1_pre'] ?? '–'}</td>
                          <td className="px-3 py-2 text-center">{d.scores['m1_post'] ?? '–'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
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
