import type { Module, Discussion } from '@/types'

export const DEFAULT_MODULES: Module[] = [
  {
    id: 'm1', title: 'Keamanan Siber untuk Guru', icon: '🌐',
    color: '#0284c7', colorLight: '#f0f9ff',
    badge: 'literasi', time: '35 mnt', dimension: 'Knowledge',
    status: 'active',
    desc: 'Memahami fondasi keamanan siber: CIA Triad, NIST CSF 2.0, dan lanskap ancaman yang dihadapi pendidik Indonesia.',
    objective: 'Menjelaskan CIA Triad, memahami 6 fungsi NIST CSF 2.0, dan mengidentifikasi 5 jenis ancaman siber utama di lingkungan sekolah.',
    facilitatorNote: 'Mulai dengan pertanyaan: "Data apa saja yang tersimpan di sekolah ini yang berharga bagi peretas?" Gambar CIA Triad di papan tulis dengan contoh nyata dari sekolah. Hubungkan NIST CSF dengan rutinitas kerja guru sehari-hari.',
    lessons: [
      {
        id: 'm1l1', title: 'Fondasi Keamanan Siber: CIA Triad', type: 'reading', emoji: '🛡️', typeLabel: 'Membaca', dur: '6 mnt', xp: 50,
        content: { sections: [
          { type: 'intro', text: 'Keamanan siber bukan sekadar antivirus. Ini tentang melindungi tiga hal fundamental: <strong>Confidentiality, Integrity, dan Availability</strong> — dikenal sebagai CIA Triad, fondasi dari seluruh ilmu keamanan informasi modern.' },
          { type: 'case', title: 'CIA Triad — Tiga Pilar Keamanan', text: '<strong>C — Confidentiality (Kerahasiaan)</strong>: Hanya pihak berwenang yang dapat mengakses data. Contoh: Nilai rapor siswa hanya boleh diakses guru wali kelas dan kepala sekolah.<br><br><strong>I — Integrity (Integritas)</strong>: Data hanya dapat diubah oleh yang berwenang dan perubahan dapat dilacak. Contoh: Nilai di Dapodik tidak bisa dimodifikasi sembarang pihak.<br><br><strong>A — Availability (Ketersediaan)</strong>: Sistem dan data tersedia saat dibutuhkan. Contoh: Portal presensi guru harus bisa diakses setiap hari kerja.' },
          { type: 'case', title: 'CIA Triad di Sekolah Anda', text: 'Ambil contoh Portal Akademik Sekolah:<br>• (C) Data nilai siswa tidak bocor ke pihak lain → akun terpisah, password kuat<br>• (I) Guru tidak bisa ubah nilai siswa lain tanpa izin → audit log, akses terbatas<br>• (A) Sistem tersedia saat pembagian rapor → backup rutin, pembaruan sistem<br><br>Jika salah satu pilar dilanggar, seluruh kepercayaan pada sistem sekolah bisa runtuh.' },
          { type: 'stat', title: 'Ancaman Siber di Sektor Pendidikan Indonesia', text: '<strong>703 insiden siber</strong> tercatat di sektor pendidikan Indonesia pada 2023, meningkat <strong>45%</strong> dari tahun sebelumnya (BSSN 2023). Sekolah jadi target favorit karena menyimpan data pribadi ribuan siswa dan guru dengan anggaran keamanan yang sangat terbatas.' },
          { type: 'warning', title: 'Mengapa Guru Adalah Target Bernilai Tinggi', text: 'Sebagai guru, Anda memiliki akses ke: data pribadi siswa (nama, NISN, KK), data keuangan BOS, sistem Dapodik dan portal Kemendikbud, serta grup WA orang tua-guru.<br><br>Satu akun guru yang diretas memberikan akses ke semua sistem ini sekaligus.' },
          { type: 'tip', title: 'Tiga Langkah Pertama Menuju Keamanan', text: '① <strong>Update</strong>: Aktifkan pembaruan otomatis di semua perangkat kerja<br>② <strong>MFA</strong>: Aktifkan Multi-Factor Authentication di email, Dapodik, dan akun penting lain<br>③ <strong>Password Unik</strong>: Satu kata sandi kuat yang berbeda untuk setiap akun penting' },
        ]}
      },
      {
        id: 'm1l2', title: 'NIST CSF 2.0: Kerangka Keamanan untuk Sekolah', type: 'reading', emoji: '📋', typeLabel: 'Membaca', dur: '7 mnt', xp: 75,
        content: { sections: [
          { type: 'intro', text: 'NIST Cybersecurity Framework 2.0 (dirilis Februari 2024) adalah panduan keamanan siber paling banyak diadopsi di dunia — digunakan lebih dari <strong>50 negara</strong> termasuk Indonesia melalui BSSN. Lembaga pendidikan pun dianjurkan menggunakannya.' },
          { type: 'case', title: '6 Fungsi NIST CSF 2.0', text: '🏛️ <strong>GOVERN</strong> — Fondasi kebijakan: Siapa bertanggung jawab atas apa? Ada kebijakan keamanan data?<br>🔍 <strong>IDENTIFY</strong> — Kenali aset: Data apa saja yang dimiliki sekolah? Di mana tersimpan?<br>🛡️ <strong>PROTECT</strong> — Kendalikan akses: Password kuat, MFA, backup rutin, pelatihan staf<br>📡 <strong>DETECT</strong> — Pantau anomali: Login tidak wajar di tengah malam?<br>⚡ <strong>RESPOND</strong> — Respons insiden: Ada SOP jika terjadi kebocoran data?<br>🔄 <strong>RECOVER</strong> — Pulihkan & belajar: Setelah insiden, bagaimana memulihkan layanan?' },
          { type: 'stat', title: 'Bukti Efektivitas NIST CSF', text: 'Sekolah yang menerapkan NIST CSF mengalami penurunan insiden siber <strong>61%</strong> dalam 2 tahun pertama (CISA Education Security Report 2023). Fungsi GOVERN adalah yang paling sering diabaikan namun paling krusial.' },
          { type: 'case', title: 'Self-Assessment NIST CSF untuk Guru', text: 'Evaluasi kondisi sekolah Anda:<br>• GOVERN: Apakah ada kebijakan tertulis soal data siswa?<br>• IDENTIFY: Tahukah Anda di mana saja data siswa disimpan?<br>• PROTECT: Apakah semua akun punya password kuat + MFA?<br>• DETECT: Bagaimana Anda tahu jika ada yang tidak beres?<br>• RESPOND: Ada prosedur jika data bocor? Siapa yang dihubungi?<br>• RECOVER: Ada backup data penting yang diuji secara berkala?' },
          { type: 'tip', title: 'NIST CSF Bukan Hanya untuk IT', text: 'Keamanan adalah tanggung jawab semua orang:<br>• Guru: mengelola data siswa dengan aman (PROTECT)<br>• Kepala sekolah: menetapkan kebijakan (GOVERN)<br>• Staf TU: menjaga data keuangan (PROTECT)<br>• IT sekolah: mengelola infrastruktur teknis (DETECT + RESPOND)<br><br>Literasi siber Anda adalah implementasi PROTECT yang paling efektif.' },
        ]}
      },
      {
        id: 'm1l3', title: 'Lanskap Ancaman: 5 Serangan Utama di Sekolah', type: 'reading', emoji: '⚠️', typeLabel: 'Membaca', dur: '7 mnt', xp: 75,
        content: { sections: [
          { type: 'intro', text: 'Mengenal jenis ancaman adalah langkah pertama dalam pertahanan. Berikut 5 jenis serangan siber yang paling sering mengincar lingkungan pendidikan Indonesia dan cara menghadapinya.' },
          { type: 'case', title: 'Ancaman #1: Phishing & Social Engineering', text: 'Manipulasi psikologis untuk mencuri kredensial. Di sekolah muncul sebagai: email dari "Kemendikbud" minta verifikasi Dapodik, WA dari "Tim BRI" minta OTP, tautan "login SiPeg" ke situs palsu.<br><br><strong>94% malware</strong> dikirim via email. Phishing adalah gerbang masuk hampir semua serangan siber lainnya.' },
          { type: 'case', title: 'Ancaman #2: Ransomware', text: 'Malware yang mengenkripsi semua file dan meminta tebusan. Institusi pendidikan adalah target favorit karena sering punya backup buruk, tekanan tinggi untuk segera pulihkan layanan (rapor, ujian), dan tersedia dana untuk membayar.<br><br>Kasus WannaCry 2017 menyerang ribuan institusi di Indonesia.' },
          { type: 'case', title: 'Ancaman #3 & #4: Data Breach & Account Takeover', text: '<strong>Data breach</strong> terjadi karena: password lemah/dibagi-pakai, mengirim file Excel nilai ke grup WA yang salah, tidak ada enkripsi pada file berisi data siswa.<br><br><strong>Account takeover</strong>: Peretas mengambil alih akun Anda via credential stuffing (mencoba kombinasi email/password yang bocor dari situs lain) atau phishing yang berhasil.' },
          { type: 'warning', title: 'Ancaman #5: Insider Threat & Oversharing', text: 'Ancaman dari dalam — sering tidak disengaja:<br>❌ Memposting foto kelas yang terlihat nilai/absensi → pelanggaran UU PDP<br>❌ Menggunakan perangkat pribadi tidak aman untuk akses Dapodik<br>❌ Berbagi password dengan kolega "untuk memudahkan"<br>❌ Tidak mengunci komputer saat meninggalkan ruangan<br><br>Ini masalah literasi dan kebiasaan digital — bukan teknis.' },
          { type: 'tip', title: 'Postur Keamanan Dasar', text: 'Tiga hal yang langsung bisa dilakukan hari ini:<br>① Cek apakah semua akun penting sudah aktifkan MFA<br>② Pastikan tidak ada akun dengan password sama atau terlalu sederhana<br>③ Periksa pengaturan privasi akun medsos dan perangkat Anda' },
        ]}
      },
      {
        id: 'm1l4', title: 'Skenario: Hari Pertama Serangan', type: 'scenario', emoji: '🎭', typeLabel: 'Skenario', dur: '8 mnt', xp: 100,
        content: {
          setup: 'Senin pagi, Anda menerima email dari "BSSN-Indonesia <keamanan@bssn-gov.net>": "Yth. Bapak/Ibu Guru, sistem kami mendeteksi percobaan akses tidak sah ke akun Dapodik Anda dari lokasi asing. Untuk mengamankan akun, mohon verifikasi identitas di: bssn-verif-akun.com/guru2026. Waktu tersisa: 2 jam."',
          question: 'Apa respons Anda yang PALING TEPAT berdasarkan prinsip keamanan siber?',
          choices: [
            { id: 'a', text: 'Klik tautan segera dan verifikasi karena ini dari BSSN yang otoritatif', correct: false, fb: 'Ini phishing! BSSN menggunakan domain resmi bssn.go.id — bukan ".gov.net". Domain palsu ini dibuat untuk terlihat mirip. Tekanan waktu 2 jam adalah taktik social engineering klasik.' },
            { id: 'b', text: 'Abaikan email, akses Dapodik langsung dari browser, periksa aktivitas login, dan laporkan email ke IT sekolah', correct: true, fb: 'Respons sempurna! Domain pemerintah Indonesia SELALU .go.id — bukan .net, .com, atau .gov.net. Ini adalah phishing. Akses sistem resmi langsung dari browser — jangan pernah dari link di email/WA.' },
            { id: 'c', text: 'Balas email untuk memverifikasi apakah ini memang pesan resmi dari BSSN', correct: false, fb: 'Membalas phishing mengkonfirmasi akun email Anda aktif — Anda bisa jadi target lebih lanjut. Penipu juga bisa memalsukan "bukti" meyakinkan via balasan. Prinsip: jangan engage — akses sistem resmi secara independen.' },
          ],
        }
      }
    ],
    pretest: { id: 'm1pre', questions: [
      { id: 'q1', text: 'Huruf "C" dalam CIA Triad mengacu pada...', opts: [{ id: 'a', text: 'Cybersecurity — keamanan dari ancaman digital' }, { id: 'b', text: 'Confidentiality — hanya yang berwenang bisa mengakses data', correct: true }, { id: 'c', text: 'Control — mengontrol semua akses masuk sistem' }, { id: 'd', text: 'Compliance — kepatuhan terhadap regulasi' }], explain: 'CIA Triad: Confidentiality (kerahasiaan), Integrity (integritas), Availability (ketersediaan). Ketiganya adalah pilar utama keamanan informasi.' },
      { id: 'q2', text: 'Sekolah adalah target serangan siber yang menarik karena...', opts: [{ id: 'a', text: 'Memiliki koneksi internet yang cepat' }, { id: 'b', text: 'Menyimpan data pribadi banyak orang dengan anggaran keamanan yang terbatas', correct: true }, { id: 'c', text: 'Menggunakan sistem komputer yang canggih' }, { id: 'd', text: 'Banyak guru yang paham teknologi' }], explain: 'Kombinasi data sensitif banyak (data siswa, keuangan) dengan anggaran keamanan terbatas membuat sekolah jadi target mudah sekaligus menggiurkan.' },
      { id: 'q3', text: 'NIST CSF 2.0 menambahkan fungsi baru yaitu...', opts: [{ id: 'a', text: 'Audit — pemeriksaan berkala sistem keamanan' }, { id: 'b', text: 'Govern — tata kelola, kebijakan, dan peran tanggung jawab', correct: true }, { id: 'c', text: 'Guard — penjagaan akses fisik ke sistem' }, { id: 'd', text: 'Generate — pembuatan sistem keamanan baru' }], explain: 'NIST CSF 2.0 (2024) menambahkan GOVERN sebagai fungsi ke-6 yang menjadi fondasi kebijakan dan peran tanggung jawab.' },
      { id: 'q4', text: 'Apa yang dimaksud "Availability" dalam CIA Triad?', opts: [{ id: 'a', text: 'Ketersediaan laporan keamanan kepada publik' }, { id: 'b', text: 'Sistem dan data tersedia dan dapat diakses saat dibutuhkan oleh yang berhak', correct: true }, { id: 'c', text: 'Ketersediaan perangkat lunak antivirus di komputer' }, { id: 'd', text: 'Tersedianya pelatihan keamanan untuk staf' }], explain: 'Availability berarti sistem dan data bisa diakses saat dibutuhkan. Serangan ransomware yang mengunci file mengancam Availability.' },
      { id: 'q5', text: 'Serangan siber mana yang PALING umum mengancam sekolah di Indonesia?', opts: [{ id: 'a', text: 'DDoS (mengganggu akses website)' }, { id: 'b', text: 'Zero-day exploit (eksploitasi celah baru)' }, { id: 'c', text: 'Phishing (manipulasi untuk mencuri kredensial)', correct: true }, { id: 'd', text: 'SQL injection (menyerang database)' }], explain: '94% serangan siber dimulai dari phishing — paling umum karena tidak butuh keahlian teknis tinggi, cukup email/WA yang meyakinkan.' },
    ]},
    posttest: { id: 'm1post', questions: [
      { id: 'q1', text: 'Data nilai siswa yang bocor ke publik merupakan pelanggaran aspek CIA Triad yang mana?', opts: [{ id: 'a', text: 'Integrity — data telah diubah tanpa izin' }, { id: 'b', text: 'Availability — data tidak bisa diakses guru' }, { id: 'c', text: 'Confidentiality — data diakses oleh yang tidak berwenang', correct: true }, { id: 'd', text: 'Tidak ada pelanggaran CIA Triad karena data masih utuh' }], explain: 'Kebocoran data adalah pelanggaran Confidentiality — pihak tidak berwenang mengakses data rahasia.' },
      { id: 'q2', text: 'Guru memperbarui password Dapodik dan mengaktifkan 2FA. Ini adalah implementasi fungsi NIST CSF yang mana?', opts: [{ id: 'a', text: 'IDENTIFY — mengidentifikasi risiko' }, { id: 'b', text: 'PROTECT — menerapkan perlindungan akses', correct: true }, { id: 'c', text: 'DETECT — mendeteksi ancaman' }, { id: 'd', text: 'RESPOND — merespons insiden' }], explain: 'Manajemen akses (password kuat, MFA) adalah implementasi fungsi PROTECT — langkah proaktif mencegah akses tidak sah.' },
      { id: 'q3', text: 'Email dari "keamanan@bssn-gov.net" meminta verifikasi akun Dapodik. Analisis singkatnya?', opts: [{ id: 'a', text: 'Berpotensi melanggar Availability jika tidak diverifikasi' }, { id: 'b', text: 'Email resmi BSSN bisa menggunakan domain .gov.net' }, { id: 'c', text: 'Indikasi phishing — domain resmi BSSN adalah bssn.go.id, bukan .gov.net', correct: true }, { id: 'd', text: 'Perlu diverifikasi untuk memastikan Integrity sistem' }], explain: 'Domain resmi pemerintah Indonesia selalu .go.id. ".gov.net" adalah domain palsu untuk phishing.' },
      { id: 'q4', text: 'Sekolah kehilangan akses sistem presensi 3 hari akibat ransomware. Pilar CIA Triad mana yang paling langsung dilanggar?', opts: [{ id: 'a', text: 'Confidentiality — data rahasia terekspos' }, { id: 'b', text: 'Integrity — data dimodifikasi tanpa izin' }, { id: 'c', text: 'Availability — sistem tidak bisa diakses saat dibutuhkan', correct: true }, { id: 'd', text: 'Ketiga pilar dilanggar secara bersamaan' }], explain: 'Ketidakmampuan mengakses sistem adalah pelanggaran Availability. Ransomware menghentikan akses sistem yang dibutuhkan.' },
      { id: 'q5', text: 'Sekolah hendak menerapkan NIST CSF 2.0. Fungsi mana yang HARUS dikerjakan pertama?', opts: [{ id: 'a', text: 'PROTECT — langsung pasang antivirus dan aktifkan MFA' }, { id: 'b', text: 'DETECT — pasang sistem monitoring jaringan' }, { id: 'c', text: 'GOVERN — tetapkan kebijakan dan peran tanggung jawab terlebih dahulu', correct: true }, { id: 'd', text: 'IDENTIFY — audit semua aset digital dulu' }], explain: 'NIST CSF 2.0 menempatkan GOVERN sebagai fondasi — tanpa kebijakan yang jelas, seluruh upaya teknis tidak akan efektif.' },
    ]}
  },
  {
    id: 'm2', title: 'Keamanan Password dan Email', icon: '🔐',
    color: '#0c8568', colorLight: '#f0fdf8',
    badge: 'guardian', time: '40 mnt', dimension: 'Knowledge + Behaviour',
    status: 'active',
    desc: 'Menguasai pembuatan kata sandi kuat, manajemen password, dan deteksi ancaman phishing email.',
    objective: 'Membuat kata sandi kuat menggunakan prinsip NIST, menggunakan password manager, dan mengidentifikasi serta merespons serangan phishing email.',
    facilitatorNote: 'Mulai sesi dengan tanya: "Siapa yang pakai kata sandi sama di > 1 akun?" Tunjukkan statistik 81% pelanggaran data terkait password lemah. Minta peserta buat passphrase sendiri. Demo cara hover mouse di atas link untuk melihat URL tujuan di status bar browser.',
    lessons: [
      {
        id: 'm2l1', title: 'Kenapa Kata Sandi Penting?', type: 'reading', emoji: '📖', typeLabel: 'Membaca', dur: '5 mnt', xp: 50,
        content: { sections: [
          { type: 'intro', text: 'Bayangkan sekolah Anda mengalami kebocoran data. Nilai ratusan siswa, data personal guru, rekap keuangan — semuanya bocor ke publik. Bagaimana ini bisa terjadi?' },
          { type: 'case', title: 'Kasus Nyata — SMP Nusantara 2022', text: 'Portal akademik sekolah diakses orang tak dikenal karena kata sandi admin masih "admin123". Data 847 siswa dan 43 guru terekspos selama 3 hari sebelum terdeteksi.' },
          { type: 'stat', title: 'Fakta NIST SP 800-63B', text: '<strong>81%</strong> pelanggaran data melibatkan kata sandi lemah atau dicuri. Di sekolah, satu akun terkompromi bisa memberikan akses ke seluruh sistem — nilai, data siswa, dan dokumen finansial.' },
          { type: 'warning', title: 'Bahaya Password Reuse', text: 'Jika akun email pribadi Anda bocor dan Anda memakai kata sandi yang sama untuk Dapodik, maka data sekolah juga terancam. Satu kebocoran bisa menyebar ke semua akun.' },
          { type: 'tip', title: 'Solusi: Password Manager', text: 'Aplikasi seperti <strong>Bitwarden</strong> (gratis, open source) menyimpan semua kata sandi terenkripsi. Anda hanya perlu mengingat <em>satu</em> kata sandi utama yang kuat.' },
        ]}
      },
      {
        id: 'm2l2', title: 'Anatomi Kata Sandi Kuat', type: 'interactive', emoji: '🛠️', typeLabel: 'Interaktif', dur: '7 mnt', xp: 75,
        content: {
          intro: 'Menurut <strong>NIST SP 800-63B</strong>, panjang lebih penting dari kompleksitas. "kuda-berlari-di-pantai!" lebih kuat dari "P@$$w0rd1".',
          items: [
            { pw: 'admin123',             label: 'Sangat Lemah', bar: 10,  time: '< 1 detik',          color: '#ef4444' },
            { pw: 'Sari2024!',            label: 'Lemah',        bar: 25,  time: '~3 menit',            color: '#f97316' },
            { pw: 'P@$$w0rd1!',           label: 'Cukup',        bar: 50,  time: '~2 jam',              color: '#eab308' },
            { pw: 'kuda-merah-kopi',      label: 'Kuat',         bar: 80,  time: '~50 juta tahun',      color: '#22c55e' },
            { pw: 'guru-IPA-suka-8-buah', label: 'Sangat Kuat',  bar: 100, time: '> 1 miliar tahun',    color: '#0c8568' },
          ],
          tips: ['Gunakan minimal <strong>12 karakter</strong>', 'Frasa sandi (passphrase) lebih kuat dan mudah diingat', 'Jangan gunakan nama, tanggal lahir, atau kata kamus', 'Buat kata sandi <strong>berbeda</strong> untuk setiap akun', 'Aktifkan <strong>MFA/2FA</strong> di semua akun penting'],
        }
      },
      {
        id: 'm2l3', title: 'Keamanan Email: Kenali dan Hindari Phishing', type: 'reading', emoji: '📧', typeLabel: 'Membaca', dur: '8 mnt', xp: 75,
        content: { sections: [
          { type: 'intro', text: 'Email adalah vektor serangan #1 dalam kejahatan siber. <strong>94% malware</strong> dikirimkan melalui email (Verizon DBIR 2023). Bagi guru, email dinas adalah pintu masuk ke seluruh sistem sekolah.' },
          { type: 'warning', title: 'Tanda Bahaya Email — 6 Indikator', text: '① Domain pengirim tidak sesuai (ketik manual di browser untuk verifikasi)<br>② Tekanan waktu dan urgency yang tidak wajar: "verifikasi dalam 24 jam!"<br>③ Permintaan informasi sensitif: password, OTP, data pribadi<br>④ Link yang tidak sesuai teks (hover untuk melihat URL asli)<br>⑤ Lampiran mencurigakan (.exe, .zip dari pengirim asing)<br>⑥ Salam generik: "Kepada Pengguna" bukan nama Anda' },
          { type: 'case', title: 'Membaca Domain Email dengan Benar', text: '<strong>Legitimate</strong>: noreply@sipeg.kemdikbud.go.id — domain resmi pemerintah .go.id ✓<br><strong>Palsu</strong>: noreply@kemdikbud-sipeg.net — domain .net bisa didaftarkan siapa saja ✗<br><br>Nama tampilan bisa dipalsukan. Selalu periksa alamat email sebenarnya dalam tanda &lt;&gt;. Hover mouse di atas link untuk melihat URL tujuan sebelum klik.' },
          { type: 'case', title: 'Tipe Serangan Email', text: '<strong>Phishing</strong>: Email massal ke banyak target dengan pesan generik.<br><strong>Spear Phishing</strong>: Ditargetkan ke individu spesifik menggunakan data personal — nama, jabatan, sekolah Anda — untuk terlihat lebih meyakinkan.<br><strong>BEC</strong> (Business Email Compromise): Penyerang pura-pura jadi atasan untuk minta transfer dana atau akses sistem.' },
          { type: 'tip', title: 'Sudah Klik Tautan Phishing? Langkah Darurat', text: 'Jangan panik — bertindak cepat:<br>① <strong>Segera ganti password</strong> akun yang mungkin terkompromi dari browser/perangkat baru<br>② <strong>Aktifkan MFA</strong> jika belum aktif<br>③ <strong>Hubungi IT sekolah</strong> — informasikan kejadian dan minta periksa log akses<br>④ <strong>Dokumentasikan</strong>: screenshot email phishing untuk keperluan laporan' },
        ]}
      },
      {
        id: 'm2l4', title: 'Simulasi: Deteksi Phishing', type: 'simulation', emoji: '⚡', typeLabel: 'Simulasi', dur: '10 mnt', xp: 100,
        content: {
          instruction: 'Analisis setiap pesan berikut. Tentukan: Aman atau Phishing? Perhatikan detail setiap elemen.',
          scenarios: [
            {
              id: 's1', verdict: 'phishing',
              msg: { from: 'Kemendikbud-Ristek <admin@kemendikbud-portal.com>', subj: 'URGENT — Verifikasi Akun Dapodik Sebelum 24 Jam', body: 'Sistem kami mendeteksi aktivitas tidak biasa pada akun Dapodik Anda. Akun akan DINONAKTIFKAN dalam 24 jam jika tidak diverifikasi.\n\nKlik tautan berikut dan masukkan username dan password Dapodik Anda:\n\nhttp://kemendikbud-portal.com/verifikasi-akun\n\nTim Keamanan Sistem Dapodik' },
              flags: ['Domain palsu: kemendikbud-portal.com ≠ kemdikbud.go.id', 'Tekanan waktu artifisial: "24 jam"', 'Permintaan password via email (sistem resmi tidak pernah meminta ini)'],
              explain: 'Domain "kemendikbud-portal.com" BUKAN situs resmi pemerintah. Domain pemerintah selalu berakhiran .go.id. Tekanan waktu dan permintaan password adalah tanda phishing klasik.'
            },
            {
              id: 's2', verdict: 'phishing',
              msg: { from: '+62-821-5567-1234 (nomor tidak dikenal)', subj: 'WhatsApp · Pesan masuk', body: 'Halo Bapak/Ibu Guru. Ini Tim IT Dapodik Kemendikbud. Akun Anda terdeteksi login dari lokasi asing (Cina).\n\nVerifikasi segera di:\nbit.ly/dapodik-verif-2026\n\nJika tidak diverifikasi dalam 2 jam, akun diblokir permanen.\n-Tim Kemdikbud' },
              flags: ['Nomor tidak dikenal — bukan nomor resmi Kemendikbud', 'URL dipersingkat bit.ly menyembunyikan tujuan asli', 'Tekanan waktu 2 jam + ancaman "blokir permanen"'],
              explain: 'Tim Dapodik resmi tidak menghubungi via WhatsApp dari nomor pribadi. URL yang disingkat menyembunyikan situs berbahaya. Ini adalah smishing (SMS/WA phishing).'
            },
            {
              id: 's3', verdict: 'phishing',
              msg: { from: 'Sistem SiPeg Resmi <noreply@kemdikbud-sipeg.net>', subj: 'Pembaruan SiPeg 2026 — Konfirmasi Identitas Diperlukan', body: 'Kepada Yth. Sari Rahayu, S.Pd.\n\nDalam rangka pembaruan sistem SiPeg 2026, kami memerlukan konfirmasi identitas seluruh ASN. Harap selesaikan sebelum Jumat, 31 Juli 2026.\n\nJika tidak, tunjangan kinerja bulan berikutnya mungkin tertunda.' },
              flags: ['Domain: kemdikbud-sipeg.net ≠ sipeg.kemdikbud.go.id', 'Menggunakan nama Anda — data dari kebocoran sebelumnya (spear phishing)', 'Ancaman finansial: "tunjangan kinerja tertunda"'],
              explain: 'Meskipun menyebut nama Anda, domain ".net" BUKAN situs pemerintah. Spear phishing menggunakan data personal untuk terlihat lebih meyakinkan.'
            }
          ]
        }
      }
    ],
    pretest: { id: 'm2pre', questions: [
      { id: 'q1', text: 'Manakah yang paling tepat menggambarkan kata sandi yang kuat?', opts: [{ id: 'a', text: 'Nama dan tanggal lahir agar mudah diingat' }, { id: 'b', text: 'Kata pendek dengan karakter unik: P@$$!' }, { id: 'c', text: 'Frasa panjang: "kucing-tidur-di-atap-merah"', correct: true }, { id: 'd', text: 'Kata sandi yang sama di semua akun agar tidak lupa' }], explain: 'Frasa sandi panjang lebih kuat karena panjang adalah faktor utama keamanan, bukan kerumitan (NIST SP 800-63B).' },
      { id: 'q2', text: 'Anda menerima email dari "admin-dapodik@gmail.com" yang meminta verifikasi akun dalam 24 jam. Apa yang dilakukan?', opts: [{ id: 'a', text: 'Klik tautan dan masukkan username/password Dapodik' }, { id: 'b', text: 'Balas email untuk konfirmasi pengirim' }, { id: 'c', text: 'Hapus email, akses Dapodik langsung dari browser', correct: true }, { id: 'd', text: 'Teruskan ke rekan guru untuk pendapat kedua' }], explain: 'Selalu akses sistem secara langsung dari browser, jangan via tautan dalam email/WA.' },
      { id: 'q3', text: 'Kondisi mana yang PALING membahayakan keamanan digital sekolah?', opts: [{ id: 'a', text: 'Guru menggunakan HP pribadi untuk akses portal sekolah' }, { id: 'b', text: 'Semua guru menggunakan satu kata sandi bersama untuk absensi', correct: true }, { id: 'c', text: 'Guru akses email sekolah dari WiFi kantin' }, { id: 'd', text: 'Komputer guru tidak memiliki antivirus terbaru' }], explain: 'Password bersama menghilangkan akuntabilitas dan membuat seluruh sistem rentan jika satu orang menjadi target.' },
      { id: 'q4', text: 'Apa yang dimaksud dengan spear phishing?', opts: [{ id: 'a', text: 'Phishing via aplikasi media sosial' }, { id: 'b', text: 'Phishing bertarget yang menggunakan data personal korban', correct: true }, { id: 'c', text: 'Phishing melalui pesan SMS' }, { id: 'd', text: 'Phishing menggunakan lampiran berisi virus' }], explain: 'Spear phishing menggunakan informasi personal (nama, jabatan, sekolah) untuk membuat email terlihat lebih meyakinkan.' },
      { id: 'q5', text: 'Mana pernyataan BENAR tentang HTTPS?', opts: [{ id: 'a', text: 'HTTPS menjamin situs tersebut aman dan tidak berbahaya' }, { id: 'b', text: 'HTTPS hanya untuk situs perbankan' }, { id: 'c', text: 'HTTPS berarti koneksi terenkripsi, tapi tidak menjamin situs aman', correct: true }, { id: 'd', text: 'Situs tanpa HTTPS pasti phishing' }], explain: 'Situs phishing pun bisa menggunakan HTTPS. Gembok hanya menjamin enkripsi data, bukan keamanan konten situs.' },
    ]},
    posttest: { id: 'm2post', questions: [
      { id: 'q1', text: 'Anda ingin membuat kata sandi untuk akun Dapodik. Manakah yang paling aman?', opts: [{ id: 'a', text: 'Sari_1234!' }, { id: 'b', text: 'guru-IPA-suka-kopi-hijau', correct: true }, { id: 'c', text: 'P@ssw0rd2024' }, { id: 'd', text: 'SMPN1Bandung2024' }], explain: 'Passphrase panjang lebih kuat dari kata sandi pendek yang "rumit". Panjang mengalahkan kompleksitas.' },
      { id: 'q2', text: 'Keuntungan utama menggunakan password manager seperti Bitwarden?', opts: [{ id: 'a', text: 'Kata sandi tidak perlu diganti karena sudah tersimpan aman' }, { id: 'b', text: 'Setiap akun punya kata sandi unik kuat tanpa perlu diingat semua', correct: true }, { id: 'c', text: 'Kata sandi disimpan di server yang bisa diakses semua guru' }, { id: 'd', text: 'Menghapus kebutuhan untuk verifikasi dua langkah' }], explain: 'Password manager memungkinkan setiap akun punya kata sandi unik yang kuat, hanya perlu mengingat satu master password.' },
      { id: 'q3', text: 'Email dari "Kepala Dinas <kadis@dinas-pendidikan-bdg.com>". Apa yang perlu diperiksa pertama?', opts: [{ id: 'a', text: 'Apakah isi email masuk akal' }, { id: 'b', text: 'Apakah domain email sesuai dengan domain resmi dinas', correct: true }, { id: 'c', text: 'Apakah email tersebut ada lampiran' }, { id: 'd', text: 'Apakah email menggunakan bahasa formal' }], explain: 'Domain yang benar untuk instansi pemerintah harus berakhiran .go.id. ".com" sudah menjadi tanda bahaya.' },
      { id: 'q4', text: 'Setelah mengklik link phishing, urutan langkah darurat yang benar?', opts: [{ id: 'a', text: 'Scan virus → ganti password → hubungi IT → laporkan ke BSSN' }, { id: 'b', text: 'Ganti password segera → hubungi IT → dokumentasi → laporkan jika perlu', correct: true }, { id: 'c', text: 'Matikan komputer → hubungi IT → tunggu instruksi' }, { id: 'd', text: 'Hapus email → ganti password → tidak perlu laporan jika tidak ada yang aneh' }], explain: 'Prioritas utama: ganti password segera untuk menghentikan akses peretas, lalu eskalasi ke IT.' },
      { id: 'q5', text: 'Apa yang dimaksud Multi-Factor Authentication (MFA)?', opts: [{ id: 'a', text: 'Menggunakan dua kata sandi berbeda secara bergantian' }, { id: 'b', text: 'Mendaftarkan akun di dua email cadangan' }, { id: 'c', text: 'Verifikasi identitas dengan 2+ faktor: kata sandi + kode OTP', correct: true }, { id: 'd', text: 'Meminta rekan guru memverifikasi login mencurigakan' }], explain: 'MFA menggabungkan sesuatu yang Anda TAHU (password) + sesuatu yang Anda MILIKI (HP/OTP). Meski password bocor, peretas tetap tidak bisa masuk.' },
    ]}
  },
  {
    id: 'm3', title: 'Internet Safety dan Data Handling', icon: '🌐',
    color: '#1d4ed8', colorLight: '#eff6ff',
    badge: 'safesurf', time: '40 mnt', dimension: 'Knowledge + Skill + Attitude',
    status: 'active',
    desc: 'Aman saat berselancar, mengenali penipuan OTP, dan melindungi data pribadi sesuai UU PDP No. 27/2022.',
    objective: 'Membaca URL dari kanan ke kiri untuk mendeteksi phishing, menolak permintaan OTP, dan memahami kewajiban sekolah sebagai pengendali data menurut UU PDP.',
    facilitatorNote: 'Demo URL reading: tulis di papan tulis "https://kemdikbud-portal.com/login" vs "https://sipeg.kemdikbud.go.id/login" — minta peserta identifikasi yang mana resmi. Roleplay: salah satu peserta jadi penipu OTP, satu jadi korban. Diskusikan UU PDP dengan kasus "foto daftar nilai di WhatsApp grup".',
    lessons: [
      {
        id: 'm3l1', title: 'Membaca URL dengan Benar', type: 'reading', emoji: '🔗', typeLabel: 'Membaca', dur: '5 mnt', xp: 50,
        content: { sections: [
          { type: 'intro', text: 'URL adalah "alamat" sebuah halaman web. Kemampuan membaca URL dengan benar adalah keterampilan keamanan dasar yang melindungi Anda dari situs phishing. Kuncinya satu: <strong>baca dari kanan ke kiri</strong>.' },
          { type: 'case', title: 'Anatomi URL — Contoh Nyata', text: '<code>https://sipeg.kemdikbud.go.id/login</code><br>① <strong>https://</strong> — protokol terenkripsi<br>② <strong>sipeg</strong> — subdomain (bagian layanan)<br>③ <strong>kemdikbud</strong> — nama domain<br>④ <strong>.go.id</strong> — TLD: khusus pemerintah Indonesia ✓<br>⑤ <strong>/login</strong> — path halaman<br><br>Baca dari kanan: .go.id → kemdikbud → sipeg. Domain asli = "kemdikbud.go.id". Resmi!' },
          { type: 'tip', title: 'TLD Resmi Indonesia — Panduan Cepat', text: '✓ <strong>.go.id</strong> — pemerintah pusat & daerah<br>✓ <strong>.sch.id</strong> — sekolah dasar & menengah<br>✓ <strong>.ac.id</strong> — perguruan tinggi<br>✓ <strong>.or.id</strong> — organisasi non-profit<br><br>⚠️ <strong>.com, .net, .xyz, .info</strong> — bisa didaftarkan siapa saja. Situs phishing sering menggunakan TLD ini.' },
          { type: 'warning', title: 'Jebakan URL Phishing yang Sering Terjadi', text: '<strong>① Typosquatting</strong>: "kerndikbud.go.id" vs "kemdikbud.go.id" (huruf rn mirip m)<br><strong>② Domain mirip</strong>: "kemdikbud-sipeg.net" (domain aslinya .net, bukan .go.id)<br><strong>③ Subdomain menipu</strong>: "kemdikbud.go.id.verif.xyz" — domain aslinya adalah "verif.xyz"!<br><strong>④ URL dipersingkat</strong>: "bit.ly/xxx" menyembunyikan tujuan asli' },
          { type: 'stat', title: 'Statistik Berbahaya', text: '<strong>91%</strong> serangan siber dimulai dari URL yang salah diklik (Verizon DBIR 2023). Menghabiskan 3 detik untuk memeriksa URL sebelum klik bisa mencegah kejadian yang membutuhkan berhari-hari bahkan berbulan-bulan untuk pulih.' },
        ]}
      },
      {
        id: 'm3l2', title: 'Penipuan OTP: Kode Rahasia yang Harus Dijaga', type: 'scenario', emoji: '📱', typeLabel: 'Skenario', dur: '8 mnt', xp: 75,
        content: {
          setup: 'Anda menerima SMS: "Kode OTP Anda adalah 847293. Jangan bagikan ke siapapun." Beberapa detik kemudian telepon berdering, mengaku dari "Tim Keamanan BRI": "Bapak/Ibu, akun Anda terdeteksi transaksi mencurigakan. Kami butuh kode OTP yang baru Anda terima untuk memblokir transaksi tersebut."',
          question: 'Apa tindakan yang BENAR?',
          choices: [
            { id: 'a', text: 'Berikan OTP karena menyangkut keamanan rekening Anda', correct: false, fb: 'OTP adalah kunci satu kali. Bank TIDAK PERNAH meminta OTP via telepon, WA, atau SMS. Jika Anda berikan, peretas langsung mengakses akun Anda saat itu juga — tidak bisa dibatalkan.' },
            { id: 'b', text: 'Tutup telepon tanpa memberikan OTP. Hubungi bank langsung via nomor resmi di kartu ATM atau aplikasi banking Anda', correct: true, fb: 'Tepat! Bank, marketplace, dan layanan resmi TIDAK PERNAH meminta OTP melalui telepon. OTP hanya dimasukkan oleh Anda sendiri di halaman/aplikasi resmi.' },
            { id: 'c', text: 'Tanyakan nama dan nomor karyawan sebelum mempertimbangkan untuk berbagi OTP', correct: false, fb: 'Penipu bisa memberikan nama dan nomor karyawan palsu. Prinsip mutlak: OTP tidak pernah diminta siapapun lewat telepon — tanpa pengecualian.' },
          ],
        }
      },
      {
        id: 'm3l3', title: 'UU PDP No. 27/2022: Hak dan Kewajiban Kita', type: 'reading', emoji: '⚖️', typeLabel: 'Membaca', dur: '7 mnt', xp: 75,
        content: { sections: [
          { type: 'intro', text: 'Indonesia mengesahkan Undang-Undang Perlindungan Data Pribadi (UU PDP No. 27/2022) pada September 2022. Ini adalah hukum pertama Indonesia yang secara khusus mengatur data pribadi — termasuk data siswa dan guru di sekolah. Efektif berlaku penuh sejak Oktober 2024.' },
          { type: 'case', title: 'Dua Kategori Data Pribadi', text: '<strong>Data Pribadi Umum</strong>: Nama lengkap, jenis kelamin, kewarganegaraan, agama, status perkawinan, alamat<br><br><strong>Data Pribadi Khusus</strong> (perlindungan ketat):<br>Data kesehatan/medis, biometrik, data genetika, kondisi keuangan, pandangan politik, data kejahatan, <strong>data anak-anak</strong>' },
          { type: 'stat', title: 'Hak Subjek Data (Siswa, Guru, dan Orang Tua)', text: 'Setiap orang berhak:<br>① <strong>Akses</strong>: meminta salinan data pribadinya<br>② <strong>Koreksi</strong>: minta perbaikan data yang salah<br>③ <strong>Penghapusan</strong>: minta data dihapus jika tidak ada dasar hukum<br>④ <strong>Keberatan</strong>: menolak pemrosesan data dalam kondisi tertentu<br>⑤ <strong>Kompensasi</strong>: tuntut ganti rugi jika terjadi pelanggaran' },
          { type: 'warning', title: 'Kewajiban Sekolah sebagai Pengendali Data', text: 'Sekolah mengumpulkan dan memproses data siswa = Sekolah adalah <strong>Pengendali Data</strong> menurut UU PDP. Kewajiban hukum:<br>① Dapatkan persetujuan sebelum memproses data<br>② Jaga keamanan data dengan standar yang layak<br>③ <strong>Laporkan pelanggaran data ke BSSN dalam 14 hari kerja</strong><br>④ Hanya proses data sesuai tujuan yang dinyatakan saat dikumpulkan' },
          { type: 'tip', title: 'Praktik Aman Data Siswa di Sekolah', text: '✓ Jangan foto daftar nilai/absensi yang menampilkan nama siswa dan unggah ke medsos<br>✓ Kirim data siswa hanya ke email/WA resmi pejabat terkait — bukan ke grup umum<br>✓ Password-protect file Excel berisi data pribadi siswa<br>✓ Minta izin orang tua sebelum memposting foto kegiatan yang menampilkan wajah anak' },
        ]}
      },
      {
        id: 'm3l4', title: 'Skenario: Data Siswa Tersebar Tanpa Sengaja', type: 'scenario', emoji: '📊', typeLabel: 'Skenario', dur: '8 mnt', xp: 100,
        content: {
          setup: 'Anda adalah wali kelas 10A. Untuk koordinasi nilai remedial, Anda mengirim file Excel berisi: nama lengkap, NISN, nilai semester, dan catatan perilaku 35 siswa ke grup WhatsApp "Orang Tua Kelas 10A" yang beranggotakan 38 orang — termasuk beberapa nomor yang tidak Anda kenali. File langsung terunduh oleh semua anggota grup.',
          question: 'Apa yang HARUS dilakukan segera?',
          choices: [
            { id: 'a', text: 'Tidak perlu panik — nilai bukan informasi terlalu sensitif, cukup minta maaf di grup', correct: false, fb: 'Nilai, NISN, dan catatan perilaku siswa adalah data pribadi yang dilindungi UU PDP. Orang tua siswa lain tidak berhak melihat data anak lainnya. Ini bukan soal etiket — ada kewajiban hukum.' },
            { id: 'b', text: 'Hapus pesan segera, minta anggota hapus file, lapor ke kepala sekolah, dokumentasikan sebagai insiden UU PDP', correct: true, fb: 'Tepat! Meskipun file mungkin sudah terunduh, langkah cepat meminimalisir eksposur lebih lanjut. Kepala sekolah perlu tahu karena ini insiden data yang memerlukan penanganan resmi sesuai UU PDP.' },
            { id: 'c', text: 'Hapus file dari grup, lanjutkan seperti biasa — tidak perlu laporan formal', correct: false, fb: 'Menghapus saja tidak cukup karena file sudah terunduh. UU PDP mengharuskan dokumentasi dan penanganan insiden pelanggaran data.' },
          ],
        }
      },
    ],
    pretest: { id: 'm3pre', questions: [
      { id: 'q1', text: 'Bagian URL mana yang paling penting untuk diverifikasi keamanannya?', opts: [{ id: 'a', text: 'Protokol (http atau https)' }, { id: 'b', text: 'Top Level Domain — bagian paling kanan sebelum tanda /', correct: true }, { id: 'c', text: 'Subdomain di bagian paling kiri' }, { id: 'd', text: 'Path setelah tanda /' }], explain: 'TLD menentukan siapa yang mendaftarkan domain. Baca dari kanan: .go.id = pemerintah resmi. "kemdikbud-portal.com" terlihat resmi tapi TLD-nya .com — bisa didaftarkan siapa saja.' },
      { id: 'q2', text: 'OTP yang diterima via SMS sebaiknya...', opts: [{ id: 'a', text: 'Diberikan kepada petugas bank yang menelepon untuk verifikasi' }, { id: 'b', text: 'Dibagikan ke helpdesk aplikasi jika diminta untuk pemulihan akun' }, { id: 'c', text: 'Hanya dimasukkan oleh Anda sendiri di aplikasi/situs resmi yang Anda akses', correct: true }, { id: 'd', text: 'Disimpan dulu, baru dimasukkan setelah konfirmasi dari penelepon' }], explain: 'OTP adalah kunci satu kali. Tidak ada pihak manapun — bank, Shopee, Tokopedia — yang berhak meminta OTP Anda.' },
      { id: 'q3', text: 'Data kesehatan siswa menurut UU PDP termasuk kategori...', opts: [{ id: 'a', text: 'Data publik — boleh diakses semua guru' }, { id: 'b', text: 'Data umum — perlu persetujuan standar' }, { id: 'c', text: 'Data khusus — memerlukan perlindungan tertinggi', correct: true }, { id: 'd', text: 'Data administratif — milik institusi sekolah' }], explain: 'Data kesehatan termasuk kategori data khusus yang memerlukan perlindungan ekstra dalam UU PDP.' },
      { id: 'q4', text: 'URL "https://login.kemdikbud.go.id.akun-verif.site/masuk" — domain aslinya adalah...', opts: [{ id: 'a', text: 'kemdikbud.go.id' }, { id: 'b', text: 'akun-verif.site', correct: true }, { id: 'c', text: 'login.kemdikbud.go.id' }, { id: 'd', text: 'kemdikbud.go.id.akun-verif.site' }], explain: 'Baca dari kanan: domain asli adalah "akun-verif.site". "kemdikbud.go.id" hanya subdomain yang ditambahkan untuk menipu.' },
      { id: 'q5', text: 'Dalam berapa hari kerja sekolah wajib melaporkan pelanggaran data ke BSSN?', opts: [{ id: 'a', text: '7 hari kerja' }, { id: 'b', text: '14 hari kerja', correct: true }, { id: 'c', text: '30 hari kerja' }, { id: 'd', text: 'Tidak ada kewajiban waktu' }], explain: 'UU PDP No. 27/2022 mewajibkan pelaporan pelanggaran data ke BSSN dalam 14 hari kerja sejak pelanggaran terdeteksi.' },
    ]},
    posttest: { id: 'm3post', questions: [
      { id: 'q1', text: 'URL "https://kemdikbud.go.id-login.com/sipeg" — apa yang mencurigakan?', opts: [{ id: 'a', text: 'Menggunakan protokol HTTPS' }, { id: 'b', text: 'Ada kata "login" di dalam URL' }, { id: 'c', text: 'Domain aslinya adalah "go.id-login.com" (TLD: .com), bukan "kemdikbud.go.id"', correct: true }, { id: 'd', text: 'URL terlalu panjang untuk situs resmi' }], explain: 'Baca dari kanan: .com → go.id-login → kemdikbud. Domain utamanya adalah "go.id-login.com" bukan situs pemerintah.' },
      { id: 'q2', text: 'Anda terlanjur memberikan OTP ke penipu yang mengaku dari Shopee. Langkah pertama?', opts: [{ id: 'a', text: 'Hubungi polisi dan laporkan kasus penipuan' }, { id: 'b', text: 'Login ke Shopee segera, ubah password dan aktifkan 2FA', correct: true }, { id: 'c', text: 'Tunggu dan pantau apakah ada transaksi mencurigakan' }, { id: 'd', text: 'Hubungi bank untuk bekukan semua transaksi' }], explain: 'Ganti password dan aktifkan 2FA segera untuk menghentikan akses. Setiap menit menunggu adalah waktu peretas bisa transaksi.' },
      { id: 'q3', text: 'Guru mengirim foto daftar absensi (nama lengkap + keterangan tidak hadir) ke grup WA orang tua. Ini bermasalah karena...', opts: [{ id: 'a', text: 'Tidak apa-apa — orang tua berhak tahu kehadiran anak mereka' }, { id: 'b', text: 'Melanggar UU PDP karena data absensi siswa lain terekspos ke orang tua yang tidak berhak', correct: true }, { id: 'c', text: 'Hanya masalah etiket, bukan pelanggaran hukum' }, { id: 'd', text: 'Bermasalah hanya jika data tersebut disalahgunakan' }], explain: 'Setiap orang tua hanya berhak atas data anaknya sendiri. Mengirim data semua siswa ke grup melanggar UU PDP.' },
      { id: 'q4', text: 'Apa yang dimaksud "prinsip minimisasi data" dalam UU PDP?', opts: [{ id: 'a', text: 'Batasan ukuran file yang boleh disimpan di server sekolah' }, { id: 'b', text: 'Hanya mengumpulkan data yang benar-benar diperlukan untuk tujuan yang dinyatakan', correct: true }, { id: 'c', text: 'Meminimalkan jumlah orang yang bisa mengakses data' }, { id: 'd', text: 'Menyimpan data dalam format yang lebih kecil' }], explain: 'Minimisasi data berarti tidak mengumpulkan lebih dari yang diperlukan untuk keperluan spesifik.' },
      { id: 'q5', text: 'Mana pernyataan BENAR tentang HTTPS?', opts: [{ id: 'a', text: 'HTTPS menjamin situs tersebut aman dan tidak bisa memalsukan diri' }, { id: 'b', text: 'HTTPS mengenkripsi koneksi, tapi tidak menjamin keamanan atau keaslian situs', correct: true }, { id: 'c', text: 'Situs tanpa HTTPS pasti berbahaya' }, { id: 'd', text: 'HTTPS hanya tersedia untuk situs pemerintah' }], explain: 'Situs phishing pun bisa menggunakan HTTPS. Gembok hanya menjamin enkripsi — domain tetap harus diverifikasi.' },
    ]}
  },
  {
    id: 'm4', title: 'Social Media & Mobile Security', icon: '📱',
    color: '#7c3aed', colorLight: '#f5f3ff',
    badge: 'socialsafe', time: '35 mnt', dimension: 'Knowledge + Attitude',
    status: 'active',
    desc: 'Mengonfigurasi privasi Instagram & WhatsApp, mengamankan perangkat mobile, dan mengenali risiko di media sosial.',
    objective: 'Mengatur pengaturan privasi akun medsos secara proaktif, menerapkan keamanan dasar perangkat mobile, dan merespons insiden pembajakan akun dengan tepat.',
    facilitatorNote: 'Minta peserta membuka pengaturan privasi Instagram/WA mereka SEKARANG — live check bersama. Tanyakan: "Siapa yang foto-foto sekolah/siswa ada di akun medsos pribadi?" Diskusikan risiko berbagi lokasi real-time. Minta peserta memeriksa izin aplikasi di HP mereka.',
    lessons: [
      {
        id: 'm4l1', title: 'Mengamankan Akun Medsos: Instagram & WhatsApp', type: 'reading', emoji: '🔒', typeLabel: 'Panduan', dur: '8 mnt', xp: 50,
        content: { sections: [
          { type: 'intro', text: 'Pengaturan privasi default media sosial sering mengekspos lebih banyak informasi dari yang Anda sadari. Panduan ini memberikan langkah konkret untuk Instagram dan WhatsApp yang bisa diselesaikan dalam 15 menit.' },
          { type: 'case', title: 'Instagram — 5 Pengaturan Wajib', text: 'Settings → Privacy:<br>① <strong>Akun Pribadi (Private Account)</strong>: Aktifkan agar hanya followers disetujui yang melihat konten<br>② <strong>Activity Status</strong>: Matikan agar orang tidak tahu kapan Anda online<br>③ <strong>Komentar</strong>: Batasi ke "Followers" atau kelola kata kunci otomatis<br>④ <strong>Tag Foto</strong>: "Add Manually" — Anda approve dulu sebelum foto tag muncul di profil<br>⑤ <strong>Mentions</strong>: Batasi ke "People You Follow"' },
          { type: 'case', title: 'WhatsApp — 5 Pengaturan Wajib', text: 'Settings → Privacy:<br>① <strong>Last Seen & Online</strong>: "My Contacts" — orang asing tidak bisa lihat kapan Anda online<br>② <strong>Foto Profil</strong>: "My Contacts Only"<br>③ <strong>About</strong>: "My Contacts" atau "Nobody"<br>④ <strong>Groups</strong>: "My Contacts" — mencegah ditambahkan ke grup sembarang<br>⑤ <strong>Two-Step Verification</strong>: Settings → Account → Two-step verification → AKTIFKAN (PIN 6 digit)' },
          { type: 'stat', title: 'Two-Factor Authentication: Wajib Diaktifkan', text: 'Akun yang tidak menggunakan verifikasi dua langkah <strong>10x lebih berisiko</strong> dibajak. Aktifkan 2FA di semua platform penting: Instagram, WhatsApp, Facebook, email sekolah, Dapodik.' },
          { type: 'warning', title: 'Yang DILARANG di Media Sosial sebagai Guru', text: '❌ Jangan unggah foto yang terlihat data siswa (absensi, nilai, KK)<br>❌ Jangan umumkan lokasi real-time atau rutinitas harian<br>❌ Jangan tambahkan siswa/orang tua sebagai teman di akun pribadi<br>❌ Jangan diskusikan masalah siswa di postingan publik<br>❌ Jangan gunakan WiFi publik tanpa VPN untuk akses akun penting' },
        ]}
      },
      {
        id: 'm4l2', title: 'Keamanan Perangkat Mobile', type: 'reading', emoji: '📲', typeLabel: 'Membaca', dur: '7 mnt', xp: 75,
        content: { sections: [
          { type: 'intro', text: 'HP Anda menyimpan data paling sensitif: akun email, banking, Dapodik, grup WA orang tua, foto siswa. Namun perangkat mobile sering kali paling sedikit diamankan. Lima langkah berikut wajib diterapkan hari ini.' },
          { type: 'case', title: '5 Pengaturan Keamanan Mobile yang Wajib', text: '① <strong>Kunci layar kuat</strong>: Gunakan PIN 6 digit, pola kompleks, atau biometrik. Hindari PIN "1234" atau tanggal lahir.<br>② <strong>Enkripsi perangkat</strong>: Android modern sudah aktif otomatis. iOS terenkripsi saat ada screen lock.<br>③ <strong>Aktifkan Find My Device</strong>: Android → Setelan → Keamanan → Find My Device. iOS → iCloud → Find My iPhone. Wajib untuk remote wipe jika hilang.<br>④ <strong>Update OS tepat waktu</strong>: Update OS mengandung patch keamanan kritis — jangan ditunda.<br>⑤ <strong>Backup otomatis</strong>: Aktifkan Google Photos atau iCloud agar data aman jika HP hilang/rusak.' },
          { type: 'warning', title: 'Bahaya WiFi Publik & Cara Aman', text: 'WiFi publik (kafe, stasiun, bandara) sangat berisiko — peretas bisa membuat hotspot palsu dengan nama "FREE_WIFI_STARBUCKS" dan menyadap semua koneksi Anda.<br><br>Cara aman:<br>• Gunakan data mobile untuk akses akun sensitif (email, banking, Dapodik)<br>• Jika harus WiFi publik: aktifkan VPN terlebih dahulu<br>• Jangan akses internet banking atau Dapodik di WiFi publik tanpa VPN' },
          { type: 'case', title: 'Audit Izin Aplikasi — Langkah Penting', text: 'Banyak aplikasi meminta izin yang tidak mereka butuhkan:<br>• Aplikasi senter meminta akses kontak dan lokasi? ❌ Mencurigakan<br>• Game meminta akses SMS? ❌ Potensi OTP stealer<br><br>Cara audit: <strong>Android</strong>: Setelan → Privasi → Pengelola Izin → periksa tiap izin<br><strong>iOS</strong>: Settings → Privacy & Security → periksa setiap kategori<br><br>Cabut izin yang tidak perlu, terutama: Lokasi, Mikrofon, Kamera, SMS, Kontak.' },
          { type: 'tip', title: 'Jika HP Hilang — Lakukan Segera', text: '① Akses <strong>findmydevice.google.com</strong> (Android) atau <strong>icloud.com/find</strong> (iOS) dari perangkat lain<br>② Aktifkan mode "Lost" untuk mengunci HP dari jarak jauh<br>③ Jika data sensitif ada di HP: lakukan <strong>Remote Erase/Wipe</strong> — hapus semua data dari jarak jauh<br>④ Ganti password semua akun yang tersimpan di HP tersebut' },
        ]}
      },
      {
        id: 'm4l3', title: 'Skenario: Akun Instagram Guru Diretas', type: 'scenario', emoji: '🔓', typeLabel: 'Skenario', dur: '8 mnt', xp: 75,
        content: {
          setup: 'Anda menerima DM Instagram dari akun "@instagram_security_team": "Akun Anda melanggar kebijakan komunitas. Klik link berikut untuk verifikasi dalam 24 jam atau akun akan dihapus permanen: bit.ly/ig-verif-2026." Anda panik karena ada ratusan foto kenangan penting di akun tersebut.',
          question: 'Apa tindakan yang BENAR?',
          choices: [
            { id: 'a', text: 'Klik link tersebut segera untuk menyelamatkan akun sebelum deadline', correct: false, fb: 'Ini phishing. Tim resmi Instagram TIDAK PERNAH mengirim notifikasi keamanan via DM. Instagram mengirim notifikasi resmi hanya melalui Pengaturan → Keamanan → Email dari Instagram. Tekanan waktu + link dipersingkat = phishing klasik.' },
            { id: 'b', text: 'Abaikan DM. Akses langsung instagram.com dari browser, cek Pengaturan → Keamanan, dan aktifkan Two-Factor Authentication', correct: true, fb: 'Tepat! Instagram tidak pernah menghubungi via DM untuk masalah keamanan. Verifikasi akun langsung dari aplikasi (Pengaturan → Keamanan → Email dari Instagram). Aktifkan 2FA sekarang sebagai perlindungan proaktif.' },
            { id: 'c', text: 'Balas DM untuk meminta bukti bahwa mereka adalah tim resmi Instagram', correct: false, fb: 'Membalas DM mengkonfirmasi akun Anda aktif dan bisa menjadikan Anda target lebih lanjut. Prinsip: jangan engage — akses Instagram langsung via aplikasi/browser.' },
          ],
        }
      },
      {
        id: 'm4l4', title: 'Simulasi Deteksi: Aman atau Berisiko?', type: 'simulation', emoji: '🎯', typeLabel: 'Simulasi', dur: '8 mnt', xp: 100,
        content: {
          instruction: 'Analisis setiap postingan/situasi berikut. Tentukan: Aman atau Berisiko terhadap privasi dan keamanan digital?',
          scenarios: [
            {
              id: 's1', verdict: 'phishing',
              msg: { from: 'Postingan Instagram Guru', subj: 'Foto Kegiatan Kelas', body: 'Guru memposting foto selfie bersama kelas, terlihat jelas papan absensi di belakang yang menampilkan nama lengkap 30 siswa beserta keterangan hadir/tidak hadir. Caption: "Seru belajar bareng kelas 10A hari ini! 😊" — akun terbuka (public).' },
              flags: ['Nama lengkap siswa terlihat jelas di papan absensi', 'Data kehadiran siswa adalah data pribadi yang dilindungi UU PDP', 'Akun publik berarti siapapun bisa melihat dan menyalin data tersebut'],
              explain: 'Postingan ini berisiko karena mengekspos data pribadi siswa (nama + kehadiran) tanpa izin. Ini berpotensi melanggar UU PDP. Solusi: pastikan tidak ada data siswa terlihat sebelum posting.'
            },
            {
              id: 's2', verdict: 'phishing',
              msg: { from: 'Status WhatsApp Guru', subj: 'Check-in Lokasi Real-time', body: 'Guru mengunggah foto makan siang di warung langganan dengan caption: "Makan siang dulu di Warung Bu Siti, Jl. Mawar No. 15! Tiap hari mampir sini setelah pulang mengajar dari SMAN 5 Bandung 🍛" — di-share ke semua kontak WhatsApp.' },
              flags: ['Mengungkap nama sekolah tempat bekerja', 'Memberi tahu rutinitas harian dan waktu keluar sekolah', 'Lokasi warung yang dikunjungi secara rutin bisa diprediksi oleh orang berniat jahat'],
              explain: 'Mengumumkan rutinitas harian (kapan, di mana, dari mana) memberi informasi berharga kepada pihak yang berniat jahat. Hindari berbagi rutinitas real-time ke publik.'
            },
            {
              id: 's3', verdict: 'safe',
              msg: { from: 'Postingan Facebook Guru', subj: 'Berbagi Artikel Pendidikan', body: 'Guru memposting artikel dari Kompas.com tentang tips belajar efektif dengan caption: "Artikel bagus tentang metode belajar Pomodoro. Cocok dicoba oleh siswa menjelang ujian! 📚" — di-share ke publik.' },
              flags: [],
              explain: 'Postingan ini aman! Berbagi artikel edukatif dari sumber terpercaya tidak mengekspos data pribadi siapapun dan merupakan bentuk profesionalisme digital yang positif.'
            }
          ]
        }
      },
    ],
    pretest: { id: 'm4pre', questions: [
      { id: 'q1', text: 'Pengaturan WhatsApp mana yang mencegah orang asing menambahkan Anda ke grup sembarang?', opts: [{ id: 'a', text: 'Matikan notifikasi grup' }, { id: 'b', text: 'Privacy → Groups → "My Contacts"', correct: true }, { id: 'c', text: 'Aktifkan mode diam (mute)' }, { id: 'd', text: 'Hapus foto profil' }], explain: 'Pengaturan "Groups" ke "My Contacts" memastikan hanya orang yang ada di daftar kontak Anda yang bisa menambahkan ke grup.' },
      { id: 'q2', text: 'Mengapa penting menonaktifkan izin lokasi untuk aplikasi kamera?', opts: [{ id: 'a', text: 'Untuk menghemat baterai HP' }, { id: 'b', text: 'Foto mengandung metadata GPS yang mengungkap lokasi persis kepada siapapun yang menerima foto', correct: true }, { id: 'c', text: 'Lokasi tidak relevan untuk foto biasa' }, { id: 'd', text: 'Agar foto bisa diunggah lebih cepat' }], explain: 'Metadata EXIF foto bisa berisi koordinat GPS persis tempat foto diambil. Mengunggah foto rumah/sekolah bisa mengekspos alamat ke publik.' },
      { id: 'q3', text: 'Mengapa penting mengaktifkan Find My Device di HP?', opts: [{ id: 'a', text: 'Agar HP bisa dilacak oleh semua orang' }, { id: 'b', text: 'Untuk menghapus data sensitif dari jarak jauh jika HP hilang', correct: true }, { id: 'c', text: 'Agar baterai lebih hemat' }, { id: 'd', text: 'Untuk mempercepat koneksi internet' }], explain: 'Find My Device memungkinkan remote wipe — menghapus semua data dari HP yang hilang sebelum jatuh ke tangan orang yang tidak bertanggung jawab.' },
      { id: 'q4', text: 'Seorang guru memposting foto kegiatan kelas dengan wajah siswa terlihat jelas di Instagram pribadinya (akun publik). Risiko utamanya?', opts: [{ id: 'a', text: 'Tidak ada risiko — ini kegiatan sekolah yang positif' }, { id: 'b', text: 'Foto anak-anak bisa disalahgunakan dan berpotensi melanggar UU PDP tanpa izin orang tua', correct: true }, { id: 'c', text: 'Foto bisa membuat siswa tidak fokus belajar' }, { id: 'd', text: 'Akun bisa dilaporkan oleh platform' }], explain: 'Data/foto anak-anak adalah data khusus yang dilindungi. Memposting tanpa izin orang tua berisiko disalahgunakan dan bisa melanggar UU PDP.' },
      { id: 'q5', text: 'Cara aman menggunakan WiFi publik untuk akses akun sensitif?', opts: [{ id: 'a', text: 'Gunakan browser mode incognito' }, { id: 'b', text: 'Aktifkan VPN terlebih dahulu sebelum mengakses akun sensitif', correct: true }, { id: 'c', text: 'Pastikan sinyal WiFi kuat' }, { id: 'd', text: 'Gunakan mode pesawat bergantian' }], explain: 'VPN mengenkripsi semua koneksi sehingga peretas di jaringan yang sama tidak bisa menyadap data Anda.' },
    ]},
    posttest: { id: 'm4post', questions: [
      { id: 'q1', text: 'Guru mengunggah selfie di depan papan tulis yang menampilkan daftar nama siswa. Langkah tepat setelah sadar?', opts: [{ id: 'a', text: 'Tidak perlu tindakan jika tidak ada keluhan' }, { id: 'b', text: 'Hapus segera, dokumentasikan sebagai insiden, pertimbangkan notifikasi ke kepala sekolah', correct: true }, { id: 'c', text: 'Crop foto agar nama tidak terlihat dan unggah ulang' }, { id: 'd', text: 'Ubah akun ke mode private dan lanjutkan' }], explain: 'Menghapus segera meminimalisir eksposur lebih lanjut. Kepala sekolah perlu tahu karena ini insiden data yang harus didokumentasikan sesuai UU PDP.' },
      { id: 'q2', text: 'Pengaturan Instagram/WA mana yang paling penting untuk keamanan akun?', opts: [{ id: 'a', text: 'Matikan semua notifikasi' }, { id: 'b', text: 'Aktifkan Two-Factor Authentication + akun privat (Instagram) / Two-Step Verification (WhatsApp)', correct: true }, { id: 'c', text: 'Ganti password setiap minggu' }, { id: 'd', text: 'Batasi jam penggunaan harian' }], explain: '2FA/Two-Step Verification melindungi akun dari pembajakan meski password diketahui orang lain.' },
      { id: 'q3', text: 'HP berisi data siswa hilang. Langkah pertama yang benar?', opts: [{ id: 'a', text: 'Buat pengumuman di grup WA untuk mencari HP' }, { id: 'b', text: 'Lakukan remote wipe segera melalui Google Find My Device / Apple Find My', correct: true }, { id: 'c', text: 'Tunggu 24 jam sebelum mengambil tindakan' }, { id: 'd', text: 'Beli HP baru sebagai pengganti' }], explain: 'Remote wipe segera menghapus data sensitif sebelum diakses pihak tidak berwenang.' },
      { id: 'q4', text: 'Apa risiko utama berbagi lokasi real-time di status WA kepada semua kontak?', opts: [{ id: 'a', text: 'Koneksi internet lebih lambat' }, { id: 'b', text: 'Pihak tidak bertanggung jawab bisa memprediksi keberadaan dan rutinitas Anda', correct: true }, { id: 'c', text: 'Baterai HP lebih cepat habis' }, { id: 'd', text: 'Foto tidak bisa diunggah bersamaan' }], explain: 'Berbagi lokasi real-time memberi informasi berharga kepada pihak berniat jahat tentang keberadaan dan rutinitas Anda.' },
      { id: 'q5', text: 'Izin aplikasi mana yang HARUS dicabut jika tidak diperlukan oleh fungsi aplikasi?', opts: [{ id: 'a', text: 'Izin untuk menampilkan notifikasi' }, { id: 'b', text: 'Izin akses kontak, lokasi, mikrofon, dan SMS pada aplikasi yang tidak membutuhkannya', correct: true }, { id: 'c', text: 'Izin untuk menggunakan WiFi' }, { id: 'd', text: 'Izin untuk mengakses penyimpanan foto' }], explain: 'Aplikasi dengan izin berlebihan bisa menyalahgunakan akses. Cabut izin yang tidak relevan dengan fungsi aplikasi — terutama SMS (OTP stealer) dan Lokasi.' },
    ]}
  },
  {
    id: 'm5', title: 'Digital Footprint & Incident Reporting', icon: '👣',
    color: '#b45309', colorLight: '#fffbeb',
    badge: 'crisis', time: '35 mnt', dimension: 'Skill + Attitude',
    status: 'active',
    desc: 'Memahami jejak digital aktif/pasif, mengenali insiden keamanan siber, dan melaporkannya ke kanal resmi yang tepat.',
    objective: 'Memahami dampak jejak digital, mengenali 6 tanda insiden siber, mengikuti prosedur 5 langkah respons, dan menghubungi kanal pelaporan yang benar.',
    facilitatorNote: 'Mulai dengan meminta peserta Google nama lengkap mereka — diskusikan apa yang muncul. Lakukan role-play: peserta dibagi menjadi "korban insiden" dan "tim respons". Perkuat: melapor bukan berarti mengaku bersalah.',
    lessons: [
      {
        id: 'm5l1', title: 'Jejak Digital Anda di Internet', type: 'reading', emoji: '👣', typeLabel: 'Membaca', dur: '5 mnt', xp: 50,
        content: { sections: [
          { type: 'intro', text: 'Setiap klik, like, komentar, dan foto yang Anda unggah meninggalkan "jejak digital" yang bisa bertahan puluhan tahun. Jejak ini mempengaruhi reputasi profesional, keamanan akun, dan privasi Anda — bahkan setelah dihapus.' },
          { type: 'case', title: 'Dua Jenis Jejak Digital', text: '<strong>Jejak Aktif</strong> (Anda buat secara sadar):<br>• Postingan, komentar, like di media sosial<br>• Pengisian formulir online<br>• Foto/video yang diunggah<br><br><strong>Jejak Pasif</strong> (dikumpulkan tanpa sadar Anda):<br>• Riwayat browsing yang dikumpulkan cookies<br>• Metadata foto: waktu, <strong>koordinat GPS lokasi</strong>, model HP<br>• Aktivitas aplikasi di latar belakang' },
          { type: 'warning', title: 'Metadata Foto: Ancaman Tersembunyi', text: 'Setiap foto smartphone menyimpan metadata EXIF yang bisa berisi koordinat GPS lokasi persis pengambilan foto. Mengunggah foto di rumah atau sekolah ke medsos bisa mengungkap alamat lengkap kepada siapapun.<br><br><strong>Solusi</strong>: Matikan izin lokasi untuk aplikasi kamera (Settings → Kamera → Izin Lokasi → Matikan).' },
          { type: 'stat', title: 'Dampak Profesional Jejak Digital', text: '<strong>70%</strong> rekruter dan kepala sekolah memeriksa media sosial kandidat sebelum interview atau promosi (CareerBuilder 2023). <strong>54%</strong> guru yang pernah memposting foto siswa dilaporkan mendapat keluhan orang tua.' },
          { type: 'tip', title: 'Cek Jejak Digital Anda Sekarang', text: '① Google nama lengkap Anda dalam tanda kutip: <em>"Nama Lengkap Anda"</em><br>② Cari akun lama yang terlupakan (forum lama, blog, dll)<br>③ Aktifkan Google Alerts untuk nama Anda di alerts.google.com<br>④ Periksa apakah ada foto Anda yang menampilkan informasi sensitif (papan nama, alamat, data siswa)' },
        ]}
      },
      {
        id: 'm5l2', title: 'Kenali Jenis Insiden Siber', type: 'reading', emoji: '📖', typeLabel: 'Membaca', dur: '6 mnt', xp: 75,
        content: { sections: [
          { type: 'intro', text: 'Tidak semua masalah komputer adalah insiden keamanan siber. Namun beberapa tanda harus membuat Anda waspada dan segera bertindak.' },
          { type: 'stat', title: 'Definisi Insiden Keamanan', text: 'Insiden keamanan adalah peristiwa yang mengancam <strong>kerahasiaan, integritas, atau ketersediaan</strong> (CIA Triad) data atau sistem sekolah. UU PDP mengharuskan pelaporan pelanggaran data dalam <strong>14 hari kerja</strong>.' },
          { type: 'case', title: '6 Tanda Insiden Siber di Sekolah', text: '① <strong>Akun terkunci</strong> padahal tidak salah input password<br>② <strong>Email terkirim</strong> sendiri ke banyak kontak tanpa sepengetahuan Anda<br>③ <strong>Password tidak bekerja</strong> lagi — tanda akun diambil alih<br>④ <strong>Pesan aneh</strong> dari rekan yang tidak pernah mereka kirim<br>⑤ <strong>Komputer lamban</strong>, program berjalan sendiri<br>⑥ <strong>Tagihan tidak wajar</strong> atau aktivitas keuangan tak dikenal' },
          { type: 'warning', title: 'Konsekuensi UU PDP No. 27/2022', text: 'Sekolah yang tidak melaporkan pelanggaran data dalam 14 hari kerja dapat dikenai denda administratif. Data siswa (nama, nilai, kondisi keluarga) termasuk <strong>data pribadi yang dilindungi</strong>.' },
          { type: 'tip', title: 'Saluran Pelaporan Resmi Indonesia', text: '• <strong>BSSN Gov-CSIRT</strong>: bantuan70@bssn.go.id<br>• <strong>Polri Patrolisiber</strong>: patrolisiber.id<br>• <strong>LAPOR!</strong>: lapor.go.id (untuk layanan publik)<br>• <strong>Internal</strong>: Tim IT sekolah / Dinas Pendidikan' },
        ]}
      },
      {
        id: 'm5l3', title: '5 Langkah Respons Insiden', type: 'reading', emoji: '📋', typeLabel: 'Panduan', dur: '7 mnt', xp: 75,
        content: { sections: [
          { type: 'intro', text: 'Saat insiden terjadi, panik adalah musuh terbesar Anda. Ikuti 5 langkah terstruktur ini untuk meminimalisir kerusakan.' },
          { type: 'case', title: 'Langkah 1: TENANG & ASSES', text: 'Ambil napas. Identifikasi: apa yang terjadi? Sistem/data apa yang terdampak? Siapa lagi yang mungkin terdampak? Jangan hapus apapun dulu — bukti digital penting untuk investigasi.' },
          { type: 'case', title: 'Langkah 2: ISOLASI', text: 'Putuskan koneksi perangkat dari internet (WiFi/Ethernet) untuk mencegah penyebaran. Jika HP: aktifkan mode pesawat. JANGAN matikan perangkat — memori bisa berisi bukti penting.' },
          { type: 'case', title: 'Langkah 3: DOKUMENTASI', text: 'Foto/screenshot semua yang terlihat: pesan error, notifikasi aneh, aktivitas tidak dikenal. Catat waktu kejadian dan apa yang Anda lakukan sebelumnya.' },
          { type: 'case', title: 'Langkah 4 & 5: LAPOR & PULIHKAN', text: '<strong>Lapor</strong>: Hubungi IT sekolah/dinas segera. Jika data siswa terdampak, wajib lapor ke BSSN (bantuan70@bssn.go.id). Untuk kejahatan siber, lapor ke Polri Patrolisiber.<br><br><strong>Pulihkan</strong>: Ganti semua password yang mungkin terkompromi. Aktifkan MFA. Periksa log akses akun. Informasikan pihak yang terdampak.' },
        ]}
      },
      {
        id: 'm5l4', title: 'Simulasi Krisis: HP Sekolah Hilang', type: 'scenario', emoji: '📱', typeLabel: 'Skenario', dur: '10 mnt', xp: 100,
        content: {
          setup: 'HP sekolah yang berisi foto KTP guru, data nilai siswa semester ini, dan percakapan grup WA orangtua murid HILANG di angkutan umum. Anda menyadarinya 30 menit yang lalu.',
          question: 'Langkah pertama yang BENAR?',
          choices: [
            { id: 'a', text: 'Panik dan hubungi semua guru di sekolah sekarang juga', correct: false, fb: 'Panik tidak produktif. Prioritas adalah mengisolasi perangkat secara remote untuk melindungi data yang ada di dalamnya.' },
            { id: 'b', text: 'Remote wipe HP via Google Find My Device / iCloud Find My', correct: true, fb: 'Tepat! Remote wipe segera menghapus data sensitif agar tidak bisa diakses meski HP jatuh ke tangan orang lain. Langkah berikutnya: lapor ke IT dan dokumentasi untuk UU PDP.' },
            { id: 'c', text: 'Tunggu beberapa jam — mungkin ada yang menemukan dan mengembalikan', correct: false, fb: 'Setiap menit data sensitif terekspos. Risiko penyalahgunaan data siswa terlalu besar untuk ditunda.' },
          ],
        }
      },
    ],
    pretest: { id: 'm5pre', questions: [
      { id: 'q1', text: 'Apa yang dimaksud jejak digital PASIF?', opts: [{ id: 'a', text: 'Foto yang sengaja Anda unggah di media sosial' }, { id: 'b', text: 'Data yang dikumpulkan tanpa tindakan sadar, seperti cookies dan metadata', correct: true }, { id: 'c', text: 'Komentar yang Anda tulis di forum online' }, { id: 'd', text: 'Akun media sosial yang Anda daftarkan' }], explain: 'Jejak pasif dikumpulkan secara otomatis tanpa tindakan sadar — riwayat browsing, metadata foto, dan data dari aplikasi yang berjalan di latar belakang.' },
      { id: 'q2', text: 'Mana yang BUKAN termasuk insiden keamanan siber di sekolah?', opts: [{ id: 'a', text: 'Akun Dapodik terkunci tanpa sebab yang jelas' }, { id: 'b', text: 'Email guru mengirim pesan sendiri ke semua kontak' }, { id: 'c', text: 'Printer sekolah macet karena kehabisan toner', correct: true }, { id: 'd', text: 'HP sekolah hilang berisi data siswa' }], explain: 'Printer macet adalah masalah teknis biasa, bukan insiden keamanan. Tiga lainnya menunjukkan akun yang mungkin dikompromi atau data yang terekspos.' },
      { id: 'q3', text: 'Ketika HP sekolah berisi data siswa hilang, tindakan pertama yang benar?', opts: [{ id: 'a', text: 'Buat pengumuman di grup WA untuk mencari HP' }, { id: 'b', text: 'Lakukan remote wipe segera melalui Google/Apple', correct: true }, { id: 'c', text: 'Tunggu 24 jam sebelum mengambil tindakan' }, { id: 'd', text: 'Beli HP baru sebagai pengganti' }], explain: 'Remote wipe segera menghapus data sensitif sebelum diakses pihak tidak berwenang.' },
      { id: 'q4', text: 'Kanal pelaporan resmi insiden siber untuk instansi pemerintah Indonesia?', opts: [{ id: 'a', text: 'OJK (Otoritas Jasa Keuangan)' }, { id: 'b', text: 'BSSN Gov-CSIRT (bantuan70@bssn.go.id)', correct: true }, { id: 'c', text: 'Menkominfo secara langsung' }, { id: 'd', text: 'Media sosial resmi Kemendikbud' }], explain: 'BSSN Gov-CSIRT adalah kanal utama pelaporan insiden siber untuk instansi pemerintah, termasuk sekolah negeri.' },
      { id: 'q5', text: 'Mengapa TIDAK disarankan langsung mematikan komputer saat terjadi insiden malware?', opts: [{ id: 'a', text: 'Mematikan komputer bisa menyebarkan malware ke komputer lain' }, { id: 'b', text: 'Proses shutdown bisa memperparah kerusakan file' }, { id: 'c', text: 'Memori (RAM) berisi bukti digital yang hilang saat dimatikan', correct: true }, { id: 'd', text: 'Tidak ada alasan — mematikan komputer selalu langkah pertama yang benar' }], explain: 'Volatile memory (RAM) bisa berisi bukti penting seperti proses malware yang berjalan, yang hilang saat komputer dimatikan.' },
    ]},
    posttest: { id: 'm5post', questions: [
      { id: 'q1', text: 'Urutan 5 langkah respons insiden yang benar?', opts: [{ id: 'a', text: 'Lapor → Isolasi → Dokumentasi → Tenang → Pulihkan' }, { id: 'b', text: 'Tenang & Asses → Isolasi → Dokumentasi → Lapor → Pulihkan', correct: true }, { id: 'c', text: 'Pulihkan → Lapor → Dokumentasi → Isolasi → Tenang' }, { id: 'd', text: 'Isolasi → Matikan → Pulihkan → Lapor → Dokumentasi' }], explain: 'Urutan benar memastikan bukti tidak hilang dan eskalasi tepat waktu.' },
      { id: 'q2', text: 'Email Anda mengirim pesan ke ratusan kontak tanpa sepengetahuan Anda. Langkah pertama?', opts: [{ id: 'a', text: 'Kirim email permintaan maaf ke semua yang menerima pesan' }, { id: 'b', text: 'Ganti password email dari perangkat lain yang aman', correct: true }, { id: 'c', text: 'Hapus akun email dan buat akun baru' }, { id: 'd', text: 'Matikan komputer dan tunggu bantuan IT' }], explain: 'Akun terkompromi — ganti password segera untuk menghentikan pengiriman spam lebih lanjut.' },
      { id: 'q3', text: 'Guru menemukan foto lama berisi nama lengkapnya di situs berita yang tidak relevan. Yang bisa dilakukan?', opts: [{ id: 'a', text: 'Tidak ada yang bisa dilakukan' }, { id: 'b', text: 'Hubungi admin situs minta penghapusan; gunakan hak "Right to Erasure" UU PDP jika ditolak', correct: true }, { id: 'c', text: 'Buat postingan baru untuk "menenggelamkan" informasi lama' }, { id: 'd', text: 'Ganti nama di semua dokumen resmi' }], explain: 'UU PDP memberi hak penghapusan data (right to erasure) dalam kondisi tertentu. Permintaan penghapusan ke pengelola situs adalah hak Anda.' },
      { id: 'q4', text: 'Data nilai siswa bocor akibat serangan pada portal sekolah. Siapa yang WAJIB dinotifikasi?', opts: [{ id: 'a', text: 'Hanya kepala sekolah dan IT' }, { id: 'b', text: 'Hanya Dinas Pendidikan' }, { id: 'c', text: 'BSSN, Dinas Pendidikan, dan orang tua siswa yang data-nya terekspos', correct: true }, { id: 'd', text: 'Tidak perlu melapor jika sudah diperbaiki' }], explain: 'UU PDP mengharuskan notifikasi ke pihak yang data-nya terdampak, selain ke BSSN dan otoritas terkait.' },
      { id: 'q5', text: 'Apa langkah "ISOLASI" dalam respons insiden?', opts: [{ id: 'a', text: 'Mematikan semua komputer di sekolah' }, { id: 'b', text: 'Memutus perangkat terdampak dari internet tanpa mematikannya', correct: true }, { id: 'c', text: 'Mengisolasi ruang komputer secara fisik' }, { id: 'd', text: 'Membatasi akses pengguna ke sistem' }], explain: 'Isolasi berarti memutus koneksi jaringan (WiFi off/cabut ethernet) tanpa mematikan perangkat, sehingga bukti di RAM tetap terjaga.' },
    ]}
  },
  {
    id: 'm6', title: 'System Updates & Device Security', icon: '💻',
    color: '#5b21b6', colorLight: '#f5f3ff',
    badge: 'sysguard', time: '35 mnt', dimension: 'Knowledge + Behaviour',
    status: 'active',
    desc: 'Memahami pentingnya pembaruan sistem, strategi backup 3-2-1, dan cara melindungi perangkat dari ransomware.',
    objective: 'Mengelola pembaruan Windows/Android secara proaktif, menerapkan backup 3-2-1, dan merespons insiden ransomware dengan benar.',
    facilitatorNote: 'Demo langsung: tunjukkan cara cek Windows Update di komputer lab. Tanyakan: "Siapa yang pernah kehilangan file penting?" Diskusikan pengalaman peserta dengan virus/malware. Minta peserta memeriksa berapa hari terakhir perangkat mereka diperbarui.',
    lessons: [
      {
        id: 'm6l1', title: 'Mengapa Sistem Harus Diperbarui?', type: 'reading', emoji: '🔄', typeLabel: 'Membaca', dur: '6 mnt', xp: 50,
        content: { sections: [
          { type: 'intro', text: 'Pada Mei 2017, virus WannaCry menginfeksi lebih dari 200.000 komputer di 150 negara hanya dalam 24 jam. Target utamanya: komputer Windows yang <strong>belum diperbarui</strong>. Termasuk rumah sakit, lembaga pendidikan, dan perkantoran Indonesia.' },
          { type: 'case', title: 'Kasus WannaCry di Indonesia', text: 'Indonesia menjadi salah satu negara dengan korban terbanyak. RS Dharmais Jakarta dan RS Harapan Kita terpaksa menolak pasien baru dan melakukan layanan manual selama beberapa hari. Penyebab utama: sistem Windows XP yang sudah tidak mendapat pembaruan keamanan.' },
          { type: 'stat', title: 'Fakta Kerentanan Sistem', text: '<strong>57%</strong> serangan siber berhasil karena korban tidak memasang pembaruan yang tersedia (Ponemon Institute 2022). Pembaruan sistem bukan sekadar fitur baru — <strong>80% patch keamanan menutup celah CVE</strong> yang bisa dieksploitasi peretas.' },
          { type: 'warning', title: 'Sistem Lama = Pintu yang Selalu Terbuka', text: 'Windows 7 dan Windows XP <strong>tidak lagi menerima patch keamanan</strong>. Setiap kerentanan baru yang ditemukan akan tetap terbuka selamanya. Banyak komputer lab sekolah masih menggunakan sistem lawas — ini adalah risiko nyata.' },
          { type: 'tip', title: 'Cara Cek & Lakukan Pembaruan', text: '<strong>Windows 10/11</strong>: Start → Settings → Update &amp; Security → Windows Update → Check for updates<br><strong>Android</strong>: Settings → About Phone → Software Update<br><strong>iOS</strong>: Settings → General → Software Update<br><br>Jadwalkan pembaruan di luar jam pelajaran (misalnya Jumat sore).' },
        ]}
      },
      {
        id: 'm6l2', title: 'Ransomware: Data Anda Tersandera', type: 'reading', emoji: '🔒', typeLabel: 'Membaca', dur: '7 mnt', xp: 75,
        content: { sections: [
          { type: 'intro', text: 'Bayangkan membuka laptop pagi hari dan menemukan semua file berubah nama menjadi ".encrypted" dengan pesan: <em>"Bayar $500 dalam 48 jam atau data Anda hilang selamanya."</em> Inilah ransomware — ancaman yang meningkat 300% terhadap institusi pendidikan sejak 2020.' },
          { type: 'case', title: 'Cara Kerja Ransomware (4 Tahap)', text: '① <strong>Masuk</strong> via email phishing atau unduhan berbahaya dari situs tidak resmi<br>② <strong>Mengenkripsi</strong> semua file: dokumen raport, foto, database nilai, arsip sekolah<br>③ <strong>Menampilkan tebusan</strong> dengan countdown timer dan instruksi pembayaran via kripto<br>④ <strong>Ancaman ganda</strong>: data tidak bisa dibuka DAN ancaman dipublikasikan jika tidak bayar' },
          { type: 'stat', title: 'Biaya Nyata Serangan Ransomware', text: 'Rata-rata biaya pemulihan tanpa backup: <strong>Rp 1,5 – 5 miliar</strong> (termasuk downtime, pemulihan data, konsultan IT). Waktu pemulihan: <strong>3–6 bulan</strong>. Dengan backup yang baik: <strong>24–72 jam</strong> dan biaya minimal.' },
          { type: 'warning', title: 'Yang DILARANG Dilakukan', text: '① <strong>JANGAN bayar tebusan</strong> — tidak ada jaminan file kembali<br>② <strong>JANGAN restart</strong> — bisa memperparah enkripsi dan menghapus bukti<br>③ <strong>JANGAN sambungkan</strong> perangkat lain ke komputer terinfeksi<br>④ <strong>JANGAN format</strong> sebelum berkonsultasi dengan IT' },
          { type: 'tip', title: 'Pencegahan Ransomware — 5 Langkah', text: '✓ Aktifkan pembaruan otomatis Windows dan antivirus<br>✓ Jangan buka lampiran email dari pengirim tidak dikenal<br>✓ Backup rutin ke media offline<br>✓ Aktifkan Windows Defender Controlled Folder Access<br>✓ Blokir eksekusi file dari folder %AppData%, %Temp%' },
        ]}
      },
      {
        id: 'm6l3', title: 'Strategi Backup 3-2-1', type: 'reading', emoji: '💾', typeLabel: 'Panduan', dur: '8 mnt', xp: 75,
        content: { sections: [
          { type: 'intro', text: 'Satu-satunya cara pasti melawan ransomware dan kerusakan data adalah backup yang benar. Strategi <strong>3-2-1</strong> adalah standar emas keamanan data yang direkomendasikan oleh NIST, FBI, dan CISA untuk semua organisasi — termasuk sekolah.' },
          { type: 'case', title: 'Aturan 3-2-1 Dijelaskan', text: '<strong>3</strong> — Pertahankan <strong>3 salinan</strong> data (original + 2 backup)<br><strong>2</strong> — Simpan di <strong>2 jenis media berbeda</strong> (contoh: komputer + flashdisk/HDD eksternal)<br><strong>1</strong> — Simpan <strong>1 salinan di lokasi offsite</strong> (cloud atau lokasi fisik berbeda)<br><br>Tujuan: jika satu lokasi hancur (kebakaran, banjir, ransomware), data tetap aman di tempat lain.' },
          { type: 'stat', title: 'Kisah Nyata — Sekolah Tanpa Backup', text: 'Sekolah menengah di Bandung kehilangan arsip nilai 5 tahun karena laptop bendahara rusak. Tidak ada backup. Pemulihan memakan waktu 8 bulan dengan biaya jutaan rupiah. Dengan backup 3-2-1: pemulihan maksimal 1 hari kerja.' },
          { type: 'tip', title: 'Implementasi 3-2-1 Gratis untuk Sekolah', text: '<strong>Salinan 1</strong>: File aktif di komputer/laptop (original)<br><strong>Salinan 2</strong>: USB Drive / HDD eksternal — backup mingguan<br><strong>Salinan 3</strong>: Google Drive / OneDrive — sinkronisasi otomatis harian<br><br>Cara: aktifkan Google Drive for Desktop → pilih folder penting → otomatis sync ke cloud. Gratis hingga 15 GB.' },
          { type: 'warning', title: 'Backup Tidak Diuji = Tidak Ada Backup', text: 'Banyak organisasi baru tahu backup-nya rusak <strong>saat bencana terjadi</strong>. Solusi: <strong>setiap bulan</strong>, coba pulihkan 1 file dari backup ke lokasi berbeda untuk memastikan prosesnya berjalan.' },
        ]}
      },
      {
        id: 'm6l4', title: 'Skenario: Laptop Terkena Ransomware', type: 'scenario', emoji: '🚨', typeLabel: 'Skenario', dur: '8 mnt', xp: 100,
        content: {
          setup: 'Selasa pagi, Anda membuka laptop untuk mempersiapkan materi pelajaran. Muncul layar merah bertuliskan: "ALL YOUR FILES ARE ENCRYPTED. Send 0.5 Bitcoin to [address]. You have 72 hours or files will be permanently deleted." Dokumen raport siswa, silabus semester ini, dan rekap nilai tidak bisa dibuka.',
          question: 'Langkah PERTAMA yang benar?',
          choices: [
            { id: 'a', text: 'Segera bayar tebusan agar file kembali sebelum deadline 72 jam', correct: false, fb: 'FBI dan CISA secara resmi merekomendasikan TIDAK membayar tebusan. Tidak ada jaminan file kembali setelah pembayaran, dan Anda justru menandai diri sebagai korban yang mau membayar — menjadi target berulang.' },
            { id: 'b', text: 'Cabut kabel jaringan/matikan WiFi, foto layar sebagai bukti, segera hubungi IT sekolah', correct: true, fb: 'Tepat! Isolasi jaringan mencegah ransomware menyebar ke komputer lain di sekolah. Foto/screenshot sebagai dokumentasi insiden. IT sekolah/dinas dapat membantu koordinasi pemulihan dari backup.' },
            { id: 'c', text: 'Restart laptop berkali-kali agar ransomware hilang sendiri', correct: false, fb: 'Restart tidak menghapus ransomware — justru bisa memicu enkripsi lanjutan dan menghapus bukti digital di memori (RAM) yang berguna untuk investigasi forensik.' },
          ],
        }
      },
    ],
    pretest: { id: 'm6pre', questions: [
      { id: 'q1', text: 'Mengapa pembaruan keamanan sistem operasi harus segera dipasang?', opts: [{ id: 'a', text: 'Untuk mendapatkan tampilan yang lebih menarik' }, { id: 'b', text: 'Menutup celah keamanan sebelum dieksploitasi peretas', correct: true }, { id: 'c', text: 'Supaya komputer berjalan lebih cepat' }, { id: 'd', text: 'Agar bisa menginstall aplikasi terbaru' }], explain: 'Pembaruan keamanan (security patches) menutup celah yang sudah diketahui. Semakin lama tidak dipasang, semakin lama peretas bisa mengeksploitasinya.' },
      { id: 'q2', text: 'Ciri utama serangan ransomware adalah...', opts: [{ id: 'a', text: 'Memperlambat komputer secara signifikan' }, { id: 'b', text: 'Mengenkripsi file dan meminta tebusan untuk kunci dekripsinya', correct: true }, { id: 'c', text: 'Mengirim spam dari akun email korban' }, { id: 'd', text: 'Mengubah tampilan desktop dan wallpaper' }], explain: 'Ransomware mengenkripsi file sehingga tidak bisa dibuka, lalu meminta tebusan (biasanya cryptocurrency) untuk kunci dekripsinya.' },
      { id: 'q3', text: 'Dalam strategi backup 3-2-1, angka "1" berarti...', opts: [{ id: 'a', text: 'Backup dilakukan 1 kali per minggu' }, { id: 'b', text: 'Hanya menggunakan 1 jenis media penyimpanan' }, { id: 'c', text: 'Minimal 1 salinan disimpan di lokasi offsite (berbeda dari komputer utama)', correct: true }, { id: 'd', text: 'Cukup menyimpan 1 folder backup' }], explain: 'Angka "1" berarti menyimpan minimal satu salinan di lokasi berbeda secara fisik (offsite), seperti cloud atau gedung lain.' },
      { id: 'q4', text: 'Ketika ransomware aktif di laptop, mengapa sebaiknya TIDAK langsung dimatikan?', opts: [{ id: 'a', text: 'Mematikan bisa memperparah enkripsi dan menghilangkan bukti di memori', correct: true }, { id: 'b', text: 'Komputer butuh waktu mendekripsi sendiri jika dibiarkan menyala' }, { id: 'c', text: 'Mematikan tidak berpengaruh apa pun' }, { id: 'd', text: 'Selalu matikan komputer terinfeksi sebagai langkah pertama' }], explain: 'Mematikan komputer bisa memicu enkripsi tambahan dan menghilangkan bukti digital di RAM yang berguna untuk analisis forensik.' },
      { id: 'q5', text: 'Mana yang BUKAN langkah pencegahan ransomware?', opts: [{ id: 'a', text: 'Mengaktifkan pembaruan otomatis Windows' }, { id: 'b', text: 'Tidak membuka lampiran email dari pengirim tidak dikenal' }, { id: 'c', text: 'Membayar tebusan kecil sebagai "test decrypt"', correct: true }, { id: 'd', text: 'Backup rutin ke Google Drive' }], explain: 'Membayar tebusan membuktikan Anda bersedia membayar dan dapat menjadikan Anda target serangan berulang.' },
    ]},
    posttest: { id: 'm6post', questions: [
      { id: 'q1', text: 'Mengapa Windows XP masih berbahaya digunakan saat ini?', opts: [{ id: 'a', text: 'Tidak kompatibel dengan internet modern' }, { id: 'b', text: 'Tidak lagi menerima patch keamanan sehingga celah baru tidak pernah ditutup', correct: true }, { id: 'c', text: 'Terlalu lambat untuk streaming video' }, { id: 'd', text: 'Tidak mendukung Wi-Fi' }], explain: 'Tanpa pembaruan keamanan, setiap kerentanan baru yang ditemukan akan tetap terbuka selamanya di sistem tersebut.' },
      { id: 'q2', text: 'Urutan tindakan yang benar saat menemukan ransomware di laptop sekolah?', opts: [{ id: 'a', text: 'Restart → scan antivirus → hubungi IT' }, { id: 'b', text: 'Bayar tebusan → dekripsi → laporkan' }, { id: 'c', text: 'Cabut jaringan → foto layar → hubungi IT → pulihkan dari backup', correct: true }, { id: 'd', text: 'Format laptop langsung → instal ulang → minta backup dari cloud' }], explain: 'Isolasi jaringan mencegah penyebaran. Dokumentasi penting untuk investigasi. IT mengevaluasi backup sebelum langkah lanjutan.' },
      { id: 'q3', text: 'Sekolah menggunakan Google Drive untuk backup otomatis. Apakah ini memenuhi strategi 3-2-1 secara penuh?', opts: [{ id: 'a', text: 'Ya, Google Drive saja sudah cukup' }, { id: 'b', text: 'Belum — Google Drive hanya memenuhi syarat "1 offsite", masih perlu backup lokal tambahan', correct: true }, { id: 'c', text: 'Tidak, cloud tidak dianggap backup valid' }, { id: 'd', text: 'Ya, tapi hanya untuk file di bawah 15 GB' }], explain: 'Google Drive memenuhi syarat offsite, tapi 3-2-1 penuh membutuhkan 3 salinan di 2 media berbeda. Tambahkan USB/HDD eksternal.' },
      { id: 'q4', text: 'Mengapa penting menguji backup secara berkala?', opts: [{ id: 'a', text: 'Agar backup tidak memakan terlalu banyak ruang penyimpanan' }, { id: 'b', text: 'Backup yang tidak teruji bisa rusak dan tidak bisa dipulihkan saat dibutuhkan', correct: true }, { id: 'c', text: 'Untuk memperbarui file backup secara manual' }, { id: 'd', text: 'Agar IT sekolah bisa memantau isi backup' }], explain: 'Backup yang tidak pernah diuji tidak bisa dipercaya. Banyak kasus backup ada tapi ternyata rusak atau tidak bisa dibuka saat dibutuhkan.' },
      { id: 'q5', text: 'Apa risiko utama membayar tebusan ransomware?', opts: [{ id: 'a', text: 'Pembayaran memerlukan mata uang kripto yang rumit' }, { id: 'b', text: 'Tidak ada jaminan file kembali, dan Anda berpotensi jadi target serangan berulang', correct: true }, { id: 'c', text: 'Jumlah tebusan biasanya terlalu besar untuk sekolah negeri' }, { id: 'd', text: 'Tidak ada risiko jika jumlahnya kecil' }], explain: 'FBI secara resmi merekomendasikan tidak membayar. Pembayaran tidak menjamin file kembali dan menandai Anda sebagai korban yang kooperatif.' },
    ]}
  },
]

export const DEFAULT_DISCUSSIONS: Discussion[] = [
  { id: 'd1', moduleId: 'm1', userId: 'P001', userName: 'Sari Rahayu, S.Pd.', avatar: 'SR', title: 'Cara mudah mengajarkan passphrase ke siswa?', body: 'Saya ingin menerapkan passphrase untuk akun lab komputer sekolah kami. Ada tips praktis mengajarkan ke siswa SMP?', time: '2 jam lalu', likes: 5, replies: [
    { id: 'r1', userId: 'E001', userName: 'Prof. Ahmad Fauzan', avatar: 'AF', expert: true, body: 'Coba metode "cerita 4 kata" — minta siswa bayangkan sebuah adegan lucu atau berkesan, lalu ubah jadi 4 kata: "kucing-terbang-makan-piza". Lebih mudah diingat karena visual dan personal.', time: '1 jam lalu', likes: 8 }
  ]},
  { id: 'd2', moduleId: 'm2', userId: 'P002', userName: 'Budi Hartono, M.Pd.', avatar: 'BH', title: 'Terlanjur klik link phishing di email dinas — harus lapor ke mana?', body: 'Kemarin saya klik link yang ternyata phishing dari email yang mengaku dari Kemendikbud. Sudah ganti password, tapi tidak yakin cukup. Langkah selanjutnya?', time: '5 jam lalu', likes: 12, replies: [
    { id: 'r2', userId: 'E001', userName: 'Prof. Ahmad Fauzan', avatar: 'AF', expert: true, body: 'Langkah Anda sudah tepat dengan mengganti password segera. Selanjutnya: (1) Aktifkan 2FA di akun email dinas, (2) Periksa aktivitas login di pengaturan keamanan, (3) Laporkan ke IT dinas pendidikan, (4) Jika akun digunakan untuk Dapodik/SiPeg, informasikan ke admin sistem tersebut.', time: '4 jam lalu', likes: 15 }
  ]},
  { id: 'd3', moduleId: 'm3', userId: 'P003', userName: 'Rini Wulandari, S.Pd.', avatar: 'RW', title: 'Prosedur pelaporan jika data siswa bocor di sekolah swasta?', body: 'Kami sekolah swasta. Apakah kewajiban pelaporan UU PDP sama dengan sekolah negeri? Ke mana harus lapor dan dalam berapa hari?', time: '1 hari lalu', likes: 7, replies: [
    { id: 'r3', userId: 'E001', userName: 'Prof. Ahmad Fauzan', avatar: 'AF', expert: true, body: 'UU PDP berlaku untuk SEMUA penyelenggara — negeri maupun swasta. Kewajiban: notifikasi ke BSSN dalam 14 hari kerja sejak pelanggaran terdeteksi, dan notifikasi ke subjek data (siswa/orang tua) sesegera mungkin.', time: '20 jam lalu', likes: 9 }
  ]},
]

export function getModules(): Module[] {
  if (typeof window === 'undefined') return DEFAULT_MODULES
  try {
    const custom: Module[] = JSON.parse(localStorage.getItem('clme_custom_modules') || '[]')
    const merged = [...DEFAULT_MODULES]
    custom.forEach(cm => {
      const idx = merged.findIndex(m => m.id === cm.id)
      if (idx >= 0) merged[idx] = cm; else merged.push(cm)
    })
    return merged
  } catch { return DEFAULT_MODULES }
}

export function getModule(id: string): Module | undefined {
  return getModules().find(m => m.id === id)
}

export function saveCustomModule(mod: Module) {
  if (typeof window === 'undefined') return
  const custom: Module[] = JSON.parse(localStorage.getItem('clme_custom_modules') || '[]')
  const idx = custom.findIndex(m => m.id === mod.id)
  if (idx >= 0) custom[idx] = mod; else custom.push(mod)
  localStorage.setItem('clme_custom_modules', JSON.stringify(custom))
}

export function updateModuleStatus(id: string, status: Module['status']) {
  if (typeof window === 'undefined') return
  const custom: Module[] = JSON.parse(localStorage.getItem('clme_custom_modules') || '[]')
  const base = DEFAULT_MODULES.find(m => m.id === id)
  const existing = custom.find(m => m.id === id)
  const mod = existing || (base ? { ...base } : null)
  if (!mod) return
  mod.status = status
  const idx = custom.findIndex(m => m.id === id)
  if (idx >= 0) custom[idx] = mod; else custom.push(mod)
  localStorage.setItem('clme_custom_modules', JSON.stringify(custom))
}

export function getDiscussions(moduleId?: string | null): Discussion[] {
  if (typeof window === 'undefined') return DEFAULT_DISCUSSIONS
  try {
    const saved: Discussion[] = JSON.parse(localStorage.getItem('clme_discussions') || '[]')
    const all = [...DEFAULT_DISCUSSIONS, ...saved]
    return moduleId ? all.filter(d => d.moduleId === moduleId) : all
  } catch { return DEFAULT_DISCUSSIONS }
}

export function addDiscussion(post: Discussion) {
  if (typeof window === 'undefined') return
  const saved: Discussion[] = JSON.parse(localStorage.getItem('clme_discussions') || '[]')
  saved.push(post)
  localStorage.setItem('clme_discussions', JSON.stringify(saved))
}

export function addReply(postId: string, reply: Discussion['replies'][0]) {
  if (typeof window === 'undefined') return
  const saved: Discussion[] = JSON.parse(localStorage.getItem('clme_discussions') || '[]')
  const idx = saved.findIndex(d => d.id === postId)
  if (idx >= 0) { saved[idx].replies.push(reply); localStorage.setItem('clme_discussions', JSON.stringify(saved)) }
  const def = DEFAULT_DISCUSSIONS.find(d => d.id === postId)
  if (def) def.replies.push(reply)
}
