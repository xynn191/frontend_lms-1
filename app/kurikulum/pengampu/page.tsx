"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type PengampuItem = {
  id: number;
  guru_id: number;
  nama_guru: string;
  nip: string;
  mata_pelajaran_id: number;
  kode_mapel: string;
  nama_mapel: string;
  kelompok: string;
  kelas_id: number;
  nama_kelas: string;
  tingkat: string;
  tahun_ajaran_id: number;
  tahun_ajaran: string;
};

type OptionItem = {
  id: number;
  nama: string;
  info: string;
};

export default function KurikulumPengampuPage() {
  const [data, setData] = useState<PengampuItem[]>([]);
  const [guruOptions, setGuruOptions] = useState<OptionItem[]>([]);
  const [mapelOptions, setMapelOptions] = useState<OptionItem[]>([]);
  const [kelasOptions, setKelasOptions] = useState<OptionItem[]>([]);
  const [activeTA, setActiveTA] = useState<any>({ id: 1, nama: "" });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [search, setSearch] = useState("");
  const [kelompokFilter, setKelompokFilter] = useState("Semua");

  // Modal State CRUD
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    guru_id: "",
    mata_pelajaran_id: "",
    kelas_id: "",
  });
  const [saving, setSaving] = useState(false);

  const headers = () => ({
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [resPengampu, resOptions] = await Promise.all([
        fetch(`${API_URL}/api/kurikulum/pengampu`, { headers: headers() }),
        fetch(`${API_URL}/api/kurikulum/options`, { headers: headers() }),
      ]);

      if (!resPengampu.ok) throw new Error(await resPengampu.text());
      const jsonPengampu = await resPengampu.json();
      setData(jsonPengampu || []);

      if (resOptions.ok) {
        const jsonOptions = await resOptions.json();
        setGuruOptions(jsonOptions.guru || []);
        setMapelOptions(jsonOptions.mapel || []);
        setKelasOptions(jsonOptions.kelas || []);
        if (jsonOptions.tahun_ajaran) setActiveTA(jsonOptions.tahun_ajaran);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Gagal memuat distribusi guru pengampu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setForm({
      guru_id: guruOptions[0] ? String(guruOptions[0].id) : "",
      mata_pelajaran_id: mapelOptions[0] ? String(mapelOptions[0].id) : "",
      kelas_id: kelasOptions[0] ? String(kelasOptions[0].id) : "",
    });
    setError("");
    setSuccessMsg("");
    setIsModalOpen(true);
  };

  const openEditModal = (item: PengampuItem) => {
    setEditingId(item.id);
    setForm({
      guru_id: String(item.guru_id),
      mata_pelajaran_id: String(item.mata_pelajaran_id),
      kelas_id: String(item.kelas_id),
    });
    setError("");
    setSuccessMsg("");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");

      const payload = {
        guru_id: Number(form.guru_id),
        mata_pelajaran_id: Number(form.mata_pelajaran_id),
        kelas_id: Number(form.kelas_id),
        tahun_ajaran_id: activeTA.id || 1,
      };

      const url = editingId
        ? `${API_URL}/api/kurikulum/pengampu/${editingId}`
        : `${API_URL}/api/kurikulum/pengampu`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers(),
        },
        body: JSON.stringify(payload),
      });

      const resJson = await res.json();
      if (!res.ok) throw new Error(resJson.message || "Gagal menyimpan alokasi pengajar");

      setSuccessMsg(
        editingId
          ? "Alokasi guru pengampu berhasil diperbarui!"
          : "Alokasi guru pengampu baru berhasil ditambahkan!"
      );
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, namaGuru: string, namaMapel: string, namaKelas: string) => {
    if (!confirm(`Hapus alokasi mengajar ${namaGuru} untuk ${namaMapel} di kelas ${namaKelas}?`)) {
      return;
    }

    try {
      setError("");
      const res = await fetch(`${API_URL}/api/kurikulum/pengampu/${id}`, {
        method: "DELETE",
        headers: headers(),
      });

      const resJson = await res.json();
      if (!res.ok) throw new Error(resJson.message || "Gagal menghapus alokasi pengajar");

      setSuccessMsg("Alokasi guru pengampu berhasil dihapus");
      loadData();
    } catch (err: any) {
      setError(err.message || "Gagal menghapus");
    }
  };

  const filtered = data.filter((item) => {
    const matchSearch =
      item.nama_mapel.toLowerCase().includes(search.toLowerCase()) ||
      item.kode_mapel.toLowerCase().includes(search.toLowerCase()) ||
      item.nama_guru.toLowerCase().includes(search.toLowerCase()) ||
      item.nama_kelas.toLowerCase().includes(search.toLowerCase());
    const matchKelompok =
      kelompokFilter === "Semua" || item.kelompok === kelompokFilter.toLowerCase();
    return matchSearch && matchKelompok;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#003399]">Mata Pelajaran & Guru Pengampu</h1>
          <p className="text-xs text-slate-500 mt-1">
            Plotting alokasi mengajar guru, manajemen beban ajar, dan distribusi kurikulum mata pelajaran per rombel kelas.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-xl bg-[#003399] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-blue-800 active:scale-95"
          >
            + Tambah Alokasi Pengampu
          </button>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase text-slate-400">Pencarian Mapel / Guru / Kelas</label>
            <input
              type="text"
              placeholder="Ketik nama mapel, guru, kelas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-[#003399] focus:ring-1 focus:ring-[#003399]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase text-slate-400">Kelompok Mata Pelajaran</label>
            <select
              value={kelompokFilter}
              onChange={(e) => setKelompokFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs outline-none focus:border-[#003399] focus:ring-1 focus:ring-[#003399]"
            >
              <option value="Semua">Semua Kelompok (Kejuruan, Umum, Muatan Lokal)</option>
              <option value="kejuruan">Kejuruan</option>
              <option value="umum">Umum</option>
              <option value="muatan_lokal">Muatan Lokal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabel Alokasi Pengampu dengan Fitur Edit & Hapus */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="py-3.5 px-5">Kelompok</th>
              <th className="py-3.5 px-4">Mata Pelajaran</th>
              <th className="py-3.5 px-4">Guru Pengampu</th>
              <th className="py-3.5 px-4">Rombel Kelas</th>
              <th className="py-3.5 px-4">Tahun Ajaran</th>
              <th className="py-3.5 px-5 text-right">Aksi Kelola</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  Memuat data pengampu...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  Belum ada alokasi guru pengampu. Klik tombol di atas untuk menambah penugasan baru.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="transition hover:bg-slate-50/70">
                  <td className="py-3.5 px-5">
                    <span
                      className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                        item.kelompok === "kejuruan"
                          ? "bg-indigo-100 text-indigo-700"
                          : item.kelompok === "umum"
                          ? "bg-slate-100 text-slate-700"
                          : "bg-teal-100 text-teal-700"
                      }`}
                    >
                      {item.kelompok.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-slate-800 text-sm">{item.nama_mapel}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{item.kode_mapel}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-[#003399]">{item.nama_guru}</p>
                    <p className="text-[11px] text-slate-400">NIP: {item.nip}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block rounded-lg bg-blue-50 px-2.5 py-1 font-semibold text-[#003399]">
                      {item.nama_kelas}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {item.tahun_ajaran}
                  </td>
                  <td className="py-3.5 px-5 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.nama_guru, item.nama_mapel, item.nama_kelas)}
                      className="rounded-lg border border-red-200 bg-white px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      🗑️ Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL FORM TAMBAH / EDIT ALOKASI PENGAMPU */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <form
            onSubmit={handleSave}
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  {editingId ? "Edit Alokasi Guru Pengampu" : "Tambah Alokasi Guru Pengampu"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Tahun Ajaran: {activeTA.nama || "Aktif"}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  1. Pilih Guru Pengajar <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={form.guru_id}
                  onChange={(e) => setForm({ ...form, guru_id: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-[#003399] focus:ring-1 focus:ring-[#003399]"
                >
                  <option value="">-- Pilih Guru --</option>
                  {guruOptions.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.nama} (NIP: {g.info || "-"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  2. Pilih Mata Pelajaran <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={form.mata_pelajaran_id}
                  onChange={(e) => setForm({ ...form, mata_pelajaran_id: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-[#003399] focus:ring-1 focus:ring-[#003399]"
                >
                  <option value="">-- Pilih Mata Pelajaran --</option>
                  {mapelOptions.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nama} ({m.info})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  3. Pilih Rombel Kelas <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={form.kelas_id}
                  onChange={(e) => setForm({ ...form, kelas_id: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-[#003399] focus:ring-1 focus:ring-[#003399]"
                >
                  <option value="">-- Pilih Rombel Kelas --</option>
                  {kelasOptions.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.nama} ({k.info})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#003399] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-800 disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Simpan Penugasan"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
