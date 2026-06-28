import type { Module, Discussion } from '@/types'

export const DEFAULT_MODULES: Module[] = [
  {
    id: 'm1', title: 'Manajemen Kata Sandi', icon: '🔐',
    color: '#0c8568', colorLight: '#f0fdf8',
    badge: 'guardian', time: '35 mnt', dimension: 'Knowledge + Behaviour',
    status: 'active',
    desc: 'Mampu mengevaluasi kekuatan kata sandi dan menerapkan praktik aman di sekolah.',
    objective: 'Membuat kata sandi kuat, memahami bahaya password reuse, dan mengenali serangan phishing sederhana.',
    facilitatorNote: 'Mulai sesi dengan tanya: "Siapa yang pakai kata sandi sama di > 1 akun?" Tunjukkan statistik 81% pelanggaran data terkait password lemah (NIST). Minta peserta buat passphrase sendiri saat sesi berlangsung.',
    lessons: [
      {
        id: 'm1l1', title: 'Kenapa Kata Sandi Penting?', type: 'reading', emoji: '📖', typeLabel: 'Membaca', dur: '5 mnt', xp: 50,
        content: {
          sections: [
            { type: 'intro', text: 'Bayangkan sekolah Anda mengalami kebocoran data. Nilai ratusan siswa, data personal guru, rekap keuangan — semuanya bocor ke publik. Bagaimana ini bisa terjadi?' },
            { type: 'case', title: 'Kasus Nyata — SMP Nusantara 2022', text: 'Portal akademik sekolah diakses orang tak dikenal karena kata sandi admin masih "admin123". Data 847 siswa dan 43 guru terekspos selama 3 hari sebelum terdeteksi.' },
            { type: 'stat', title: 'Fakta NIST SP 800-63B', text: '<strong>81%</strong> pelanggaran data melibatkan kata sandi lemah atau dicuri. Di sekolah, satu akun terkompromi bisa memberikan akses ke seluruh sistem — nilai, data siswa, dan dokumen finansial.' },
            { type: 'warning', title: 'Bahaya Password Reuse', text: 'Jika akun email pribadi Anda bocor dan Anda memakai kata sandi yang sama untuk Dapodik, maka data sekolah juga terancam. Satu kebocoran bisa menyebar ke semua akun.' },
            { type: 'tip', title: 'Solusi: Password Manager', text: 'Aplikasi seperti <strong>Bitwarden</strong> (gratis, open source) menyimpan semua kata sandi terenkripsi. Anda hanya perlu mengingat <em>satu</em> kata sandi utama yang kuat.' },
          ]
        }
      },
      {
        id: 'm1l2', title: 'Anatomi Kata Sandi Kuat', type: 'interactive', emoji: '🛠️', typeLabel: 'Interaktif', dur: '7 mnt', xp: 75,
        content: {
          intro: 'Menurut <strong>NIST SP 800-63B</strong>, panjang lebih penting dari kompleksitas. "kuda-berlari-di-pantai!" lebih kuat dari "P@$$w0rd1".',
          items: [
            { pw: 'admin123',            label: 'Sangat Lemah', bar: 10,  time: '< 1 detik',         color: '#ef4444' },
            { pw: 'Sari2024!',           label: 'Lemah',        bar: 25,  time: '~3 menit',           color: '#f97316' },
            { pw: 'P@$$w0rd1!',          label: 'Cukup',        bar: 50,  time: '~2 jam',             color: '#eab308' },
            { pw: 'kuda-merah-kopi',     label: 'Kuat',         bar: 80,  time: '~50 juta tahun',     color: '#22c55e' },
            { pw: 'guru-IPA-suka-8-buah',label: 'Sangat Kuat',  bar: 100, time: '> 1 miliar tahun',   color: '#0c8568' },
          ],
          tips: ['Gunakan minimal <strong>12 karakter</strong>', 'Frasa sandi (passphrase) lebih kuat dan mudah diingat', 'Jangan gunakan nama, tanggal lahir, atau kata kamus', 'Buat kata sandi <strong>berbeda</strong> untuk setiap akun', 'Aktifkan <strong>MFA/2FA</strong> di semua akun penting'],
        }
      },
      {
        id: 'm1l3', title: 'Etika Berbagi Kata Sandi', type: 'scenario', emoji: '🎭', typeLabel: 'Skenario', dur: '8 mnt', xp: 75,
        content: {
          setup: 'Pak Kepala Sekolah menghampiri Anda: "Bu Sari, login portal SiPeg-nya pakai akun Ibu dulu ya, akun saya lagi diproses IT."',
          question: 'Apa respons terbaik Anda?',
          choices: [
            { id: 'a', text: 'Berikan kata sandi karena beliau adalah atasan langsung', correct: false, fb: 'Berbagi kata sandi — bahkan dengan atasan — melanggar prinsip akuntabilitas individual. Jika terjadi insiden, sulit menentukan siapa yang bertanggung jawab.' },
            { id: 'b', text: 'Login sendiri, biarkan beliau menggunakan komputer Anda tanpa pengawasan', correct: false, fb: 'Ini juga berisiko — seseorang bisa mengakses data lain saat Anda meninggalkan komputer. Login dengan akun Anda untuk orang lain tetap melanggar prinsip akuntabilitas.' },
            { id: 'c', text: 'Sarankan beliau hubungi IT untuk akun sementara; tawarkan bantuan upload data', correct: true, fb: 'Pilihan terbaik! Ini menyelesaikan masalah tanpa melanggar keamanan. Anda membantu kepala sekolah sambil mempertahankan standar keamanan yang benar.' },
          ],
        }
      },
      {
        id: 'm1l4', title: 'Simulasi: Deteksi Phishing', type: 'simulation', emoji: '⚡', typeLabel: 'Simulasi', dur: '10 mnt', xp: 100,
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
    pretest: {
      id: 'm1pre',
      questions: [
        { id: 'q1', text: 'Manakah yang paling tepat menggambarkan kata sandi yang kuat?', opts: [{ id: 'a', text: 'Nama dan tanggal lahir agar mudah diingat' }, { id: 'b', text: 'Kata pendek dengan karakter unik: P@$$!' }, { id: 'c', text: 'Frasa panjang: "kucing-tidur-di-atap-merah"', correct: true }, { id: 'd', text: 'Kata sandi yang sama di semua akun agar tidak lupa' }], explain: 'Frasa sandi panjang lebih kuat karena panjang adalah faktor utama keamanan, bukan kerumitan (NIST SP 800-63B).' },
        { id: 'q2', text: 'Anda menerima email dari "admin-dapodik@gmail.com" yang meminta verifikasi akun dalam 24 jam. Apa yang dilakukan?', opts: [{ id: 'a', text: 'Klik tautan dan masukkan username/password Dapodik' }, { id: 'b', text: 'Balas email untuk konfirmasi pengirim' }, { id: 'c', text: 'Hapus email, akses Dapodik langsung dari browser', correct: true }, { id: 'd', text: 'Teruskan ke rekan guru untuk pendapat kedua' }], explain: 'Selalu akses sistem secara langsung dari browser, jangan via tautan dalam email/WA.' },
        { id: 'q3', text: 'Kondisi mana yang PALING membahayakan keamanan digital sekolah?', opts: [{ id: 'a', text: 'Guru menggunakan HP pribadi untuk akses portal sekolah' }, { id: 'b', text: 'Semua guru menggunakan satu kata sandi bersama untuk absensi', correct: true }, { id: 'c', text: 'Guru akses email sekolah dari WiFi kantin' }, { id: 'd', text: 'Komputer guru tidak memiliki antivirus terbaru' }], explain: 'Password bersama menghilangkan akuntabilitas dan membuat seluruh sistem rentan jika satu orang menjadi target serangan.' },
        { id: 'q4', text: 'Mana yang BUKAN merupakan tanda phishing?', opts: [{ id: 'a', text: 'Email memiliki tekanan waktu: "Verifikasi dalam 24 jam atau diblokir!"' }, { id: 'b', text: 'Domain pengirim: kemendikbud-portal.com (bukan .go.id)' }, { id: 'c', text: 'Email dari rekan guru yang dikenal, isi pesan membahas materi biasa', correct: true }, { id: 'd', text: 'Email meminta username dan password untuk "verifikasi akun"' }], explain: 'Email dari kenalan dengan isi wajar bukan phishing. Namun jika akun rekan Anda diretas, email dari mereka bisa berbahaya.' },
        { id: 'q5', text: 'Apa yang dimaksud Multi-Factor Authentication (MFA)?', opts: [{ id: 'a', text: 'Menggunakan dua kata sandi berbeda secara bergantian' }, { id: 'b', text: 'Mendaftarkan akun di dua email cadangan' }, { id: 'c', text: 'Verifikasi identitas dengan 2+ faktor: kata sandi + kode OTP', correct: true }, { id: 'd', text: 'Meminta rekan guru memverifikasi login mencurigakan' }], explain: 'MFA menggabungkan sesuatu yang Anda TAHU (password) + sesuatu yang Anda MILIKI (HP/OTP). Meski password bocor, peretas tetap tidak bisa masuk.' },
      ]
    },
    posttest: {
      id: 'm1post',
      questions: [
        { id: 'q1', text: 'Anda ingin membuat kata sandi untuk akun Dapodik. Manakah yang paling aman?', opts: [{ id: 'a', text: 'Sari_1234!' }, { id: 'b', text: 'guru-IPA-suka-kopi-hijau', correct: true }, { id: 'c', text: 'P@ssw0rd2024' }, { id: 'd', text: 'SMPN1Bandung2024' }], explain: 'Passphrase panjang lebih kuat dari kata sandi pendek yang "rumit". Panjang mengalahkan kompleksitas.' },
        { id: 'q2', text: 'Kepala sekolah meminta kata sandi SiPeg Anda untuk keperluan mendesak. Tindakan TERBAIK?', opts: [{ id: 'a', text: 'Berikan karena beliau atasan langsung' }, { id: 'b', text: 'Hubungi IT agar buat akun sementara untuk kepala sekolah', correct: true }, { id: 'c', text: 'Login sendiri, biarkan beliau gunakan komputer Anda' }, { id: 'd', text: 'Tolak tanpa menawarkan solusi' }], explain: 'Solusi terbaik memfasilitasi pembuatan akun sementara — menyelesaikan masalah tanpa melanggar keamanan.' },
        { id: 'q3', text: 'Keuntungan utama menggunakan password manager seperti Bitwarden?', opts: [{ id: 'a', text: 'Kata sandi tidak perlu diganti karena sudah tersimpan aman' }, { id: 'b', text: 'Setiap akun punya kata sandi unik kuat tanpa perlu diingat semua', correct: true }, { id: 'c', text: 'Kata sandi disimpan di server yang bisa diakses semua guru' }, { id: 'd', text: 'Menghapus kebutuhan untuk verifikasi dua langkah' }], explain: 'Password manager memungkinkan setiap akun punya kata sandi unik yang kuat, hanya perlu mengingat satu master password.' },
        { id: 'q4', text: 'WA dari nomor asing minta klik "bit.ly/verif-dapodik". Apa yang dilakukan?', opts: [{ id: 'a', text: 'Klik link untuk memeriksa apakah valid' }, { id: 'b', text: 'Balas WA untuk konfirmasi pengirim' }, { id: 'c', text: 'Abaikan dan akses Dapodik langsung dari browser', correct: true }, { id: 'd', text: 'Screenshot dan bagikan ke grup guru sebagai peringatan' }], explain: 'URL dipersingkat + nomor asing = smishing. Selalu akses sistem resmi langsung, jangan dari link WA/email.' },
        { id: 'q5', text: 'Mengapa penting mengaktifkan MFA untuk email sekolah?', opts: [{ id: 'a', text: 'Agar tidak perlu mengganti kata sandi secara berkala' }, { id: 'b', text: 'Agar tetap bisa login meskipun lupa kata sandi' }, { id: 'c', text: 'Agar peretas tidak bisa masuk meski mengetahui kata sandi', correct: true }, { id: 'd', text: 'Agar bisa login dari banyak perangkat sekaligus' }], explain: 'MFA memastikan kata sandi yang bocor saja tidak cukup — peretas juga butuh kode OTP dari HP Anda.' },
      ]
    }
  },
  {
    id: 'm2', title: 'Keamanan Email', icon: '📧',
    color: '#1d3280', colorLight: '#eff6ff',
    badge: 'emaildef', time: '30 mnt', dimension: 'Knowledge + Skill',
    status: 'active',
    desc: 'Mampu mengidentifikasi email berbahaya dan mengambil langkah darurat setelah insiden klik phishing.',
    objective: 'Membaca tanda bahaya email phishing, memverifikasi link sebelum klik, dan merespons darurat setelah terlanjur klik tautan berbahaya.',
    facilitatorNote: 'Tunjukkan contoh header email asli vs palsu. Demo cara hover mouse di atas link untuk melihat URL tujuan di status bar browser. Diskusikan: "Apakah Anda pernah menerima email mencurigakan?"',
    lessons: [
      {
        id: 'm2l1', title: 'Mengapa Email Jadi Target Utama?', type: 'reading', emoji: '📖', typeLabel: 'Membaca', dur: '5 mnt', xp: 50,
        content: {
          sections: [
            { type: 'intro', text: 'Email adalah vektor serangan #1 dalam kejahatan siber. <strong>94% malware</strong> dikirimkan melalui email (Verizon DBIR 2023). Bagi guru, email dinas adalah pintu masuk ke seluruh sistem sekolah.' },
            { type: 'stat', title: 'Fakta Mengejutkan', text: 'Rata-rata, seseorang menerima <strong>1 dari 99 email</strong> yang merupakan phishing. Di Indonesia, serangan phishing meningkat <strong>40%</strong> selama pandemi dan belum turun signifikan.' },
            { type: 'case', title: 'Tipe Serangan Email', text: '<strong>Phishing</strong>: Email massal ke banyak target dengan pesan generik.<br><strong>Spear Phishing</strong>: Ditargetkan ke individu spesifik dengan data personal.<br><strong>BEC</strong> (Business Email Compromise): Penyerang pura-pura jadi atasan untuk minta transfer dana.' },
            { type: 'warning', title: 'Tanda Bahaya Email — 6 Indikator', text: '① Domain pengirim tidak sesuai (ketik manual di browser)<br>② Tekanan waktu dan urgency yang tidak wajar<br>③ Permintaan informasi sensitif (password, OTP, data pribadi)<br>④ Link yang tidak sesuai dengan teks yang ditampilkan<br>⑤ Lampiran mencurigakan (.exe, .zip dari pengirim asing)<br>⑥ Salam generik: "Kepada Pengguna" bukan nama Anda' },
            { type: 'tip', title: 'Cara Verifikasi Email', text: 'Sebelum klik tautan:<br>1. <strong>Hover</strong> mouse di atas link — lihat URL di status bar<br>2. Periksa domain: harus berakhiran <strong>.go.id</strong> untuk instansi pemerintah<br>3. Jika ragu, akses langsung via browser — jangan klik link email' },
          ]
        }
      },
      {
        id: 'm2l2', title: 'Membaca Header & Link Email', type: 'interactive', emoji: '🔍', typeLabel: 'Interaktif', dur: '8 mnt', xp: 75,
        content: {
          intro: 'Setiap email memiliki "jejak digital" yang bisa dianalisis. Pelajari cara membaca indikator penting ini:',
          checks: [
            { label: 'Domain Pengirim', good: 'noreply@sipeg.kemdikbud.go.id', bad: 'noreply@kemdikbud-sipeg.net', note: 'Domain resmi pemerintah selalu berakhiran <strong>.go.id</strong>' },
            { label: 'Display Name', good: 'Dapodik <dapodik@kemdikbud.go.id>', bad: 'Dapodik Resmi <admin@gmail-dapodik.com>', note: 'Nama tampilan bisa dipalsukan. Selalu periksa alamat email dalam <>'},
            { label: 'URL Tujuan Link', good: 'https://sipeg.kemdikbud.go.id/login', bad: 'https://kemdikbud-login-verif.xyz/sipeg', note: 'Hover mouse di atas link untuk melihat URL tujuan sebelum klik' },
            { label: 'Protokol', good: 'https:// (ada ikon gembok)', bad: 'http:// (tidak terenkripsi)', note: 'HTTPS berarti koneksi terenkripsi, TAPI tidak menjamin situs aman — phishing pun bisa pakai HTTPS' },
          ],
        }
      },
      {
        id: 'm2l3', title: 'Sudah Klik? Langkah Darurat', type: 'scenario', emoji: '🚨', typeLabel: 'Skenario', dur: '8 mnt', xp: 75,
        content: {
          setup: 'Anda tidak sengaja mengklik tautan dalam email yang ternyata phishing dan memasukkan username Dapodik Anda. Beberapa detik kemudian Anda sadar ada yang salah.',
          question: 'Apa langkah pertama yang BENAR?',
          choices: [
            { id: 'a', text: 'Tunggu beberapa hari untuk melihat apakah terjadi sesuatu', correct: false, fb: 'Menunggu adalah pilihan terburuk. Setiap menit sangat berharga — peretas bisa segera menggunakan kredensial Anda untuk mengakses akun.' },
            { id: 'b', text: 'Segera ganti password Dapodik dari tab/browser baru, hubungi IT sekolah', correct: true, fb: 'Tepat! Ganti password segera meminimalisir window waktu bagi peretas. Hubungi IT untuk memantau akun dan periksa log aktivitas.' },
            { id: 'c', text: 'Matikan komputer dan cabut dari internet agar aman', correct: false, fb: 'Mematikan komputer tidak membantu karena serangan sudah terjadi di level akun. Anda justru perlu segera ganti password dari perangkat lain yang aman.' },
          ],
        }
      },
    ],
    pretest: { id: 'm2pre', questions: [
      { id: 'q1', text: 'Apa yang dimaksud dengan spear phishing?', opts: [{ id: 'a', text: 'Phishing via aplikasi media sosial' }, { id: 'b', text: 'Phishing bertarget yang menggunakan data personal korban', correct: true }, { id: 'c', text: 'Phishing melalui pesan SMS' }, { id: 'd', text: 'Phishing menggunakan lampiran berisi virus' }], explain: 'Spear phishing menggunakan informasi personal (nama, jabatan, sekolah) untuk membuat email terlihat lebih meyakinkan.' },
      { id: 'q2', text: 'Email dari "Dapodik Resmi <admin@gmail-kemdikbud.com>" meminta verifikasi password. Apa yang salah?', opts: [{ id: 'a', text: 'Tidak ada yang salah, Gmail bisa digunakan untuk email resmi' }, { id: 'b', text: 'Domain @gmail.com bukan domain resmi pemerintah', correct: true }, { id: 'c', text: 'Format email terlalu formal untuk dinas' }, { id: 'd', text: 'Dapodik seharusnya tidak mengirim email' }], explain: 'Email resmi pemerintah menggunakan domain .go.id, bukan Gmail atau platform email publik lainnya.' },
      { id: 'q3', text: 'Cara terbaik untuk memeriksa URL tujuan sebelum mengklik link dalam email?', opts: [{ id: 'a', text: 'Klik link, lalu periksa URL di address bar browser' }, { id: 'b', text: 'Salin link ke notepad dan baca' }, { id: 'c', text: 'Hover mouse di atas link dan lihat URL di status bar browser', correct: true }, { id: 'd', text: 'Minta rekan untuk mengklik terlebih dahulu' }], explain: 'Hover mouse di atas link menampilkan URL tujuan di status bar browser tanpa harus mengklik.' },
      { id: 'q4', text: 'Anda terlanjur klik link phishing dan memasukkan password. Langkah PERTAMA?', opts: [{ id: 'a', text: 'Matikan komputer segera' }, { id: 'b', text: 'Tunggu 24 jam dan periksa apakah ada yang aneh' }, { id: 'c', text: 'Ganti password akun yang terkompromi segera dari perangkat aman', correct: true }, { id: 'd', text: 'Pasang antivirus dan scan komputer' }], explain: 'Ganti password segera untuk meminimalisir window waktu bagi peretas menggunakan kredensial Anda.' },
      { id: 'q5', text: 'Mana pernyataan BENAR tentang HTTPS?', opts: [{ id: 'a', text: 'HTTPS menjamin situs tersebut aman dan tidak berbahaya' }, { id: 'b', text: 'HTTPS hanya untuk situs perbankan' }, { id: 'c', text: 'HTTPS berarti koneksi terenkripsi, tapi tidak menjamin situs aman', correct: true }, { id: 'd', text: 'Situs tanpa HTTPS pasti phishing' }], explain: 'Situs phishing pun bisa menggunakan HTTPS. Gembok hanya menjamin enkripsi data, bukan keamanan konten situs.' },
    ]},
    posttest: { id: 'm2post', questions: [
      { id: 'q1', text: 'Email dari "Kepala Dinas <kadis@dinas-pendidikan-bdg.com>". Apa yang perlu diperiksa pertama?', opts: [{ id: 'a', text: 'Apakah isi email masuk akal' }, { id: 'b', text: 'Apakah domain email sesuai dengan domain resmi dinas', correct: true }, { id: 'c', text: 'Apakah email tersebut ada lampiran' }, { id: 'd', text: 'Apakah email menggunakan bahasa formal' }], explain: 'Domain yang benar untuk instansi pemerintah harus berakhiran .go.id. ".com" sudah menjadi tanda bahaya.' },
      { id: 'q2', text: 'Kolega mengirim email berisi link dengan teks "Klik di sini untuk materi rapat". Bagaimana cara aman memeriksanya?', opts: [{ id: 'a', text: 'Klik langsung karena dari kolega yang dikenal' }, { id: 'b', text: 'Hover mouse di atas link untuk melihat URL tujuan sebelum klik', correct: true }, { id: 'c', text: 'Teruskan email ke IT untuk diperiksa sebelum diklik' }, { id: 'd', text: 'Tidak perlu diperiksa jika email datang dari seseorang yang dikenal' }], explain: 'Akun kolega bisa diretas. Selalu verifikasi URL sebelum klik, terlepas dari siapa pengirimnya.' },
      { id: 'q3', text: 'Apa perbedaan utama phishing biasa vs spear phishing?', opts: [{ id: 'a', text: 'Spear phishing lebih mudah dideteksi karena lebih canggih' }, { id: 'b', text: 'Phishing biasa menggunakan lampiran; spear phishing tidak' }, { id: 'c', text: 'Spear phishing menggunakan data personal target untuk tampak meyakinkan', correct: true }, { id: 'd', text: 'Phishing biasa hanya menyerang email dinas' }], explain: 'Spear phishing lebih berbahaya karena personalisasi membuatnya sulit dibedakan dari komunikasi legitimate.' },
      { id: 'q4', text: 'Setelah mengklik link phishing, urutan langkah darurat yang benar?', opts: [{ id: 'a', text: 'Scan virus → ganti password → hubungi IT → laporkan ke BSSN' }, { id: 'b', text: 'Ganti password segera → hubungi IT → dokumentasi → laporkan jika perlu', correct: true }, { id: 'c', text: 'Matikan komputer → hubungi IT → tunggu instruksi' }, { id: 'd', text: 'Hapus email → ganti password → tidak perlu laporan jika tidak ada yang aneh' }], explain: 'Prioritas utama: ganti password segera untuk menghentikan akses peretas, lalu eskalasi ke IT.' },
      { id: 'q5', text: 'Email resmi dari instansi pemerintah Indonesia menggunakan domain?', opts: [{ id: 'a', text: '.com atau .org karena lebih mudah' }, { id: 'b', text: '.id karena ini Indonesia' }, { id: 'c', text: '.go.id untuk semua lembaga pemerintah', correct: true }, { id: 'd', text: '.ac.id untuk semua instansi pendidikan' }], explain: '.go.id adalah TLD resmi pemerintah Indonesia. .ac.id untuk perguruan tinggi, .sch.id untuk sekolah dasar/menengah.' },
    ]}
  },
  {
    id: 'm3', title: 'Pelaporan Insiden', icon: '🚨',
    color: '#b91c1c', colorLight: '#fef2f2',
    badge: 'crisis', time: '30 mnt', dimension: 'Skill + Attitude',
    status: 'active',
    desc: 'Mampu mengidentifikasi insiden keamanan siber dan melaporkannya ke kanal resmi yang tepat.',
    objective: 'Mengenali 6 tanda insiden siber, mengikuti prosedur 5 langkah respons, dan menghubungi kanal pelaporan yang benar.',
    facilitatorNote: 'Lakukan role-play: peserta dibagi menjadi "korban insiden" dan "tim respons". Korban mendeskripsikan insiden, tim respons memandu 5 langkah. Perkuat: melapor bukan berarti mengaku bersalah.',
    lessons: [
      {
        id: 'm3l1', title: 'Kenali Jenis Insiden Siber', type: 'reading', emoji: '📖', typeLabel: 'Membaca', dur: '6 mnt', xp: 50,
        content: {
          sections: [
            { type: 'intro', text: 'Tidak semua masalah komputer adalah insiden keamanan siber. Namun beberapa tanda harus membuat Anda waspada dan segera bertindak.' },
            { type: 'stat', title: 'Definisi Insiden Keamanan', text: 'Insiden keamanan adalah peristiwa yang mengancam <strong>kerahasiaan, integritas, atau ketersediaan</strong> (CIA Triad) data atau sistem sekolah. UU PDP mengharuskan pelaporan pelanggaran data dalam <strong>14 hari kerja</strong>.' },
            { type: 'case', title: '6 Tanda Insiden Siber di Sekolah', text: '① <strong>Akun terkunci</strong> padahal tidak salah input password<br>② <strong>Email terkirim</strong> sendiri ke banyak kontak tanpa sepengetahuan Anda<br>③ <strong>Password tidak bekerja</strong> lagi — tanda akun diambil alih<br>④ <strong>Pesan aneh</strong> dari rekan yang tidak pernah mereka kirim<br>⑤ <strong>Komputer lamban</strong>, program berjalan sendiri<br>⑥ <strong>Tagihan tidak wajar</strong> atau aktivitas keuangan tak dikenal' },
            { type: 'warning', title: 'Konsekuensi UU PDP No. 27/2022', text: 'Sekolah yang tidak melaporkan pelanggaran data dalam 14 hari kerja dapat dikenai denda administratif. Data siswa (nama, nilai, kondisi keluarga) termasuk <strong>data pribadi yang dilindungi</strong>.' },
            { type: 'tip', title: 'Saluran Pelaporan Resmi Indonesia', text: '• <strong>BSSN Gov-CSIRT</strong>: bantuan70@bssn.go.id<br>• <strong>Polri Patrolisiber</strong>: patrolisiber.id<br>• <strong>LAPOR!</strong>: lapor.go.id (untuk layanan publik)<br>• <strong>Internal</strong>: Tim IT sekolah / Dinas Pendidikan' },
          ]
        }
      },
      {
        id: 'm3l2', title: '5 Langkah Respons Insiden', type: 'reading', emoji: '📋', typeLabel: 'Panduan', dur: '7 mnt', xp: 75,
        content: {
          sections: [
            { type: 'intro', text: 'Saat insiden terjadi, panik adalah musuh terbesar Anda. Ikuti 5 langkah terstruktur ini untuk meminimalisir kerusakan.' },
            { type: 'case', title: 'Langkah 1: TENANG & ASSES', text: 'Ambil napas. Identifikasi: apa yang terjadi? Sistem/data apa yang terdampak? Siapa lagi yang mungkin terdampak? Jangan hapus apapun dulu — bukti digital penting untuk investigasi.' },
            { type: 'case', title: 'Langkah 2: ISOLASI', text: 'Putuskan koneksi perangkat dari internet (WiFi/Ethernet) untuk mencegah penyebaran. Jika HP: aktifkan mode pesawat. JANGAN matikan perangkat — memori bisa berisi bukti penting.' },
            { type: 'case', title: 'Langkah 3: DOKUMENTASI', text: 'Foto/screenshot semua yang terlihat: pesan error, notifikasi aneh, aktivitas tidak dikenal. Catat waktu kejadian dan apa yang Anda lakukan sebelumnya.' },
            { type: 'case', title: 'Langkah 4: LAPOR', text: 'Hubungi IT sekolah/dinas segera. Jika data siswa terdampak, wajib lapor ke BSSN (bantuan70@bssn.go.id). Untuk kejahatan siber, lapor ke Polri Patrolisiber.' },
            { type: 'case', title: 'Langkah 5: PULIHKAN', text: 'Ganti semua password yang mungkin terkompromi. Aktifkan MFA. Periksa log akses akun. Informasikan pihak yang terdampak (siswa/orang tua jika data mereka bocor).' },
          ]
        }
      },
      {
        id: 'm3l3', title: 'Simulasi Krisis: HP Sekolah Hilang', type: 'scenario', emoji: '📱', typeLabel: 'Skenario', dur: '10 mnt', xp: 100,
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
    pretest: { id: 'm3pre', questions: [
      { id: 'q1', text: 'Mana yang BUKAN termasuk insiden keamanan siber di sekolah?', opts: [{ id: 'a', text: 'Akun Dapodik terkunci tanpa sebab yang jelas' }, { id: 'b', text: 'Email guru mengirim pesan sendiri ke semua kontak' }, { id: 'c', text: 'Printer sekolah macet karena kehabisan toner', correct: true }, { id: 'd', text: 'HP sekolah hilang berisi data siswa' }], explain: 'Printer macet adalah masalah teknis biasa, bukan insiden keamanan. Tiga lainnya menunjukkan akun yang mungkin dikompromi atau data yang terekspos.' },
      { id: 'q2', text: 'Ketika HP sekolah berisi data siswa hilang, tindakan pertama yang benar?', opts: [{ id: 'a', text: 'Buat pengumuman di grup WA untuk mencari HP' }, { id: 'b', text: 'Lakukan remote wipe segera melalui Google/Apple', correct: true }, { id: 'c', text: 'Tunggu 24 jam sebelum mengambil tindakan' }, { id: 'd', text: 'Beli HP baru sebagai pengganti' }], explain: 'Remote wipe segera menghapus data sensitif sebelum diakses pihak tidak berwenang.' },
      { id: 'q3', text: 'Dalam berapa hari kerja sekolah wajib melaporkan pelanggaran data ke BSSN (sesuai UU PDP)?', opts: [{ id: 'a', text: '7 hari kerja' }, { id: 'b', text: '14 hari kerja', correct: true }, { id: 'c', text: '30 hari kerja' }, { id: 'd', text: 'Tidak ada kewajiban waktu' }], explain: 'UU PDP No. 27/2022 mengharuskan pelaporan pelanggaran data ke BSSN dalam 14 hari kerja sejak insiden terdeteksi.' },
      { id: 'q4', text: 'Kanal pelaporan resmi insiden siber untuk instansi pemerintah Indonesia?', opts: [{ id: 'a', text: 'OJK (Otoritas Jasa Keuangan)' }, { id: 'b', text: 'BSSN Gov-CSIRT (bantuan70@bssn.go.id)', correct: true }, { id: 'c', text: 'Menkominfo secara langsung' }, { id: 'd', text: 'Media sosial resmi Kemendikbud' }], explain: 'BSSN Gov-CSIRT adalah kanal utama pelaporan insiden siber untuk instansi pemerintah, termasuk sekolah negeri.' },
      { id: 'q5', text: 'Mengapa TIDAK disarankan langsung mematikan komputer saat terjadi insiden malware?', opts: [{ id: 'a', text: 'Mematikan komputer bisa menyebarkan malware ke komputer lain' }, { id: 'b', text: 'Proses shutdown bisa memperparah kerusakan file' }, { id: 'c', text: 'Memori (RAM) berisi bukti digital yang hilang saat dimatikan', correct: true }, { id: 'd', text: 'Tidak ada alasan — mematikan komputer selalu langkah pertama yang benar' }], explain: 'Volatile memory (RAM) bisa berisi bukti penting seperti proses malware yang berjalan, yang hilang saat komputer dimatikan.' },
    ]},
    posttest: { id: 'm3post', questions: [
      { id: 'q1', text: 'Urutan 5 langkah respons insiden yang benar?', opts: [{ id: 'a', text: 'Lapor → Isolasi → Dokumentasi → Tenang → Pulihkan' }, { id: 'b', text: 'Tenang & Asses → Isolasi → Dokumentasi → Lapor → Pulihkan', correct: true }, { id: 'c', text: 'Pulihkan → Lapor → Dokumentasi → Isolasi → Tenang' }, { id: 'd', text: 'Isolasi → Matikan → Pulihkan → Lapor → Dokumentasi' }], explain: 'Urutan benar memastikan bukti tidak hilang (jangan langsung matikan/pulihkan) dan eskalasi tepat waktu.' },
      { id: 'q2', text: 'Email Anda mengirim pesan ke ratusan kontak tanpa sepengetahuan Anda. Langkah pertama?', opts: [{ id: 'a', text: 'Kirim email permintaan maaf ke semua yang menerima pesan' }, { id: 'b', text: 'Ganti password email dari perangkat lain yang aman', correct: true }, { id: 'c', text: 'Hapus akun email dan buat akun baru' }, { id: 'd', text: 'Matikan komputer dan tunggu bantuan IT' }], explain: 'Akun terkompromi — ganti password segera untuk menghentikan pengiriman spam lebih lanjut.' },
      { id: 'q3', text: 'Data nilai siswa bocor akibat serangan pada portal sekolah. Siapa yang WAJIB dinotifikasi?', opts: [{ id: 'a', text: 'Hanya kepala sekolah dan IT' }, { id: 'b', text: 'Hanya Dinas Pendidikan' }, { id: 'c', text: 'BSSN, Dinas Pendidikan, dan orang tua siswa yang data-nya terekspos', correct: true }, { id: 'd', text: 'Tidak perlu melapor jika sudah diperbaiki' }], explain: 'UU PDP mengharuskan notifikasi ke pihak yang data-nya terdampak, selain ke BSSN dan otoritas terkait.' },
      { id: 'q4', text: 'Guru terlanjur mengklik link malware dan laptop menampilkan pesan ransom. Langkah darurat yang BENAR?', opts: [{ id: 'a', text: 'Bayar ransom segera agar data kembali' }, { id: 'b', text: 'Format laptop untuk menghapus malware' }, { id: 'c', text: 'Cabut dari jaringan, foto layar sebagai dokumentasi, hubungi IT segera', correct: true }, { id: 'd', text: 'Restart laptop dan instal antivirus' }], explain: 'Isolasi segera mencegah penyebaran ransomware ke perangkat lain di jaringan sekolah.' },
      { id: 'q5', text: 'Apa langkah "ISOLASI" dalam respons insiden?', opts: [{ id: 'a', text: 'Mematikan semua komputer di sekolah' }, { id: 'b', text: 'Memutus perangkat terdampak dari internet tanpa mematikannya', correct: true }, { id: 'c', text: 'Mengisolasi ruang komputer secara fisik' }, { id: 'd', text: 'Membatasi akses pengguna ke sistem' }], explain: 'Isolasi berarti memutus koneksi jaringan (WiFi off/cabut ethernet) tanpa mematikan perangkat, sehingga bukti di RAM tetap terjaga.' },
    ]}
  },
  {
    id: 'm4', title: 'Keamanan Perangkat', icon: '💻', color: '#5b21b6', colorLight: '#f5f3ff',
    badge: null, time: '35 mnt', dimension: 'Knowledge + Behaviour', status: 'coming',
    desc: 'Memahami pentingnya pembaruan sistem, pengaturan keamanan perangkat, dan backup data.',
    objective: 'Mengelola pembaruan Windows/Android secara bijak dan menerapkan strategi backup 3-2-1.',
    facilitatorNote: 'Demo langsung: tunjukkan cara memeriksa pembaruan Windows di sekolah.',
    lessons: [], pretest: { id: 'm4pre', questions: [] }, posttest: { id: 'm4post', questions: [] }
  },
  {
    id: 'm5', title: 'Internet Safety & Data', icon: '🌐', color: '#1d4ed8', colorLight: '#eff6ff',
    badge: null, time: '40 mnt', dimension: 'Knowledge + Skill + Attitude', status: 'coming',
    desc: 'Aman saat berselancar dan melindungi data pribadi sesuai UU PDP No. 27/2022.',
    objective: 'Membaca URL dengan benar dan mengklasifikasikan data menurut UU PDP.',
    facilitatorNote: 'Demonstrasikan cara membaca URL dari kanan ke kiri. Bahas kasus OTP scam.',
    lessons: [], pretest: { id: 'm5pre', questions: [] }, posttest: { id: 'm5post', questions: [] }
  },
  {
    id: 'm6', title: 'Media Sosial & Privasi', icon: '📱', color: '#7c3aed', colorLight: '#f5f3ff',
    badge: null, time: '30 mnt', dimension: 'Knowledge + Attitude', status: 'coming',
    desc: 'Mengelola privasi di media sosial dan mengamankan perangkat mobile dari ancaman siber.',
    objective: 'Mengonfigurasi pengaturan privasi Instagram dan WhatsApp.',
    facilitatorNote: 'Minta peserta cek pengaturan privasi Instagram/WA mereka saat sesi.',
    lessons: [], pretest: { id: 'm6pre', questions: [] }, posttest: { id: 'm6post', questions: [] }
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
