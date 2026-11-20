"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type Stats = {
  total_siswa: number;
  total_guru: number;
  total_kelas: number;
  total_jurusan: number;
  total_mapel: number;
  total_mata_pelajaran?: number;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_URL}/api/dashboard`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });
        if (response.status === 401 || response.status === 403) {
          router.push("/login");
          return;
        }

        let data: any = null;
        try {
          data = await response.json();
        } catch (jsonErr) {
          throw new Error("Respon server tidak valid atau server backend belum diperbarui");
        }

        if (!response.ok) throw new Error(data?.message || "Gagal mengambil data statistik");
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  const cards = [
    { title: "Total Siswa", count: stats?.total_siswa ?? 0, icon: "👨‍🎓", href: "/admin/siswa", color: "from-blue-500 to-indigo-600" },
    { title: "Total Guru", count: stats?.total_guru ?? 0, icon: "👨‍🏫", href: "/admin/guru", color: "from-emerald-500 to-teal-600" },
    { title: "Total Kelas", count: stats?.total_kelas ?? 0, icon: "🏫", href: "/admin/kelas", color: "from-violet-500 to-purple-600" },
    { title: "Total Jurusan", count: stats?.total_jurusan ?? 0, icon: "🏢", href: "/admin/jurusan", color: "from-amber-500 to-orange-600" },
    { title: "Mata Pelajaran", count: stats?.total_mapel ?? stats?.total_mata_pelajaran ?? 0, icon: "📚", href: "/admin/mata-pelajaran", color: "from-rose-500 to-pink-600" },
  ];

  const quickNav = [
    { label: "Kelola Siswa", href: "/admin/siswa", desc: "Data siswa, kelas, dan jurusan", icon: "👨‍🎓" },
    { label: "Kelola Guru", href: "/admin/guru", desc: "Manajemen akun dan data staf pengajar", icon: "👨‍🏫" },
    { label: "Jurusan & Kelas", href: "/admin/kelas", desc: "Daftar kompetensi keahlian dan rombel", icon: "🏢" },
    { label: "Mata Pelajaran", href: "/admin/mata-pelajaran", desc: "Kurikulum & silabus mata pelajaran", icon: "📚" },
    { label: "Kurikulum", href: "/admin/kurikulum", desc: "Tim penanggung jawab kurikulum", icon: "📋" },
    { label: "Kepala Sekolah", href: "/admin/kepala-sekolah", desc: "Profil pimpinan sekolah", icon: "👔" },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#003399] to-[#1d3557] p-8 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Selamat Datang di Edu Class 👋</h1>
          <p className="mt-2 text-blue-100 text-sm max-w-xl">
            Sistem Informasi & Manajemen Akademik Sekolah. Pantau dan kelola seluruh data akademik dalam satu portal terpadu.
          </p>
        </div>
        <div className="shrink-0 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-blue-50">
          Admin Control Center
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-200">
          ⚠️ {error}
        </div>
      )}

      {/* Stat Cards Grid */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-4">Ringkasan Data Akademik</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {cards.map((c) => (
            <Link
              key={c.title}
              href={c.href}
              className="group bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-400 transition flex flex-col justify-between"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{c.title}</span>
                <span className="text-2xl group-hover:scale-110 transition-transform">{c.icon}</span>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-slate-800">
                  {loading ? (
                    <span className="inline-block h-8 w-12 animate-pulse rounded bg-slate-200" />
                  ) : (
                    c.count
                  )}
                </span>
                <span className="text-xs text-blue-600 font-semibold group-hover:underline">
                  Lihat Detail →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Nav / Menu Kelola */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-4">Aksi Cepat & Manajemen Modul</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickNav.map((nav) => (
            <Link
              key={nav.label}
              href={nav.href}
              className="flex items-center gap-4 bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-[#003399]/40 transition group"
            >
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl group-hover:bg-[#003399] group-hover:text-white transition">
                {nav.icon}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm group-hover:text-[#003399] transition">
                  {nav.label}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{nav.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
