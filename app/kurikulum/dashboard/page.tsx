"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function KurikulumDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal Detail State untuk Cardbox Interaktif
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalDetailData, setModalDetailData] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/kurikulum/dashboard`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Gagal memuat statistik kurikulum");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // Handler interaktif ketika cardbox diklik
  const handleCardClick = async (type: string) => {
    switch (type) {
      case "guru":
        setActiveModal("guru");
        setModalLoading(true);
        try {
          const res = await fetch(`${API_URL}/api/kurikulum/options`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
          });
          const json = await res.json();
          setModalDetailData(json.guru || []);
        } catch (e) {
          console.error(e);
        } finally {
          setModalLoading(false);
        }
        break;
      case "siswa":
        setActiveModal("siswa");
        break;
      case "kelas":
        router.push("/kurikulum/akademik");
        break;
      case "jurusan":
        router.push("/kurikulum/akademik");
        break;
      case "mapel":
        router.push("/kurikulum/pengampu");
        break;
      case "materi":
        router.push("/kurikulum/monitoring?tab=materi");
        break;
      case "tugas":
        router.push("/kurikulum/monitoring?tab=tugas");
        break;
      case "evaluasi":
        router.push("/kurikulum/monitoring?tab=evaluasi");
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-44 rounded-2xl bg-slate-200"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-slate-200"></div>
          ))}
        </div>
      </div>
    );
  }

  const s = data?.statistik || {};
  const statsList = [
    { type: "guru", label: "Guru Pengajar", val: s.total_guru || 0, icon: "👨‍🏫", bg: "hover:border-blue-300 group-hover:bg-blue-50/50", actionText: "Lihat detail guru" },
    { type: "siswa", label: "Siswa Aktif", val: s.total_siswa || 0, icon: "👩‍🎓", bg: "hover:border-indigo-300 group-hover:bg-indigo-50/50", actionText: "Distribusi jurusan" },
    { type: "kelas", label: "Rombel Kelas", val: s.total_kelas || 0, icon: "🏫", bg: "hover:border-sky-300 group-hover:bg-sky-50/50", actionText: "Ke Data Akademik →" },
    { type: "jurusan", label: "Konsentrasi Jurusan", val: s.total_jurusan || 0, icon: "⚙️", bg: "hover:border-teal-300 group-hover:bg-teal-50/50", actionText: "Kelola rombel →" },
    { type: "mapel", label: "Mata Pelajaran", val: s.total_mapel || 0, icon: "📚", bg: "hover:border-emerald-300 group-hover:bg-emerald-50/50", actionText: "Alokasi pengampu →" },
    { type: "materi", label: "Materi Ajar Terbit", val: s.total_materi || 0, icon: "📖", bg: "hover:border-amber-300 group-hover:bg-amber-50/50", actionText: "Pantau materi →" },
    { type: "tugas", label: "Tugas Pembelajaran", val: s.total_tugas || 0, icon: "📝", bg: "hover:border-orange-300 group-hover:bg-orange-50/50", actionText: "Pantau tugas →" },
    { type: "evaluasi", label: "Kuis & Ujian Aktif", val: (s.total_kuis || 0) + (s.total_ujian || 0), icon: "🎯", bg: "hover:border-violet-300 group-hover:bg-violet-50/50", actionText: "Pantau evaluasi →" },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#003399] via-[#1048b3] to-[#1e3a8a] p-8 text-white shadow-md">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
            🎓 Pusat Monitoring & Evaluasi Akademik
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight">
            Portal Kurikulum Edu Class
          </h1>
          <p className="mt-2 text-sm text-blue-100 leading-relaxed">
            Kelola penugasan guru pengampu, penetapan wali kelas, serta pantau keterlaksanaan modul belajar dan rekap nilai siswa secara interaktif.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/kurikulum/pengampu"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-[#003399] shadow-sm transition hover:bg-blue-50"
            >
              📚 Atur Alokasi Guru Pengampu
            </Link>
            <Link
              href="/kurikulum/akademik"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              🏫 Kelola Wali Kelas Rombel
            </Link>
          </div>
        </div>
        <div className="absolute -right-8 -bottom-10 h-64 w-64 rounded-full bg-white/10 blur-2xl"></div>
      </section>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Grid 8 Cardbox Interaktif (Semua Bisa Diklik) */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800">Cardbox Statistik Akademik</h2>
            <p className="text-xs text-slate-400">Klik setiap kartu untuk berinteraksi dan melihat rincian datanya</p>
          </div>
          <span className="text-xs text-slate-400 font-medium">Tahun Ajaran 2025/2026 Ganjil</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {statsList.map((st, idx) => (
            <div
              key={idx}
              onClick={() => handleCardClick(st.type)}
              className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition duration-200 hover:-translate-y-1 hover:shadow-md hover:border-[#003399]/40 active:scale-[0.98]"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl transition group-hover:scale-110">{st.icon}</span>
                <span className="text-2xl font-black text-slate-800">{st.val}</span>
              </div>
              <p className="mt-3 text-xs font-bold text-slate-700">{st.label}</p>
              <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-[#003399]">
                <span>{st.actionText}</span>
                <span className="transition group-hover:translate-x-1">→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Grid 2 Kolom: Distribusi Jurusan & Aktivitas Terkini */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribusi Jurusan & Rombel */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Distribusi Rombel & Siswa per Jurusan</h3>
              <p className="text-xs text-slate-400 mt-0.5">Struktur konsentrasi keahlian terdaftar</p>
            </div>
            <Link
              href="/kurikulum/akademik"
              className="text-xs font-bold text-[#003399] hover:underline"
            >
              Lihat Detail →
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {data?.jurusan_stats && data.jurusan_stats.length > 0 ? (
              data.jurusan_stats.map((js: any) => (
                <div
                  key={js.kode_jurusan}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#003399]/10 text-xs font-black text-[#003399]">
                      {js.kode_jurusan}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{js.nama_jurusan}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{js.total_kelas} Rombel Kelas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block rounded-full bg-blue-100/80 px-2.5 py-1 text-xs font-bold text-[#003399]">
                      {js.total_siswa} Siswa
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-6 text-xs text-slate-400">Belum ada data jurusan.</p>
            )}
          </div>
        </div>

        {/* Aktivitas Pembelajaran Terkini */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Aktivitas Pembelajaran Terkini</h3>
              <p className="text-xs text-slate-400 mt-0.5">Materi & tugas yang baru dipublikasikan guru</p>
            </div>
            <Link
              href="/kurikulum/monitoring"
              className="text-xs font-bold text-[#003399] hover:underline"
            >
              Semua Aktivitas →
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {data?.aktivitas && data.aktivitas.length > 0 ? (
              data.aktivitas.map((act: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-start justify-between rounded-xl border border-slate-100 p-3.5 transition hover:bg-slate-50/80"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                        act.tipe === "Materi"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {act.tipe}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 leading-snug">{act.judul}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {act.guru} • <span className="font-medium text-slate-700">{act.mapel}</span> ({act.kelas})
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 text-[10px] text-slate-400 font-medium">{act.created_at}</span>
                </div>
              ))
            ) : (
              <p className="text-center py-6 text-xs text-slate-400">Belum ada aktivitas pembelajaran tercatat.</p>
            )}
          </div>
        </div>
      </section>

      {/* MODAL INTERAKTIF CARDBOX: DETAIL GURU PENGAJAR */}
      {activeModal === "guru" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">👨‍🏫</span>
                <h3 className="text-base font-bold text-slate-800">Daftar Guru Pengajar Aktif</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 max-h-80 overflow-y-auto space-y-2">
              {modalLoading ? (
                <p className="py-6 text-center text-xs text-slate-400">Memuat data guru...</p>
              ) : modalDetailData && modalDetailData.length > 0 ? (
                modalDetailData.map((g: any) => (
                  <div key={g.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{g.nama}</p>
                      <p className="text-[11px] text-slate-400">NIP: {g.info || "-"}</p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                      Aktif Mengajar
                    </span>
                  </div>
                ))
              ) : (
                <p className="py-6 text-center text-xs text-slate-400">Tidak ada data guru.</p>
              )}
            </div>

            <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                onClick={() => setActiveModal(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Tutup
              </button>
              <Link
                href="/kurikulum/pengampu"
                className="rounded-xl bg-[#003399] px-4 py-2 text-xs font-bold text-white hover:bg-blue-800"
              >
                Atur Alokasi Guru →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* MODAL INTERAKTIF CARDBOX: DISTRIBUSI SISWA PER JURUSAN */}
      {activeModal === "siswa" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">👩‍🎓</span>
                <h3 className="text-base font-bold text-slate-800">Distribusi Siswa per Konsentrasi</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {data?.jurusan_stats?.map((js: any) => (
                <div key={js.kode_jurusan} className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
                  <div>
                    <p className="text-xs font-bold text-slate-800">{js.nama_jurusan} ({js.kode_jurusan})</p>
                    <p className="text-[11px] text-slate-400">{js.total_kelas} Rombel Kelas</p>
                  </div>
                  <span className="font-black text-[#003399] text-sm">{js.total_siswa} Siswa</span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button
                onClick={() => setActiveModal(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Tutup
              </button>
              <Link
                href="/kurikulum/akademik"
                className="rounded-xl bg-[#003399] px-4 py-2 text-xs font-bold text-white hover:bg-blue-800"
              >
                Lihat Data Rombel Lengkap →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
