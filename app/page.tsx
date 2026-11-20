"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeRoleTab, setActiveRoleTab] = useState<"admin" | "guru" | "siswa" | "kurikulum" | "kepala_sekolah">("guru");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const rolesData = {
    guru: {
      title: "Guru Pendidik",
      badge: "Pembelajaran & Evaluasi Digital",
      icon: "👨‍🏫",
      desc: "Unggah materi modul ajar digital, terbitkan tugas berbatas waktu, buat kuis formatif & ujian CBT dengan butir soal langsung, serta rekap nilai otomatis sesuai bobot akademik.",
      highlights: [
        "Materi Modul PDF & Tautan Web Eksternal",
        "Penugasan Siswa dengan Deadline Otomatis",
        "Kuis Harian & Ujian Semester Terpisah (CBT Online)",
        "Kalkulasi Nilai Akhir Otomatis (30% Tugas + 30% Kuis + 40% Ujian)",
      ],
      linkText: "Akses Portal Guru",
    },
    siswa: {
      title: "Siswa Peserta Didik",
      badge: "E-Learning Mandiri & Tugas",
      icon: "👩‍🎓",
      desc: "Ruang belajar mandiri bagi siswa untuk membaca materi modul, mengumpulkan berkas penugasan tepat waktu, serta mengikuti evaluasi kuis dan ujian secara daring tanpa kendala.",
      highlights: [
        "Login Fleksibel Menggunakan NIS, Username, atau Email",
        "Dasbor Pengingat Tenggat Waktu Tugas Terdekat",
        "Pengumpulan Berkas Tugas (PDF/Word/ZIP) Cepat",
        "Pengerjaan Kuis & Ujian Digital Berbatas Waktu",
      ],
      linkText: "Akses Portal Siswa",
    },
    admin: {
      title: "Administrator Sekolah",
      badge: "Master Data & Manajemen Akun",
      icon: "⚙️",
      desc: "Pengelolaan terpusat seluruh master data institusi sekolah: data siswa, data guru, tingkat kelas, konsentrasi jurusan, serta daftar mata pelajaran kurikulum.",
      highlights: [
        "CRUD Siswa, Guru, Kelas, Jurusan, & Mapel",
        "Penempatan Rombel Kelas & Konsentrasi Keahlian",
        "Dasbor Statistik Data Master Sekolah Real-time",
        "Keamanan Akun Terproteksi Bcrypt & Token JWT",
      ],
      linkText: "Akses Portal Admin",
    },
    kurikulum: {
      title: "Bidang Kurikulum",
      badge: "Monitoring & Mutu Akademik",
      icon: "🎓",
      desc: "Pengawasan mutu pembelajaran sekolah: plotting alokasi guru pengampu ke kelas (guru_mengajar), penetapan wali kelas rombel, monitoring butir soal ujian, dan rekapitulasi nilai.",
      highlights: [
        "Plotting Alokasi Guru Pengampu Mapel & Rombel",
        "Penetapan & Pergantian Wali Kelas Terpadu",
        "Monitoring Materi, Tugas, & Pratinjau Butir Soal Ujian",
        "Rekapitulasi Rata-rata Nilai & Ketuntasan Belajar (KKM)",
      ],
      linkText: "Akses Portal Kurikulum",
    },
    kepala_sekolah: {
      title: "Kepala Sekolah",
      badge: "Eksekutif & Laporan Sekolah",
      icon: "👔",
      desc: "Tinjauan makro bagi pimpinan sekolah untuk memantau produktivitas belajar mengajar, kinerja pengajar, serta arsip ketercapaian target kurikulum dalam format siap cetak.",
      highlights: [
        "Executive Dashboard Statistik Kinerja Sekolah",
        "Analisis Grafik Rata-rata Mutu per Jurusan",
        "Pemantauan Keaktifan Pengajar Sekolah",
        "Arsip Laporan Akademik Resmi Siap Unduh/Cetak",
      ],
      linkText: "Akses Portal Pimpinan",
    },
  };

  const currentRole = rolesData[activeRoleTab];

  const faqs = [
    {
      q: "Bagaimana cara siswa login ke Edu Class?",
      a: "Siswa dapat login menggunakan salah satu dari 3 pilihan: Nomor Induk Siswa (NIS), Username, atau Email sekolah dengan password default 'admin123'.",
    },
    {
      q: "Mengapa fitur Kuis dan Ujian dipisahkan pada peran Guru?",
      a: "Kuis ditujukan untuk asesmen harian formatif berdurasi singkat per bab, sedangkan Ujian ditujukan untuk UTS/UAS terjadwal dengan bobot nilai yang lebih tinggi.",
    },
    {
      q: "Apa wewenang peran Kurikulum di Edu Class?",
      a: "Kurikulum bertugas memplot alokasi guru yang mengajar mapel di tiap kelas, menetapkan wali kelas, serta memonitor materi, tugas, dan butir soal ujian secara view-only.",
    },
    {
      q: "Apakah siswa dapat melihat nilai atau peringkat secara langsung?",
      a: "Tidak. Sesuai kebijakan sekolah, nilai siswa tidak ditampilkan mentah di portal siswa demi privasi dan etika evaluasi resmi raport oleh wali kelas.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-800 selection:bg-[#003399] selection:text-white">
      {/* ================= NAVBAR ================= */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#1d3557]/95 backdrop-blur-md shadow-md py-3 text-white"
            : "bg-[#1d3557] py-4 text-white"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <Link href="#beranda" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 border border-white/20 text-white font-black text-lg shadow-inner transition group-hover:scale-105 group-hover:bg-[#003399]">
              🎓
            </div>
            <div>
              <span className="font-extrabold text-base tracking-wider text-white flex items-center gap-1.5 leading-none">
                EDU CLASS
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </span>
              <p className="text-[9px] text-blue-200 uppercase tracking-widest font-medium mt-0.5">
                LMS Terpadu Sekolah
              </p>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold tracking-wide text-blue-100">
            <a href="#beranda" className="hover:text-white transition">Beranda</a>
            <a href="#fitur" className="hover:text-white transition">Fitur Utama</a>
            <a href="#peran" className="hover:text-white transition">Ekosistem Peran</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
            <a href="#kontak" className="hover:text-white transition">Kontak</a>
          </nav>

          {/* CTA Button */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-[#003399] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-blue-600 active:scale-95 border border-white/20"
            >
              <span>Masuk Portal</span>
              <span className="text-sm">→</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-lg p-2 text-white hover:bg-white/10"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#10294d] border-t border-white/10 px-6 py-4 space-y-3 text-xs">
            <a href="#beranda" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-200">Beranda</a>
            <a href="#fitur" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-200">Fitur Utama</a>
            <a href="#peran" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-200">Ekosistem Peran</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-slate-200">FAQ</a>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center rounded-xl bg-[#003399] py-2 text-xs font-bold text-white mt-2"
            >
              Masuk Portal →
            </Link>
          </div>
        )}
      </header>

      {/* ================= HERO SECTION ================= */}
      <section id="beranda" className="relative pt-28 pb-16 md:pt-36 md:pb-20 overflow-hidden bg-gradient-to-b from-[#1d3557] via-[#10294d] to-[#0f172a] text-white">
        <div className="absolute top-20 left-1/4 h-80 w-80 rounded-full bg-blue-600/15 blur-3xl pointer-events-none"></div>

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-200 backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                Learning Management System Sekolah Generasi Baru
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.2]">
                Belajar, Mengajar, &amp; <br />
                <span className="bg-gradient-to-r from-blue-300 via-sky-200 to-white bg-clip-text text-transparent">
                  Kelola Akademik Sekolah
                </span>{" "}
                Secara Terpadu.
              </h1>

              <p className="mx-auto lg:mx-0 max-w-xl text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                Platform e-learning cerdas yang menyatukan seluruh siklus sekolah: kelola data master oleh Admin, materi &amp; CBT oleh Guru, tugas oleh Siswa, serta penjaminan mutu oleh Kurikulum.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <Link
                  href="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#003399] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-blue-900/50 transition duration-200 hover:bg-blue-600 hover:-translate-y-0.5 active:scale-95 border border-white/20"
                >
                  <span>Mulai Masuk Portal</span>
                  <span>→</span>
                </Link>

                <a
                  href="#peran"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-xs sm:text-sm font-semibold text-white backdrop-blur-sm transition duration-200 hover:bg-white/10"
                >
                  <span>Lihat Ekosistem Peran</span>
                  <span>↓</span>
                </a>
              </div>
            </div>

            {/* Right Hero Live Interactive Mockup Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md rounded-2xl border border-white/15 bg-slate-900/80 p-5 shadow-2xl backdrop-blur-xl space-y-4 text-left">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500/80"></div>
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80"></div>
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80"></div>
                    <span className="ml-2 font-mono text-[10px] text-slate-400">edu-class-system</span>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
                    SISTEM AKTIF
                  </span>
                </div>

                <div className="rounded-xl bg-gradient-to-r from-[#003399]/70 to-blue-900/50 p-3.5 border border-blue-500/20">
                  <p className="text-[10px] font-semibold text-blue-200">Edu Class Portal</p>
                  <h4 className="text-xs font-bold text-white mt-0.5">Satu Gerbang Login untuk Seluruh Warga Sekolah</h4>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                    <span className="text-slate-400 text-[9px] font-semibold uppercase">Siswa Terdaftar</span>
                    <p className="text-lg font-black text-white mt-0.5">500+ Siswa</p>
                    <span className="text-[9px] text-emerald-400">● 100% Rombel Lengkap</span>
                  </div>
                  <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                    <span className="text-slate-400 text-[9px] font-semibold uppercase">Pendidik Guru</span>
                    <p className="text-lg font-black text-white mt-0.5">35 Guru</p>
                    <span className="text-[9px] text-blue-300">● Terplotting Kurikulum</span>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-200 flex items-center gap-1.5 text-[11px]">
                      <span>⏱️</span> Kuis &amp; Ujian Online (CBT)
                    </span>
                    <span className="text-[10px] text-amber-300 font-semibold">Tersinkron Otomatis</span>
                  </div>
                  <p className="text-[10px] text-slate-400">Mendukung butir soal pilihan ganda &amp; penilaian bobot instan.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATISTIK INTI BAR ================= */}
      <section className="relative -mt-7 z-20 mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg text-center">
          <div className="p-2 border-r border-slate-100">
            <span className="text-2xl font-black text-[#003399]">5 Role</span>
            <p className="text-[11px] font-bold text-slate-700 mt-0.5">Akses Terstruktur</p>
          </div>
          <div className="p-2 sm:border-r border-slate-100">
            <span className="text-2xl font-black text-emerald-600">100%</span>
            <p className="text-[11px] font-bold text-slate-700 mt-0.5">Paperless &amp; Modul Digital</p>
          </div>
          <div className="p-2 border-r border-slate-100">
            <span className="text-2xl font-black text-indigo-600">CBT Digital</span>
            <p className="text-[11px] font-bold text-slate-700 mt-0.5">Kuis &amp; Ujian Terpisah</p>
          </div>
          <div className="p-2">
            <span className="text-2xl font-black text-amber-600">Real-Time</span>
            <p className="text-[11px] font-bold text-slate-700 mt-0.5">Kalkulasi Nilai Otomatis</p>
          </div>
        </div>
      </section>

      {/* ================= FITUR UNGGULAN INTI ================= */}
      <section id="fitur" className="py-16 mx-auto max-w-6xl px-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="rounded-full bg-blue-50 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-[#003399]">
            Fitur Utama Edu Class
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Dirancang Rinci untuk Kebutuhan Sekolah Nyata
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Semua yang dibutuhkan untuk kegiatan pembelajaran digital dan administrasi kurikulum sekolah:
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: "📖",
              title: "Materi & Modul Digital",
              desc: "Unggah modul ajar PDF, dokumen, dan tautan referensi terfilter per rombel & mapel.",
            },
            {
              icon: "📝",
              title: "Penugasan & Batas Waktu",
              desc: "Pengumpulan tugas siswa secara digital dengan deadline otomatis dan counter pengumpulan.",
            },
            {
              icon: "⏱️",
              title: "Kuis Harian Terpisah",
              desc: "Evaluasi harian cepat berdurasi menit dengan pembuatan butir pertanyaan & kunci jawaban.",
            },
            {
              icon: "🎯",
              title: "Ujian Semester (PTS/PAS)",
              desc: "Pelaksanaan ujian formal terjadwal khusus tanpa tercampur kuis harian, berbobot nilai resmi.",
            },
            {
              icon: "📊",
              title: "Kalkulasi Nilai Otomatis",
              desc: "Perhitungan bobot 30% tugas + 30% kuis + 40% ujian dan predikat A/B/C/D tanpa hitung manual.",
            },
            {
              icon: "👨‍🏫",
              title: "Plotting Guru Mengajar",
              desc: "Alokasi penugasan pendidik ke kelas dan mata pelajaran serta penetapan wali kelas oleh Kurikulum.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition duration-200 hover:-translate-y-1 hover:shadow-md hover:border-[#003399]/40 group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xl transition group-hover:bg-[#003399] group-hover:scale-105">
                {f.icon}
              </div>
              <h3 className="mt-3.5 text-sm font-bold text-slate-800 group-hover:text-[#003399] transition">
                {f.title}
              </h3>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= EKOSISTEM PERAN INTERAKTIF ================= */}
      <section id="peran" className="py-16 bg-slate-100/70 border-y border-slate-200">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="rounded-full bg-[#003399]/10 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-[#003399]">
              Ekosistem 5 Peran
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Satu Sistem, Dasbor Khusus Tiap Peran
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Klik tab peran di bawah untuk melihat wewenang dan alur kerja masing-masing pengguna:
            </p>
          </div>

          {/* Interactive Role Tabs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: "guru", label: "👨‍🏫 Guru" },
              { id: "siswa", label: "👩‍🎓 Siswa" },
              { id: "admin", label: "⚙️ Admin" },
              { id: "kurikulum", label: "🎓 Kurikulum" },
              { id: "kepala_sekolah", label: "👔 Kepsek" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveRoleTab(tab.id as any)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition duration-200 ${
                  activeRoleTab === tab.id
                    ? "bg-[#003399] text-white shadow-sm scale-105"
                    : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active Role Content Card */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="grid items-center gap-6 md:grid-cols-12">
              <div className="md:col-span-7 space-y-3">
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-[#003399]">
                  <span>{currentRole.icon}</span>
                  <span>{currentRole.badge}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {currentRole.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {currentRole.desc}
                </p>

                <div className="pt-2">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#003399] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-blue-800"
                  >
                    <span>{currentRole.linkText}</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

              {/* Highlights Checklist */}
              <div className="md:col-span-5 bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-2.5">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Fitur Unggulan:
                </h4>
                {currentRole.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700 mt-0.5">
                      ✓
                    </span>
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ ACCORDION ================= */}
      <section id="faq" className="py-16 mx-auto max-w-4xl px-6">
        <div className="text-center space-y-2">
          <span className="rounded-full bg-[#003399]/10 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-[#003399]">
            Tanya Jawab
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Informasi ringkas seputar penggunaan platform Edu Class:
          </p>
        </div>

        <div className="mt-8 space-y-2.5">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs transition"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-bold text-slate-800 hover:text-[#003399] transition"
              >
                <span>{faq.q}</span>
                <span className="text-sm font-mono shrink-0 ml-3">
                  {activeFaq === idx ? "−" : "+"}
                </span>
              </button>
              {activeFaq === idx && (
                <div className="px-4 pb-4 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ================= COMPACT CTA ================= */}
      <section className="py-12 mx-auto max-w-5xl px-6">
        <div className="rounded-2xl bg-gradient-to-r from-[#003399] via-[#1048b3] to-[#1d3557] p-8 text-white text-center shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Siap Memulai Pembelajaran Modern?
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-lg mx-auto mt-2 leading-relaxed">
            Masuk dengan akun sekolah Anda dan nikmati kemudahan belajar, mengajar, serta pengawasan akademik dalam satu portal.
          </p>
          <div className="mt-5">
            <Link
              href="/login"
              className="inline-block rounded-xl bg-white px-6 py-2.5 text-xs font-bold text-[#003399] shadow-md transition hover:bg-blue-50 active:scale-95"
            >
              Masuk ke Akun Anda →
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FOOTER PROPORSI RAPI ================= */}
      <footer id="kontak" className="bg-[#10294d] text-white pt-12 pb-8 border-t border-white/10 text-xs">
        <div className="mx-auto max-w-6xl px-6 grid gap-8 md:grid-cols-3">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎓</span>
              <span className="font-extrabold text-sm tracking-wider text-white">EDU CLASS</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Platform e-learning dan manajemen akademik modern sekolah untuk mendukung pembelajaran efektif, terstruktur, dan paperless.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold uppercase tracking-wider text-blue-300 text-[11px]">
              Gerbang Peran Pengguna
            </h3>
            <div className="flex flex-wrap gap-2 text-[11px] text-slate-300">
              <Link href="/login" className="hover:text-white">Admin</Link> •
              <Link href="/login" className="hover:text-white">Guru</Link> •
              <Link href="/login" className="hover:text-white">Siswa</Link> •
              <Link href="/login" className="hover:text-white">Kurikulum</Link> •
              <Link href="/login" className="hover:text-white">Kepala Sekolah</Link>
            </div>
          </div>

          <div className="space-y-1.5 text-[11px] text-slate-300 leading-relaxed">
            <h3 className="font-bold uppercase tracking-wider text-blue-300">
              Sekolah &amp; Kontak
            </h3>
            <p><strong>SMK Citra Negara</strong> — Jl. Tanah Baru II, Kemiri Jaya No. 99, Beji, Depok</p>
            <p>📧 info@citranegara.sch.id • 📞 (+62) 812-3456-7890</p>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-6 mt-8 pt-4 border-t border-white/10 text-center text-[10px] text-slate-400">
          © 2026 Edu Class — Learning Management System. All Rights Reserved.
        </div>
      </footer>
    </main>
  );
}
