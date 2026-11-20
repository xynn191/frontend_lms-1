"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type NilaiItem = {
  id: number;
  nis: string;
  nama_siswa: string;
  nama_kelas: string;
  nama_mapel: string;
  nama_guru: string;
  nilai_tugas: number;
  nilai_kuis: number;
  nilai_ujian: number;
  nilai_akhir: number;
  predikat: string;
  catatan: string;
};

export default function KurikulumNilaiPage() {
  const [data, setData] = useState<NilaiItem[]>([]);
  const [kelasList, setKelasList] = useState<any[]>([]);
  const [mapelList, setMapelList] = useState<any[]>([]);
  const [selectedKelas, setSelectedKelas] = useState("");
  const [selectedMapel, setSelectedMapel] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const headers = () => ({
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  });

  const loadFilterOptions = async () => {
    try {
      const [kRes, mRes] = await Promise.all([
        fetch(`${API_URL}/api/kelas`, { headers: headers() }),
        fetch(`${API_URL}/api/mata-pelajaran`, { headers: headers() }),
      ]);
      if (kRes.ok) setKelasList(await kRes.json());
      if (mRes.ok) setMapelList(await mRes.json());
    } catch (e) {
      console.error(e);
    }
  };

  const loadNilai = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedKelas) params.append("kelas_id", selectedKelas);
      if (selectedMapel) params.append("mapel_id", selectedMapel);

      const res = await fetch(`${API_URL}/api/kurikulum/nilai?${params.toString()}`, {
        headers: headers(),
      });
      if (!res.ok) throw new Error(await res.text());
      const json = await res.json();
      setData(json || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Gagal memuat rekap nilai siswa");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFilterOptions();
  }, []);

  useEffect(() => {
    loadNilai();
  }, [selectedKelas, selectedMapel]);

  const filtered = data.filter((item) =>
    item.nama_siswa.toLowerCase().includes(search.toLowerCase()) ||
    item.nis.toLowerCase().includes(search.toLowerCase()) ||
    item.nama_kelas.toLowerCase().includes(search.toLowerCase()) ||
    item.nama_mapel.toLowerCase().includes(search.toLowerCase())
  );

  // Perhitungan Statistik Rata-Rata Capaian Nilai
  const count = filtered.length;
  const avgTugas = count ? (filtered.reduce((acc, c) => acc + (c.nilai_tugas || 0), 0) / count).toFixed(1) : "0";
  const avgKuis = count ? (filtered.reduce((acc, c) => acc + (c.nilai_kuis || 0), 0) / count).toFixed(1) : "0";
  const avgUjian = count ? (filtered.reduce((acc, c) => acc + (c.nilai_ujian || 0), 0) / count).toFixed(1) : "0";
  const avgAkhir = count ? (filtered.reduce((acc, c) => acc + (c.nilai_akhir || 0), 0) / count).toFixed(1) : "0";
  const tuntasCount = filtered.filter((c) => (c.nilai_akhir || 0) >= 75).length;
  const percentTuntas = count ? Math.round((tuntasCount / count) * 100) : 0;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#003399]">Rekapitulasi Nilai Siswa</h1>
          <p className="text-xs text-slate-500 mt-1">
            Pengawasan mutu capaian belajar peserta didik, rata-rata tugas/kuis/ujian, serta predikat ketuntasan belajar.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50"
        >
          🖨️ Cetak / Ekspor Laporan
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
          ✕ {error}
        </div>
      )}

      {/* 5 Kartu Rata-Rata Statistik Capaian Akademik */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="block text-[10px] font-bold uppercase text-slate-400">Rata Tugas</span>
          <span className="text-xl font-black text-slate-800">{avgTugas}</span>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="block text-[10px] font-bold uppercase text-slate-400">Rata Kuis</span>
          <span className="text-xl font-black text-slate-800">{avgKuis}</span>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="block text-[10px] font-bold uppercase text-slate-400">Rata Ujian</span>
          <span className="text-xl font-black text-slate-800">{avgUjian}</span>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4 shadow-xs">
          <span className="block text-[10px] font-bold uppercase text-[#003399]">Rata Nilai Akhir</span>
          <span className="text-xl font-black text-[#003399]">{avgAkhir}</span>
        </div>
        <div className="col-span-2 sm:col-span-1 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-xs">
          <span className="block text-[10px] font-bold uppercase text-emerald-700">Ketuntasan (≥75)</span>
          <span className="text-xl font-black text-emerald-700">{percentTuntas}% Tuntas</span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase text-slate-400">Pencarian Siswa / NIS</label>
            <input
              type="text"
              placeholder="Ketik nama siswa atau NIS..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-[#003399] focus:ring-1 focus:ring-[#003399]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase text-slate-400">Filter Rombel Kelas</label>
            <select
              value={selectedKelas}
              onChange={(e) => setSelectedKelas(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-[#003399] focus:ring-1 focus:ring-[#003399]"
            >
              <option value="">Semua Kelas</option>
              {kelasList.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.nama_kelas}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase text-slate-400">Filter Mata Pelajaran</label>
            <select
              value={selectedMapel}
              onChange={(e) => setSelectedMapel(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-[#003399] focus:ring-1 focus:ring-[#003399]"
            >
              <option value="">Semua Mata Pelajaran</option>
              {mapelList.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nama_mapel}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabel Nilai Siswa Terpadu */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="py-3.5 px-5">NIS & Nama Siswa</th>
              <th className="py-3.5 px-4">Kelas & Mapel</th>
              <th className="py-3.5 px-4">Guru Penilai</th>
              <th className="py-3.5 px-3 text-center">Tugas</th>
              <th className="py-3.5 px-3 text-center">Kuis</th>
              <th className="py-3.5 px-3 text-center">Ujian</th>
              <th className="py-3.5 px-3 text-center font-bold text-slate-700">Nilai Akhir</th>
              <th className="py-3.5 px-4">Predikat</th>
              <th className="py-3.5 px-5">Catatan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400">
                  Memuat rekap nilai siswa...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400">
                  Belum ada rekaman nilai siswa untuk filter yang dipilih.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="transition hover:bg-slate-50/70">
                  <td className="py-3.5 px-5">
                    <p className="font-bold text-slate-800 text-sm">{item.nama_siswa}</p>
                    <p className="text-[11px] text-slate-400 font-mono">NIS: {item.nis}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-700">{item.nama_mapel}</p>
                    <span className="inline-block rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-[#003399]">
                      {item.nama_kelas}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-600">
                    {item.nama_guru}
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono font-medium text-slate-600">
                    {item.nilai_tugas ? item.nilai_tugas.toFixed(1) : "-"}
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono font-medium text-slate-600">
                    {item.nilai_kuis ? item.nilai_kuis.toFixed(1) : "-"}
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono font-medium text-slate-600">
                    {item.nilai_ujian ? item.nilai_ujian.toFixed(1) : "-"}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="inline-block rounded-lg bg-blue-50 px-2.5 py-1 font-mono text-sm font-black text-[#003399]">
                      {item.nilai_akhir ? item.nilai_akhir.toFixed(1) : "-"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${
                        item.predikat.startsWith("A")
                          ? "bg-emerald-100 text-emerald-800"
                          : item.predikat.startsWith("B")
                          ? "bg-blue-100 text-blue-800"
                          : item.predikat.startsWith("C")
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.predikat}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-slate-500 text-[11px] italic max-w-xs truncate">
                    {item.catatan || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
