'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSession, logout, getAllUsers } from '@/lib/auth'
import { getModules, saveCustomModule, updateModuleStatus } from '@/lib/data'
import type { User, Module } from '@/types'

type Section = 'dashboard' | 'users' | 'modules' | 'settings' | 'ai-config'

interface ModuleForm {
  id: string
  title: string
  icon: string
  desc: string
  objective: string
  time: string
  dimension: string
  status: 'active' | 'coming' | 'draft'
}

interface FGDRecord {
  moduleId: string
  date: string
  attendees: string
  notes: string
  decision: 'approved' | 'revision' | 'rejected'
  submittedAt: string
}

const FGD_STORAGE_KEY = 'clme_fgd_data'

const EMPTY_FORM: ModuleForm = {
  id: '', title: '', icon: '🛡️', desc: '', objective: '', time: '30 mnt', dimension: 'Knowledge', status: 'draft',
}

const EMPTY_FGD_FORM = {
  date: '', attendees: '', notes: '', decision: 'approved' as FGDRecord['decision'],
}

export default function AdminPage() {
  const router = useRouter()
  const [section, setSection] = useState<Section>('dashboard')
  const [session, setSession] = useState<User | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [users, setUsers] = useState<User[]>([])

  // Module CRUD
  const [showModuleModal, setShowModuleModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ModuleForm>(EMPTY_FORM)
  const [formError, setFormError] = useState('')

  // FGD workflow
  const [fgdData, setFGDData] = useState<Record<string, FGDRecord>>({})
  const [showFGDModal, setShowFGDModal] = useState(false)
  const [fgdTargetModule, setFGDTargetModule] = useState<Module | null>(null)
  const [fgdForm, setFGDForm] = useState(EMPTY_FGD_FORM)
  const [fgdFormError, setFGDFormError] = useState('')

  const [saveMsg, setSaveMsg] = useState('')
  const [aiModel, setAiModel] = useState('claude-sonnet-4-6')
  const [aiPrompt, setAiPrompt] = useState('Kamu adalah AI Tutor CLME yang membantu guru memahami konsep keamanan siber. Jawab dalam Bahasa Indonesia yang jelas, praktis, dan sesuai konteks sekolah. Selalu berikan contoh yang relevan untuk pendidik.')
  const [settings, setSettings] = useState({
    gamification: true, discussion: true, aiTutor: true, certificate: true, maintenance: false,
  })

  useEffect(() => {
    const s = getSession()
    if (!s || s.role !== 'admin') { router.push('/'); return }
    setSession(s)
    setModules(getModules())
    setUsers(getAllUsers())
    try {
      const stored = localStorage.getItem(FGD_STORAGE_KEY)
      if (stored) setFGDData(JSON.parse(stored))
    } catch { /* ignore */ }
  }, [router])

  const flash = (msg: string) => { setSaveMsg(msg); setTimeout(() => setSaveMsg(''), 3000) }
  const handleLogout = () => { logout(); router.push('/') }
  const refreshModules = () => setModules(getModules())

  // ── Module CRUD ───────────────────────────────────────
  const openAddModal = () => {
    setForm({ ...EMPTY_FORM, id: `custom_${Date.now()}` })
    setEditingId(null)
    setFormError('')
    setShowModuleModal(true)
  }

  const openEditModal = (m: Module) => {
    setForm({ id: m.id, title: m.title, icon: m.icon, desc: m.desc, objective: m.objective, time: m.time, dimension: m.dimension, status: m.status })
    setEditingId(m.id)
    setFormError('')
    setShowModuleModal(true)
  }

  const handleSaveModule = () => {
    if (!form.title.trim()) { setFormError('Judul modul tidak boleh kosong.'); return }
    if (!form.desc.trim()) { setFormError('Deskripsi tidak boleh kosong.'); return }
    const mod: Module = {
      id: form.id,
      title: form.title.trim(),
      icon: form.icon || '🛡️',
      color: '#0c8568',
      colorLight: '#f0fdf8',
      badge: null,
      time: form.time || '30 mnt',
      dimension: form.dimension || 'Knowledge',
      status: 'draft',
      desc: form.desc.trim(),
      objective: form.objective.trim() || form.desc.trim(),
      facilitatorNote: '',
      lessons: [],
      pretest: { id: `${form.id}_pre`, questions: [] },
      posttest: { id: `${form.id}_post`, questions: [] },
    }
    saveCustomModule(mod)
    refreshModules()
    setShowModuleModal(false)
    flash(editingId ? `Modul "${form.title}" diperbarui.` : `Modul "${form.title}" ditambahkan sebagai Draft. Lakukan FGD Ahli sebelum mengaktifkannya.`)
  }

  // ── FGD workflow ──────────────────────────────────────
  const isCustomModule = (id: string) => id.startsWith('custom_')

  const fgdStatusOf = (moduleId: string): FGDRecord | undefined => fgdData[moduleId]

  const openFGDModal = (m: Module) => {
    setFGDTargetModule(m)
    const existing = fgdData[m.id]
    if (existing) {
      setFGDForm({ date: existing.date, attendees: existing.attendees, notes: existing.notes, decision: existing.decision })
    } else {
      setFGDForm({ ...EMPTY_FGD_FORM, date: new Date().toISOString().split('T')[0] })
    }
    setFGDFormError('')
    setShowFGDModal(true)
  }

  const handleSaveFGD = () => {
    if (!fgdForm.attendees.trim()) { setFGDFormError('Nama peserta FGD wajib diisi.'); return }
    if (!fgdForm.notes.trim()) { setFGDFormError('Catatan diskusi wajib diisi.'); return }
    if (!fgdTargetModule) return

    const record: FGDRecord = {
      moduleId: fgdTargetModule.id,
      date: fgdForm.date || new Date().toISOString().split('T')[0],
      attendees: fgdForm.attendees.trim(),
      notes: fgdForm.notes.trim(),
      decision: fgdForm.decision,
      submittedAt: new Date().toISOString(),
    }
    const newData = { ...fgdData, [fgdTargetModule.id]: record }
    setFGDData(newData)
    localStorage.setItem(FGD_STORAGE_KEY, JSON.stringify(newData))
    setShowFGDModal(false)

    if (record.decision === 'approved') {
      flash(`FGD untuk "${fgdTargetModule.title}" didokumentasikan. Modul siap diaktifkan.`)
    } else {
      flash(`Dokumentasi FGD disimpan. Keputusan: ${record.decision === 'revision' ? 'Perlu Revisi' : 'Ditolak'}.`)
    }
  }

  const handleActivateModule = (m: Module) => {
    if (m.status === 'active') {
      updateModuleStatus(m.id, 'coming')
      refreshModules()
      flash(`Modul "${m.title}" dinonaktifkan.`)
      return
    }
    if (isCustomModule(m.id)) {
      const fgd = fgdStatusOf(m.id)
      if (!fgd || fgd.decision !== 'approved') {
        flash(`⚠️ Dokumentasikan hasil FGD Ahli terlebih dahulu sebelum mengaktifkan modul ini.`)
        return
      }
    }
    updateModuleStatus(m.id, 'active')
    refreshModules()
    flash(`Modul "${m.title}" berhasil diaktifkan!`)
  }

  // ── UI helpers ────────────────────────────────────────
  const moduleStatusBadge = (m: Module): { label: string; cls: string } => {
    if (m.status === 'active')  return { label: 'Aktif',   cls: 'bg-primary-100 text-primary-700' }
    if (m.status === 'coming')  return { label: 'Segera',  cls: 'bg-amber-100 text-amber-700' }
    // draft — check FGD
    if (!isCustomModule(m.id)) return { label: 'Draft',   cls: 'bg-slate-100 text-slate-600' }
    const fgd = fgdStatusOf(m.id)
    if (!fgd) return { label: 'Perlu FGD', cls: 'bg-orange-100 text-orange-700' }
    if (fgd.decision === 'approved')  return { label: 'FGD Disetujui', cls: 'bg-teal-100 text-teal-700' }
    if (fgd.decision === 'revision') return { label: 'FGD — Perlu Revisi', cls: 'bg-yellow-100 text-yellow-700' }
    return { label: 'FGD — Ditolak', cls: 'bg-red-100 text-red-700' }
  }

  const navItems: { id: Section; label: string; emoji: string }[] = [
    { id: 'dashboard',  label: 'Ringkasan Sistem',    emoji: '📊' },
    { id: 'users',      label: 'Pengguna',             emoji: '👥' },
    { id: 'modules',    label: 'Manajemen Modul',      emoji: '📚' },
    { id: 'settings',   label: 'Pengaturan Platform',  emoji: '⚙️' },
    { id: 'ai-config',  label: 'Konfigurasi AI',       emoji: '🤖' },
  ]

  const pesertaUsers = users.filter(u => u.role === 'peserta')
  const activeModules = modules.filter(m => m.status === 'active')

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
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col shadow-sm flex-none">
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white">🛡️</div>
            <div>
              <p className="text-sm font-black text-slate-900 leading-none">CLME Admin</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Control Panel</p>
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
              <span>{n.emoji}</span> {n.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-xs font-black text-slate-600 flex-none">{session.avatar}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{session.name}</p>
              <p className="text-[10px] text-slate-400">Administrator</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full text-xs text-slate-500 hover:text-red-600 py-1.5 rounded-lg border border-slate-200 hover:border-red-200 transition">Keluar</button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-5xl mx-auto">

          {saveMsg && (
            <div className={`mb-4 text-sm px-4 py-3 rounded-xl flex items-center gap-2 border ${saveMsg.startsWith('⚠️') ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-primary-50 border-primary-200 text-primary-700'}`}>
              {!saveMsg.startsWith('⚠️') && <span>✅</span>} {saveMsg}
            </div>
          )}

          {/* ── DASHBOARD ──────────────────────────── */}
          {section === 'dashboard' && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-black text-slate-900">Ringkasan Sistem</h1>
                <p className="text-slate-500 text-sm mt-1">CLME Platform · {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total Pengguna',    val: users.length,        emoji: '👥', bg: 'bg-blue-50',    border: 'border-blue-100' },
                  { label: 'Modul Aktif',       val: activeModules.length, emoji: '📚', bg: 'bg-primary-50', border: 'border-primary-100' },
                  { label: 'Peserta Terdaftar', val: pesertaUsers.length,  emoji: '👩‍🏫', bg: 'bg-amber-50',   border: 'border-amber-100' },
                  { label: 'Total Modul',       val: modules.length,       emoji: '🗂️', bg: 'bg-violet-50',  border: 'border-violet-100' },
                ].map(s => (
                  <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4 shadow-sm`}>
                    <div className="text-2xl mb-1">{s.emoji}</div>
                    <div className="text-2xl font-black text-slate-900">{s.val}</div>
                    <div className="text-xs text-slate-500 mt-0.5 font-medium">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-4">
                <h3 className="text-sm font-bold text-slate-800 mb-4">Status Layanan</h3>
                <div className="space-y-2">
                  {[
                    { name: 'Frontend (Next.js)',          latency: '12ms' },
                    { name: 'Data Storage (localStorage)', latency: '< 1ms' },
                    { name: 'AI Tutor (Simulasi)',         latency: '~900ms' },
                    { name: 'Gamifikasi Engine',           latency: '< 1ms' },
                  ].map(s => (
                    <div key={s.name} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                        <span className="text-sm text-slate-700">{s.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400">{s.latency}</span>
                        <span className="text-[10px] font-bold bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">Aktif</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="text-sm font-bold text-slate-800 mb-3">Distribusi Peran Pengguna</h3>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { role: 'Peserta',     count: users.filter(u => u.role === 'peserta').length,   emoji: '👩‍🏫', cls: 'bg-primary-50 text-primary-700' },
                    { role: 'Fasilitator', count: users.filter(u => u.role === 'ahli').length,     emoji: '🤝', cls: 'bg-blue-50 text-blue-700' },
                    { role: 'Peneliti',    count: users.filter(u => u.role === 'peneliti').length, emoji: '📊', cls: 'bg-violet-50 text-violet-700' },
                    { role: 'Admin',       count: users.filter(u => u.role === 'admin').length,    emoji: '⚙️', cls: 'bg-slate-100 text-slate-700' },
                  ].map(r => (
                    <div key={r.role} className={`${r.cls} rounded-xl p-3 text-center border border-current/10`}>
                      <div className="text-xl mb-1">{r.emoji}</div>
                      <div className="text-xl font-black">{r.count}</div>
                      <div className="text-[10px] font-semibold mt-0.5">{r.role}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── USERS ──────────────────────────────── */}
          {section === 'users' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-black text-slate-900">Manajemen Pengguna</h1>
                  <p className="text-slate-500 text-sm mt-1">Daftar semua pengguna terdaftar dalam sistem</p>
                </div>
                <button className="bg-primary-600 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-primary-700 transition">
                  + Undang Peserta
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      {['Pengguna', 'Email', 'Peran', 'Institusi', 'Status'].map(h => (
                        <th key={h} className="text-left text-[10px] font-bold text-slate-500 uppercase tracking-wide px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {users.map(u => {
                      const roleStyle: Record<string, string> = {
                        peserta:   'bg-primary-100 text-primary-700',
                        ahli:      'bg-blue-100 text-blue-700',
                        peneliti:  'bg-violet-100 text-violet-700',
                        admin:     'bg-slate-200 text-slate-700',
                      }
                      const roleLabel: Record<string, string> = {
                        peserta: 'Peserta', ahli: 'Fasilitator', peneliti: 'Peneliti', admin: 'Admin',
                      }
                      return (
                        <tr key={u.id} className="hover:bg-slate-50/50 transition">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700 flex-none">{u.avatar}</div>
                              <div>
                                <p className="text-xs font-semibold text-slate-800">{u.name}</p>
                                <p className="text-[10px] text-slate-400">{u.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-600">{u.email}</td>
                          <td className="px-4 py-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${roleStyle[u.role]}`}>{roleLabel[u.role]}</span>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-600">{u.school || u.institution}</td>
                          <td className="px-4 py-3">
                            <span className="text-[10px] font-bold bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">Aktif</span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── MODULES ────────────────────────────── */}
          {section === 'modules' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-900">Manajemen Modul</h1>
                  <p className="text-slate-500 text-sm mt-1">Kelola konten dan status modul pembelajaran</p>
                </div>
                <button onClick={openAddModal}
                  className="bg-primary-600 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-primary-700 transition">
                  + Tambah Modul
                </button>
              </div>

              {/* FGD info banner */}
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 mb-5 flex items-start gap-3">
                <span className="text-sky-500 text-lg flex-none mt-0.5">ℹ️</span>
                <div>
                  <p className="text-sm font-semibold text-sky-900">Alur FGD Ahli</p>
                  <p className="text-xs text-sky-700 mt-0.5 leading-relaxed">
                    Setiap modul baru harus melalui <strong>FGD Ahli</strong> (Focus Group Discussion) sebelum dapat diaktifkan.
                    Klik <strong>"Dokumentasi FGD"</strong> pada modul Draft untuk mencatat tanggal, peserta, dan keputusan FGD.
                    Setelah FGD disetujui, tombol Aktifkan akan tersedia.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {modules.map(m => {
                  const badge = moduleStatusBadge(m)
                  const fgd = fgdStatusOf(m.id)
                  const canActivate = !isCustomModule(m.id) || (fgd?.decision === 'approved')

                  return (
                    <div key={m.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-none" style={{ background: m.colorLight }}>
                            {m.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                              <h3 className="text-sm font-bold text-slate-900">{m.title}</h3>
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${badge.cls}`}>
                                {badge.label}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mb-1.5">{m.desc}</p>
                            <div className="flex gap-2 text-[10px] text-slate-400 flex-wrap">
                              <span>{m.time}</span>
                              <span>·</span>
                              <span>{m.dimension}</span>
                              {m.lessons.length > 0 && <><span>·</span><span>{m.lessons.length} pelajaran</span></>}
                              {fgd && (
                                <>
                                  <span>·</span>
                                  <span className="text-slate-500">FGD: {new Date(fgd.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 flex-none flex-wrap justify-end">
                          {/* FGD button for custom draft/coming modules */}
                          {isCustomModule(m.id) && m.status !== 'active' && (
                            <button onClick={() => openFGDModal(m)}
                              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
                                fgd
                                  ? 'border-slate-200 text-slate-500 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700'
                                  : 'border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100'
                              }`}>
                              {fgd ? 'Lihat FGD' : '📋 Dokumentasi FGD'}
                            </button>
                          )}

                          {/* Activate/Deactivate */}
                          <button onClick={() => handleActivateModule(m)}
                            disabled={m.status !== 'active' && !canActivate}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
                              m.status === 'active'
                                ? 'border-slate-200 text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600'
                                : canActivate
                                  ? 'border-primary-300 bg-primary-50 text-primary-700 hover:bg-primary-100'
                                  : 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'
                            }`}
                            title={m.status !== 'active' && !canActivate ? 'Dokumentasikan FGD terlebih dahulu' : undefined}>
                            {m.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                          </button>

                          {/* Edit */}
                          <button onClick={() => openEditModal(m)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition">
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── SETTINGS ───────────────────────────── */}
          {section === 'settings' && (
            <div>
              <h1 className="text-2xl font-black text-slate-900 mb-1">Pengaturan Platform</h1>
              <p className="text-slate-500 text-sm mb-6">Aktifkan atau nonaktifkan fitur platform</p>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-4">
                <h3 className="text-sm font-bold text-slate-800 mb-4">Fitur Platform</h3>
                <div className="space-y-4">
                  {[
                    { key: 'gamification' as const, label: 'Sistem Gamifikasi',  sub: 'XP, level, badge, dan streak' },
                    { key: 'discussion'   as const, label: 'Forum Diskusi',      sub: 'Peserta dapat membuat dan membalas diskusi' },
                    { key: 'aiTutor'      as const, label: 'AI Tutor',           sub: 'Chat dengan asisten AI' },
                    { key: 'certificate'  as const, label: 'Sertifikat Digital', sub: 'Sertifikat penyelesaian modul' },
                    { key: 'maintenance'  as const, label: 'Mode Pemeliharaan',  sub: 'Hanya admin yang bisa akses platform' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{item.label}</p>
                        <p className="text-xs text-slate-500">{item.sub}</p>
                      </div>
                      <button onClick={() => setSettings(s => ({ ...s, [item.key]: !s[item.key] }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings[item.key] ? 'bg-primary-600' : 'bg-slate-200'}`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${settings[item.key] ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="text-sm font-bold text-slate-800 mb-4">Konfigurasi Sesi</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Nama Kohort</label>
                    <input defaultValue="Angkatan 2026 — PPS PTK UPI Bandung"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Tanggal Mulai</label>
                    <input type="date" defaultValue="2026-06-01"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">Magic Link Undangan</label>
                    <div className="flex gap-2">
                      <input readOnly value="https://clme.app/join?token=CLME2026-DEMO"
                        className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none bg-slate-50 font-mono text-slate-600" />
                      <button className="bg-primary-600 text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-primary-700 transition flex-none">Salin</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button onClick={() => flash('Pengaturan berhasil disimpan!')}
                  className="bg-primary-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-primary-700 transition">
                  Simpan Pengaturan
                </button>
              </div>
            </div>
          )}

          {/* ── AI CONFIG ──────────────────────────── */}
          {section === 'ai-config' && (
            <div>
              <h1 className="text-2xl font-black text-slate-900 mb-1">Konfigurasi AI Tutor</h1>
              <p className="text-slate-500 text-sm mb-6">Atur model dan system prompt untuk AI Tutor</p>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-4">
                <h3 className="text-sm font-bold text-slate-800 mb-4">Pemilihan Model</h3>
                <div className="space-y-2">
                  {[
                    { id: 'claude-sonnet-4-6',        label: 'Claude Sonnet 4.6',  desc: 'Direkomendasikan — keseimbangan kecepatan dan kualitas',     badge: 'Aktif' },
                    { id: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5',  desc: 'Respons lebih cepat, cocok untuk Q&A sederhana',             badge: 'Tersedia' },
                    { id: 'claude-opus-4-8',           label: 'Claude Opus 4.8',   desc: 'Paling canggih untuk analisis kompleks',                      badge: 'Premium' },
                  ].map(m => (
                    <button key={m.id} onClick={() => setAiModel(m.id)}
                      className={`w-full text-left border rounded-xl p-4 transition ${aiModel === m.id ? 'border-primary-400 bg-primary-50' : 'border-slate-200 bg-white hover:border-primary-200'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-900">{m.label}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{m.desc}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${aiModel === m.id ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-500'}`}>{m.badge}</span>
                          {aiModel === m.id && <span className="text-primary-600 font-bold">✓</span>}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="text-sm font-bold text-slate-800 mb-1">System Prompt</h3>
                <p className="text-xs text-slate-400 mb-3">Instruksi dasar yang diterima AI sebelum setiap percakapan</p>
                <textarea value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} rows={6}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 resize-none font-mono" />
                <div className="flex justify-between items-center mt-3">
                  <p className="text-xs text-slate-400">{aiPrompt.length} karakter</p>
                  <button onClick={() => flash('Konfigurasi AI disimpan!')}
                    className="bg-primary-600 text-white font-bold px-5 py-2 rounded-xl hover:bg-primary-700 transition text-sm">
                    Simpan Konfigurasi
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ── Module Modal ──────────────────────────── */}
      {showModuleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                {editingId ? 'Edit Modul' : 'Tambah Modul Baru'}
              </h2>
              <button onClick={() => setShowModuleModal(false)} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 text-sm transition">✕</button>
            </div>
            <div className="px-6 py-4 space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-xl">{formError}</div>
              )}
              {!editingId && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-2.5 rounded-xl leading-relaxed">
                  ⚠️ Modul baru akan dibuat sebagai <strong>Draft</strong>. Anda perlu mendokumentasikan <strong>FGD Ahli</strong> sebelum modul dapat diaktifkan.
                </div>
              )}
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Ikon</label>
                  <input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-center text-lg outline-none focus:border-primary-500" />
                </div>
                <div className="col-span-3">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Judul Modul *</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="Judul modul pembelajaran"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Deskripsi *</label>
                <textarea value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
                  rows={2} placeholder="Deskripsi singkat modul"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 resize-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Tujuan Pembelajaran</label>
                <textarea value={form.objective} onChange={e => setForm(f => ({ ...f, objective: e.target.value }))}
                  rows={2} placeholder="Tujuan atau kompetensi yang ingin dicapai"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Durasi</label>
                  <input value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                    placeholder="30 mnt"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Dimensi</label>
                  <input value={form.dimension} onChange={e => setForm(f => ({ ...f, dimension: e.target.value }))}
                    placeholder="Knowledge"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary-500" />
                </div>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setShowModuleModal(false)}
                className="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition text-sm">
                Batal
              </button>
              <button onClick={handleSaveModule}
                className="flex-1 bg-primary-600 text-white font-bold py-2.5 rounded-xl hover:bg-primary-700 transition text-sm">
                {editingId ? 'Simpan Perubahan' : 'Tambah Modul'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FGD Modal ─────────────────────────────── */}
      {showFGDModal && fgdTargetModule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Dokumentasi FGD Ahli</h2>
                <p className="text-xs text-slate-500 mt-0.5">{fgdTargetModule.title}</p>
              </div>
              <button onClick={() => setShowFGDModal(false)} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 text-sm transition">✕</button>
            </div>

            <div className="px-6 py-4 space-y-4">
              {fgdFormError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-xl">{fgdFormError}</div>
              )}

              <div className="bg-sky-50 border border-sky-100 rounded-xl p-3 text-xs text-sky-700 leading-relaxed">
                Catat hasil FGD (Focus Group Discussion) dengan para ahli untuk modul ini. Dokumentasi ini diperlukan sebelum modul dapat diaktifkan untuk peserta.
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Tanggal FGD</label>
                <input type="date" value={fgdForm.date} onChange={e => setFGDForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Peserta FGD *</label>
                <textarea value={fgdForm.attendees} onChange={e => setFGDForm(f => ({ ...f, attendees: e.target.value }))}
                  rows={2} placeholder="Nama ahli yang hadir (pisahkan dengan koma)"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 resize-none" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Catatan Diskusi *</label>
                <textarea value={fgdForm.notes} onChange={e => setFGDForm(f => ({ ...f, notes: e.target.value }))}
                  rows={4} placeholder="Ringkasan diskusi, masukan dari ahli, dan poin-poin penting yang dibahas..."
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 resize-none" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2">Keputusan FGD</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'approved'  as const, label: '✅ Disetujui',       cls: 'border-primary-400 bg-primary-50 text-primary-700' },
                    { value: 'revision'  as const, label: '🔄 Perlu Revisi',    cls: 'border-amber-400 bg-amber-50 text-amber-700' },
                    { value: 'rejected'  as const, label: '❌ Ditolak',         cls: 'border-red-300 bg-red-50 text-red-700' },
                  ].map(opt => (
                    <button key={opt.value} onClick={() => setFGDForm(f => ({ ...f, decision: opt.value }))}
                      className={`text-xs font-semibold py-2.5 px-3 rounded-xl border-2 transition text-center ${fgdForm.decision === opt.value ? opt.cls : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setShowFGDModal(false)}
                className="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition text-sm">
                Batal
              </button>
              <button onClick={handleSaveFGD}
                className="flex-1 bg-primary-600 text-white font-bold py-2.5 rounded-xl hover:bg-primary-700 transition text-sm">
                Simpan Hasil FGD
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
