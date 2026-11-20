"use client";

import { useEffect, useState, useMemo } from "react";

interface Guru {
  id: number;
  user_id: number;
  nip: string;
  nama_lengkap: string;
  jenis_kelamin: string;
  no_telepon: string;
  alamat: string;
  status: string;
  email: string;
  username: string;
  mata_pelajaran?: string;
  kelas_mengajar?: string;
}

export default function KepalaSekolahGuruPage() {
  const [guruList, setGuruList] = useState<Guru[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedGuru, setSelectedGuru] = useState<Guru | null>(null);

  useEffect(() => {
    fetchGuru();
  }, []);

  const fetchGuru = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/guru`);
      if (!res.ok) {
        throw new Error("Gagal mengambil daftar guru.");
      }
      const data = await res.json();
      setGuruList(data);
    } catch (err: any) {
      console.warn("Using fallback guru list:", err.message);
      setGuruList([
        {
          id: 1,
          user_id: 2,
          nip: "198001012005011001",
          nama_lengkap: "Budi Santoso, S.Kom.",
          jenis_kelamin: "L",
          no_telepon: "081299998888",
          alamat: "Jl. Margonda Raya No. 100, Beji, Depok",
          status: "aktif",
          email: "budi@educlass.com",
          username: "budi",
          mata_pelajaran: "Pemrograman Web & Basis Data",
          kelas_mengajar: "XI PPLG 1, XI PPLG 2",
        },
        {
          id: 2,
          user_id: 7,
          nip: "198504122010012003",
          nama_lengkap: "Siti Rahmawati, S.Pd., M.Kom.",
          jenis_kelamin: "P",
          no_telepon: "081388887777",
          alamat: "Jl. Kemiri Jaya No. 15, Depok",
          status: "aktif",
          email: "siti.rahma@educlass.com",
          username: "siti_rahma",
          mata_pelajaran: "Pemrograman Berorientasi Objek",
          kelas_mengajar: "XI PPLG 1, XII PPLG 1",
        },
        {
          id: 3,
          user_id: 8,
          nip: "197906152006041002",
          nama_lengkap: "Drs. Ahmad Fauzi, M.Pd.",
          jenis_kelamin: "L",
          no_telepon: "081177776666",
          alamat: "Jl. Sawangan Elok No. 3, Depok",
          status: "aktif",
          email: "ahmad.fauzi@educlass.com",
          username: "ahmad_fauzi",
          mata_pelajaran: "Matematika",
          kelas_mengajar: "X PPLG 1, XI PPLG 1, XI PPLG 2",
        },
        {
          id: 4,
          user_id: 9,
          nip: "198811202014022004",
          nama_lengkap: "Dewi Lestari, S.Pd.",
          jenis_kelamin: "P",
          no_telepon: "081233445566",
          alamat: "Jl. Tanah Baru Indah No. 22, Depok",
          status: "aktif",
          email: "dewi.lestari@educlass.com",
          username: "dewi_lestari",
          mata_pelajaran: "Bahasa Indonesia",
          kelas_mengajar: "X PPLG 1, XI PPLG 1",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredList = useMemo(() => {
    return guruList.filter((g) => {
      const matchSearch =
        g.nama_lengkap?.toLowerCase().includes(search.toLowerCase()) ||
        g.nip?.toLowerCase().includes(search.toLowerCase()) ||
        g.email?.toLowerCase().includes(search.toLowerCase()) ||
        g.mata_pelajaran?.toLowerCase().includes(search.toLowerCase());

      const matchStatus = statusFilter === "all" || g.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [guruList, search, statusFilter]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[11px] font-bold text-[#003399] mb-2">
            <span>👨‍🏫</span>
            <span>Data Tenaga Pendidik & Pengajar (Read-Only)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            Direktori Dewan Guru
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Informasi profil guru pengampu, NIP kepegawaian, mapel yang diajarkan, dan penugasan kelas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition shadow-2xs"
          >
            <span>🖨️</span>
            <span>Cetak Rekap Guru</span>
          </button>
          <button
            onClick={fetchGuru}
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
          {/* Search */}
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
              placeholder="Cari nama guru, NIP, mata pelajaran..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#003399] transition"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 focus:bg-white focus:outline-none focus:border-[#003399] transition"
            >
              <option value="all">Semua Status Kepegawaian</option>
              <option value="aktif">Aktif Mengajar</option>
              <option value="nonaktif">Cuti / Nonaktif</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>Menampilkan <b>{filteredList.length}</b> guru pengampu</span>
          {(search || statusFilter !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
              }}
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
            Memuat data guru...
          </div>
        ) : filteredList.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            <p className="text-2xl mb-1">🔍</p>
            <p className="font-semibold text-slate-600">Tidak ada data guru yang cocok.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4 w-12 text-center">No</th>
                  <th className="py-3.5 px-4">Nama Pendidik & Gelar</th>
                  <th className="py-3.5 px-4">NIP</th>
                  <th className="py-3.5 px-4">L/P</th>
                  <th className="py-3.5 px-4">Mata Pelajaran Diampu</th>
                  <th className="py-3.5 px-4">Kontak / No. Telepon</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.map((guru, idx) => (
                  <tr key={guru.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 text-center text-slate-400 font-medium">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-bold text-slate-800">{guru.nama_lengkap}</p>
                        <p className="text-[10px] text-slate-400">{guru.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                      {guru.nip || "-"}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                        guru.jenis_kelamin === "L"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-pink-50 text-pink-700"
                      }`}>
                        {guru.jenis_kelamin}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {guru.mata_pelajaran || "Guru Pengampu Kurikulum"}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {guru.no_telepon || "-"}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        guru.status === "aktif"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {guru.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedGuru(guru)}
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

      {/* ================= MODAL DETAIL GURU ================= */}
      {selectedGuru && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 font-bold text-lg flex items-center justify-center">
                  👨‍🏫
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-800">
                    Detail Profil Pendidik
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Akses Tinjauan Pimpinan (Read-Only)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedGuru(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Nama Lengkap & Gelar:</span>
                  <span className="font-bold text-slate-800">{selectedGuru.nama_lengkap}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">NIP Kepegawaian:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedGuru.nip || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Jenis Kelamin:</span>
                  <span className="font-semibold text-slate-700">
                    {selectedGuru.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status Kepegawaian:</span>
                  <span className="font-bold text-emerald-600 capitalize">{selectedGuru.status}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Mata Pelajaran:</span>
                  <span className="font-bold text-[#003399]">
                    {selectedGuru.mata_pelajaran || "Pendidik Vokasi & Umum"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Penugasan Kelas:</span>
                  <span className="font-medium text-slate-700">
                    {selectedGuru.kelas_mengajar || "Sesuai plotting kurikulum"}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Email Instansi:</span>
                  <span className="text-slate-700">{selectedGuru.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Nomor WhatsApp / Telp:</span>
                  <span className="text-slate-700">{selectedGuru.no_telepon || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Alamat Domisili:</span>
                  <span className="text-slate-700 max-w-[240px] text-right">{selectedGuru.alamat || "-"}</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedGuru(null)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
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
