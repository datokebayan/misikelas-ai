/* MisiKelas AI — Konfigurasi bersama untuk SEMUA peranti
   ---------------------------------------------------------------
   MOD LALAI (tiada perubahan diperlukan):
     Log masuk Mod Demo — akaun demo disemak dalam peranti, berfungsi tanpa internet.

   MOD FIREBASE (pilihan, lihat README Bahagian 6 dan 7):
     1. Tampal firebaseConfig di MK.FIREBASE_CONFIG  → misi & papan markah dikongsi antara peranti
     2. Tukar MK.FIREBASE_AUTH kepada true          → log masuk staf menggunakan Firebase Authentication

   JANGAN letak kunci API Gemini/Claude dalam fail ini.
   --------------------------------------------------------------- */
window.MK = window.MK || {};

MK.FIREBASE_CONFIG = null;
MK.FIREBASE_AUTH = false;

/* Kod kelas demo yang digunakan pelajar untuk log masuk */
MK.CLASS_CODE = "DEMO";

/* Akaun staf demo.
   Dalam Mod Demo, kata laluan di bawah disemak dalam peranti (untuk demonstrasi sahaja, BUKAN keselamatan sebenar).
   Dalam Mod Firebase, kata laluan disemak oleh Firebase Authentication; senarai ini hanya menentukan PERANAN setiap e-mel. */
MK.STAFF = [
  { email: "admin@misikelas.demo", password: "Admin@2026", role: "admin", name: "Pentadbir Demo" },
  { email: "guru@misikelas.demo",  password: "Guru@2026",  role: "guru",  name: "Cikgu Demo" },
  { email: "juri@misikelas.demo",  password: "Juri@2026",  role: "juri",  name: "Juri / Pemerhati" }
];

/* Contoh MK.FIREBASE_CONFIG selepas diisi:
MK.FIREBASE_CONFIG = {
  apiKey: "AIza....",
  authDomain: "misikelas-ai.firebaseapp.com",
  databaseURL: "https://misikelas-ai-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "misikelas-ai",
  storageBucket: "misikelas-ai.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
*/
