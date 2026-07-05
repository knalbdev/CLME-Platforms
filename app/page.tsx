'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/auth'

// ── Data ────────────────────────────────────────────────────

const FEATURES = [
  { icon: '🎮', title: 'Gamifikasi Penuh', desc: 'XP, 5 level, 7 badge, dan streak harian membuat proses belajar terasa seperti permainan yang mengasyikkan.' },
  { icon: '🤖', title: 'AI Tutor Interaktif', desc: 'Tanya jawab langsung dengan AI Tutor — siap membantu kapan saja, dalam Bahasa Indonesia.' },
  { icon: '🎓', title: 'Sertifikat Digital', desc: 'Dapatkan sertifikat resmi setiap kali menyelesaikan modul. Bukti kompetensi literasi siber Anda.' },
]

const MODULES = [
  { icon: '🌐', title: 'Keamanan Siber untuk Guru',              desc: 'CIA Triad, NIST CSF 2.0, dan lanskap ancaman siber untuk pendidik',   time: '35 mnt', tag: 'Aktif', num: '01' },
  { icon: '🔐', title: 'Keamanan Password dan Email',            desc: 'Kata sandi kuat, password manager, dan deteksi phishing email',       time: '40 mnt', tag: 'Aktif', num: '02' },
  { icon: '🌊', title: 'Internet Safety dan Data Handling',      desc: 'Membaca URL, menghindari penipuan OTP, dan hak-hak UU PDP',          time: '40 mnt', tag: 'Aktif', num: '03' },
  { icon: '📱', title: 'Social Media & Mobile Security',         desc: 'Privasi Instagram & WhatsApp, keamanan HP, dan risiko oversharing',   time: '35 mnt', tag: 'Aktif', num: '04' },
  { icon: '👣', title: 'Digital Footprint & Incident Reporting', desc: 'Jejak digital, mengenali insiden siber, dan prosedur 5 langkah',      time: '35 mnt', tag: 'Aktif', num: '05' },
  { icon: '💻', title: 'System Updates & Device Security',       desc: 'Pembaruan sistem, perlindungan ransomware, dan backup 3-2-1',        time: '35 mnt', tag: 'Aktif', num: '06' },
]

const STATS = [
  { val: 6,    suffix: '',   label: 'Modul Pembelajaran' },
  { val: 5,    suffix: '',   label: 'Peran Pengguna' },
  { val: 10,   suffix: '',   label: 'Badge Pencapaian' },
  { val: 100,  suffix: '%',  label: 'Gratis untuk Riset' },
]

const NAV_LINKS = [
  { label: 'Modul', href: '#modul' },
  { label: 'Fitur', href: '#fitur' },
  { label: 'Tentang', href: '#tentang' },
]

const STEPS = [
  { num: '01', title: 'Masuk sebagai Peserta', desc: 'Daftar atau masuk sebagai peserta (guru) untuk mengakses semua modul pembelajaran.' },
  { num: '02', title: 'Kerjakan Modul Interaktif', desc: 'Mulai dari pre-test, ikuti pelajaran interaktif, simulasi phishing, hingga post-test.' },
  { num: '03', title: 'Kumpulkan XP & Badge', desc: 'Setiap aktivitas menghasilkan XP. Naiki level dan kumpulkan badge sebagai bukti kompetensi.' },
  { num: '04', title: 'Dapatkan Sertifikat', desc: 'Sertifikat digital otomatis setelah modul selesai, didukung data N-Gain oleh tim peneliti.' },
]

const ROLES = [
  { icon: '👩‍🏫', title: 'Peserta (Guru)', desc: 'Akses modul, AI Tutor, forum diskusi, dan sertifikat' },
  { icon: '🤝', title: 'Fasilitator', desc: 'Monitor keterlibatan peserta dan laporan lapangan' },
  { icon: '📊', title: 'Peneliti', desc: 'Analisis N-Gain, ekspor data CSV/JSON untuk riset' },
  { icon: '⚙️', title: 'Administrator', desc: 'Kelola modul, pengguna, dan konfigurasi platform' },
]

// ── Scroll-reveal hook ───────────────────────────────────────

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.animationPlayState = 'running'
            e.target.classList.add('revealed')
            observer.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

// ── Counter hook ─────────────────────────────────────────────

function useCounter(target: number, duration = 1400) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const start = useCallback(() => {
    if (started) return
    setStarted(true)
    const startTime = performance.now()
    const tick = (now: number) => {
      const pct = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - pct, 3) // ease-out-cubic
      setCount(Math.round(eased * target))
      if (pct < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration, started])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { start(); observer.disconnect() } },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [start])

  return { count, ref }
}

// ── Stat item ────────────────────────────────────────────────

function StatItem({ val, suffix, label }: { val: number; suffix: string; label: string }) {
  const { count, ref } = useCounter(val)
  return (
    <div ref={ref} className="text-center">
      <p className="text-3xl sm:text-4xl font-black text-white tabular-nums">
        {count}{suffix}
      </p>
      <p className="text-sm text-primary-200 mt-1 font-medium">{label}</p>
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────

export default function LandingPage() {
  const router = useRouter()
  useScrollReveal()

  useEffect(() => {
    const session = getSession()
    if (session) {
      const routes: Record<string, string> = { peserta: '/peserta', ahli: '/ahli', peneliti: '/peneliti', admin: '/admin' }
      router.push(routes[session.role] || '/login')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">

      {/* ── Navbar ─────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-slate-100 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="CLME" className="w-8 h-8 object-contain flex-none" />
            <span className="text-base font-black text-slate-900 tracking-tight">CLME</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(l => (
              <a key={l.label} href={l.href}
                className="text-sm font-medium text-slate-600 hover:text-primary-600 transition">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition hidden sm:block">
              Masuk
            </Link>
            <Link href="/login"
              className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition shadow-sm shadow-primary-200/60 animate-glow">
              Mulai Sekarang →
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────── */}
      <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary-950 to-navy-900">
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-primary-500/20 blur-3xl" />
        <div className="absolute bottom-10 left-10 w-56 h-56 rounded-full bg-sky-500/15 blur-3xl" />
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Text — fade in on load */}
            <div className="animate-reveal relative z-10" style={{ animationDelay: '0ms' }}>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-primary-200 text-xs font-bold px-3 py-1.5 rounded-full mb-6 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
                Platform Literasi Siber Pendidik Indonesia
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-5">
                Kuasai Keamanan Siber,<br />
                <span className="text-primary-300">Lindungi Sekolahmu</span>
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed mb-8">
                Platform gamifikasi berbasis riset untuk guru Indonesia. Belajar literasi keamanan siber
                dengan modul interaktif, AI Tutor, dan sertifikat digital yang diakui.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/login"
                  className="bg-primary-500 hover:bg-primary-400 text-white font-bold px-6 py-3.5 rounded-xl text-sm transition shadow-lg shadow-primary-900/50 text-center">
                  Mulai Belajar Sekarang →
                </Link>
                <a href="#modul"
                  className="border border-white/30 text-white font-semibold px-6 py-3.5 rounded-xl text-sm hover:bg-white/10 transition text-center backdrop-blur-sm">
                  Lihat Modul
                </a>
              </div>
              <div className="mt-10 flex items-center gap-4 flex-wrap">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Dikembangkan oleh</p>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-slate-300">PPS PTK UPI Bandung</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-sm font-bold text-slate-300">Platform Siber untuk Pendidik</span>
                </div>
              </div>
            </div>

            {/* Dashboard visual — float animation */}
            <div className="relative animate-reveal" style={{ animationDelay: '150ms' }}>
              <div className="animate-float">
                <div className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-3xl p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="text-xs text-white/50">Selamat datang,</p>
                      <p className="text-sm font-bold text-white">Sari Rahayu, S.Pd.</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-primary-400/30 flex items-center justify-center text-sm font-bold text-white border border-white/20">SR</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-4 mb-4 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-white">🔒 Cyber Defender</span>
                      <span className="text-xs bg-primary-400/30 px-2 py-0.5 rounded-full font-bold text-white">420 XP</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-400 rounded-full w-[60%] transition-all duration-1000" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                      { val: '🔥 7', label: 'Streak' },
                      { val: '✅ 6', label: 'Pelajaran' },
                      { val: '🏅 3', label: 'Badge' },
                    ].map(s => (
                      <div key={s.label} className="bg-white/10 rounded-xl p-2 text-center border border-white/10">
                        <p className="text-xs font-bold text-white">{s.val}</p>
                        <p className="text-[9px] text-white/50 mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl flex-none">🔐</div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-800">Manajemen Kata Sandi</p>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                          <div className="h-full bg-primary-500 rounded-full w-[75%]" />
                        </div>
                        <p className="text-[9px] text-slate-400 mt-1">3/4 pelajaran · 75%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-3 border border-slate-100 animate-pop animate-float-slow">
                <div className="text-center">
                  <div className="text-2xl mb-0.5">🏆</div>
                  <p className="text-[9px] font-bold text-slate-700">Badge Baru!</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-3 border border-slate-100 animate-float" style={{ animationDelay: '1.2s' }}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-xs">🤖</div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-700">AI Tutor</p>
                    <p className="text-[8px] text-slate-400">Online 24/7</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────── */}
      <section className="py-14 bg-primary-600 relative overflow-hidden">
        {/* Background shimmer */}
        <div className="absolute inset-0 opacity-10"
          style={{ background: 'linear-gradient(90deg, transparent 0%, white 50%, transparent 100%)', backgroundSize: '200% 100%', animation: 'shimmer 3s linear infinite' }} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(s => <StatItem key={s.label} {...s} />)}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────── */}
      <section id="fitur" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12" data-reveal
            style={{ opacity: 0, animation: 'reveal 0.65s cubic-bezier(0.16,1,0.3,1) forwards', animationPlayState: 'paused' }}>
            <h2 className="text-3xl font-black text-slate-900 mb-3">Fitur Utama Platform</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
              Dirancang khusus untuk pendidik Indonesia dengan pendekatan gamifikasi berbasis riset
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={f.title} data-reveal
                style={{ opacity: 0, animation: 'reveal 0.65s cubic-bezier(0.16,1,0.3,1) forwards', animationPlayState: 'paused', animationDelay: `${i * 120}ms` }}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-primary-200 hover:bg-primary-50/30 hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-2xl mb-4 group-hover:border-primary-200 group-hover:bg-primary-50 transition shadow-sm">
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Modules ────────────────────────────────── */}
      <section id="modul" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10" data-reveal
            style={{ opacity: 0, animation: 'reveal 0.65s cubic-bezier(0.16,1,0.3,1) forwards', animationPlayState: 'paused' }}>
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-2">Modul Pembelajaran</h2>
              <p className="text-slate-500 text-sm">Mulai perjalanan belajar dengan kurikulum terbaik kami</p>
            </div>
            <Link href="/login" className="text-primary-600 font-bold text-sm hover:underline hidden sm:block">
              Lihat Semua →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MODULES.map((m, i) => (
              <div key={m.title} data-reveal
                style={{ opacity: 0, animation: 'reveal 0.65s cubic-bezier(0.16,1,0.3,1) forwards', animationPlayState: 'paused', animationDelay: `${i * 80}ms` }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
                <div className="h-24 bg-gradient-to-br from-navy-900 to-primary-900 flex items-center justify-between px-5 relative overflow-hidden">
                  <span className="text-3xl z-10 group-hover:scale-110 transition-transform duration-500">{m.icon}</span>
                  <span className="text-5xl font-black text-white/10 absolute right-3 top-1/2 -translate-y-1/2 select-none">{m.num}</span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-primary-400/30 text-primary-200 z-10">{m.tag}</span>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-slate-900 mb-1.5 leading-tight">{m.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{m.desc}</p>
                  <p className="text-[10px] text-slate-400 mt-2">{m.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white" id="tentang">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-8" data-reveal
                style={{ opacity: 0, animation: 'reveal 0.65s cubic-bezier(0.16,1,0.3,1) forwards', animationPlayState: 'paused' }}>
                Bagaimana CLME Bekerja?
              </h2>
              <div className="space-y-5">
                {STEPS.map((s, i) => (
                  <div key={s.num} data-reveal
                    style={{ opacity: 0, animation: 'reveal 0.65s cubic-bezier(0.16,1,0.3,1) forwards', animationPlayState: 'paused', animationDelay: `${i * 100}ms` }}
                    className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white text-xs font-black flex-none shadow-sm shadow-primary-200/50 group-hover:scale-110 transition-transform">
                      {s.num}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 mb-0.5">{s.title}</p>
                      <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {ROLES.map((r, i) => (
                <div key={r.title} data-reveal
                  style={{ opacity: 0, animation: 'reveal 0.65s cubic-bezier(0.16,1,0.3,1) forwards', animationPlayState: 'paused', animationDelay: `${i * 80}ms` }}
                  className="bg-slate-50 border border-slate-100 rounded-2xl p-5 hover:border-primary-200 hover:bg-primary-50/30 hover:-translate-y-1 transition-all duration-300">
                  <div className="text-3xl mb-3">{r.icon}</div>
                  <p className="text-sm font-bold text-slate-900 mb-1">{r.title}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-navy-900 to-primary-900 relative overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute top-8 left-12 w-40 h-40 rounded-full bg-primary-500/20 blur-3xl animate-float-slow" />
        <div className="absolute bottom-8 right-12 w-56 h-56 rounded-full bg-navy-700/40 blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="max-w-3xl mx-auto text-center relative" data-reveal
          style={{ opacity: 0, animation: 'reveal 0.65s cubic-bezier(0.16,1,0.3,1) forwards', animationPlayState: 'paused' }}>
          <img src="/logo.png" alt="CLME" className="w-16 h-16 object-contain mx-auto mb-5 drop-shadow-lg" />
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Siap Menjadi Pendidik<br />yang Lebih Siber-Literat?
          </h2>
          <p className="text-primary-200 mb-8 leading-relaxed">
            Bergabunglah bersama guru-guru Indonesia yang telah memperkuat kompetensi
            keamanan siber mereka bersama CLME Platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/login"
              className="bg-white text-primary-700 font-bold px-8 py-3.5 rounded-xl hover:bg-primary-50 transition text-sm shadow-lg hover:scale-105 duration-200">
              Daftar Gratis Sekarang
            </Link>
            <Link href="/login"
              className="border border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition text-sm">
              Masuk ke Platform
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────── */}
      <footer className="bg-slate-900 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="CLME" className="w-7 h-7 object-contain flex-none" />
              <span className="text-sm font-black text-white">CLME Platform</span>
            </div>
            <p className="text-xs text-slate-500 text-center">
              © 2026 CLME Platform · PPS PTK UPI Bandung
            </p>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-xs text-slate-400 hover:text-white transition">Masuk</Link>
              <span className="text-slate-700">·</span>
              <a href="#tentang" className="text-xs text-slate-400 hover:text-white transition">Tentang</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
