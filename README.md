# 🛡️ CLME Platform
**Cybersecurity Literacy for Micro-credential Educators**

Platform literasi keamanan siber berbasis gamifikasi untuk pendidik Indonesia.
Dikembangkan dalam program **PPS PTK UPI Bandung** — Prototype Interaktif Tahap 2.

> 🔗 **Demo Live:** [clme-platform.vercel.app](https://clme-platform.vercel.app) *(akan aktif setelah deploy)*

---

## ✨ Fitur Utama

| Fitur | Keterangan |
|---|---|
| 🎮 Gamifikasi | XP, 5 level, 7 badge, streak harian |
| 📚 3 Modul Aktif | Kata Sandi, Email, Pelaporan Insiden |
| ⚡ Simulasi Phishing | Latihan deteksi email berbahaya |
| 🤖 AI Tutor | Chat asisten keamanan siber |
| 💬 Forum Diskusi | Diskusi peserta + balasan ahli |
| 📋 Pre & Post Test | Pengukuran N-Gain pembelajaran |
| 🎓 Sertifikat Digital | Otomatis setelah selesai modul |
| 📊 Dashboard Riset | Analisis data untuk peneliti |
| ⚙️ Admin Panel | CRUD modul, manajemen pengguna |

---

## 👤 Akun Demo

> Klik akun di halaman login untuk isi otomatis, atau masukkan manual.

| Peran | Email | Kata Sandi | Akses |
|---|---|---|---|
| 👩‍🏫 **Peserta** | `sari@clme.id` | `peserta123` | Modul, AI Tutor, Diskusi, Sertifikat |
| 🔬 **Ahli Validasi** | `prof.ahmad@clme.id` | `ahli123` | Validasi konten, moderasi diskusi |
| 📊 **Peneliti** | `yudi@clme.id` | `peneliti123` | Data riset, analisis N-Gain, ekspor CSV/JSON |
| ⚙️ **Administrator** | `admin@clme.id` | `admin123` | Kelola modul, pengguna, konfigurasi AI |

---

## 🗺️ Panduan Per Peran

### 👩‍🏫 Peserta (Guru)
Antarmuka **mobile** (tampilan seperti smartphone) dengan 5 tab navigasi:

1. **Beranda** — Dashboard XP, level, streak, progress modul
2. **Modul** — Pilih modul, kerjakan pre-test → pelajaran → post-test
3. **AI Tutor** — Chat tanya jawab keamanan siber (+5 XP per pertanyaan)
4. **Diskusi** — Buat dan baca diskusi antar peserta
5. **Pencapaian** — Level, badge, sertifikat

**Alur belajar yang disarankan:**
```
Pilih Modul → Pre-Test → Pelajaran 1-4 → Post-Test → Sertifikat
```

### 🔬 Ahli Validasi
Antarmuka **desktop** dengan sidebar navigasi:
- **Dashboard** — Ringkasan statistik dan grafik progress peserta
- **Data Peserta** — Tabel XP, level, dan skor semua peserta
- **Validasi Konten** — Ubah status konten (Draft → Review → Disetujui) + catatan
- **Moderasi Diskusi** — Balas diskusi peserta sebagai ahli
- **Umpan Balik** — Evaluasi kualitatif dari peserta (relevansi, kejelasan, penerapan)

### 📊 Peneliti
Antarmuka **desktop** untuk keperluan riset:
- **Dashboard Riset** — Statistik N-Gain, Gantt chart timeline penelitian
- **Log Data Mentah** — Tabel lengkap semua data peserta
- **Analisis N-Gain** — Hitung gain per modul dan per peserta (formula Hake, 1998)
- **Efektivitas** — Indikator perubahan perilaku, engagement, distribusi level
- **Ekspor Data** — Unduh data sebagai **CSV** (Excel/SPSS) atau **JSON** (Python/R)

### ⚙️ Administrator
- **Ringkasan Sistem** — Status layanan, distribusi pengguna
- **Manajemen Pengguna** — Tabel semua akun + undangan peserta
- **Manajemen Modul** — Tambah/edit modul baru, aktifkan/nonaktifkan, simpan ke localStorage
- **Pengaturan Platform** — Toggle fitur (gamifikasi, diskusi, AI tutor, dll), magic link kohort
- **Konfigurasi AI** — Pilih model Claude (Sonnet/Haiku/Opus) + edit system prompt

---

## 📦 Modul Pembelajaran

| # | Judul | Status | Pelajaran | Waktu |
|---|---|---|---|---|
| 1 | 🔐 Manajemen Kata Sandi | ✅ Aktif | 4 (Baca, Interaktif, Skenario, Simulasi) | 35 mnt |
| 2 | 📧 Keamanan Email | ✅ Aktif | 3 (Baca, Interaktif, Skenario) | 30 mnt |
| 3 | 🚨 Pelaporan Insiden | ✅ Aktif | 3 (Baca, Baca, Skenario) | 30 mnt |
| 4 | 💻 Keamanan Perangkat | 🔜 Segera | — | — |
| 5 | 🌐 Keamanan Internet | 🔜 Segera | — | — |
| 6 | 📱 Media Sosial | 🔜 Segera | — | — |

---

## 🚀 Cara Deploy ke Vercel

### Langkah 1 — Push ke GitHub

```bash
# Inisialisasi git (jika belum)
git init
git add .
git commit -m "feat: initial CLME platform build"

# Buat repo di GitHub, lalu:
git remote add origin https://github.com/USERNAME/clme-platform.git
git branch -M main
git push -u origin main
```

### Langkah 2 — Deploy ke Vercel

1. Buka [vercel.com](https://vercel.com) → **Sign Up** / Login dengan akun GitHub
2. Klik **"Add New Project"**
3. Pilih repo `clme-platform` dari GitHub
4. Vercel otomatis mendeteksi **Next.js** → klik **Deploy**
5. Tunggu ~2 menit → platform langsung live! 🎉

> Tidak perlu konfigurasi tambahan. Vercel gratis untuk project pribadi/riset.

### Langkah 3 — Bagikan URL ke Klien

URL akan berbentuk: `https://clme-platform.vercel.app`

Setiap kali `git push`, Vercel otomatis deploy ulang.

---

## 🛠️ Menjalankan Lokal

```bash
# Install dependensi
npm install

# Jalankan development server
npm run dev
# → Buka http://localhost:3000

# Build untuk produksi
npm run build
npm start
```

**Persyaratan:** Node.js 18+

---

## 🏗️ Teknologi

| Layer | Teknologi |
|---|---|
| Framework | Next.js 14 (App Router) |
| Bahasa | TypeScript |
| Styling | Tailwind CSS v3 |
| State | React Hooks (useState, useEffect) |
| Data | localStorage (no backend) |
| Ikon | Lucide React |
| Font | Inter (Google Fonts) |
| Deploy | Vercel |

---

## 📁 Struktur Proyek

```
clme-platform/
├── app/
│   ├── page.tsx          # Halaman login
│   ├── peserta/          # Interface peserta (mobile)
│   ├── ahli/             # Interface ahli validasi (desktop)
│   ├── peneliti/         # Interface peneliti (desktop)
│   └── admin/            # Interface administrator (desktop)
├── lib/
│   ├── auth.ts           # Autentikasi & session
│   ├── data.ts           # Data modul & diskusi
│   └── gamification.ts   # Logika XP, level, badge
├── types/
│   └── index.ts          # TypeScript types
└── tailwind.config.ts    # Design tokens (warna, animasi)
```

---

## ⚠️ Catatan Penting untuk Klien

- **Data tersimpan di localStorage browser** — Data tidak hilang saat refresh, tapi hilang jika cache browser dibersihkan. Untuk produksi penuh, perlu integrasi database (Supabase/Firebase).
- **Akun dummy** — Semua akun sudah di-hardcode untuk keperluan demo/presentasi.
- **AI Tutor** — Respons saat ini disimulasikan. Untuk integrasi Claude API nyata, diperlukan backend server.
- **Modul 4-6** — Ditandai "Segera" dan bisa diaktifkan dari panel Admin kapan saja.

---

## 📞 Kontak

Dikembangkan oleh **[Nama Developer]** untuk Program PPS PTK UPI Bandung.
Pertanyaan teknis: hubungi tim pengembang.

---

*CLME Platform — Prototype Interaktif v1.0 · 2026*
