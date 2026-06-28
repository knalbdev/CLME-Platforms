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

const EMPTY_FORM: ModuleForm = {
  id: '', title: '', icon: '🛡️', desc: '', objective: '', time: '30 mnt', dimension: 'Knowledge', status: 'draft',
}

export default function AdminPage() {
  const router = useRouter()
  const [section, setSection] = useState<Section>('dashboard')
  const [session, setSession] = useState<User | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<ModuleForm>(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [saveMsg, setSaveMsg] = useState('')
  const [aiModel, setAiModel] = useState('claude-sonnet-4-6')
  const [aiPrompt, setAiPrompt] = useState('Kamu adalah AI Tutor CLME yang membantu guru memahami konsep keamanan siber. Jawab dalam Bahasa Indonesia yang jelas, praktis, dan sesuai konteks sekolah. Selalu berikan contoh yang relevan untuk pendidik.')
  const [settings, setSettings] = useState({
    gamification: true,
    discussion: true,
    aiTutor: true,
    certificate: true,
    maintenance: false,
  })

  useEffect(() => {
    const s = getSession()
    if (!s || s.role !== 'admin') { router.push('/'); return }
    setSession(s)
    setModules(getModules())
    setUsers(getAllUsers())
  }, [router])

  const handleLogout = () => { logout(); router.push('/') }

  const refreshModules = () => setModules(getModules())

  const openAddModal = () => {
    setForm({ ...EMPTY_FORM, id: `custom_${Date.now()}` })
    setEditingId(null)
    setFormError('')
    setShowModal(true)
  }

  const openEditModal = (m: Module) => {
    setForm({ id: m.id, title: m.title, icon: m.icon, desc: m.desc, objective: m.objective, time: m.time, dimension: m.dimension, status: m.status })
    setEditingId(m.id)
    setFormError('')
    setShowModal(true)
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
      status: form.status,
      desc: form.desc.trim(),
      objective: form.objective.trim() || form.desc.trim(),
      facilitatorNote: '',
      lessons: [],
      pretest: { id: `${form.id}_pre`, questions: [] },
      posttest: { id: `${form.id}_post`, questions: [] },
    }
    saveCustomModule(mod)
    refreshModules()
    setShowModal(false)
    setSaveMsg(`Modul "${form.title}" berhasil disimpan!`)
    setTimeout(() => setSaveMsg(''), 3000)
  }

  const handleToggleStatus = (id: string, current: Module['status']) => {
    const next: Module['status'] = current === 'active' ? 'coming' : 'active'
    updateModuleStatus(id, next)
    refreshModules()
    setSaveMsg(`Status modul diperbarui.`)
    setTimeout(() => setSaveMsg(''), 2500)
  }

  const handleSaveSettings = () => {
    setSaveMsg('Pengaturan berhasil disimpan!')
    setTimeout(() => setSaveMsg(''), 2500)
  }

  const handleSaveAI = () => {
    setSaveMsg('Konfigurasi AI disimpan!')
    setTimeout(() => setSaveMsg(''), 2500)
  }

  const statusColors: Record<Module['status'], string> = {
    active: 'bg-primary-100 text-primary-700',
    coming: 'bg-amber-100 text-amber-700',
    draft: 'bg-slate-100 text-slate-600',
  }
  const statusLabels: Record<Module['status'], string> = {
    active: 'Aktif', coming: 'Segera', draft: 'Draft',
  }

  const navItems: { id: Section; label: string; emoji: string }[] = [
    { id: 'dashboard', label: 'Ringkasan Sistem', emoji: '📊' },
    { id: 'users', label: 'Pengguna', emoji: '👥' },
    { id: 'modules', label: 'Manajemen Modul', emoji: '📚' },
    { id: 'settings', label: 'Pengaturan Platform', emoji: '⚙️' },
    { id: 'ai-config', label: 'Konfigurasi AI', emoji: '🤖' },
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
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col shadow-sm flex-none">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white text-xs">🛡️</div>
            <div>
              <p className="text-sm font-black text-slate-900">CLME Admin</p>
              <p className="text-[10px] text-slate-400 font-medium">Control Panel</p>
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
            <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">{session.avatar}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{session.name}</p>
              <p className="text-[10px] text-slate-400">Administrator</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full text-xs text-slate-500 hover:text-red-600 py-1.5 rounded-lg border border-slate-200 hover:border-red-200 transition">Keluar</button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-5xl mx-auto">

          {saveMsg && (
            <div className="mb-4 bg-primary-50 border border-primary-200 text-primary-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
              <span>✅</span> {saveMsg}
            </div>
          )}

          {/* DASHBOARD */}
          {section === 'dashboard' && (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-black text-slate-900">Ringkasan Sistem</h1>
                <p className="text-slate-500 text-sm mt-1">CLME Platform · {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total Pengguna', val: users.length, emoji: '👥', color: 'bg-blue-50 border-blue-100' },
                  { label: 'Modul Aktif', val: activeModules.length, emoji: '📚', color: 'bg-primary-50 border-primary-100' },
                  { label: 'Peserta Terdaftar', val: pesertaUsers.length, emoji: '👩‍🏫', color: 'bg-amber-50 border-amber-100' },
                  { label: 'Total Modul', val: modules.length, emoji: '🗂️', color: 'bg-violet-50 border-violet-100' },
                ].map(s => (
                  <div key={s.label} className={`${s.color} border rounded-2xl p-4 shadow-sm`}>
                    <div className="text-2xl mb-1">{s.emoji}</div>
                    <div className="text-2xl font-black text-slate-900">{s.val}</div>
                    <div className="text-xs text-slate-500 mt-0.5 font-medium">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Service status */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-4">
                <h3 className="text-sm font-bold text-slate-800 mb-4">Status Layanan</h3>
                <div className="space-y-2">
                  {[
                    { name: 'Frontend (Next.js)', status: 'Aktif', latency: '12ms' },
                    { name: 'Data Storage (localStorage)', status: 'Aktif', latency: '< 1ms' },
                    { name: 'AI Tutor (Simulasi)', status: 'Aktif', latency: '~900ms' },
                    { name: 'Gamifikasi Engine', status: 'Aktif', latency: '< 1ms' },
                  ].map(s => (
                    <div key={s.name} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                        <span className="text-sm text-slate-700">{s.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400">{s.latency}</span>
                        <span className="text-[10px] font-bold bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">{s.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="text-sm font-bold text-slate-800 mb-3">Distribusi Peran Pengguna</h3>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { role: 'Peserta', count: users.filter(u => u.role === 'peserta').length, emoji: '👩‍🏫', color: 'bg-primary-50 text-primary-700' },
                    { role: 'Ahli', count: users.filter(u => u.role === 'ahli').length, emoji: '🔬', color: 'bg-blue-50 text-blue-700' },
                    { role: 'Peneliti', count: users.filter(u => u.role === 'peneliti').length, emoji: '📊', color: 'bg-violet-50 text-violet-700' },
                    { role: 'Admin', count: users.filter(u => u.role === 'admin').length, emoji: '⚙️', color: 'bg-slate-100 text-slate-700' },
                  ].map(r => (
                    <div key={r.role} className={`${r.color} rounded-xl p-3 text-center border border-current/10`}>
                      <div className="text-xl mb-1">{r.emoji}</div>
                      <div className="text-xl font-black">{r.count}</div>
                      <div className="text-[10px] font-semibold mt-0.5">{r.role}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* USERS */}
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
                      const roleColors: Record<string, string> = {
                        peserta: 'bg-primary-100 text-primary-700',
                        ahli: 'bg-blue-100 text-blue-700',
                        peneliti: 'bg-violet-100 text-violet-700',
                        admin: 'bg-slate-200 text-slate-700',
                      }
                      const roleLabels: Record<string, string> = {
                        peserta: 'Peserta', ahli: 'Ahli Validasi', peneliti: 'Peneliti', admin: 'Admin',
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
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${roleColors[u.role]}`}>{roleLabels[u.role]}</span>
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

          {/* MODULES */}
          {section === 'modules' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-black text-slate-900">Manajemen Modul</h1>
                  <p className="text-slate-500 text-sm mt-1">Kelola konten dan status modul pembelajaran</p>
                </div>
                <button onClick={openAddModal}
                  className="bg-primary-600 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-primary-700 transition">
                  + Tambah Modul
                </button>
              </div>

              <div className="space-y-3">
                {modules.map(m => (
                  <div key={m.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-none" style={{ background: m.colorLight }}>
                          {m.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="text-sm font-bold text-slate-900">{m.title}</h3>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${statusColors[m.status]}`}>
                              {statusLabels[m.status]}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mb-1">{m.desc}</p>
                          <div className="flex gap-2 text-[10px] text-slate-400">
                            <span>{m.time}</span>
                            <span>·</span>
                            <span>{m.dimension}</span>
                            {m.lessons.length > 0 && <><span>·</span><span>{m.lessons.length} pelajaran</span></>}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-none">
                        <button onClick={() => handleToggleStatus(m.id, m.status)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 transition">
                          {m.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                        </button>
                        <button onClick={() => openEditModal(m)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 transition">
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {section === 'settings' && (
            <div>
              <h1 className="text-2xl font-black text-slate-900 mb-1">Pengaturan Platform</h1>
              <p className="text-slate-500 text-sm mb-6">Aktifkan atau nonaktifkan fitur platform</p>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-4">
                <h3 className="text-sm font-bold text-slate-800 mb-4">Fitur Platform</h3>
                <div className="space-y-4">
                  {[
                    { key: 'gamification' as const, label: 'Sistem Gamifikasi', sub: 'XP, level, badge, dan streak' },
                    { key: 'discussion' as const, label: 'Forum Diskusi', sub: 'Peserta dapat membuat dan membalas diskusi' },
                    { key: 'aiTutor' as const, label: 'AI Tutor', sub: 'Chat dengan asisten AI' },
                    { key: 'certificate' as const, label: 'Sertifikat Digital', sub: 'Sertifikat penyelesaian modul' },
                    { key: 'maintenance' as const, label: 'Mode Pemeliharaan', sub: 'Hanya admin yang bisa akses platform' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{item.label}</p>
                        <p className="text-xs text-slate-500">{item.sub}</p>
                      </div>
                      <button
                        onClick={() => setSettings(s => ({ ...s, [item.key]: !s[item.key] }))}
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
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Nama Kohort</label>
                    <input defaultValue="Angkatan 2026 — PPS PTK UPI Bandung"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Tanggal Mulai</label>
                    <input type="date" defaultValue="2026-06-01"
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Magic Link Undangan</label>
                    <div className="flex gap-2">
                      <input readOnly value={`https://clme.app/join?token=CLME2026-${Math.random().toString(36).substr(2, 8).toUpperCase()}`}
                        className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none bg-slate-50 font-mono text-slate-600" />
                      <button className="bg-primary-600 text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-primary-700 transition flex-none">
                        Salin
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button onClick={handleSaveSettings}
                  className="bg-primary-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-primary-700 transition">
                  Simpan Pengaturan
                </button>
              </div>
            </div>
          )}

          {/* AI CONFIG */}
          {section === 'ai-config' && (
            <div>
              <h1 className="text-2xl font-black text-slate-900 mb-1">Konfigurasi AI Tutor</h1>
              <p className="text-slate-500 text-sm mb-6">Atur model dan system prompt untuk AI Tutor</p>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-4">
                <h3 className="text-sm font-bold text-slate-800 mb-4">Pemilihan Model</h3>
                <div className="space-y-2">
                  {[
                    { id: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6', desc: 'Direkomendasikan — keseimbangan kecepatan dan kualitas', badge: 'Aktif' },
                    { id: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5', desc: 'Respons lebih cepat, cocok untuk Q&A sederhana', badge: 'Tersedia' },
                    { id: 'claude-opus-4-8', label: 'Claude Opus 4.8', desc: 'Paling canggih untuk analisis kompleks', badge: 'Premium' },
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
                          {aiModel === m.id && <span className="text-primary-600">✓</span>}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="text-sm font-bold text-slate-800 mb-1">System Prompt</h3>
                <p className="text-xs text-slate-400 mb-3">Instruksi dasar yang diterima AI sebelum setiap percakapan</p>
                <textarea value={aiPrompt} onChange={e => setAiPrompt(e.target.value)}
                  rows={6}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 resize-none font-mono" />
                <div className="flex justify-between items-center mt-3">
                  <p className="text-xs text-slate-400">{aiPrompt.length} karakter</p>
                  <button onClick={handleSaveAI}
                    className="bg-primary-600 text-white font-bold px-5 py-2 rounded-xl hover:bg-primary-700 transition text-sm">
                    Simpan Konfigurasi
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Module modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                {editingId ? 'Edit Modul' : 'Tambah Modul Baru'}
              </h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 text-sm transition">✕</button>
            </div>
            <div className="px-6 py-4 space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-xl">{formError}</div>
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
              <div className="grid grid-cols-3 gap-3">
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
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as ModuleForm['status'] }))}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary-500 bg-white">
                    <option value="draft">Draft</option>
                    <option value="coming">Segera</option>
                    <option value="active">Aktif</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setShowModal(false)}
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
    </div>
  )
}
