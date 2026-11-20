"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      let data: any = null;
      try {
        data = await response.json();
      } catch (e) {}

      if (!response.ok) {
        throw new Error(data?.message || "Gagal login, periksa kembali Email/Username/NIS dan password Anda");
      }

      // Login berhasil, simpan token & role
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect berdasarkan role
      switch (data.role) {
        case "admin":
          router.push("/admin/dashboard");
          break;
        case "guru":
          router.push("/guru/dashboard");
          break;
        case "siswa":
          router.push("/siswa/dashboard");
          break;
        case "kurikulum":
          router.push("/kurikulum/dashboard");
          break;
        case "kepala_sekolah":
          router.push("/kepala-sekolah/dashboard");
          break;
        default:
          router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col justify-between selection:bg-blue-100 selection:text-[#003399]">

      {/* ================= TOP NAV BAR ================= */}
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-[#003399] flex items-center justify-center text-white text-lg shadow-sm group-hover:scale-105 transition-transform">
              🎓
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-[#172b4d] block leading-tight">
                EDU CLASS
              </span>
              <span className="text-[10px] text-slate-500 font-medium block">
                Learning Management System
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#003399] px-3.5 py-2 rounded-xl hover:bg-slate-100 transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Beranda
          </Link>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">

          {/* ================= LEFT SIDE (BRAND & VALUE) ================= */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#1d3557] via-[#102a45] to-[#0b1d30] p-8 lg:p-10 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Background decorative circles */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-[#003399]/20 blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-blue-200 mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Portal Terpadu Sekolah Digital
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Mulai Pembelajaran <br />
                <span className="text-blue-400">Efektif & Terstruktur</span>
              </h1>

              <p className="mt-3 text-xs leading-relaxed text-slate-300">
                Akses materi, kerjakan tugas, pantau kuis & ujian harian, serta rekapitulasi nilai dalam satu ekosistem e-learning terpadu.
              </p>

              {/* Feature Points */}
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center text-sm shrink-0 mt-0.5">
                    📚
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Materi & Penugasan Lengkap</h3>
                    <p className="text-[11px] text-slate-300 leading-snug mt-0.5">
                      Modul PDF, lampiran eksternal, dan deadline tugas otomatis.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-sm shrink-0 mt-0.5">
                    ⏱️
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Kuis & CBT Ujian Mandiri</h3>
                    <p className="text-[11px] text-slate-300 leading-snug mt-0.5">
                      Sistem asesmen formatif kuis & sumatif ujian dengan timer langsung.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-sm shrink-0 mt-0.5">
                    🔒
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Multi-Role Terproteksi</h3>
                    <p className="text-[11px] text-slate-300 leading-snug mt-0.5">
                      Hak akses terpisah untuk Siswa, Guru, Admin, Kurikulum & Pimpinan.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom mini badge */}
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 relative z-10">
              <span>SMK Citra Negara</span>
              <span className="font-medium text-slate-300">Tahun Ajaran 2026/2027</span>
            </div>
          </div>

          {/* ================= RIGHT SIDE (LOGIN FORM) ================= */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white">
            <div className="max-w-md w-full mx-auto">
              
              <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-[#172b4d] tracking-tight">
                  Selamat Datang! 👋
                </h2>
                <p className="text-xs text-slate-500 mt-1.5 font-medium leading-relaxed">
                  Masukkan NIS / Username / Email serta kata sandi Anda untuk melanjutkan ke dasbor akun.
                </p>
              </div>

              {/* Error Message Box */}
              {error && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3 animate-in fade-in duration-200">
                  <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold shrink-0 mt-0.5">
                    ⚠️
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-rose-900">Kendala Masuk Akun</p>
                    <p className="leading-relaxed text-rose-700">{error}</p>
                    {error.includes("Laragon") && (
                      <p className="mt-1 text-[11px] bg-rose-100/70 p-2 rounded-lg text-rose-900 font-medium">
                        👉 Solusi: Buka aplikasi Laragon di komputer Anda, lalu klik tombol <b>&quot;Start All&quot;</b> agar database MySQL aktif.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email, Username, atau NIS Siswa <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Contoh: 10245678 / ahmad_siswa / guru@sekolah.sch.id"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#003399] focus:ring-4 focus:ring-blue-100 transition shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Kata Sandi <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] text-slate-400">Default: admin123</span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi akun Anda"
                      required
                      className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#003399] focus:ring-4 focus:ring-blue-100 transition shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition"
                      aria-label="Tampilkan password"
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      id="remember"
                      className="w-4 h-4 rounded border-slate-300 text-[#003399] focus:ring-[#003399] accent-[#003399] cursor-pointer"
                    />
                    <span className="text-slate-600 font-medium">Ingat saya di perangkat ini</span>
                  </label>

                  <a
                    href="#bantuan"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Silakan hubungi staf administrator atau tim kurikulum sekolah untuk mereset kata sandi akun Anda.");
                    }}
                    className="font-semibold text-[#003399] hover:underline"
                  >
                    Lupa Password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold text-white transition-all shadow-md shadow-blue-900/15 flex items-center justify-center gap-2 ${
                    isLoading
                      ? "bg-slate-400 cursor-not-allowed"
                      : "bg-[#003399] hover:bg-[#002673] active:scale-[0.99]"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Memverifikasi Akun...
                    </>
                  ) : (
                    <>
                      <span>Masuk ke Portal</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              {/* Roles quick guide */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <p className="text-[11px] font-semibold text-slate-500 mb-2.5 text-center">
                  Panduan Kredensial Akses Peran:
                </p>
                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="font-bold text-slate-700">Siswa</p>
                    <p className="text-slate-500">NIS / Username</p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="font-bold text-slate-700">Guru</p>
                    <p className="text-slate-500">Email / Username</p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="font-bold text-slate-700">Admin</p>
                    <p className="text-slate-500">admin / Email</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="w-full bg-[#10294d] text-white py-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-base">🎓</span>
            <span className="font-bold text-white tracking-wide">EDU CLASS</span>
            <span>— Sistem Pembelajaran Terpadu SMK Citra Negara</span>
          </div>
          <div>
            &copy; 2026 Edu Class. Hak Cipta Dilindungi.
          </div>
        </div>
      </footer>

    </main>
  );
}
