# Data simulasi MisiKelas AI

Semua data dalam folder ini ialah **DATA SIMULASI** untuk demonstrasi. Tiada data pelajar sebenar.

| Fail | Kandungan |
|---|---|
| `bank_soalan.json` / `.csv` | 30 soalan topik Asas Kecerdasan Buatan, 5 kemahiran, 7 miskonsepsi, misi demo |
| `pelajar_simulasi.json` / `.csv` | 28 pelajar bernama samaran (contoh: Harimau01) |
| `jawapan_simulasi.json` / `.csv` | Rekod jawapan disimulasi, termasuk betul/salah, miskonsepsi dan masa respons |

## Profil kumpulan simulasi (sengaja dibina supaya analitik menunjukkan corak)

| Kumpulan | Pelajar | Corak |
|---|---|---|
| A | P01–P06 | Kuat dalam semua kemahiran |
| B | P07–P14 | Sederhana |
| C | P15–P20 | Lemah dalam Etika & Bias dan AI Berpusatkan Insan (miskonsepsi M5, M6) |
| D | P21–P28 | Lemah dalam AI Generatif (miskonsepsi M4, M2) |

Aplikasi menjana data yang sama secara automatik semasa dibuka kali pertama (fail `js/data.js`).
Fail di sini disediakan untuk rujukan, laporan, atau analisis dalam Excel/SPSS.
Untuk set semula data dalam aplikasi: **Guru → Laporan → Set semula data demo**.

## PIN pelajar demo

Semua pelajar simulasi menggunakan PIN **1234**, kecuali tiga akaun demo utama:

| Nama samaran | Kumpulan | PIN |
|---|---|---|
| Harimau01 | A (kuat) | 1111 |
| Kekwa17 | C (lemah Etika) | 2222 |
| Siamang21 | D (lemah AI Generatif) | 3333 |

Kod kelas: **DEMO**
