"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type KelasAkademik = {
  id: number;
  nama_kelas: string;
  tingkat: string;
  jurusan_id: number;
  kode_jurusan: string;
  nama_jurusan: string;
  wali_kelas_id: number;
  wali_kelas: string;
  total_siswa: number;
};

type GuruOption = {
  id: number;
  nama: string;
  info: string;
};

export default function KurikulumAkademikPage() {
  const [data, setData] = useState<KelasAkademik[]>([]);
  const [guruList, setGuruList] = useState<GuruOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [search, setSearch] = useState("");
  const [tingkatFilter, setTingkatFilter] = useState("Semua");
  const [jurusanFilter, setJurusanFilter] = useState("Semua");

  // Modal State untuk Penetapan Wali Kelas
  const [isWaliModalOpen, setIsWaliModalOpen] = useState(false);
  const [selectedKelas, setSelectedKelas] = useState<KelasAkademik | null>(null);
  const [selectedWaliID, setSelectedWaliID] = useState<number>(0);
  const [savingWali, setSavingWali] = useState(false);

  const headers = () => ({
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  });

  const loadAkademik = async () => {
    try {
      setLoading(true);
      const [resAkademik, resOptions] = await Promise.all([
        fetch(`${API_URL}/api/kurikulum/akademik`, { headers: headers() }),
        fetch(`${API_URL}/api/kurikulum/options`, { headers: headers() }),
      ]);

      if (!resAkademik.ok) throw new Error(await resAkademik.text());
      const jsonAkademik = await resAkademik.json();
      setData(jsonAkademik || []);

      if (resOptions.ok) {
        const jsonOptions = await resOptions.json();
        setGuruList(jsonOptions.guru || []);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Gagal memuat data akademik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAkademik();
  }, []);

  const openWaliModal = (kelas: KelasAkademik) => {
    setSelectedKelas(kelas);
    setSelectedWaliID(kelas.wali_kelas_id || 0);
    setIsWaliModalOpen(true);
    setSuccessMsg("");
    setError("");
  };

  const saveWaliKelas = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKelas) return;

    try {
      setSavingWali(true);
      setError("");
      const res = await fetch(`${API_URL}/api/kurikulum/akademik/${selectedKelas.id}/wali-kelas`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...headers(),
        },
        body: JSON.stringify({ wali_kelas_id: Number(selectedWaliID) }),
      });

      const resJson = await res.json();
      if (!res.ok) throw new Error(resJson.message || "Gagal memperbarui wali kelas");

      setSuccessMsg(`Wali kelas untuk ${selectedKelas.nama_kelas} berhasil diperbarui!`);
      setIsWaliModalOpen(false);
      loadAkademik();
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan wali kelas");
    } finally {
      setSavingWali(false);
    }
  };

  const jurusanList = Array.from(new Set(data.map((x) => x.kode_jurusan))).filter(Boolean);

  const filtered = data.filter((item) => {
    const matchSearch =
      item.nama_kelas.toLowerCase().includes(search.toLowerCase()) ||
      item.nama_jurusan.toLowerCase().includes(search.toLowerCase()) ||
      item.wali_kelas.toLowerCase().includes(search.toLowerCase());
    const matchTingkat = tingkatFilter === "Semua" || item.tingkat === tingkatFilter;
    const matchJurusan = jurusanFilter === "Semua" || item.kode_jurusan === jurusanFilter;
    return matchSearch && matchTingkat && matchJurusan;
  });

  const totalSiswaAll = data.reduce((acc, curr) => acc + curr.total_siswa, 0);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#003399]">Data Akademik (Kelas & Jurusan)</h1>
          <p className="text-xs text-slate-500 mt-1">
            Pantau dan kelola struktur jenjang kelas, penetapan wali kelas, serta populasi siswa aktif per rombel.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-right shadow-xs">
            <span className="block text-[10px] font-bold uppercase text-slate-400">Total Rombel</span>
            <span className="text-sm font-black text-[#003399]">{data.length} Kelas</span>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-right shadow-xs">
            <span className="block text-[10px] font-bold uppercase text-slate-400">Total Siswa</span>
            <span className="text-sm font-black text-emerald-600">{totalSiswaAll} Siswa</span>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-700 animate-in fade-in">
          ✓ {successMsg}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
          ✕ {error}
        </div>
      )}

      {/* Filter Controls */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase text-slate-400">Pencarian</label>
            <input
              type="text"
              placeholder="Cari kelas, jurusan, wali kelas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-[#003399] focus:ring-1 focus:ring-[#003399]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase text-slate-400">Tingkat Jenjang</label>
            <select
              value={tingkatFilter}
              onChange={(e) => setTingkatFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-[#003399] focus:ring-1 focus:ring-[#003399]"
            >
              <option value="Semua">Semua Tingkat (X, XI, XII)</option>
              <option value="X">Kelas X</option>
              <option value="XI">Kelas XI</option>
              <option value="XII">Kelas XII</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase text-slate-400">Konsentrasi Jurusan</label>
            <select
              value={jurusanFilter}
              onChange={(e) => setJurusanFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-[#003399] focus:ring-1 focus:ring-[#003399]"
            >
              <option value="Semua">Semua Jurusan</option>
              {jurusanList.map((jur) => (
                <option key={jur} value={jur}>
                  {jur}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabel Data Akademik Ringkas */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="py-3.5 px-5">Tingkat</th>
              <th className="py-3.5 px-4">Nama Kelas</th>
              <th className="py-3.5 px-4">Jurusan</th>
              <th className="py-3.5 px-4">Wali Kelas Saat Ini</th>
              <th className="py-3.5 px-4 text-center">Jumlah Siswa</th>
              <th className="py-3.5 px-5 text-right">Tindakan Wali Kelas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  Memuat data akademik...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  Tidak ada kelas yang cocok dengan kriteria filter.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="transition hover:bg-slate-50/70">
                  <td className="py-3.5 px-5 font-black text-slate-700">
                    <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700">
                      Kelas {item.tingkat}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#003399] text-sm">
                    {item.nama_kelas}
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-800">{item.kode_jurusan}</p>
                    <p className="text-[11px] text-slate-400">{item.nama_jurusan}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    {item.wali_kelas === "Belum Ditentukan" ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600">
                        ⚠️ Belum ada wali kelas
                      </span>
                    ) : (
                      <span className="font-medium text-slate-800">{item.wali_kelas}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-block rounded-full bg-blue-50 px-3 py-1 font-bold text-[#003399]">
                      {item.total_siswa} Siswa
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => openWaliModal(item)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#003399]/20 bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#003399] transition hover:bg-[#003399] hover:text-white"
                    >
                      ✏️ Tetapkan Wali
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL PENETAPAN WALI KELAS */}
      {isWaliModalOpen && selectedKelas && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <form
            onSubmit={saveWaliKelas}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-800">Tetapkan Wali Kelas</h3>
                <p className="text-xs text-slate-400 mt-0.5">Rombel: {selectedKelas.nama_kelas}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsWaliModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pilih Guru Sebagai Wali Kelas
                </label>
                <select
                  value={selectedWaliID}
                  onChange={(e) => setSelectedWaliID(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-[#003399] focus:ring-1 focus:ring-[#003399]"
                >
                  <option value={0}>-- Kosongkan / Belum Ada Wali Kelas --</option>
                  {guruList.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.nama} (NIP: {g.info || "-"})
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[11px] text-slate-400">
                  Guru yang dipilih akan bertanggung jawab mendampingi rombel kelas ini.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setIsWaliModalOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={savingWali}
                className="rounded-xl bg-[#003399] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-800 disabled:opacity-50"
              >
                {savingWali ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
