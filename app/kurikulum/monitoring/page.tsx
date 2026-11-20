"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function MonitoringContent() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as "materi" | "tugas" | "evaluasi") || "materi";

  const [data, setData] = useState<any>({ materi: [], tugas: [], evaluasi: [] });
  const [activeTab, setActiveTab] = useState<"materi" | "tugas" | "evaluasi">(initialTab);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Modal State untuk Preview Interaktif
  const [selectedMateri, setSelectedMateri] = useState<any | null>(null);

  const [selectedTugas, setSelectedTugas] = useState<any | null>(null);
  const [pengumpulanList, setPengumpulanList] = useState<any[]>([]);
  const [loadingTugasDetail, setLoadingTugasDetail] = useState(false);

  const [selectedEvaluasi, setSelectedEvaluasi] = useState<any | null>(null);
  const [soalList, setSoalList] = useState<any[]>([]);
  const [loadingSoal, setLoadingSoal] = useState(false);

  const headers = () => ({
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  });

  const loadMonitoring = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/kurikulum/monitoring`, {
        headers: headers(),
      });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      setData(json || { materi: [], tugas: [], evaluasi: [] });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Gagal memuat aktivitas pembelajaran");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMonitoring();
  }, []);

  useEffect(() => {
    const tabParam = searchParams.get("tab") as "materi" | "tugas" | "evaluasi";
    if (tabParam && ["materi", "tugas", "evaluasi"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Buka Modal Tugas & Ambil data pengumpulan siswa
  const openTugasDetail = async (tugas: any) => {
    setSelectedTugas(tugas);
    setLoadingTugasDetail(true);
    try {
      const res = await fetch(`${API_URL}/api/kurikulum/monitoring/tugas/${tugas.id}`, {
        headers: headers(),
      });
      if (res.ok) {
        setPengumpulanList(await res.json());
      } else {
        setPengumpulanList([]);
      }
    } catch (e) {
      console.error(e);
      setPengumpulanList([]);
    } finally {
      setLoadingTugasDetail(false);
    }
  };

  // Buka Modal Evaluasi & Ambil butir-butir soal
  const openEvaluasiDetail = async (evaluasi: any) => {
    setSelectedEvaluasi(evaluasi);
    setLoadingSoal(true);
    try {
      const res = await fetch(`${API_URL}/api/kurikulum/monitoring/evaluasi/${evaluasi.id}`, {
        headers: headers(),
      });
      if (res.ok) {
        setSoalList(await res.json());
      } else {
        setSoalList([]);
      }
    } catch (e) {
      console.error(e);
      setSoalList([]);
    } finally {
      setLoadingSoal(false);
    }
  };

  const materiFiltered = (data?.materi || []).filter((m: any) =>
    m.judul.toLowerCase().includes(search.toLowerCase()) ||
    m.guru.toLowerCase().includes(search.toLowerCase()) ||
    m.mapel.toLowerCase().includes(search.toLowerCase()) ||
    m.kelas.toLowerCase().includes(search.toLowerCase())
  );

  const tugasFiltered = (data?.tugas || []).filter((t: any) =>
    t.judul.toLowerCase().includes(search.toLowerCase()) ||
    t.guru.toLowerCase().includes(search.toLowerCase()) ||
    t.mapel.toLowerCase().includes(search.toLowerCase()) ||
    t.kelas.toLowerCase().includes(search.toLowerCase())
  );

  const evaluasiFiltered = (data?.evaluasi || []).filter((e: any) =>
    e.judul.toLowerCase().includes(search.toLowerCase()) ||
    e.guru.toLowerCase().includes(search.toLowerCase()) ||
    e.mapel.toLowerCase().includes(search.toLowerCase()) ||
    e.kelas.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#003399]">Monitoring Pembelajaran</h1>
          <p className="text-xs text-slate-500 mt-1">
            Pantau transparansi dan keaktifan modul materi, penugasan siswa, serta butir soal kuis & ujian secara interaktif.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("materi")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === "materi"
                ? "bg-[#003399] text-white shadow-xs"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            📖 Materi ({data?.materi?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("tugas")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === "tugas"
                ? "bg-[#003399] text-white shadow-xs"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            📝 Tugas ({data?.tugas?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("evaluasi")}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === "evaluasi"
                ? "bg-[#003399] text-white shadow-xs"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            🎯 Kuis & Ujian ({data?.evaluasi?.length || 0})
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
          ✕ {error}
        </div>
      )}

      {/* Search Input */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <input
          type="text"
          placeholder="Cari berdasarkan judul materi/tugas/evaluasi, nama guru, mapel, atau kelas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-2 text-xs outline-none focus:border-[#003399] focus:ring-1 focus:ring-[#003399]"
        />
      </div>

      {/* TAB 1: MATERI */}
      {activeTab === "materi" && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3.5 px-5">Judul Materi</th>
                <th className="py-3.5 px-4">Guru Pengampu</th>
                <th className="py-3.5 px-4">Mapel & Kelas</th>
                <th className="py-3.5 px-4">Modul / Berkas</th>
                <th className="py-3.5 px-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Memuat materi pembelajaran...
                  </td>
                </tr>
              ) : materiFiltered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Belum ada materi pembelajaran yang terdaftar.
                  </td>
                </tr>
              ) : (
                materiFiltered.map((m: any) => (
                  <tr key={m.id} className="transition hover:bg-slate-50/70">
                    <td className="py-3.5 px-5">
                      <p className="font-bold text-slate-800 text-sm">{m.judul}</p>
                      {m.deskripsi && <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{m.deskripsi}</p>}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#003399]">{m.guru}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-700">{m.mapel}</span>
                      <span className="ml-2 inline-block rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-[#003399]">
                        {m.kelas}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 space-x-2">
                      {m.file_url ? (
                        <a
                          href={m.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-700 hover:bg-blue-100"
                        >
                          📄 Berkas Modul
                        </a>
                      ) : null}
                      {m.tautan_eksternal ? (
                        <a
                          href={m.tautan_eksternal}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-700 hover:bg-slate-200"
                        >
                          🔗 Tautan Web
                        </a>
                      ) : null}
                      {!m.file_url && !m.tautan_eksternal && (
                        <span className="text-[11px] text-slate-400">Teks Instruksi</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => setSelectedMateri(m)}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-[#003399] hover:bg-blue-50"
                      >
                        👁️ Pratinjau
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: TUGAS */}
      {activeTab === "tugas" && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3.5 px-5">Judul Tugas</th>
                <th className="py-3.5 px-4">Guru</th>
                <th className="py-3.5 px-4">Mapel & Kelas</th>
                <th className="py-3.5 px-4">Batas Deadline</th>
                <th className="py-3.5 px-4 text-center">Partisipasi Kumpul</th>
                <th className="py-3.5 px-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Memuat daftar penugasan...
                  </td>
                </tr>
              ) : tugasFiltered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Belum ada tugas siswa yang aktif.
                  </td>
                </tr>
              ) : (
                tugasFiltered.map((t: any) => (
                  <tr key={t.id} className="transition hover:bg-slate-50/70">
                    <td className="py-3.5 px-5 font-bold text-slate-800 text-sm">{t.judul}</td>
                    <td className="py-3.5 px-4 font-semibold text-[#003399]">{t.guru}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-700">{t.mapel}</span>
                      <span className="ml-2 inline-block rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-[#003399]">
                        {t.kelas}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-amber-600">
                      ⏰ {t.deadline}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block rounded-full bg-emerald-50 px-3 py-1 font-bold text-emerald-700">
                        {t.total_terkumpul} Siswa
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => openTugasDetail(t)}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-[#003399] hover:bg-blue-50"
                      >
                        👁️ Pantau ({t.total_terkumpul})
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: KUIS & UJIAN */}
      {activeTab === "evaluasi" && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <tr>
                <th className="py-3.5 px-5">Tipe</th>
                <th className="py-3.5 px-4">Judul Evaluasi</th>
                <th className="py-3.5 px-4">Guru</th>
                <th className="py-3.5 px-4">Mapel & Kelas</th>
                <th className="py-3.5 px-4">Durasi & Soal</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Memuat evaluasi kuis dan ujian...
                  </td>
                </tr>
              ) : evaluasiFiltered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Belum ada kuis atau ujian yang dibuat.
                  </td>
                </tr>
              ) : (
                evaluasiFiltered.map((e: any) => (
                  <tr key={e.id} className="transition hover:bg-slate-50/70">
                    <td className="py-3.5 px-5">
                      <span
                        className={`inline-block rounded-md px-2.5 py-0.5 text-[10px] font-black uppercase ${
                          e.tipe === "ujian"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-blue-100 text-[#003399]"
                        }`}
                      >
                        {e.tipe}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800 text-sm">{e.judul}</td>
                    <td className="py-3.5 px-4 font-semibold text-[#003399]">{e.guru}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-700">{e.mapel}</span>
                      <span className="ml-2 inline-block rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-[#003399]">
                        {e.kelas}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-slate-700">⏱️ {e.durasi_menit} Menit</p>
                      <p className="text-[11px] text-slate-400">{e.jumlah_soal} Butir Soal</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                          e.status === "aktif"
                            ? "bg-emerald-50 text-emerald-700"
                            : e.status === "selesai"
                            ? "bg-slate-100 text-slate-600"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {e.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => openEvaluasiDetail(e)}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-[#003399] hover:bg-blue-50"
                      >
                        👁️ Pratinjau Soal
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL 1: PRATINJAU MATERI */}
      {selectedMateri && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#003399]">Modul Materi Ajar</span>
                <h3 className="text-base font-bold text-slate-800">{selectedMateri.judul}</h3>
              </div>
              <button
                onClick={() => setSelectedMateri(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl">
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Guru Pengajar</span>
                  <p className="font-bold text-slate-800">{selectedMateri.guru}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">Mapel / Rombel</span>
                  <p className="font-bold text-slate-800">{selectedMateri.mapel} ({selectedMateri.kelas})</p>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block text-xs font-bold mb-1">Deskripsi & Pokok Pembahasan:</span>
                <p className="text-xs text-slate-700 leading-relaxed bg-white border border-slate-100 p-3.5 rounded-xl whitespace-pre-wrap">
                  {selectedMateri.deskripsi || "Tidak ada rincian deskripsi tambahan."}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-slate-500 block text-xs font-bold">Akses Berkas / Referensi:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedMateri.file_url && (
                    <a
                      href={selectedMateri.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100"
                    >
                      📄 Unduh Berkas PDF / Modul
                    </a>
                  )}
                  {selectedMateri.tautan_eksternal && (
                    <a
                      href={selectedMateri.tautan_eksternal}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
                    >
                      🔗 Kunjungi Tautan Web Eksternal
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end border-t border-slate-100 pt-3">
              <button
                onClick={() => setSelectedMateri(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: PRATINJAU PENGUMPULAN TUGAS */}
      {selectedTugas && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#003399]">Pantau Pengumpulan Tugas</span>
                <h3 className="text-base font-bold text-slate-800">{selectedTugas.judul}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedTugas.mapel} ({selectedTugas.kelas}) • Deadline: {selectedTugas.deadline}
                </p>
              </div>
              <button
                onClick={() => setSelectedTugas(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="mt-4">
              <h4 className="text-xs font-bold text-slate-700 mb-2">
                Daftar Siswa yang Mengumpulkan ({pengumpulanList.length} Siswa)
              </h4>
              <div className="max-h-72 overflow-y-auto space-y-2 border border-slate-100 rounded-xl p-2 bg-slate-50/50">
                {loadingTugasDetail ? (
                  <p className="py-6 text-center text-xs text-slate-400">Memuat data pengumpulan...</p>
                ) : pengumpulanList.length === 0 ? (
                  <p className="py-6 text-center text-xs text-slate-400">Belum ada siswa yang mengumpulkan tugas ini.</p>
                ) : (
                  pengumpulanList.map((p) => (
                    <div key={p.id} className="flex items-center justify-between rounded-xl bg-white border border-slate-100 p-3 shadow-2xs">
                      <div>
                        <p className="text-xs font-bold text-slate-800">{p.nama_siswa}</p>
                        <p className="text-[11px] text-slate-400 font-mono">NIS: {p.nis} • Waktu: {p.waktu_kumpul}</p>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        {p.nilai > 0 ? (
                          <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-mono font-bold text-emerald-700">
                            Nilai: {p.nilai}
                          </span>
                        ) : (
                          <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                            Belum Dinilai
                          </span>
                        )}
                        {p.file_url && (
                          <a
                            href={p.file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg bg-blue-50 px-2 py-1 text-[10px] font-bold text-[#003399] hover:bg-blue-100"
                          >
                            Unduh File
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end border-t border-slate-100 pt-3">
              <button
                onClick={() => setSelectedTugas(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: PRATINJAU BUTIR SOAL KUIS & UJIAN */}
      {selectedEvaluasi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in duration-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                    {selectedEvaluasi.tipe}
                  </span>
                  <span className="text-xs text-slate-400">⏱️ {selectedEvaluasi.durasi_menit} Menit</span>
                </div>
                <h3 className="text-base font-bold text-slate-800 mt-1">{selectedEvaluasi.judul}</h3>
                <p className="text-xs text-slate-500">{selectedEvaluasi.mapel} • {selectedEvaluasi.kelas} (Guru: {selectedEvaluasi.guru})</p>
              </div>
              <button
                onClick={() => setSelectedEvaluasi(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 flex-1 overflow-y-auto space-y-4 pr-1">
              {loadingSoal ? (
                <p className="py-8 text-center text-xs text-slate-400">Memuat butir pertanyaan soal...</p>
              ) : soalList.length === 0 ? (
                <p className="py-8 text-center text-xs text-slate-400">Belum ada butir soal yang diinput guru untuk evaluasi ini.</p>
              ) : (
                soalList.map((s, idx) => (
                  <div key={s.id} className="rounded-xl border border-slate-200 p-4 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 text-xs">Soal No. {idx + 1}</span>
                      <span className="text-[10px] font-semibold text-slate-400 bg-white border px-2 py-0.5 rounded-md">
                        Bobot: {s.bobot} Poin
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-800 font-medium whitespace-pre-wrap">{s.pertanyaan}</p>

                    <div className="mt-3 space-y-1.5 pl-2">
                      {s.pilihan?.map((p: any, pIdx: number) => (
                        <div
                          key={p.id}
                          className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium border ${
                            p.is_benar
                              ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-bold"
                              : "bg-white border-slate-100 text-slate-700"
                          }`}
                        >
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                              p.is_benar
                                ? "bg-emerald-600 text-white"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {String.fromCharCode(65 + pIdx)}
                          </span>
                          <span className="flex-1">{p.teks}</span>
                          {p.is_benar && (
                            <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                              Kunci Jawaban Benar
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 flex justify-end border-t border-slate-100 pt-3 shrink-0">
              <button
                onClick={() => setSelectedEvaluasi(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function KurikulumMonitoringPage() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-slate-400">Memuat modul monitoring...</div>}>
      <MonitoringContent />
    </Suspense>
  );
}
