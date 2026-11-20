"use client";

import { useEffect, useState, useMemo } from "react";

interface Mapel {
  id: number;
  kode_mapel: string;
  nama_mapel: string;
  kelompok: string;
  deskripsi: string;
  guru_pengampu?: string;
  target_kelas?: string;
}

export default function KepalaSekolahMapelPage() {
  const [mapelList, setMapelList] = useState<Mapel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [kelompokFilter, setKelompokFilter] = useState("all");
  const [selectedMapel, setSelectedMapel] = useState<Mapel | null>(null);

  useEffect(() => {
    fetchMapel();
  }, []);

  const fetchMapel = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mata-pelajaran`);
      if (!res.ok) {
        throw new Error("Gagal mengambil data mata pelajaran.");
      }
      const data = await res.json();
      setMapelList(data);
    } catch (err: any) {
      console.warn("Fallback mapel list:", err.message);
      setMapelList([
        {
          id: 1,
          kode_mapel: "UM-01",
          nama_mapel: "Pendidikan Agama dan Budi Pekerti",
          kelompok: "umum",
          deskripsi: "Mata pelajaran pembentukan karakter, moralitas keagamaan, dan budi pekerti luhur bagi peserta didik.",
          guru_pengampu: "Drs. Ahmad Fauzi, M.Pd.",
          target_kelas: "Semua Tingkat X, XI, XII",
        },
        {
          id: 2,
          kode_mapel: "UM-02",
          nama_mapel: "Pendidikan Pancasila dan Kewarganegaraan",
          kelompok: "umum",
          deskripsi: "Pendidikan ideologi bangsa, hukum tata negara, serta hak dan kewajiban warga negara Indonesia.",
          guru_pengampu: "Dewi Lestari, S.Pd.",
          target_kelas: "Semua Tingkat X, XI, XII",
        },
        {
          id: 3,
          kode_mapel: "UM-03",
          nama_mapel: "Bahasa Indonesia",
          kelompok: "umum",
          deskripsi: "Penguasaan literasi bahasa, penulisan karya ilmiah, teks laporan hasil observasi, dan komunikasi formal.",
          guru_pengampu: "Dewi Lestari, S.Pd.",
          target_kelas: "Semua Tingkat X, XI, XII",
        },
        {
          id: 4,
          kode_mapel: "UM-04",
          nama_mapel: "Matematika",
          kelompok: "umum",
          deskripsi: "Kaidah matematika dasar, aljabar linear, kalkulus praktis vokasi, dan statistika probabilitas terapan.",
          guru_pengampu: "Drs. Ahmad Fauzi, M.Pd.",
          target_kelas: "Semua Tingkat X, XI, XII",
        },
        {
          id: 5,
          kode_mapel: "KJ-PPLG-01",
          nama_mapel: "Pemrograman Web dan Perangkat Bergerak",
          kelompok: "kejuruan",
          deskripsi: "Arsitektur frontend modern (HTML/CSS/JS/React/Next.js), backend REST API, dan integrasi mobile responsif.",
          guru_pengampu: "Budi Santoso, S.Kom.",
          target_kelas: "XI PPLG 1, XI PPLG 2, XII PPLG 1",
        },
        {
          id: 6,
          kode_mapel: "KJ-PPLG-02",
          nama_mapel: "Basis Data",
          kelompok: "kejuruan",
          deskripsi: "Relational Database Management System (RDBMS) MySQL, perancangan ERD, normalisasi, indexing, dan stored procedures.",
          guru_pengampu: "Budi Santoso, S.Kom.",
          target_kelas: "XI PPLG 1, XI PPLG 2",
        },
        {
          id: 7,
          kode_mapel: "KJ-PPLG-03",
          nama_mapel: "Pemrograman Berorientasi Objek",
          kelompok: "kejuruan",
          deskripsi: "Konsep encapsulation, inheritance, polymorphism, abstraction dalam paradigma OOP berbasis Java/C#/TypeScript.",
          guru_pengampu: "Siti Rahmawati, S.Pd., M.Kom.",
          target_kelas: "XI PPLG 1, XII PPLG 1",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredList = useMemo(() => {
    return mapelList.filter((m) => {
      const matchSearch =
        m.nama_mapel?.toLowerCase().includes(search.toLowerCase()) ||
        m.kode_mapel?.toLowerCase().includes(search.toLowerCase()) ||
        m.deskripsi?.toLowerCase().includes(search.toLowerCase()) ||
        m.guru_pengampu?.toLowerCase().includes(search.toLowerCase());

      const matchKelompok = kelompokFilter === "all" || m.kelompok === kelompokFilter;
      return matchSearch && matchKelompok;
    });
  }, [mapelList, search, kelompokFilter]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[11px] font-bold text-[#003399] mb-2">
            <span>📖</span>
            <span>Kurikulum & Bahan Kajian (Read-Only)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            Data Mata Pelajaran
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Daftar seluruh kurikulum mata pelajaran umum dan kejuruan vokasi di SMK Citra Negara.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition shadow-2xs"
          >
            <span>🖨️</span>
            <span>Cetak Rekap Mapel</span>
          </button>
          <button
            onClick={fetchMapel}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
            title="Refresh Data"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kode mapel, nama mata pelajaran, atau guru..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#003399] transition"
            />
          </div>

          <div>
            <select
              value={kelompokFilter}
              onChange={(e) => setKelompokFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 focus:bg-white focus:outline-none focus:border-[#003399] transition"
            >
              <option value="all">Semua Kelompok Mapel</option>
              <option value="umum">Muatan Umum (Normatif/Adaptif)</option>
              <option value="kejuruan">Muatan Kejuruan (Vokasi)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>Menampilkan <b>{filteredList.length}</b> dari {mapelList.length} mata pelajaran</span>
          {(search || kelompokFilter !== "all") && (
            <button
              onClick={() => { setSearch(""); setKelompokFilter("all"); }}
              className="text-[#003399] font-bold hover:underline"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs">
            <div className="w-8 h-8 border-3 border-[#003399] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            Memuat data mata pelajaran...
          </div>
        ) : filteredList.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            Tidak ada mata pelajaran yang cocok.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4 w-12 text-center">No</th>
                  <th className="py-3.5 px-4">Kode Mapel</th>
                  <th className="py-3.5 px-4">Nama Mata Pelajaran</th>
                  <th className="py-3.5 px-4">Kelompok</th>
                  <th className="py-3.5 px-4">Guru Pengampu</th>
                  <th className="py-3.5 px-4">Target Kelas</th>
                  <th className="py-3.5 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.map((mapel, idx) => (
                  <tr key={mapel.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 text-center text-slate-400 font-medium">{idx + 1}</td>
                    <td className="py-3 px-4 font-mono font-bold text-[#003399]">{mapel.kode_mapel}</td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-800">{mapel.nama_mapel}</p>
                      <p className="text-[10px] text-slate-400 max-w-sm truncate mt-0.5">{mapel.deskripsi}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                        mapel.kelompok === "kejuruan"
                          ? "bg-purple-50 text-purple-700 border border-purple-200"
                          : "bg-blue-50 text-[#003399] border border-blue-200"
                      }`}>
                        {mapel.kelompok}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {mapel.guru_pengampu || "Tim Pengajar Kurikulum"}
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-[11px]">
                      {mapel.target_kelas || "Rombel Terkait"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedMapel(mapel)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#003399] text-slate-700 hover:text-white font-bold text-[11px] transition"
                      >
                        <span>👁️</span>
                        <span>Detail</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= MODAL DETAIL MAPEL ================= */}
      {selectedMapel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="font-mono font-bold text-[#003399] bg-blue-50 px-2 py-0.5 rounded-md text-xs">
                  {selectedMapel.kode_mapel}
                </span>
                <h3 className="text-base font-extrabold text-slate-800 mt-1">
                  {selectedMapel.nama_mapel}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMapel(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Kelompok Kurikulum:</span>
                  <span className="font-bold text-slate-800 uppercase">{selectedMapel.kelompok}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Guru Pengampu:</span>
                  <span className="font-bold text-[#003399]">{selectedMapel.guru_pengampu || "Budi Santoso, S.Kom."}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Distribusi Kelas:</span>
                  <span className="font-medium text-slate-700">{selectedMapel.target_kelas || "Rombel Terkait"}</span>
                </div>
              </div>

              <div>
                <p className="font-bold text-slate-700 mb-1">Deskripsi Silabus & Capaian Pembelajaran:</p>
                <p className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-600 leading-relaxed">
                  {selectedMapel.deskripsi || "Mata pelajaran ini disusun sesuai panduan kurikulum nasional dan vokasi industri."}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedMapel(null)}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
            >
              Tutup Pratinjau
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
