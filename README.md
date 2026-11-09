# MisiKelas AI

**Ejen AI Adaptif yang Menukar Pelajaran kepada Misi Permainan Kelas**
Penyertaan: The Solution Arena — Agentic AI Challenge 2026, Festival Idea Putrajaya (FOI) 2026
Peserta: Prof. Madya Ts. Dr. Shamsul Arrieya Ariffin, Fakulti Komputeran dan Meta-Teknologi, UPSI

---

## Kandungan

1. [Akaun demo](#1-akaun-demo)
2. [Apa yang ada dalam pakej ini](#2-apa-yang-ada-dalam-pakej-ini)
3. [Cuba dahulu di komputer (2 minit)](#3-cuba-dahulu-di-komputer-2-minit)
4. [Muat naik ke GitHub dan terbitkan secara percuma (10 minit)](#4-muat-naik-ke-github-dan-terbitkan-secara-percuma-10-minit)
5. [Buka di telefon dan pasang sebagai aplikasi](#5-buka-di-telefon-dan-pasang-sebagai-aplikasi)
6. [Pilihan: mod berbilang peranti (Firebase Database)](#6-pilihan-mod-berbilang-peranti-firebase-database)
7. [Pilihan: log masuk sebenar (Firebase Authentication)](#7-pilihan-log-masuk-sebenar-firebase-authentication)
8. [Pilihan: sambung AI sebenar (Google Gemini, percuma)](#8-pilihan-sambung-ai-sebenar-google-gemini-percuma)
9. [Pilihan: jadikan fail APK Android](#9-pilihan-jadikan-fail-apk-android)
10. [Cara algoritma adaptif berfungsi](#10-cara-algoritma-adaptif-berfungsi)
11. [Skrip demo 3 minit untuk juri](#11-skrip-demo-3-minit-untuk-juri)
12. [Masalah lazim](#12-masalah-lazim)
13. [Seni bina kod dan hala tuju](#13-seni-bina-kod-dan-hala-tuju)

---

## 1. Akaun demo

### Guru, pentadbir dan juri (tab "Guru / Staf")

| Peranan | E-mel (ID log masuk) | Kata laluan | Boleh buat |
|---|---|---|---|
| **Pentadbir** | `admin@misikelas.demo` | `Admin@2026` | Urus pelajar & PIN, lihat status sistem, buka semua paparan guru |
| **Guru** | `guru@misikelas.demo` | `Guru@2026` | Jana & lulus misi, Kelas Langsung, Kumpulan, Analitik, profil individu, reset PIN, laporan |
| **Juri / Pemerhati** | `juri@misikelas.demo` | `Juri@2026` | Lihat semua paparan guru; butang yang mengubah data **dinyahaktifkan** |

### Pelajar (tab "Pelajar")

| Pelajar | Kod kelas | Nama samaran | PIN | Profil data simulasi |
|---|---|---|---|---|
| Pelajar kuat | `DEMO` | `Harimau01` | `1111` | Kuat dalam semua kemahiran |
| Pelajar lemah Etika | `DEMO` | `Kekwa17` | `2222` | Lemah dalam Etika & Bias dan AI Berpusatkan Insan |
| Pelajar lemah AI Generatif | `DEMO` | `Siamang21` | `3333` | Lemah dalam AI Generatif |
| Pelajar simulasi lain | `DEMO` | contoh `Helang02` | `1234` | Pelbagai |
| **Pelajar baharu** | `DEMO` | pilih sendiri (tab "Pelajar baharu") | dijana automatik | Bermula dari kosong |

**Format mudah diingat:**
- Staf: **e-mel** `@misikelas.demo` + kata laluan **Peranan@2026** (huruf besar pertama).
- Pelajar: **tiada e-mel**. Kod kelas + nama samaran + PIN 4 digit.

> 💡 Pada skrin log masuk, buka **"Akaun demo"** dan ketik mana-mana ID untuk mengisi borang secara automatik.
>
> ⚠ `@misikelas.demo` bukan e-mel sebenar. Dalam Mod Demo, kata laluan disemak dalam peranti dan boleh dibaca dalam kod di GitHub, jadi ia **untuk demonstrasi sahaja, bukan keselamatan sebenar**. Untuk keselamatan sebenar, aktifkan Bahagian 7.

---

## 2. Apa yang ada dalam pakej ini

### Ciri mengikut peranan

| Peranan | Ciri |
|---|---|
| **Pelajar** | Dashboard sendiri: XP & tahap · penguasaan setiap kemahiran (Elo) + status BKT (Belum kuasai / Sedang belajar / Kuasai) · **"Disyorkan untuk anda"** (latihan peribadi untuk kemahiran belum dikuasai) · trend kemajuan · lencana · papan markah · misi dengan Sang Kancil bersuara |
| **Guru** | Papan pemuka + **pelajar berisiko** · Jana misi dengan ejen AI · Panel kelulusan · Kelas langsung (QR, papan markah, mod projektor) · **Kumpulan** automatik (K-means) + jana misi untuk setiap kumpulan · Analitik (peta haba Elo, ★ BKT, miskonsepsi) · **Profil individu** (radar, BKT, cadangan intervensi, sejarah, reset PIN) · Laporan CSV/PDF |
| **Pentadbir** | Status sistem · akaun staf · senarai pelajar & PIN (papar, reset, tambah) · set semula data demo · akses semua paparan guru |
| **Juri** | Semua paparan guru dalam mod baca sahaja |

### Struktur fail

| Fail / folder | Fungsi |
|---|---|
| `index.html` | Halaman utama aplikasi |
| `css/style.css` | Reka bentuk responsif (telefon, tablet, desktop, projektor), mod gelap/cerah |
| `js/config.js` | **Satu-satunya fail yang anda mungkin perlu ubah**: akaun staf, kod kelas, Firebase (pilihan) |
| `js/data.js` | Bank 30 soalan, 7 miskonsepsi, misi demo, **penjana data simulasi** (28 pelajar, ±760 jawapan) |
| `js/core.js` | Storan, **Elo**, **BKT**, **K-means**, analitik, profil pelajar |
| `js/auth.js` | **Log masuk hibrid** (Mod Demo / Firebase Auth), pendaftaran pelajar baharu |
| `js/agents.js` | **4 ejen AI**: Perancang, Pereka Permainan, Penganalisis, Penyesuai |
| `js/avatar.js` | **Sang Kancil** beranimasi + suara (bercakap & mendengar) |
| `js/teacher.js` | Paparan guru (juga digunakan pentadbir & juri) |
| `js/student.js` | Paparan & permainan pelajar |
| `js/admin.js` | Paparan pentadbir |
| `js/app.js` | Penghala, kawalan akses mengikut peranan, tetapan |
| `manifest.json`, `sw.js`, `icons/` | Aplikasi mudah alih (PWA): boleh dipasang dan berfungsi tanpa internet |
| `data/` | Salinan data simulasi dalam JSON dan CSV (boleh dibuka dengan Excel/SPSS) |

> **Mod Demo** (lalai) berfungsi tanpa kunci API, tanpa Firebase dan tanpa internet. Ini paling selamat untuk pembentangan. Semua bahagian bertanda "Pilihan" boleh dilangkau.

---

## 3. Cuba dahulu di komputer (2 minit)

1. Ekstrak (unzip) fail `misikelas-ai.zip`.
2. Buka folder `misikelas-ai`.
3. Klik dua kali pada fail **`index.html`**. Gunakan **Google Chrome** untuk sokongan suara terbaik.
4. Klik **Log masuk Guru / Staf** → buka "Akaun demo" → ketik `guru@misikelas.demo` → **Log masuk**.
5. Untuk mencuba sebagai pelajar: **Log keluar** → **Log masuk Pelajar** → `Harimau01`, PIN `1111`.

> Dalam mod fail tempatan, kod QR dan fon memerlukan internet. Ciri lain berfungsi sepenuhnya.

---

## 4. Muat naik ke GitHub dan terbitkan secara percuma (10 minit)

Langkah ini dibuat menggunakan **komputer** (bukan telefon).

### Langkah 1: Buat akaun GitHub
Pergi ke **https://github.com** → **Sign up** → ikut arahan. Abaikan jika sudah ada akaun.

### Langkah 2: Buat repositori baharu
1. Klik butang **+** di penjuru kanan atas → **New repository**.
2. **Repository name**: `misikelas-ai`
3. Pilih **Public** → klik **Create repository**.

### Langkah 3: Muat naik fail
1. Pada halaman repositori baharu, klik pautan **uploading an existing file**.
2. Buka folder `misikelas-ai` di komputer. **Pilih semua kandungan di dalamnya** (Ctrl+A / Cmd+A).
3. **Seret** semuanya ke kawasan muat naik di GitHub.

   ⚠ Seret **kandungan** folder, bukan folder `misikelas-ai` itu sendiri. Fail `index.html` mesti berada di tahap paling atas repositori.
4. Tunggu muat naik selesai → klik butang hijau **Commit changes**.

### Langkah 4: Hidupkan GitHub Pages
1. Klik tab **Settings** → menu kiri **Pages**.
2. **Source**: pilih **Deploy from a branch**.
3. **Branch**: pilih **main** dan **/ (root)** → **Save**.
4. Tunggu 1–2 minit, kemudian muat semula halaman. Pautan aplikasi akan muncul, contohnya:

   **`https://NAMA-PENGGUNA-ANDA.github.io/misikelas-ai/`**

5. Buka pautan itu. Aplikasi anda kini dalam talian! 🎉

### Mengemas kini kemudian
Repositori → **Add file** → **Upload files** → seret fail yang diubah → **Commit changes**. Jika telefon masih menunjukkan versi lama, tutup dan buka semula aplikasi.

---

## 5. Buka di telefon dan pasang sebagai aplikasi

1. Buka pautan GitHub Pages di telefon.
2. **Android (Chrome)**: menu **⋮** → **Add to Home screen / Install app**.
3. **iPhone (Safari)**: ikon **Kongsi** → **Add to Home Screen**.

---

## 6. Pilihan: mod berbilang peranti (Firebase Database)

Tanpa Firebase, setiap peranti menyimpan data sendiri. Papan markah langsung hanya dikemas kini antara tab pada peranti yang sama. Untuk demo di mana juri mengimbas QR dengan **telefon masing-masing**:

1. Pergi ke **https://console.firebase.google.com** → **Create a project** → nama `misikelas-ai` → ikut arahan.
2. Menu kiri: **Build** → **Realtime Database** → **Create Database** → lokasi **Singapore (asia-southeast1)** → **Start in test mode** → **Enable**.
3. Klik **⚙ Project settings** → **Your apps** → ikon **`</>`** (Web) → nama `misikelas` → **Register app**.
4. Salin kod `const firebaseConfig = { ... }` yang dipaparkan. Pastikan ada baris `databaseURL`; jika tiada, salin URL dari halaman Realtime Database dan tambah `databaseURL: "URL-itu",`.
5. Di GitHub: repositori → folder **`js`** → **`config.js`** → ikon **pensel ✏**.
6. Gantikan `MK.FIREBASE_CONFIG = null;` dengan kod yang disalin, tetapi tukar `const firebaseConfig =` kepada **`MK.FIREBASE_CONFIG =`** (contoh lengkap ada dalam fail).
7. **Commit changes** → tunggu 1–2 minit → buka aplikasi. Mesej "Firebase bersambung" akan muncul.

> ⚠ "Test mode" membuka pangkalan data selama 30 hari dan sesuai untuk **demo sahaja**. Jangan simpan data peribadi sebenar.

---

## 7. Pilihan: log masuk sebenar (Firebase Authentication)

Lengkapkan Bahagian 6 dahulu.

1. Firebase Console → **Build** → **Authentication** → **Get started** → **Email/Password** → **Enable** → **Save**.
2. Tab **Users** → **Add user**. Cipta tiga pengguna dengan e-mel yang sama seperti dalam `js/config.js`:
   `admin@misikelas.demo`, `guru@misikelas.demo`, `juri@misikelas.demo`. **Gunakan kata laluan baharu yang kukuh**, bukan kata laluan demo.
3. Di GitHub, sunting `js/config.js`: tukar `MK.FIREBASE_AUTH = false;` kepada **`MK.FIREBASE_AUTH = true;`**.
4. Untuk keselamatan, padam nilai `password` dalam `MK.STAFF` (biarkan `""`). Dalam Mod Firebase, kata laluan disemak oleh Firebase, bukan oleh fail ini.
5. **Commit changes**. Skrin log masuk kini memaparkan "🔐 Mod Firebase".

Peranan setiap e-mel ditentukan oleh senarai `MK.STAFF` dalam `config.js`. Untuk menambah guru baharu: tambah baris dalam `MK.STAFF` dan cipta pengguna yang sama di Firebase.

> Pelajar tetap log masuk dengan kod kelas + nama samaran + PIN (tiada e-mel), sesuai untuk pelajar bawah umur dan selaras dengan prinsip data minimum PDPA 2010. Untuk produk sebenar, semakan PIN wajar dipindahkan ke pelayan (Fasa 2).

---

## 8. Pilihan: sambung AI sebenar (Google Gemini, percuma)

Mod Demo menggunakan bank soalan terbina dalam. Untuk menjana misi daripada **sebarang topik atau nota guru**:

1. Pergi ke **https://aistudio.google.com/apikey** → log masuk → **Create API key** → salin.
2. Dalam aplikasi, log masuk sebagai guru → ikon **⚙** (kanan atas).
3. **Enjin AI**: **Google Gemini** → tampal kunci → **Simpan**.
4. **Jana Misi** → masukkan topik baharu → **Jalankan Ejen AI**.

> 🔐 Kunci API disimpan dalam pelayar peranti ini sahaja. **Jangan sekali-kali** menulis kunci API dalam fail yang dimuat naik ke GitHub.
> Jika nama model Gemini berubah, kemas kini di **⚙ → Tetapan lanjutan**. Pilihan **Anthropic Claude** juga tersedia.

---

## 9. Pilihan: jadikan fail APK Android

1. Pastikan aplikasi sudah diterbitkan di GitHub Pages (Bahagian 4).
2. Pergi ke **https://www.pwabuilder.com** → tampal pautan GitHub Pages → **Start**.
3. **Package For Stores** → **Android** → **Generate Package**.
4. Muat turun, ekstrak, dan pasang fail **`.apk`** pada telefon Android. Fail `.aab` dalam pakej yang sama digunakan untuk Google Play Store.

---

## 10. Cara algoritma adaptif berfungsi

| Lapisan | Algoritma | Soalan yang dijawab | Di mana kelihatan |
|---|---|---|---|
| 1 | **Bayesian Knowledge Tracing (BKT)** | "Adakah pelajar ini *sudah menguasai* kemahiran ini?" | Status kemahiran pelajar, ★ dalam peta haba, profil individu, "Disyorkan untuk anda" |
| 2 | **Elo** (K menurun) | "Soalan *mana* yang sesuai sekarang?" | "🎯 Peluang …%" semasa bermain, peta haba, radar |
| 3 | **K-means** | "Pelajar mana yang mempunyai corak kelemahan yang sama?" | Tab Kumpulan |
| 4 | **Ejen Penganalisis & Penyesuai** (LLM / peraturan) | "Apakah miskonsepsi utama dan apa intervensinya?" | Analitik, misi pemulihan |

**Cara soalan dipilih untuk setiap pelajar:**
1. BKT mengenal pasti kemahiran yang **belum dikuasai** (P(kuasai) < 95%) dan mengutamakan yang paling lemah.
2. Dalam kemahiran itu, Elo memilih soalan dengan **peluang berjaya ±70%** (tidak terlalu mudah, tidak terlalu sukar).
3. Sang Kancil memberi petunjuk jika pelajar diam 20 saat; 2 salah berturut-turut menghasilkan soalan lebih mudah.

**Parameter BKT** (nilai lazim literatur; boleh dianggar semula dengan data sebenar dalam Fasa 2):

| P(L₀) sudah tahu | P(T) belajar | P(G) meneka | P(S) tersilap | Ambang kuasai |
|---|---|---|---|---|
| 0.20 | 0.15 | 0.25 | 0.10 | 0.95 |

Contoh: jawapan betul, betul, salah, betul, betul → P(kuasai) 20% → 55% → 84% → 51% → 82% → **95% (Kuasai)**.

**Rujukan:**
- Corbett, A. T., & Anderson, J. R. (1994). Knowledge tracing: Modeling the acquisition of procedural knowledge. *User Modeling and User-Adapted Interaction, 4*(4), 253–278. https://doi.org/10.1007/BF01099821
- Pelánek, R. (2016). Applications of the Elo rating system in adaptive educational systems. *Computers & Education, 98*, 169–179. https://doi.org/10.1016/j.compedu.2016.03.017

---

## 11. Skrip demo 3 minit untuk juri

| Masa | Langkah | Apa yang disebut |
|---|---|---|
| 0:00 | Laman utama → log masuk sebagai **guru** | "Setiap stakeholder mempunyai akses mengikut peranan." |
| 0:15 | **Jana Misi** → Jalankan Ejen AI | "Ejen Perancang dan Pereka Permainan membina misi secara automatik." |
| 0:40 | **Kelulusan** → Luluskan | "Tiada kandungan AI sampai kepada pelajar tanpa kelulusan guru." |
| 0:55 | **Kelas Langsung** → QR; juri log masuk sebagai `Kekwa17` / `2222` | "Pelajar sertai dengan telefon menggunakan kod kelas dan PIN." |
| 1:15 | Juri main 2–3 soalan (cuba 🎤) | "BKT memilih kemahiran yang belum dikuasai; Elo memilih aras soalan. Kancil memberi petunjuk jika pelajar diam." |
| 1:45 | Dashboard pelajar → **Disyorkan untuk anda** | "Setiap pelajar mendapat latihan peribadi berbeza." |
| 2:00 | Guru → **Kumpulan** → jana misi untuk satu kumpulan | "K-means membentuk kumpulan; Ejen Penyesuai menjana misi pemulihan." |
| 2:25 | Klik nama pelajar → **profil individu** | "Guru melihat radar, status penguasaan, miskonsepsi dan cadangan intervensi." |
| 2:45 | Penutup | "Rancang, Bina, Laksana, Nilai, Suai: kitaran agentik lengkap, dengan guru sebagai pembuat keputusan." |

> Sebut dengan jujur: "Data kelas yang dipaparkan ialah data simulasi untuk demonstrasi."
> Sebelum pembentangan: log masuk sebagai **pentadbir** → **Set semula data demo**.
> Berikan akaun `juri@misikelas.demo` / `Juri@2026` kepada juri supaya mereka boleh meneroka dalam mod baca sahaja.

---

## 12. Masalah lazim

| Masalah | Penyelesaian |
|---|---|
| GitHub Pages menunjukkan ralat 404 | Tunggu 2 minit. Pastikan `index.html` berada di tahap atas repositori. |
| "E-mel atau kata laluan salah" | Semak huruf besar/kecil kata laluan (contoh `Guru@2026`). Dalam Mod Firebase, gunakan kata laluan yang dicipta di Firebase Console. |
| Pelajar lupa PIN | Guru: klik nama pelajar → **Tetapkan semula PIN**. Pentadbir: **Senarai pelajar & PIN**. |
| Pelajar baharu yang didaftar di telefon tidak boleh log masuk di peranti lain | Tanpa Firebase, data disimpan dalam peranti masing-masing. Aktifkan Bahagian 6. |
| Sang Kancil tidak bersuara | Gunakan Chrome. Pastikan ikon pada gelembung ialah 🔊 dan bukan 🔇. Sesetengah peranti tiada suara Bahasa Melayu. |
| Butang 🎤 tidak muncul | Hanya disokong Chrome/Edge melalui HTTPS (GitHub Pages sudah HTTPS). Benarkan akses mikrofon. |
| Kod QR tidak muncul | Memerlukan internet. Gunakan kod kelas `DEMO`. |
| "Ralat ejen" semasa menjana misi | Semak kunci API dan internet di ⚙ Tetapan. Tukar ke Mod Demo semasa pembentangan. |
| Mahu kosongkan semua data | Log masuk sebagai pentadbir → **Set semula data demo**. |

---

## 13. Seni bina kod dan hala tuju

Kod mengikut prinsip **MVC** dalam bentuk ringan tanpa framework, supaya boleh diterbitkan terus di GitHub Pages tanpa proses binaan:

| Lapisan | Fail |
|---|---|
| **Model** (data & algoritma) | `data.js`, `core.js` |
| **View** (paparan) | fungsi `v_…()` dalam `teacher.js`, `student.js`, `admin.js`, `auth.js` |
| **Controller** (aliran & kawalan akses) | `app.js`, fungsi `a_…()` |
| Perkhidmatan | `agents.js` (LLM), `avatar.js` (Web Speech API) |

**Hala tuju Fasa 2 (produk sebenar):**
- Pindah ke seni bina berasaskan komponen (React/Vue) dengan backend API.
- Semakan PIN dan peraturan akses di pelayan.
- Anggar semula parameter BKT menggunakan data sebenar (Expectation-Maximization).
- Pengesanan ekspresi muka secara pilihan (dalam peranti) dan versi robot sosial fizikal.
- Integrasi dengan DELIMa / sistem pengurusan pembelajaran.

---

Watak Sang Kancil dalam aplikasi ini ialah lukisan asal berdasarkan cerita rakyat Melayu. Semua data pelajar dalam pakej ini ialah data simulasi.
