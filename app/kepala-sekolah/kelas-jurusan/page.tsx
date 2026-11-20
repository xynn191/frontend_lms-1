"use client";

import { useEffect, useState } from "react";

interface Kelas {
  id: number;
  nama_kelas: string;
  tingkat: string;
  jurusan_id: number;
  nama_jurusan?: string;
  wali_kelas_id?: number;
  nama_wali_kelas?: string;
  total_siswa?: number;
}

interface Jurusan {
  id: number;
  kode_jurusan: string;
  nama_jurusan: string;
  deskripsi: string;
  total_kelas?: number;
  total_siswa?: number;
}

export default function KepalaSekolahKelasJurusanPage() {
  const [activeTab, setActiveTab] = useState<"kelas" | "jurusan">("kelas");
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [jurusanList, setJurusanList] = useState<Jurusan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedKelas, setSelectedKelas] = useState<Kelas | null>(null);
  const [selectedJurusan, setSelectedJurusan] = useState<Jurusan | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    try {
      const [resK, resJ] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/kelas`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jurusan`),
      ]);

      if (resK.ok) {
        const kData = await resK.json();
        setKelasList(kData);
      }
      if (resJ.ok) {
        const jData = await resJ.json();
        setJurusanList(jData);
      }
    } catch (err) {
      console.warn("Fallback kelas & jurusan:", err);
      setKelasList([
        { id: 1, nama_kelas: "X PPLG 1", tingkat: "X", jurusan_id: 1, nama_jurusan: "Pengembangan Perangkat Lunak & Gim", nama_wali_kelas: "Citra Dewi, S.Pd.", total_siswa: 32 },
        { id: 2, nama_kelas: "XI PPLG 1", tingkat: "XI", jurusan_id: 1, nama_jurusan: "Pengembangan Perangkat Lunak & Gim", nama_wali_kelas: "Budi Santoso, S.Kom.", total_siswa: 30 },
        { id: 3, nama_kelas: "XI PPLG 2", tingkat: "XI", jurusan_id: 1, nama_jurusan: "Pengembangan Perangkat Lunak & Gim", nama_wali_kelas: "Ahmad Fauzi, M.Pd.", total_siswa: 28 },
        { id: 4, nama_kelas: "XII PPLG 1", tingkat: "XII", jurusan_id: 1, nama_jurusan: "Pengembangan Perangkat Lunak & Gim", nama_wali_kelas: "Siti Rahmawati, M.Kom.", total_siswa: 30 },
        { id: 5, nama_kelas: "X TJKT 1", tingkat: "X", jurusan_id: 2, nama_jurusan: "Teknik Jaringan Komputer & Telekomunikasi", nama_wali_kelas: "Hendro Wibowo, S.T.", total_siswa: 32 },
        { id: 6, nama_kelas: "XI TJKT 1", tingkat: "XI", jurusan_id: 2, nama_jurusan: "Teknik Jaringan Komputer & Telekomunikasi", nama_wali_kelas: "Rina Marlina, S.Kom.", total_siswa: 31 },
      ]);
      setJurusanList([
        { id: 1, kode_jurusan: "PPLG", nama_jurusan: "Pengembangan Perangkat Lunak dan Gim", deskripsi: "Fokus pada rekayasa perangkat lunak, pemrograman web modern, aplikasi mobile, dan pengembangan gim interaktif.", total_kelas: 4, total_siswa: 120 },
        { id: 2, kode_jurusan: "TJKT", nama_jurusan: "Teknik Jaringan Komputer dan Telekomunikasi", deskripsi: "Fokus pada arsitektur infrastruktur jaringan, administrasi server, keamanan siber, dan sistem telekomunikasi.", total_kelas: 3, total_siswa: 95 },
        { id: 3, kode_jurusan: "AKL", nama_jurusan: "Akuntansi dan Keuangan Lembaga", deskripsi: "Fokus pada pembukuan akuntansi terkomputerisasi, perpajakan, audit keuangan, dan manajemen perbankan.", total_kelas: 2, total_siswa: 48 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredKelas = kelasList.filter((k) =>
    k.nama_kelas?.toLowerCase().includes(search.toLowerCase()) ||
    k.tingkat?.toLowerCase().includes(search.toLowerCase()) ||
    k.nama_jurusan?.toLowerCase().includes(search.toLowerCase()) ||
    k.nama_wali_kelas?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredJurusan = jurusanList.filter((j) =>
    j.nama_jurusan?.toLowerCase().includes(search.toLowerCase()) ||
    j.kode_jurusan?.toLowerCase().includes(search.toLowerCase()) ||
    j.deskripsi?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[11px] font-bold text-[#003399] mb-2">
            <span>🏛️</span>
            <span>Data Institusi & Rombongan Belajar (Read-Only)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            Data Kelas & Konsentrasi Jurusan
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Informasi rombongan belajar (rombel), wali kelas, serta bidang konsentrasi keahlian di SMK Citra Negara.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 rounded-2xl bg-slate-100 border border-slate-200 shrink-0">
          <button
            onClick={() => { setActiveTab("kelas"); setSearch(""); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === "kelas"
                ? "bg-[#003399] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🏛️ Rombel Kelas ({kelasList.length})
          </button>
          <button
            onClick={() => { setActiveTab("jurusan"); setSearch(""); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === "jurusan"
                ? "bg-[#003399] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🏢 Konsentrasi Jurusan ({jurusanList.length})
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={activeTab === "kelas" ? "Cari nama rombel kelas, tingkat, wali kelas..." : "Cari kode atau nama jurusan..."}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#003399] transition"
          />
        </div>
        {search && (
          <button onClick={() => setSearch("")} className="text-xs text-[#003399] font-bold px-2">
            Reset
          </button>
        )}
      </div>

      {/* Content based on Active Tab */}
      {activeTab === "kelas" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full py-16 text-center text-slate-400 text-xs">
              <div className="w-8 h-8 border-3 border-[#003399] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              Memuat data kelas...
            </div>
          ) : filteredKelas.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-400 text-xs">
              Tidak ada kelas yang sesuai pencarian.
            </div>
          ) : (
            filteredKelas.map((kelas) => (
              <div
                key={kelas.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:border-[#003399]/40 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-9 h-9 rounded-xl bg-blue-50 text-[#003399] font-black text-xs flex items-center justify-center border border-blue-100">
                      {kelas.tingkat}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      👥 {kelas.total_siswa || 30} Siswa
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-800">
                    {kelas.nama_kelas}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {kelas.nama_jurusan || "Pengembangan Perangkat Lunak dan Gim"}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-[11px] text-slate-400">Wali Kelas:</span>
                      <span className="font-bold text-slate-700 text-right">
                        {kelas.nama_wali_kelas || "Budi Santoso, S.Kom."}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-[11px] text-slate-400">Tahun Ajaran:</span>
                      <span className="font-medium text-slate-600">2025/2026 Ganjil</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedKelas(kelas)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-[#003399] text-slate-700 hover:text-white font-bold text-xs transition"
                  >
                    Detail Rombel &rarr;
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-16 text-center text-slate-400 text-xs">
              <div className="w-8 h-8 border-3 border-[#003399] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              Memuat data jurusan...
            </div>
          ) : filteredJurusan.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-400 text-xs">
              Tidak ada jurusan yang sesuai pencarian.
            </div>
          ) : (
            filteredJurusan.map((jurusan) => (
              <div
                key={jurusan.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-xl bg-blue-50 text-[#003399] font-black text-xs border border-blue-100">
                      {jurusan.kode_jurusan}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      {jurusan.total_kelas || 4} Rombel
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-800 leading-snug">
                    {jurusan.nama_jurusan}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {jurusan.deskripsi}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400">Total Siswa Aktif</p>
                    <p className="text-lg font-black text-slate-800">
                      {jurusan.total_siswa || 120} Siswa
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedJurusan(jurusan)}
                    className="py-2 px-3.5 rounded-xl bg-slate-100 hover:bg-[#003399] text-slate-700 hover:text-white font-bold text-xs transition"
                  >
                    Detail &rarr;
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ================= MODAL DETAIL KELAS ================= */}
      {selectedKelas && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#003399] font-black text-sm flex items-center justify-center">
                  {selectedKelas.tingkat}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-800">
                    {selectedKelas.nama_kelas}
                  </h3>
                  <p className="text-[11px] text-slate-400">Detail Rombongan Belajar</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedKelas(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Tingkat Pendidikan:</span>
                  <span className="font-bold text-slate-800">Kelas {selectedKelas.tingkat} (SMK)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Jurusan Keahlian:</span>
                  <span className="font-medium text-slate-700">{selectedKelas.nama_jurusan || "PPLG"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Wali Kelas:</span>
                  <span className="font-bold text-[#003399]">{selectedKelas.nama_wali_kelas || "Budi Santoso, S.Kom."}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Kapasitas Peserta:</span>
                  <span className="font-bold text-emerald-600">{selectedKelas.total_siswa || 30} Siswa Terdaftar</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedKelas(null)}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
            >
              Tutup Pratinjau
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL DETAIL JURUSAN ================= */}
      {selectedJurusan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-[#003399] bg-blue-50 px-2 py-0.5 rounded-md">
                  {selectedJurusan.kode_jurusan}
                </span>
                <h3 className="text-base font-extrabold text-slate-800 mt-1">
                  {selectedJurusan.nama_jurusan}
                </h3>
              </div>
              <button
                onClick={() => setSelectedJurusan(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                {selectedJurusan.deskripsi}
              </p>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100">
                  <p className="text-[10px] text-slate-500">Rombel Kelas</p>
                  <p className="text-xl font-black text-[#003399]">{selectedJurusan.total_kelas || 4} Kelas</p>
                </div>
                <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100">
                  <p className="text-[10px] text-slate-500">Total Siswa</p>
                  <p className="text-xl font-black text-indigo-700">{selectedJurusan.total_siswa || 120} Siswa</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedJurusan(null)}
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
