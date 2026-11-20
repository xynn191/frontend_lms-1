"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function KepalaSekolahLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const userData = localStorage.getItem("user");

    if (!token || (role !== "kepala_sekolah" && role !== "admin")) {
      router.push("/login");
      return;
    }

    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        setUser({ username: "kepala_sekolah", role: "kepala_sekolah" });
      }
    } else {
      setUser({ username: "kepala_sekolah", role: "kepala_sekolah" });
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8fafc] text-slate-500 text-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#003399] border-t-transparent rounded-full animate-spin"></div>
          <p className="font-medium text-xs">Memuat Portal Kepala Sekolah...</p>
        </div>
      </div>
    );
  }

  const isActive = (path: string) =>
    pathname === path || (path !== "/kepala-sekolah/dashboard" && pathname.startsWith(path));

  const navItemClass = (active: boolean) =>
    `flex items-center gap-3 w-full text-left px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition ${
      active
        ? "bg-[#003399] text-white shadow-sm font-semibold"
        : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
    }`;

  const navLinks = [
    { href: "/kepala-sekolah/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/kepala-sekolah/siswa", label: "Data Siswa", icon: "👨‍🎓" },
    { href: "/kepala-sekolah/guru", label: "Data Guru", icon: "👨‍🏫" },
    { href: "/kepala-sekolah/kelas-jurusan", label: "Data Kelas & Jurusan", icon: "🏛️" },
    { href: "/kepala-sekolah/mata-pelajaran", label: "Data Mata Pelajaran", icon: "📖" },
    { href: "/kepala-sekolah/monitoring", label: "Monitoring Akademik", icon: "📈" },
    { href: "/kepala-sekolah/laporan", label: "Laporan Sekolah", icon: "📄" },
    { href: "/kepala-sekolah/profil", label: "Profil Akun", icon: "👤" },
  ];

  const currentTitle =
    navLinks.find((item) => isActive(item.href))?.label || "Portal Pimpinan";

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
      {/* ================= SIDEBAR ================= */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 shadow-sm flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        {/* Brand */}
        <div className="flex h-16 items-center px-6 border-b border-slate-100 gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#003399] flex items-center justify-center text-white font-bold text-sm shadow-xs">
            🎓
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-[#172b4d] tracking-wide leading-none truncate">
              EDU CLASS
            </h1>
            <p className="text-[10px] text-slate-500 font-medium mt-1 truncate">
              Portal Kepala Sekolah
            </p>
          </div>
        </div>

        {/* Navigation list */}
        <div className="p-4 flex-1 overflow-y-auto space-y-5">
          <div>
            <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-2.5 px-3">
              Menu Eksekutif
            </h3>
            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={navItemClass(isActive(link.href))}
                >
                  <span className="text-base shrink-0">{link.icon}</span>
                  <span className="truncate">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Read-Only Notice Badge */}
          <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#003399]">
              <span>🛡️</span>
              <span>Hak Akses Read-Only</span>
            </div>
            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
              Kepala Sekolah memiliki wewenang pengawasan makro, statistik, dan laporan tanpa manipulasi data.
            </p>
          </div>
        </div>

        {/* User Card & Logout */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-slate-200/70 shadow-2xs mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#1d3557] text-white flex items-center justify-center text-sm font-bold shrink-0">
              👔
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">
                Drs. H. Mulyadi, M.M.
              </p>
              <p className="text-[10px] text-slate-500 truncate font-medium">
                Kepala Sekolah
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Keluar Akun
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100"
              aria-label="Toggle Menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h2 className="text-base font-bold text-slate-800 leading-tight">
                {currentTitle}
              </h2>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Sistem Informasi Manajemen Sekolah &bull; SMK Citra Negara
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Semester pill */}
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              TA 2025/2026 (Ganjil)
            </div>

            {/* Quick date */}
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-slate-700">Tahun Ajaran Aktif</p>
              <p className="text-[10px] text-slate-400">Semester Ganjil</p>
            </div>

            {/* Print action shortcut */}
            <Link
              href="/kepala-sekolah/laporan"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#003399] bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition"
            >
              <span>🖨️</span>
              <span className="hidden sm:inline">Cetak Laporan</span>
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* ================= LOGOUT MODAL ================= */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-sm w-full p-6 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl mx-auto mb-4">
              🚪
            </div>
            <h3 className="text-base font-bold text-slate-800 text-center">
              Konfirmasi Keluar
            </h3>
            <p className="text-xs text-slate-500 text-center mt-2 leading-relaxed">
              Apakah Anda yakin ingin keluar dari sesi Portal Kepala Sekolah?
            </p>
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 px-4 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2.5 px-4 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition shadow-sm"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
