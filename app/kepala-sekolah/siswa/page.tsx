"use client";

import { useEffect, useState, useMemo } from "react";

interface Siswa {
  id: number;
  user_id: number;
  nis: string;
  nisn: string;
  nama_lengkap: string;
  username: string;
  email: string;
  jenis_kelamin: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  no_telepon: string;
  alamat: string;
  kelas_id: number;
  nama_kelas: string;
  jurusan_id: number;
  nama_jurusan: string;
  status: string;
}

export default function KepalaSekolahSiswaPage() {
  const [siswaList, setSiswaList] = useState<Siswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedKelas, setSelectedKelas] = useState("all");
  const [selectedJurusan, setSelectedJurusan] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSiswa, setSelectedSiswa] = useState<Siswa | null>(null);

  useEffect(() => {
    fetchSiswa();
  }, []);

  const fetchSiswa = async () => {
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/siswa`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Gagal mengambil data siswa.");
      }

      const data = await res.json();
      setSiswaList(data);
    } catch (err: any) {
      console.warn("Error fetching siswa, using fallback:", err.message);
      // Fallback data
      setSiswaList([
        {
          id: 1,
          user_id: 3,
          nis: "10245678",
          nisn: "0051234567",
          nama_lengkap: "Dewi Nur Azizah",
          username: "dewi",
          email: "dewi@educlass.com",
          jenis_kelamin: "P",
          tempat_lahir: "Jakarta",
          tanggal_lahir: "2007-08-17",
          no_telepon: "081234567890",
          alamat: "Jl. Margonda Raya No. 12, Depok",
          kelas_id: 2,
          nama_kelas: "XI PPLG 1",
          jurusan_id: 1,
          nama_jurusan: "Pengembangan Perangkat Lunak dan Gim",
          status: "aktif",
        },
        {
          id: 2,
          user_id: 4,
          nis: "10245679",
          nisn: "0051234568",
          nama_lengkap: "Ahmad Rizky Pratama",
          username: "ahmad_rizky",
          email: "ahmad.rizky@educlass.com",
          jenis_kelamin: "L",
          tempat_lahir: "Depok",
          tanggal_lahir: "2007-03-22",
          no_telepon: "081298765432",
          alamat: "Jl. Tanah Baru No. 45, Beji, Depok",
          kelas_id: 2,
          nama_kelas: "XI PPLG 1",
          jurusan_id: 1,
          nama_jurusan: "Pengembangan Perangkat Lunak dan Gim",
          status: "aktif",
        },
        {
          id: 3,
          user_id: 5,
          nis: "10245680",
          nisn: "0051234569",
          nama_lengkap: "Bagas Maulana",
          username: "bagas_m",
          email: "bagas@educlass.com",
          jenis_kelamin: "L",
          tempat_lahir: "Bogor",
          tanggal_lahir: "2007-11-05",
          no_telepon: "081345678912",
          alamat: "Jl. Sawangan Indah No. 8, Depok",
          kelas_id: 3,
          nama_kelas: "XI PPLG 2",
          jurusan_id: 1,
          nama_jurusan: "Pengembangan Perangkat Lunak dan Gim",
          status: "aktif",
        },
        {
          id: 4,
          user_id: 6,
          nis: "10245681",
          nisn: "0051234570",
          nama_lengkap: "Citra Anggraini",
          username: "citra_a",
          email: "citra@educlass.com",
          jenis_kelamin: "P",
          tempat_lahir: "Jakarta",
          tanggal_lahir: "2008-01-14",
          no_telepon: "081567890123",
          alamat: "Jl. Raya Bogor KM 30, Cimanggis",
          kelas_id: 1,
          nama_kelas: "X PPLG 1",
          jurusan_id: 1,
          nama_jurusan: "Pengembangan Perangkat Lunak dan Gim",
          status: "aktif",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Distinct options for filters
  const kelasOptions = useMemo(() => {
    const set = new Set<string>();
    siswaList.forEach((s) => {
      if (s.nama_kelas) set.add(s.nama_kelas);
    });
    return Array.from(set).sort();
  }, [siswaList]);

  const jurusanOptions = useMemo(() => {
    const set = new Set<string>();
    siswaList.forEach((s) => {
      if (s.nama_jurusan) set.add(s.nama_jurusan);
    });
    return Array.from(set).sort();
  }, [siswaList]);

  // Filtered List
  const filteredList = useMemo(() => {
    return siswaList.filter((s) => {
      const matchSearch =
        s.nama_lengkap?.toLowerCase().includes(search.toLowerCase()) ||
        s.nis?.toLowerCase().includes(search.toLowerCase()) ||
        s.nisn?.toLowerCase().includes(search.toLowerCase()) ||
        s.username?.toLowerCase().includes(search.toLowerCase());

      const matchKelas = selectedKelas === "all" || s.nama_kelas === selectedKelas;
      const matchJurusan = selectedJurusan === "all" || s.nama_jurusan === selectedJurusan;
      const matchStatus = selectedStatus === "all" || s.status === selectedStatus;

      return matchSearch && matchKelas && matchJurusan && matchStatus;
    });
  }, [siswaList, search, selectedKelas, selectedJurusan, selectedStatus]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[11px] font-bold text-[#003399] mb-2">
            <span>👨‍🎓</span>
            <span>Data Induk Peserta Didik (Read-Only)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            Direktori Data Siswa
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Menampilkan seluruh data siswa aktif di lingkungan sekolah SMK Citra Negara.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition shadow-2xs"
          >
            <span>🖨️</span>
            <span>Cetak Rekap</span>
          </button>
          <button
            onClick={fetchSiswa}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, NIS, NISN..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-[#003399] transition"
            />
          </div>

          {/* Filter Kelas */}
          <div>
            <select
              value={selectedKelas}
              onChange={(e) => setSelectedKelas(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 focus:bg-white focus:outline-none focus:border-[#003399] transition"
            >
              <option value="all">Semua Rombel Kelas</option>
              {kelasOptions.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Jurusan */}
          <div>
            <select
              value={selectedJurusan}
              onChange={(e) => setSelectedJurusan(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 focus:bg-white focus:outline-none focus:border-[#003399] transition"
            >
              <option value="all">Semua Konsentrasi Jurusan</option>
              {jurusanOptions.map((j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Status */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 focus:bg-white focus:outline-none focus:border-[#003399] transition"
            >
              <option value="all">Semua Status Siswa</option>
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
              <option value="lulus">Lulus</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>Menampilkan <b>{filteredList.length}</b> dari {siswaList.length} total siswa</span>
          {(search || selectedKelas !== "all" || selectedJurusan !== "all" || selectedStatus !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setSelectedKelas("all");
                setSelectedJurusan("all");
                setSelectedStatus("all");
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
            Memuat data siswa...
          </div>
        ) : filteredList.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            <p className="text-2xl mb-1">🔍</p>
            <p className="font-semibold text-slate-600">Tidak ada data siswa yang cocok.</p>
            <p className="text-[11px] mt-0.5">Silakan sesuaikan kata kunci pencarian atau filter Anda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4 w-12 text-center">No</th>
                  <th className="py-3.5 px-4">Nama Siswa</th>
                  <th className="py-3.5 px-4">NIS / NISN</th>
                  <th className="py-3.5 px-4">L/P</th>
                  <th className="py-3.5 px-4">Kelas</th>
                  <th className="py-3.5 px-4">Konsentrasi Jurusan</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.map((siswa, idx) => (
                  <tr key={siswa.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 text-center text-slate-400 font-medium">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-bold text-slate-800">{siswa.nama_lengkap}</p>
                        <p className="text-[10px] text-slate-400">@{siswa.username}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                      <div>{siswa.nis}</div>
                      <div className="text-[10px] text-slate-400">{siswa.nisn || "-"}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                        siswa.jenis_kelamin === "L"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-pink-50 text-pink-700"
                      }`}>
                        {siswa.jenis_kelamin}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg text-[11px]">
                        {siswa.nama_kelas}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-[220px] truncate">
                      {siswa.nama_jurusan}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        siswa.status === "aktif"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}>
                        {siswa.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedSiswa(siswa)}
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

      {/* ================= MODAL DETAIL SISWA ================= */}
      {selectedSiswa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#003399] font-bold text-lg flex items-center justify-center">
                  👨‍🎓
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-800">
                    Detail Informasi Siswa
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Akses Tinjauan Pimpinan (Read-Only)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSiswa(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Nama Lengkap:</span>
                  <span className="font-bold text-slate-800">{selectedSiswa.nama_lengkap}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Nomor Induk Siswa (NIS):</span>
                  <span className="font-mono font-bold text-slate-800">{selectedSiswa.nis}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">NISN:</span>
                  <span className="font-mono text-slate-700">{selectedSiswa.nisn || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Jenis Kelamin:</span>
                  <span className="font-semibold text-slate-700">
                    {selectedSiswa.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Rombel Kelas:</span>
                  <span className="font-bold text-[#003399]">{selectedSiswa.nama_kelas}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Konsentrasi Keahlian:</span>
                  <span className="font-medium text-slate-700">{selectedSiswa.nama_jurusan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status Akun:</span>
                  <span className="font-bold text-emerald-600 capitalize">{selectedSiswa.status}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Username Akun:</span>
                  <span className="font-mono text-slate-700">@{selectedSiswa.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Email:</span>
                  <span className="text-slate-700">{selectedSiswa.email || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">No. Telepon:</span>
                  <span className="text-slate-700">{selectedSiswa.no_telepon || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Alamat Tempat Tinggal:</span>
                  <span className="text-slate-700 max-w-[240px] text-right">{selectedSiswa.alamat || "-"}</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedSiswa(null)}
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
