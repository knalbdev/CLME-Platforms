'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSession, logout, getAllUsers } from '@/lib/auth'
import { getModules, getDiscussions } from '@/lib/data'
import { getProgress } from '@/lib/gamification'
import type { User, Module, Discussion } from '@/types'

type Section = 'dashboard' | 'peserta' | 'konten' | 'diskusi' | 'umpan-balik'

interface ContentItem {
  id: string
  module: string
  title: string
  type: string
  status: 'draft' | 'review' | 'approved'
  notes: string
}

const INITIAL_CONTENT: ContentItem[] = [
  { id: 'c1', module: 'Modul 1', title: 'Kenapa Kata Sandi Penting?', type: 'Membaca', status: 'approved', notes: 'Konten sudah sesuai standar NIST SP 800-63B.' },
  { id: 'c2', module: 'Modul 1', title: 'Anatomi Kata Sandi Kuat', type: 'Interaktif', status: 'approved', notes: 'Tabel perbandingan perlu pembaruan referensi.' },
  { id: 'c3', module: 'Modul 1', title: 'Etika Berbagi Kata Sandi', type: 'Skenario', status: 'review', notes: 'Skenario terlalu sederhana untuk guru SMK.' },
  { id: 'c4', module: 'Modul 2', title: 'Ancaman Email di Sekolah', type: 'Membaca', status: 'approved', notes: 'Referensi Permenkominfo sudah sesuai.' },
  { id: 'c5', module: 'Modul 2', title: 'Anatomi Phishing Email', type: 'Interaktif', status: 'review', notes: 'Perlu tambahan contoh domain .sch.id.' },
  { id: 'c6', module: 'Modul 3', title: 'Jenis-Jenis Insiden Siber', type: 'Membaca', status: 'draft', notes: 'Menunggu validasi konten dari BSSN.' },
]

const FEEDBACK_DATA = [
  { id: 'f1', peserta: 'Sari Rahayu, S.Pd.', sekolah: 'SMP Negeri 1 Bandung', modul: 'Modul 1', relevance: 4, clarity: 5, applicability: 4, comment: 'Materi sangat relevan dengan kebutuhan sehari-hari guru. Skenario kehilangan HP sangat bisa terjadi.' },
  { id: 'f2', peserta: 'Budi Hartono, M.Pd.', sekolah: 'SMAN 5 Bandung', modul: 'Modul 1', relevance: 5, clarity: 4, applicability: 5, comment: 'Simulasi phishing sangat membantu untuk meningkatkan kewaspadaan. Saya akan bagikan ke rekan guru.' },
  { id: 'f3', peserta: 'Rini Wulandari, S.Pd.', sekolah: 'SMPN 3 Bandung', modul: 'Modul 2', relevance: 4, clarity: 4, applicability: 3, comment: 'Beberapa istilah teknis perlu dijelaskan lebih sederhana untuk guru non-IT.' },
]

export default function AhliPage() {
  const router = useRouter()
  const [section, setSection] = useState<Section>('dashboard')
  const [session, setSession] = useState<User | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [pesertaList, setPesertaList] = useState<User[]>([])
  const [content, setContent] = useState<ContentItem[]>(INITIAL_CONTENT)
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({})

  useEffect(() => {
    const s = getSession()
    if (!s || s.role !== 'ahli') { router.push('/'); return }
    setSession(s)
    setModules(getModules())
    setDiscussions(getDiscussions())
    const all = getAllUsers().filter(u => u.role === 'peserta')
    setPesertaList(all)
  }, [router])

  const handleLogout = () => { logout(); router.push('/') }

  const handleStatusChange = (id: string, status: ContentItem['status']) => {
    setContent(prev => prev.map(c => c.id === id ? { ...c, status } : c))
  }

  const handleNoteChange = (id: string, notes: string) => {
    setContent(prev => prev.map(c => c.id === id ? { ...c, notes } : c))
  }

  const handleReply = (discId: string) => {
    const text = replyInputs[discId]?.trim()
    if (!text || !session) return
    alert(`Balasan dikirim: "${text}"`)
    setReplyInputs(prev => ({ ...prev, [discId]: '' }))
  }

  const statusColors: Record<ContentItem['status'], string> = {
    draft: 'bg-slate-100 text-slate-600',
    review: 'bg-amber-100 text-amber-700',
    approved: 'bg-primary-100 text-primary-700',
  }
  const statusLabels: Record<ContentItem['status'], string> = {
    draft: 'Draft', review: 'Review', approved: 'Disetujui',
  }

  const getProgresses = () => pesertaList.map(u => {
    const p = getProgress(u.id)
    return { user: u, progress: p }
  })

  const navItems: { id: Section; label: string; emoji: string }[] = [
    { id: 'dashboard', label: 'Dashboard', emoji: '📊' },
    { id: 'peserta', label: 'Data Peserta', emoji: '👥' },
    { id: 'konten', label: 'Validasi Konten', emoji: '✅' },
    { id: 'diskusi', label: 'Moderasi Diskusi', emoji: '💬' },
    { id: 'umpan-balik', label: 'Umpan Balik', emoji: '📋' },
  ]

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const progresses = getProgresses()
  const avgXP = progresses.length ? Math.round(progresses.reduce((s, p) => s + p.progress.xp, 0) / progresses.length) : 0
  const avgLessons = progresses.length ? Math.round(progresses.reduce((s, p) => s + p.progress.done.length, 0) / progresses.length) : 0
  const approvedCount = content.filter(c => c.status === 'approved').length

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-slate-100 flex flex-col shadow-sm flex-none">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-xs">🛡️</div>
            <div>
              <p className="text-sm font-black text-slate-900">CLME</p>
              <p className="text-[10px] text-slate-400 font-medium">Ahli Validasi</p>
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
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">{session.avatar}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{session.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{session.institution}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full text-xs text-slate-500 hover:text-red-600 py-1.5 rounded-lg border border-slate-200 hover:border-red-200 transition">Keluar</button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-5xl mx-auto">

          {/* DASHBOARD */}
          {section === 'dashboard' && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-black text-slate-900">Selamat Datang, {session.name.split(',')[0]} 👋</h1>
                <p className="text-slate-500 text-sm mt-1">Panel Ahli Validasi — CLME Platform · {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total Peserta', val: pesertaList.length, emoji: '👥', color: 'bg-blue-50 border-blue-100' },
                  { label: 'Konten Disetujui', val: `${approvedCount}/${content.length}`, emoji: '✅', color: 'bg-primary-50 border-primary-100' },
                  { label: 'Rata-rata XP', val: avgXP, emoji: '⭐', color: 'bg-amber-50 border-amber-100' },
                  { label: 'Diskusi Aktif', val: discussions.length, emoji: '💬', color: 'bg-violet-50 border-violet-100' },
                ].map(s => (
                  <div key={s.label} className={`${s.color} border rounded-2xl p-4 shadow-sm`}>
                    <div className="text-2xl mb-1">{s.emoji}</div>
                    <div className="text-2xl font-black text-slate-900">{s.val}</div>
                    <div className="text-xs text-slate-500 mt-0.5 font-medium">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Progress charts */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <h3 className="text-sm font-bold text-slate-800 mb-4">Progress Peserta (XP)</h3>
                  <div className="space-y-3">
                    {progresses.map(({ user, progress }) => (
                      <div key={user.id}>
                        <div className="flex justify-between text-xs text-slate-600 mb-1">
                          <span className="font-medium truncate">{user.name.split(',')[0]}</span>
                          <span className="font-bold text-primary-600 flex-none ml-2">{progress.xp} XP</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${Math.min((progress.xp / 1200) * 100, 100)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <h3 className="text-sm font-bold text-slate-800 mb-4">Status Validasi Konten</h3>
                  <div className="space-y-2">
                    {(['approved', 'review', 'draft'] as const).map(s => {
                      const count = content.filter(c => c.status === s).length
                      const pct = Math.round((count / content.length) * 100)
                      const colors = { approved: '#0c8568', review: '#f59e0b', draft: '#94a3b8' }
                      return (
                        <div key={s}>
                          <div className="flex justify-between text-xs text-slate-600 mb-1">
                            <span className="font-medium capitalize">{statusLabels[s]}</span>
                            <span className="font-bold">{count} ({pct}%)</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: colors[s] }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="text-sm font-bold text-slate-800 mb-3">Rata-rata Skor Pre/Post Test per Modul</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { mod: 'Modul 1', pre: 2.7, post: 4.3 },
                    { mod: 'Modul 2', pre: 2.4, post: 4.0 },
                    { mod: 'Modul 3', pre: 2.1, post: 3.8 },
                  ].map(m => (
                    <div key={m.mod} className="text-center">
                      <p className="text-xs font-bold text-slate-600 mb-2">{m.mod}</p>
                      <div className="flex items-end justify-center gap-3 h-24">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-[10px] font-bold text-slate-500">{m.pre}</span>
                          <div className="w-8 rounded-t-md bg-slate-300" style={{ height: `${(m.pre / 5) * 80}px` }} />
                          <span className="text-[9px] text-slate-400">Pre</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-[10px] font-bold text-primary-600">{m.post}</span>
                          <div className="w-8 rounded-t-md bg-primary-500" style={{ height: `${(m.post / 5) * 80}px` }} />
                          <span className="text-[9px] text-slate-400">Post</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* DATA PESERTA */}
          {section === 'peserta' && (
            <div>
              <h1 className="text-2xl font-black text-slate-900 mb-1">Data Peserta</h1>
              <p className="text-slate-500 text-sm mb-6">Progress dan performa seluruh peserta aktif</p>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      {['Peserta', 'Sekolah', 'XP', 'Level', 'Pelajaran', 'Modul Selesai', 'Streak', 'Badge'].map(h => (
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
                        <td className="px-4 py-3 text-xs text-slate-600">{user.school}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-bold text-primary-600">{progress.xp}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600">L{progress.level}</td>
                        <td className="px-4 py-3 text-xs text-slate-600">{progress.done.length}</td>
                        <td className="px-4 py-3 text-xs text-slate-600">{progress.modules.length}/3</td>
                        <td className="px-4 py-3 text-xs text-slate-600">🔥 {progress.streak}</td>
                        <td className="px-4 py-3 text-xs text-slate-600">{progress.badges.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VALIDASI KONTEN */}
          {section === 'konten' && (
            <div>
              <h1 className="text-2xl font-black text-slate-900 mb-1">Validasi Konten</h1>
              <p className="text-slate-500 text-sm mb-6">Tinjau dan setujui konten modul pembelajaran</p>
              <div className="space-y-3">
                {content.map(c => (
                  <div key={c.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{c.module}</span>
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{c.type}</span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 mb-2">{c.title}</h3>
                        <textarea
                          value={c.notes}
                          onChange={e => handleNoteChange(c.id, e.target.value)}
                          className="w-full text-xs text-slate-600 border border-slate-200 rounded-xl px-3 py-2 resize-none outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-100"
                          rows={2}
                          placeholder="Catatan validasi…"
                        />
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-none">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusColors[c.status]}`}>
                          {statusLabels[c.status]}
                        </span>
                        <div className="flex gap-1.5">
                          {(['draft', 'review', 'approved'] as const).map(s => (
                            <button key={s} onClick={() => handleStatusChange(c.id, s)}
                              className={`text-[10px] font-semibold px-2 py-1 rounded-lg transition border ${c.status === s ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-slate-500 border-slate-200 hover:border-primary-300'}`}>
                              {statusLabels[s]}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MODERASI DISKUSI */}
          {section === 'diskusi' && (
            <div>
              <h1 className="text-2xl font-black text-slate-900 mb-1">Moderasi Diskusi</h1>
              <p className="text-slate-500 text-sm mb-6">Balas diskusi peserta sebagai ahli</p>
              <div className="space-y-4">
                {discussions.map(d => (
                  <div key={d.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 flex-none">{d.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-sm font-bold text-slate-900">{d.title}</h3>
                          <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded-full">{d.moduleId.toUpperCase()}</span>
                        </div>
                        <p className="text-xs text-slate-500">{d.userName} · {d.time}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed mb-4">{d.body}</p>
                    {/* Existing replies */}
                    {d.replies.length > 0 && (
                      <div className="mb-4 space-y-2 border-l-2 border-primary-100 pl-4">
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
                    {/* Reply form */}
                    <div className="flex gap-2">
                      <input
                        value={replyInputs[d.id] || ''}
                        onChange={e => setReplyInputs(prev => ({ ...prev, [d.id]: e.target.value }))}
                        placeholder="Tulis balasan ahli…"
                        className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-100"
                      />
                      <button onClick={() => handleReply(d.id)}
                        className="bg-primary-600 text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-primary-700 transition flex-none">
                        Balas
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* UMPAN BALIK */}
          {section === 'umpan-balik' && (
            <div>
              <h1 className="text-2xl font-black text-slate-900 mb-1">Umpan Balik Peserta</h1>
              <p className="text-slate-500 text-sm mb-6">Evaluasi kualitatif dari peserta pelatihan</p>

              {/* Summary stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Rata-rata Relevansi', val: '4.3/5', emoji: '🎯', sub: 'Tinggi' },
                  { label: 'Rata-rata Kejelasan', val: '4.3/5', emoji: '💡', sub: 'Tinggi' },
                  { label: 'Rata-rata Penerapan', val: '4.0/5', emoji: '🛠️', sub: 'Baik' },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
                    <div className="text-2xl mb-2">{s.emoji}</div>
                    <div className="text-xl font-black text-slate-900">{s.val}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{s.label}</div>
                    <div className="text-[10px] font-bold text-primary-600 mt-1">{s.sub}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                {FEEDBACK_DATA.map(f => (
                  <div key={f.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{f.peserta}</p>
                        <p className="text-xs text-slate-500">{f.sekolah} · {f.modul}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      {[
                        { label: 'Relevansi', val: f.relevance },
                        { label: 'Kejelasan', val: f.clarity },
                        { label: 'Penerapan', val: f.applicability },
                      ].map(s => (
                        <div key={s.label} className="text-center">
                          <p className="text-[10px] text-slate-400 mb-1">{s.label}</p>
                          <div className="flex justify-center gap-0.5">
                            {[1, 2, 3, 4, 5].map(i => (
                              <span key={i} className={`text-sm ${i <= s.val ? 'text-amber-400' : 'text-slate-200'}`}>★</span>
                            ))}
                          </div>
                          <p className="text-xs font-bold text-slate-700 mt-0.5">{s.val}/5</p>
                        </div>
                      ))}
                    </div>
                    <div className="bg-slate-50 rounded-xl px-4 py-3">
                      <p className="text-xs text-slate-600 italic leading-relaxed">"{f.comment}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
