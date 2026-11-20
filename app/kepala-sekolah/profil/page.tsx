"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function KepalaSekolahProfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    if (rawUser) {
      try {
        setUser(JSON.parse(rawUser));
      } catch (e) {
        setUser({
          username: "kepala_sekolah",
          email: "kepala.sekolah@educlass.com",
          role: "kepala_sekolah",
        });
      }
    } else {
      setUser({
        username: "kepala_sekolah",
        email: "kepala.sekolah@educlass.com",
        role: "kepala_sekolah",
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[11px] font-bold text-[#003399] mb-2">
          <span>👤</span>
          <span>Identitas Pimpinan Lembaga (Read-Only)</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
          Profil Akun Kepala Sekolah
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Kredensial resmi dan rincian identitas pimpinan eksekutif SMK Citra Negara di platform Edu Class.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
        {/* Cover banner */}
        <div className="h-32 bg-gradient-to-r from-[#1d3557] via-[#102a45] to-[#003399] p-6 flex items-end">
          <div className="translate-y-12 flex items-center gap-4">
            <div className="w-24 h-24 rounded-3xl bg-white p-1 shadow-md border border-slate-200">
              <div className="w-full h-full rounded-2xl bg-slate-100 flex items-center justify-center text-4xl">
                👔
              </div>
            </div>
            <div className="pt-8">
              <h2 className="text-lg font-black text-slate-800">
                Drs. H. Mulyadi, M.M.
              </h2>
              <p className="text-xs font-semibold text-[#003399]">
                Kepala Sekolah &bull; SMK Citra Negara
              </p>
            </div>
          </div>
        </div>

        {/* Info details */}
        <div className="pt-16 p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <p className="text-slate-400 font-medium">NIP Kepegawaian</p>
              <p className="font-mono font-bold text-slate-800 text-sm">196803121995121001</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <p className="text-slate-400 font-medium">Jabatan Formal</p>
              <p className="font-bold text-slate-800 text-sm">Kepala Sekolah (Pimpinan Eksekutif)</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <p className="text-slate-400 font-medium">Username Login</p>
              <p className="font-mono font-bold text-slate-800 text-sm">
                @{user?.username || "kepala_sekolah"}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <p className="text-slate-400 font-medium">Email Kedinasan</p>
              <p className="font-bold text-slate-800 text-sm">
                {user?.email || "kepala.sekolah@educlass.com"}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <p className="text-slate-400 font-medium">Hak Akses Sistem</p>
              <span className="inline-block px-2.5 py-1 rounded-full bg-blue-50 text-[#003399] font-bold text-[11px] border border-blue-200 mt-0.5">
                Read-Only (Monitoring Makro & Laporan)
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <p className="text-slate-400 font-medium">Status Akun</p>
              <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] border border-emerald-200 mt-0.5">
                ✓ Aktif Bertugas
              </span>
            </div>
          </div>

          {/* Security & Access Statement */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <span>🛡️</span>
              <span>Kebijakan Keamanan Akun Pimpinan</span>
            </p>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Role Kepala Sekolah tidak diberikan kewenangan untuk merubah atau memanipulasi data akademik secara langsung guna menjaga integritas rekam jejak penilaian sekolah. Seluruh hak manipulasi master data tetap berada di bawah kendali Administrator dan Kurikulum.
            </p>
          </div>

          {/* Logout Action */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Sesi terenkripsi token JWT aktif
            </span>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition shadow-sm"
            >
              <span>🚪</span>
              <span>Keluar dari Akun</span>
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-sm w-full p-6 shadow-xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl mx-auto">
              🚪
            </div>
            <h3 className="text-base font-bold text-slate-800 text-center">
              Konfirmasi Keluar Akun
            </h3>
            <p className="text-xs text-slate-500 text-center leading-relaxed">
              Apakah Anda yakin ingin mengakhiri sesi login Kepala Sekolah?
            </p>
            <div className="flex items-center gap-3 pt-2">
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
