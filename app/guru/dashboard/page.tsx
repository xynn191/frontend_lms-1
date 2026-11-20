"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type GuruDashboardData = {
  nama_guru: string;
  nip: string;
  total_kelas: number;
  total_materi: number;
  total_tugas: number;
  total_kuis: number;
  total_ujian: number;
  kelas_ajar: {
    kelas_id: number;
    nama_kelas: string;
    tingkat: string;
    mapel_id: number;
    nama_mapel: string;
    kode_mapel: string;
  }[];
  materi_terbaru: {
    id: number;
    nama_mapel: string;
    nama_kelas: string;
    judul: string;
    created_at: string;
  }[];
  tugas_terbaru: {
    id: number;
    nama_mapel: string;
    nama_kelas: string;
    judul: string;
    deadline: string;
    total_kumpul: number;
  }[];
};

export default function GuruDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<GuruDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/guru/dashboard`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });
        if (res.status === 401 || res.status === 403) {
          router.push("/login");
          return;
        }
        if (!res.ok) throw new Error("Gagal mengambil data dashboard guru");
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan memuat dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#003399] to-[#1e3a8a] p-8 text-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="inline-block bg-white/15 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 text-blue-100">
            Portal Pembelajaran Guru
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Selamat Datang, {data?.nama_guru || "Bapak/Ibu Guru"} 👋
          </h1>
          <p className="mt-1 text-blue-100 text-sm max-w-xl">
            NIP: {data?.nip || "-"} • Kelola materi pembelajaran, penugasan, kuis, dan rekap penilaian siswa Anda di sini.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link
            href="/guru/materi"
            className="bg-white text-[#003399] px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-50 transition shadow-xs"
          >
            + Buat Materi
          </Link>
          <Link
            href="/guru/tugas"
            className="bg-blue-700/80 border border-white/20 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-600 transition shadow-xs"
          >
            + Buat Tugas
          </Link>
          <Link
            href="/guru/nilai"
            className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald-500 transition shadow-xs"
          >
            Input Nilai
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-200">
          ⚠️ {error}
        </div>
      )}

      {/* Statistik Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Kelas Diampu</span>
            <span className="text-2xl">🏫</span>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-extrabold text-[#003399]">
              {loading ? "..." : data?.total_kelas ?? 0}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Rombongan Belajar</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Materi Aktif</span>
            <span className="text-2xl">📖</span>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-extrabold text-emerald-600">
              {loading ? "..." : data?.total_materi ?? 0}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Modul pembelajaran</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Tugas Diberikan</span>
            <span className="text-2xl">📝</span>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-extrabold text-blue-600">
              {loading ? "..." : data?.total_tugas ?? 0}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">Tugas siswa</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Kuis & Ujian</span>
            <span className="text-2xl">⏱️</span>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-extrabold text-amber-600">
              {loading ? "..." : (data?.total_kuis ?? 0) + (data?.total_ujian ?? 0)}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{data?.total_kuis ?? 0} Kuis • {data?.total_ujian ?? 0} Ujian</p>
          </div>
        </div>
      </div>

      {/* Grid: Kelas Mengajar & Aktivitas Terbaru */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom 1 & 2: Daftar Kelas yang Diampu */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold text-slate-800">Daftar Kelas & Mata Pelajaran</h2>
            <span className="text-xs text-slate-400 font-medium">Semester Ganjil 2025/2026</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase text-[11px] font-semibold border-b border-slate-200">
                  <th className="p-3">Kelas</th>
                  <th className="p-3">Mata Pelajaran</th>
                  <th className="p-3">Kode</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-400 text-xs">Memuat kelas...</td>
                  </tr>
                ) : data?.kelas_ajar && data.kelas_ajar.length > 0 ? (
                  data.kelas_ajar.map((item, idx) => (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/80 transition text-xs">
                      <td className="p-3 font-bold text-slate-800">
                        <span className="inline-block bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-bold">
                          {item.nama_kelas}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-slate-700">{item.nama_mapel}</td>
                      <td className="p-3 font-mono text-slate-500">{item.kode_mapel}</td>
                      <td className="p-3 text-right">
                        <Link
                          href={`/guru/nilai?kelas_id=${item.kelas_id}&mapel_id=${item.mapel_id}`}
                          className="text-xs font-semibold text-[#003399] hover:underline"
                        >
                          Buka Nilai →
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-400 text-xs">Belum ada penugasan mengajar</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Kolom 3: Tugas & Materi Terbaru */}
        <div className="space-y-6">
          {/* Box Tugas Terbaru */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-slate-800">Tugas Terbaru</h3>
              <Link href="/guru/tugas" className="text-xs text-[#003399] font-medium hover:underline">
                Semua →
              </Link>
            </div>
            <div className="space-y-3">
              {data?.tugas_terbaru && data.tugas_terbaru.length > 0 ? (
                data.tugas_terbaru.slice(0, 3).map((t) => (
                  <div key={t.id} className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                    <p className="font-bold text-slate-800 truncate">{t.judul}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {t.nama_kelas} • {t.nama_mapel}
                    </p>
                    <p className="text-[10px] text-red-500 font-medium mt-1">
                      ⏰ Deadline: {t.deadline}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-xs py-2">Belum ada tugas dibuat.</p>
              )}
            </div>
          </div>

          {/* Box Materi Terbaru */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-slate-800">Materi Terakhir</h3>
              <Link href="/guru/materi" className="text-xs text-[#003399] font-medium hover:underline">
                Semua →
              </Link>
            </div>
            <div className="space-y-3">
              {data?.materi_terbaru && data.materi_terbaru.length > 0 ? (
                data.materi_terbaru.slice(0, 3).map((m) => (
                  <div key={m.id} className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                    <p className="font-bold text-slate-800 truncate">{m.judul}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {m.nama_kelas} • {m.nama_mapel}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      📅 Diunggah: {m.created_at}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-xs py-2">Belum ada materi pembelajaran.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

