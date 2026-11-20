# 🎨 EDU CLASS — DESIGN SYSTEM & GUIDELINE PANDUAN VISUAL

Dokumen ini adalah standarisasi desain antarmuka (*User Interface / UI*) dan pengalaman pengguna (*User Experience / UX*) untuk platform **Edu Class**. Panduan ini dirancang agar seluruh modul, dasbor per role, dan komponen visual selalu selaras, modern, konsisten, dan beridentitas kuat.

---

## 1. 🌈 Palet Warna Utama (*Color Palette*)

Identitas visual Edu Class dibangun di atas nuansa **Edu Navy & Deep Classic Blue** yang mencerminkan kredibilitas akademik, ketenangan belajar, kejelasan informasi, dan profesionalisme.

### A. Warna Utama (*Primary Brand*)
Digunakan untuk navigasi aktif, tombol utama (*Primary CTA*), judul besar, dan identitas logo institusi:

| Nama Warna | Kode HEX | Tailwind Equivalent | Penggunaan Utama |
|:---|:---:|:---:|:---|
| **Edu Classic Navy** | `#003399` | Custom Primary | Warna brand inti, sidebar active state, tombol CTA utama, teks header brand. |
| **Deep Slate Navy** | `#1d3557` | Custom Dark Navy | Background landing page, welcome banner gradient, header dark theme. |
| **Dark Indigo Surface**| `#172b4d` | Custom Midnight | Teks judul utama halaman login, sidebar master header. |
| **Edu Blue Hover** | `#1048b3` | `hover:bg-blue-800` | Status *hover* pada tombol utama dan elemen interaktif. |
| **Soft Blue Tint** | `#eff6ff` | `bg-blue-50` | Background tag aktif, highlight baris, aksen ikon edukasi. |

---

### B. Warna Latar & Permukaan (*Surface & Backgrounds*)
Menjaga kontras visual agar bersih (*clean*), mudah dibaca (*accessible*), dan nyaman di mata pengguna:

| Nama Permukaan | Kode HEX | Tailwind Equivalent | Penggunaan |
|:---|:---:|:---:|:---|
| **App Canvas** | `#f8fafc` | `bg-slate-50` | Warna latar belakang seluruh halaman dasbor aplikasi. |
| **Card Surface** | `#ffffff` | `bg-white` | Latar belakang kartu (*card box*), tabel data, dan jendela dialog modal. |
| **Subtle Border** | `#e2e8f0` | `border-slate-200` | Garis pemisah kartu, batas tabel, dan kotak input formulir. |
| **Muted Divider** | `#f1f5f9` | `border-slate-100` | Garis pembagi antar baris data (*table divider*). |

---

### C. Warna Fungsional & Status (*Semantic Colors*)
Memberikan indikasi visual status akademik yang cepat dipahami oleh pengguna:

```text
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│     Sukses      │    Perhatian    │     Bahaya      │    Informasi    │
│  (Status Aktif) │    (Deadline)   │  (Ujian/Hapus)  │  (Rombel/Modul) │
│     Emerald     │      Amber      │    Rose / Red   │    Sky/Indigo   │
│     #059669     │     #d97706     │     #dc2626     │     #2563eb     │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

1. **Sukses / Aktif / Tuntas**:
   - Teks & Ikon: `#059669` (`text-emerald-700`)
   - Background Badge: `#ecfdf5` (`bg-emerald-50`)
   - Border Badge: `#a7f3d0` (`border-emerald-200`)
   - Digunakan untuk: Status akun aktif, evaluasi tuntas, materi terbit.

2. **Perhatian / Peringatan / Deadline**:
   - Teks & Ikon: `#d97706` (`text-amber-700`)
   - Background Badge: `#fffbeb` (`bg-amber-50`)
   - Border Badge: `#fde68a` (`border-amber-200`)
   - Digunakan untuk: Batas waktu penugasan (*deadline*), rombel belum ber-wali kelas, status draft.

3. **Bahaya / Ujian / Tindakan Kritis**:
   - Teks & Ikon: `#dc2626` (`text-red-600`) atau `#be123c` (`text-rose-700`)
   - Background Badge: `#fef2f2` (`bg-red-50`) atau `#fff1f2` (`bg-rose-50`)
   - Digunakan untuk: Penanda evaluasi "Ujian", tombol hapus data, notifikasi kesalahan validasi.

4. **Kelompok Mata Pelajaran**:
   - **Kejuruan**: Badge Indigo (`bg-indigo-100 text-indigo-700 font-bold`)
   - **Umum**: Badge Neutral Slate (`bg-slate-100 text-slate-700 font-bold`)
   - **Muatan Lokal**: Badge Teal (`bg-teal-100 text-teal-700 font-bold`)

---

## 2. 🔤 Tipografi (*Typography*)

Sistem tipografi menggunakan *font family* modern sans-serif (**Inter** / **system-ui**) dengan skala proporsional:

| Skala Tipografi | Ukuran & Weight | Karakteristik Tailwind | Penggunaan |
|:---|:---|:---|:---|
| **Display Title** | 30px / 1.875rem • ExtraBold | `text-3xl font-extrabold tracking-tight` | Judul utama welcome banner & hero dashboard. |
| **Page Heading** | 24px / 1.5rem • Black/Bold | `text-2xl font-black text-[#003399]` | Judul modul halaman (contoh: *Data Siswa, Monitoring*). |
| **Section Title** | 16px / 1rem • Bold | `text-base font-bold text-slate-800` | Sub-judul bagian (*section*), label grup tabel. |
| **Body Regular** | 14px / 0.875rem • Medium/Normal | `text-sm text-slate-700 leading-relaxed` | Paragraf teks, penjelasan panduan, isi form. |
| **Table & UI Meta** | 12px / 0.75rem • SemiBold | `text-xs text-slate-500` | Teks isi tabel, nama kolom, deskripsi cardbox. |
| **Micro Badge** | 10px / 0.625rem • Bold/Uppercase | `text-[10px] font-bold uppercase tracking-wider` | Label status (AKTIF, DRAFT, KUIS, UJIAN). |

---

## 3. 🧩 Pola Komponen Visual (*Component Patterns*)

### A. Cardbox Statistik Interaktif
Cardbox statistik di dasbor dirancang memiliki *micro-interaction*:
- **Bentuk**: Sudut membulat modern (`rounded-2xl`), border tipis (`border border-slate-200`), shadow halus (`shadow-xs`).
- **Efek Hover**: Sedikit terangkat (`hover:-translate-y-1 hover:shadow-md`), garis tepi menyorot (`hover:border-[#003399]/40`), kursor tangan (`cursor-pointer`).
- **Elemen Dalam**: Ikon representatif di kiri atas, angka tebal besar (`text-2xl font-black text-slate-800`), label metrik di bawah, dan indikator navigasi panah (`→`).

### B. Tombol Aksi (*Buttons*)
1. **Primary Button**:
   `rounded-xl bg-[#003399] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-blue-800 active:scale-95`
2. **Secondary / Outline Button**:
   `rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50`
3. **Danger Button**:
   `rounded-xl border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50`

### C. Tabel Data Akademik
- Header tabel menggunakan background netral `bg-slate-50` dengan teks huruf kapital `text-[11px] font-bold uppercase text-slate-400`.
- Baris data memiliki transisi sorot lembut saat disentuh kursor: `hover:bg-slate-50/70`.
- Nilai angka desimal atau kode mapel diformat dalam gaya angka rapi: `font-mono`.

### D. Dialog Modal (*Pop-up / Overlay*)
- Menggunakan latar belakang gelap transparan dengan efek buram halus: `bg-slate-900/50 backdrop-blur-xs`.
- Kotak modal di tengah layar dengan sudut bulat luas: `rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in duration-200`.
- Memiliki tombol *close* (✕) di sudut kanan atas dan tombol konfirmasi di pojok kanan bawah.

---

## 4. 📐 Standar Desain Per-Role

1. **Admin**: Berorientasi pada kecepatan pengelolaan data (*Data-Dense Layout*), tabel responsif dengan tombol tambah data cepat, pencarian instan, dan kartu statistik navigasi.
2. **Guru**: Berorientasi pada kenyamanan menulis (*Authoring Comfort*), formulir pembuatan tugas & modul yang lega, pemisah tab yang jelas antara kuis dan ujian, serta pembagian butir soal bernomor rapi.
3. **Siswa**: Berorientasi pada fokus belajar (*Student-Centric*), minim distraksi, banner motivasi belajar, pengingat tenggat tugas berwarna tegas, dan tombol aksi pengumpulan tugas yang mencolok.
4. **Kurikulum**: Berorientasi pada pengawasan mutu (*Monitoring & Analytics*), visualisasi statistik rombel, alokasi pengajar, pratinjau soal ujian tanpa hak merusak data, dan format rekapitulasi nilai siap cetak.
5. **Kepala Sekolah**: Berorientasi pada pembacaan eksekutif (*Executive Summary*), grafik ringkasan makro, indikator kinerja sekolah, dan tombol ekspor dokumen resmi.
