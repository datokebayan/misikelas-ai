/* MisiKelas AI — Data demo (topik: Asas Kecerdasan Buatan)
   Semua data pelajar ialah DATA SIMULASI untuk demonstrasi. */
window.MK = window.MK || {};

MK.SKILLS = [
  { id: "S1", name: "Konsep AI" },
  { id: "S2", name: "Data & Pembelajaran Mesin" },
  { id: "S3", name: "AI Generatif" },
  { id: "S4", name: "Etika & Bias" },
  { id: "S5", name: "AI Berpusatkan Insan" }
];

MK.MISCONCEPTIONS = {
  M1: { name: "AI berfikir dan berperasaan seperti manusia", fix: "Tegaskan bahawa AI mengenal pasti corak dalam data; ia tidak mempunyai kesedaran atau perasaan." },
  M2: { name: "AI sentiasa betul dan tidak pernah silap", fix: "Tunjukkan contoh output AI yang salah (halusinasi) dan latih pelajar menyemak fakta." },
  M3: { name: "Lebih banyak data sentiasa lebih baik walaupun kualitinya rendah", fix: "Bincangkan konsep 'sampah masuk, sampah keluar' dan kepentingan data yang bersih serta seimbang." },
  M4: { name: "AI generatif mencari jawapan siap dalam pangkalan data", fix: "Jelaskan bahawa AI generatif meramal perkataan atau piksel seterusnya, bukan mencari jawapan yang tersimpan." },
  M5: { name: "Bias hanya berlaku jika pembangun berniat jahat", fix: "Tunjukkan bagaimana data sejarah yang tidak seimbang boleh menghasilkan bias tanpa niat sesiapa." },
  M6: { name: "AI boleh membuat keputusan penting tanpa pengawasan manusia", fix: "Kukuhkan prinsip 'manusia dalam gelung' dan tanggungjawab manusia ke atas keputusan." },
  M7: { name: "Semua automasi ialah AI", fix: "Bandingkan peraturan tetap (jika-maka) dengan sistem yang belajar daripada data." }
};

/* q: soalan, o: pilihan, a: indeks jawapan betul, m: miskonsepsi bagi pilihan salah, h: petunjuk, e: penerangan, d: kesukaran awal (Elo) */
MK.QUESTIONS = [
  // S1 Konsep AI
  { id: "Q01", s: "S1", d: -1.0, q: "Apakah maksud kecerdasan buatan (AI)?", o: ["Mesin yang mempunyai perasaan seperti manusia", "Sistem komputer yang melaksanakan tugas yang biasanya memerlukan kecerdasan manusia", "Robot yang boleh berjalan", "Sebarang program komputer"], a: 1, m: { 0: "M1", 2: "M7", 3: "M7" }, h: "Fikirkan tentang TUGAS yang boleh dilakukan, bukan rupa mesin.", e: "AI ialah sistem yang melaksanakan tugas seperti mengenal pasti corak, membuat ramalan dan memahami bahasa." },
  { id: "Q02", s: "S1", d: -0.5, q: "Pembantu suara di telefon memahami arahan anda kerana...", o: ["Ia faham perasaan anda", "Ia dilatih dengan banyak contoh pertuturan untuk mengenal pasti corak", "Ada manusia yang mendengar setiap arahan", "Ia membaca fikiran pengguna"], a: 1, m: { 0: "M1", 2: "M6", 3: "M1" }, h: "AI belajar daripada contoh.", e: "Pengecaman suara menggunakan model yang dilatih dengan jutaan contoh audio." },
  { id: "Q03", s: "S1", d: 0.0, q: "Lampu isyarat yang bertukar warna setiap 60 saat ialah contoh...", o: ["AI kerana ia automatik", "Automasi berasaskan peraturan tetap, bukan AI", "AI generatif", "Pembelajaran mesin"], a: 1, m: { 0: "M7", 2: "M7", 3: "M7" }, h: "Adakah lampu itu belajar daripada data trafik?", e: "Automasi dengan peraturan tetap tidak belajar daripada data, jadi ia bukan AI." },
  { id: "Q04", s: "S1", d: 0.4, q: "Pernyataan manakah yang PALING tepat tentang AI hari ini?", o: ["AI mempunyai kesedaran diri", "AI sangat baik dalam tugas khusus tetapi tidak memahami dunia seperti manusia", "AI boleh menggantikan semua pekerjaan manusia", "AI tidak boleh melakukan apa-apa tanpa internet"], a: 1, m: { 0: "M1", 2: "M6" }, h: "Kebanyakan AI dibina untuk satu jenis tugas.", e: "AI semasa ialah 'AI sempit' yang cemerlang dalam tugas tertentu sahaja." },
  { id: "Q05", s: "S1", d: 0.8, q: "Sebuah chatbot berkata 'Saya gembira membantu anda'. Ini bermakna...", o: ["Chatbot itu benar-benar berasa gembira", "Chatbot menjana ayat sopan berdasarkan corak bahasa yang dipelajari", "Chatbot mempunyai emosi seperti haiwan", "Chatbot sedang menipu dengan sengaja"], a: 1, m: { 0: "M1", 2: "M1", 3: "M1" }, h: "Dari mana chatbot belajar ayat seperti itu?", e: "Ayat itu dijana daripada corak bahasa; AI tidak mengalami perasaan." },
  { id: "Q06", s: "S1", d: 1.2, q: "Mesin basuh 'pintar' yang melaras masa basuhan berdasarkan berat dan tahap kotoran yang dipelajari daripada data penggunaan ialah...", o: ["Bukan AI kerana ia hanya mesin basuh", "Contoh AI kerana ia menyesuaikan tindakan berdasarkan data", "Robot humanoid", "AI generatif"], a: 1, m: { 0: "M7", 3: "M4" }, h: "Kuncinya ialah menyesuaikan diri berdasarkan data.", e: "Sistem yang belajar dan menyesuaikan tindakan daripada data menggunakan teknik AI." },
  // S2 Data & Pembelajaran Mesin
  { id: "Q07", s: "S2", d: -0.8, q: "Dalam pembelajaran mesin, komputer belajar daripada...", o: ["Arahan jika-maka yang ditulis satu per satu", "Contoh data", "Perasaan pengguna", "Internet secara automatik tanpa data"], a: 1, m: { 0: "M7", 2: "M1" }, h: "Pembelajaran mesin = belajar daripada contoh.", e: "Model pembelajaran mesin dilatih menggunakan contoh data untuk mengenal pasti corak." },
  { id: "Q08", s: "S2", d: -0.2, q: "Model mengecam kucing dilatih dengan 10,000 gambar kucing yang kabur dan salah label. Apakah kesannya?", o: ["Model tetap tepat kerana datanya banyak", "Model mungkin kurang tepat kerana kualiti data rendah", "Model akan menjadi lebih pintar", "Tiada kesan langsung"], a: 1, m: { 0: "M3", 2: "M3", 3: "M3" }, h: "Kualiti data sama penting dengan kuantiti.", e: "Data berkualiti rendah menghasilkan model berkualiti rendah: sampah masuk, sampah keluar." },
  { id: "Q09", s: "S2", d: 0.2, q: "Apakah tujuan membahagikan data kepada set latihan dan set ujian?", o: ["Untuk menjimatkan ruang storan", "Untuk menguji prestasi model pada data yang belum pernah dilihat", "Supaya model lebih cepat", "Supaya data lebih banyak"], a: 1, m: { 3: "M3" }, h: "Bagaimana kita tahu model benar-benar belajar, bukan menghafal?", e: "Set ujian menilai sama ada model boleh membuat generalisasi kepada data baharu." },
  { id: "Q10", s: "S2", d: 0.6, q: "Model meramal harga rumah dengan sangat tepat untuk data latihan tetapi gagal untuk rumah baharu. Ini dipanggil...", o: ["Underfitting", "Overfitting (terlebih padan)", "Bias manusia", "AI generatif"], a: 1, m: { 0: "M3", 2: "M5" }, h: "Model terlalu 'menghafal' data latihan.", e: "Overfitting berlaku apabila model menghafal data latihan dan tidak boleh membuat generalisasi." },
  { id: "Q11", s: "S2", d: 0.9, q: "Sebuah sekolah ada data peperiksaan 5 tahun dari bandar sahaja. Model ramalan prestasi dibina untuk semua sekolah. Apakah risikonya?", o: ["Tiada risiko kerana data 5 tahun sudah banyak", "Model mungkin tidak tepat untuk sekolah luar bandar kerana data tidak mewakili", "Model akan lebih adil", "Model akan menjadi lebih cepat"], a: 1, m: { 0: "M3", 2: "M5" }, h: "Adakah data itu mewakili semua kumpulan?", e: "Data yang tidak mewakili populasi menghasilkan ramalan yang tidak tepat bagi kumpulan yang tertinggal." },
  { id: "Q12", s: "S2", d: 1.3, q: "Manakah langkah TERBAIK sebelum melatih model?", o: ["Kumpul data sebanyak mungkin tanpa menyemaknya", "Bersihkan data, buang ralat dan pastikan semua kumpulan diwakili", "Terus latih model dan lihat hasilnya", "Gunakan data dari satu sumber sahaja"], a: 1, m: { 0: "M3", 2: "M2", 3: "M3" }, h: "Persediaan data ialah langkah paling penting.", e: "Pembersihan dan keseimbangan data menentukan kualiti model." },
  // S3 AI Generatif
  { id: "Q13", s: "S3", d: -0.6, q: "Apakah yang dilakukan oleh AI generatif seperti chatbot?", o: ["Mencari jawapan siap dalam pangkalan data", "Menjana kandungan baharu dengan meramal perkataan seterusnya", "Menyalin laman web secara terus", "Bertanya kepada pakar manusia"], a: 1, m: { 0: "M4", 2: "M4", 3: "M6" }, h: "Kata kuncinya ialah 'menjana'.", e: "Model bahasa besar menjana teks dengan meramal perkataan yang paling mungkin seterusnya." },
  { id: "Q14", s: "S3", d: 0.0, q: "Chatbot memberikan rujukan buku yang sebenarnya tidak wujud. Fenomena ini dipanggil...", o: ["Pepijat perisian biasa", "Halusinasi AI", "Penipuan yang disengajakan oleh AI", "Mustahil kerana AI sentiasa betul"], a: 1, m: { 2: "M1", 3: "M2" }, h: "AI kadangkala menjana maklumat yang kedengaran meyakinkan tetapi palsu.", e: "Halusinasi berlaku apabila AI menjana maklumat palsu yang kelihatan munasabah." },
  { id: "Q15", s: "S3", d: 0.3, q: "Apakah tindakan terbaik selepas mendapat fakta penting daripada chatbot untuk tugasan?", o: ["Terus salin kerana AI tepat", "Semak fakta dengan sumber yang dipercayai", "Tanya chatbot sekali lagi sahaja", "Abaikan semua jawapan AI"], a: 1, m: { 0: "M2", 2: "M2" }, h: "AI boleh silap.", e: "Fakta daripada AI perlu disemak dengan sumber berautoriti." },
  { id: "Q16", s: "S3", d: 0.7, q: "Jika anda bertanya soalan yang sama dua kali kepada chatbot, jawapannya mungkin berbeza kerana...", o: ["Chatbot mencari pangkalan data yang berbeza", "Proses penjanaan melibatkan unsur kebarangkalian", "Chatbot sudah lupa", "Ada manusia yang menukar jawapan"], a: 1, m: { 0: "M4", 2: "M1", 3: "M6" }, h: "Penjanaan bukan carian.", e: "Model memilih perkataan berdasarkan kebarangkalian, jadi output boleh berbeza." },
  { id: "Q17", s: "S3", d: 1.0, q: "Penjana imej AI menghasilkan gambar 'doktor' yang kebanyakannya lelaki. Mengapa?", o: ["AI memilih secara rawak", "Data latihan mungkin mengandungi lebih banyak gambar doktor lelaki", "AI mencari gambar doktor di internet", "AI tidak suka doktor wanita"], a: 1, m: { 0: "M2", 2: "M4", 3: "M1" }, h: "Output mencerminkan data latihan.", e: "Ketidakseimbangan dalam data latihan menyebabkan output yang berat sebelah." },
  { id: "Q18", s: "S3", d: 1.4, q: "Arahan (prompt) manakah yang paling baik untuk chatbot?", o: ["'Tulis esei'", "'Tulis esei 300 patah perkataan tentang kitar semula untuk murid Tahun 5, dalam 3 perenggan'", "'Esei kitar semula sekarang!'", "'Buat sesuatu yang bagus'"], a: 1, m: { 0: "M4", 3: "M1" }, h: "Arahan yang jelas dan khusus menghasilkan output yang lebih baik.", e: "Prompt yang menyatakan topik, khalayak, panjang dan format menghasilkan output yang lebih tepat." },
  // S4 Etika & Bias
  { id: "Q19", s: "S4", d: -0.4, q: "Bias dalam AI boleh berlaku apabila...", o: ["Pembangun berniat jahat sahaja", "Data latihan tidak seimbang atau mencerminkan ketidakadilan lalu", "AI marah kepada pengguna", "Komputer terlalu panas"], a: 1, m: { 0: "M5", 2: "M1" }, h: "Bias boleh berlaku tanpa niat sesiapa.", e: "Bias sering datang daripada data yang tidak seimbang, bukan niat jahat." },
  { id: "Q20", s: "S4", d: 0.1, q: "Sistem saringan kerja AI menolak lebih ramai calon wanita kerana dilatih dengan data pekerja lelaki terdahulu. Siapakah yang bertanggungjawab?", o: ["AI itu sendiri", "Manusia dan organisasi yang membangun serta menggunakan sistem", "Tiada sesiapa kerana ia automatik", "Calon wanita"], a: 1, m: { 0: "M1", 2: "M6" }, h: "AI ialah alat; manusia bertanggungjawab.", e: "Organisasi yang membangun dan menggunakan AI bertanggungjawab ke atas kesannya." },
  { id: "Q21", s: "S4", d: 0.5, q: "Pasukan pembangun tidak berniat jahat, tetapi sistem pengecaman wajah kurang tepat untuk kulit gelap. Ini menunjukkan...", o: ["Bias mustahil kerana tiada niat jahat", "Bias boleh berlaku tanpa niat, contohnya akibat data yang tidak mewakili", "Sistem itu tepat", "Masalah kamera sahaja"], a: 1, m: { 0: "M5", 2: "M2" }, h: "Niat bukan satu-satunya punca bias.", e: "Bias tanpa niat berlaku apabila data latihan tidak mewakili semua kumpulan." },
  { id: "Q22", s: "S4", d: 0.8, q: "Apakah amalan terbaik apabila memuat naik data pelajar ke aplikasi AI?", o: ["Muat naik semua maklumat peribadi supaya AI lebih tepat", "Gunakan data minimum dan nama samaran untuk melindungi privasi", "Kongsi kata laluan pelajar", "Tiada isu privasi dalam pendidikan"], a: 1, m: { 0: "M3", 3: "M2" }, h: "Lindungi data peribadi.", e: "Prinsip data minimum dan nama samaran melindungi privasi pelajar." },
  { id: "Q23", s: "S4", d: 1.1, q: "Cara terbaik mengurangkan bias dalam sistem AI ialah...", o: ["Menambah data secara rawak", "Mengaudit output, mempelbagaikan data dan melibatkan pelbagai pihak dalam pembangunan", "Membiarkan AI membetulkan dirinya sendiri", "Hanya mengupah pengaturcara yang baik"], a: 1, m: { 0: "M3", 2: "M6", 3: "M5" }, h: "Bias perlu diurus secara aktif oleh manusia.", e: "Audit berterusan, data yang pelbagai dan penglibatan pelbagai pihak membantu mengurangkan bias." },
  { id: "Q24", s: "S4", d: 1.5, q: "Pelajar menggunakan AI untuk menulis keseluruhan esei dan menghantarnya sebagai hasil sendiri. Isu utama ialah...", o: ["Tiada isu kerana AI ialah alat", "Integriti akademik dan ketelusan penggunaan AI", "Esei AI sentiasa sempurna", "AI akan dipersalahkan"], a: 1, m: { 0: "M6", 2: "M2", 3: "M1" }, h: "Kejujuran dan ketelusan.", e: "Penggunaan AI perlu dinyatakan secara telus untuk menjaga integriti akademik." },
  // S5 AI Berpusatkan Insan
  { id: "Q25", s: "S5", d: -0.5, q: "'Manusia dalam gelung' (human-in-the-loop) bermaksud...", o: ["Manusia digantikan sepenuhnya oleh AI", "Manusia menyemak dan membuat keputusan akhir ke atas output AI", "AI mengawal manusia", "Manusia hanya menekan butang mula"], a: 1, m: { 0: "M6", 2: "M1", 3: "M6" }, h: "Siapa yang membuat keputusan akhir?", e: "Manusia kekal menyemak dan meluluskan keputusan AI." },
  { id: "Q26", s: "S5", d: 0.0, q: "AI mencadangkan markah esei pelajar. Apakah peranan guru yang paling sesuai?", o: ["Terima semua markah AI tanpa semakan", "Semak cadangan AI dan membuat keputusan akhir", "Biarkan pelajar menentukan markah", "Tidak menggunakan AI langsung dalam apa jua keadaan"], a: 1, m: { 0: "M2", 2: "M6" }, h: "AI membantu; guru memutuskan.", e: "Guru menggunakan AI sebagai pembantu tetapi kekal sebagai pembuat keputusan." },
  { id: "Q27", s: "S5", d: 0.4, q: "Mengapa sesebuah sistem AI perlu boleh menerangkan keputusannya (kebolehjelasan)?", o: ["Supaya kelihatan canggih", "Supaya pengguna faham, percaya dan boleh mencabar keputusan yang salah", "Supaya lebih cepat", "Tidak perlu kerana AI sentiasa betul"], a: 1, m: { 3: "M2" }, h: "Bagaimana kita tahu keputusan itu adil?", e: "Kebolehjelasan membolehkan manusia memahami, mempercayai dan memperbetulkan AI." },
  { id: "Q28", s: "S5", d: 0.8, q: "Hospital mahu AI membuat keputusan rawatan sepenuhnya tanpa doktor untuk menjimatkan kos. Pandangan HCAI ialah...", o: ["Setuju kerana AI lebih cepat", "Keputusan berisiko tinggi perlu kekal di bawah kawalan dan tanggungjawab doktor", "Setuju jika AI mahal", "AI tidak boleh digunakan langsung di hospital"], a: 1, m: { 0: "M6", 2: "M6" }, h: "Keputusan berisiko tinggi memerlukan manusia.", e: "HCAI menggabungkan automasi tinggi dengan kawalan manusia yang tinggi." },
  { id: "Q29", s: "S5", d: 1.1, q: "Reka bentuk aplikasi AI untuk murid Malaysia sebaiknya...", o: ["Menyalin aplikasi luar negara tanpa perubahan", "Mengambil kira bahasa, budaya dan keperluan pengguna tempatan", "Hanya dalam bahasa Inggeris", "Tidak perlu menguji dengan pengguna"], a: 1, m: { 0: "M3", 3: "M2" }, h: "Teknologi berpusatkan insan bermula dengan pengguna.", e: "Reka bentuk berpusatkan insan mengambil kira konteks budaya dan menguji bersama pengguna sebenar." },
  { id: "Q30", s: "S5", d: 1.5, q: "Ciri manakah menunjukkan sesebuah ejen AI pendidikan direka secara berpusatkan insan?", o: ["Ejen menghantar kandungan terus kepada murid tanpa semakan", "Guru boleh menyemak, mengubah dan meluluskan cadangan ejen sebelum digunakan", "Ejen mengumpul semua data peribadi murid", "Ejen tidak boleh dihentikan"], a: 1, m: { 0: "M6", 2: "M3", 3: "M6" }, h: "Kawalan manusia ialah kuncinya.", e: "Ejen berpusatkan insan memberi guru kawalan untuk menyemak dan meluluskan." }
];

/* Rawakkan susunan pilihan jawapan (benih tetap) supaya jawapan betul tidak sentiasa di kedudukan yang sama */
(function () {
  let s = 77;
  const r = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  MK.QUESTIONS.forEach(q => {
    const idx = [0, 1, 2, 3].slice(0, q.o.length);
    for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
    const m = {};
    idx.forEach((oldI, newI) => { if (q.m[oldI]) m[newI] = q.m[oldI]; });
    q.o = idx.map(i => q.o[i]); q.a = idx.indexOf(q.a); q.m = m;
  });
})();

/* Misi demo terbina dalam (digunakan dalam Mod Demo tanpa API) */
MK.DEMO_MISSION = {
  id: "DEMO",
  title: "Misi Kancil di Hutan Data",
  topic: "Asas Kecerdasan Buatan",
  outcomes: [
    "Menerangkan maksud AI dan membezakannya daripada automasi biasa",
    "Menjelaskan peranan data dalam pembelajaran mesin dan AI generatif",
    "Menilai isu etika, bias dan peranan manusia dalam penggunaan AI"
  ],
  levels: [
    { name: "Peringkat 1: Hutan Konsep", story: "Sang Kancil tersesat di Hutan Konsep. Pokok-pokok di sini berbisik tentang apa itu AI yang sebenar. Bantu Kancil membezakan mesin pintar daripada mesin biasa!", skills: ["S1", "S2"] },
    { name: "Peringkat 2: Sungai Penjana", story: "Untuk menyeberangi Sungai Penjana, Kancil perlu memahami bagaimana AI generatif mencipta kata-kata. Hati-hati dengan buaya halusinasi!", skills: ["S3"] },
    { name: "Peringkat 3: Bukit Bijaksana", story: "Di puncak Bukit Bijaksana, Kancil perlu membuat keputusan yang adil dan beretika. Ingat, manusia yang membuat keputusan akhir!", skills: ["S4", "S5"] }
  ],
  questionIds: MK.QUESTIONS.map(q => q.id),
  length: 10,
  status: "approved",
  type: "utama",
  createdBy: "Demo"
};

/* ---- Penjana data simulasi (benih tetap supaya hasil sama setiap kali) ---- */
MK.seededRandom = function (seed) {
  let s = seed >>> 0;
  return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
};

/* PIN akaun demo pelajar (lain-lain: 1234) */
MK.DEMO_PINS = { Harimau01: "1111", Kekwa17: "2222", Siamang21: "3333" };

MK.STUDENT_NAMES = ["Harimau", "Helang", "Penyu", "Rusa", "Gajah", "Tapir", "Merak", "Enggang", "Beruang", "Seladang", "Kijang", "Pelanduk", "Badak", "Memerang", "Musang", "Murai", "Kekwa", "Belibis", "Bangau", "Tenggiling", "Siamang", "Kelulut", "Rama", "Pipit", "Ketam", "Ikan Pari", "Dugong", "Lotong"];

MK.generateDemoData = function () {
  const rnd = MK.seededRandom(2026);
  const students = [];
  const answers = [];
  // Profil kebolehan: kumpulan A kuat, B sederhana, C lemah dalam Etika & HCAI (M5/M6), D lemah AI Generatif (M4/M2)
  MK.STUDENT_NAMES.forEach((n, i) => {
    const id = "P" + String(i + 1).padStart(2, "0");
    const name = n + String(i + 1).padStart(2, "0");
    let ability = { S1: 0.6, S2: 0.3, S3: 0.2, S4: 0.2, S5: 0.3 };
    let group = "B";
    if (i < 6) { group = "A"; ability = { S1: 2.0, S2: 1.8, S3: 1.7, S4: 1.6, S5: 1.8 }; }
    else if (i >= 14 && i < 20) { group = "C"; ability = { S1: 0.8, S2: 0.4, S3: 0.4, S4: -1.8, S5: -1.6 }; }
    else if (i >= 20) { group = "D"; ability = { S1: 0.5, S2: -0.4, S3: -1.9, S4: 0.2, S5: 0.4 }; }
    students.push({ id, name, group, demo: true, pin: MK.DEMO_PINS[name] || "1234" });
    // 16–20 jawapan setiap pelajar
    const nAns = 24 + Math.floor(rnd() * 8);
    for (let k = 0; k < nAns; k++) {
      const q = MK.QUESTIONS[Math.floor(rnd() * MK.QUESTIONS.length)];
      const theta = ability[q.s] + (rnd() - 0.5) * 0.6;
      const p = 1 / (1 + Math.exp(-(theta - q.d)));
      const correct = rnd() < p;
      let choice = q.a, misc = null;
      if (!correct) {
        const wrong = [0, 1, 2, 3].filter(x => x !== q.a);
        // pelajar kumpulan C/D cenderung memilih pilihan yang berkait miskonsepsi sasaran
        const target = group === "C" ? ["M5", "M6"] : group === "D" ? ["M4", "M2"] : null;
        let pick = wrong.find(w => target && target.includes(q.m[w]));
        if (pick === undefined || rnd() < 0.3) pick = wrong[Math.floor(rnd() * wrong.length)];
        choice = pick; misc = q.m[pick] || null;
      }
      answers.push({
        sid: id, name, qid: q.id, skill: q.s, choice, correct, misc,
        ms: Math.round(4000 + rnd() * 18000 + (correct ? 0 : 5000)),
        ts: Date.now() - Math.floor(rnd() * 6 * 86400000),
        session: "DEMO", demo: true
      });
    }
  });
  answers.sort((a, b) => a.ts - b.ts);
  return { students, answers };
};
