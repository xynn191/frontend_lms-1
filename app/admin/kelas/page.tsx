"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type Kelas = {
  id: number;
  nama_kelas: string;
  tingkat: "X" | "XI" | "XII";
  jurusan_id: number;
  nama_jurusan: string;
  tahun_ajaran_id: number;
};

type JurusanOption = {
  id: number;
  kode_jurusan: string;
  nama_jurusan: string;
};

export default function KelasPage() {
  const [data, setData] = useState<Kelas[]>([]);
  const [jurusanList, setJurusanList] = useState<JurusanOption[]>([]);
  const [form, setForm] = useState({
    nama_kelas: "",
    tingkat: "X",
    jurusan_id: "",
    tahun_ajaran_id: "1",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${localStorage.getItem("token") || ""}` };
      const [kelasRes, jurusanRes] = await Promise.all([
        fetch(`${API_URL}/api/kelas`, { headers }),
        fetch(`${API_URL}/api/jurusan`, { headers }),
      ]);
      const kelasJson = await kelasRes.json();
      const jurusanJson = await jurusanRes.json();
      setData(kelasJson || []);
      setJurusanList(jurusanJson || []);
    } catch (e) {
      console.error(e);
      setError("Gagal memuat data kelas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreate = () => {
    setForm({ nama_kelas: "", tingkat: "X", jurusan_id: "", tahun_ajaran_id: "1" });
    setEditingId(null);
    setError("");
    setIsOpen(true);
  };

  const openEdit = (item: Kelas) => {
    setForm({
      nama_kelas: item.nama_kelas,
      tingkat: item.tingkat,
      jurusan_id: String(item.jurusan_id),
      tahun_ajaran_id: String(item.tahun_ajaran_id || "1"),
    });
    setEditingId(item.id);
    setError("");
    setIsOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `${API_URL}/api/kelas/${editingId}` : `${API_URL}/api/kelas`;
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          ...form,
          jurusan_id: Number(form.jurusan_id),
          tahun_ajaran_id: Number(form.tahun_ajaran_id),
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Gagal menyimpan data kelas");
      }

      setMessage(editingId ? "Kelas berhasil diubah" : "Kelas baru berhasil ditambahkan");
      setTimeout(() => setMessage(""), 3500);
      setIsOpen(false);
      loadData();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kelas ini?")) return;
    try {
      const res = await fetch(`${API_URL}/api/kelas/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      });
      if (!res.ok) throw new Error("Gagal menghapus data kelas");
      setMessage("Kelas berhasil dihapus");
      setTimeout(() => setMessage(""), 3500);
      loadData();
    } catch (e: any) {
      alert(e.message || "Gagal menghapus kelas");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-6xl mx-auto mt-6 text-slate-800 border border-slate-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#003399]">Manajemen Kelas</h1>
          <p className="text-xs text-slate-500 mt-1">Kelola rombongan belajar (rombel) berdasarkan jurusan dan tingkat</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-[#003399] hover:bg-blue-800 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition flex items-center gap-2 shadow-sm"
        >
          <span>+</span> Tambah Kelas
        </button>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 text-sm flex items-center gap-2">
          <span>✓</span> {message}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs">
              <th className="p-4 font-semibold">Nama Kelas</th>
              <th className="p-4 font-semibold">Tingkat</th>
              <th className="p-4 font-semibold">Jurusan</th>
              <th className="p-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-400">Memuat data...</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">Belum ada data kelas</td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition">
                  <td className="p-4 font-semibold text-slate-800">{item.nama_kelas}</td>
                  <td className="p-4">
                    <span className="inline-block bg-slate-100 text-slate-700 border border-slate-200 font-bold px-2 py-0.5 rounded text-xs">
                      Tingkat {item.tingkat}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="inline-block bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-md text-xs font-bold">
                      {jurusanList.find((j) => j.id === item.jurusan_id)?.kode_jurusan || item.nama_jurusan || "-"}
                    </span>
                  </td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => openEdit(item)}
                      className="text-blue-600 hover:text-blue-800 mr-4 font-medium text-xs hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(item.id)}
                      className="text-red-600 hover:text-red-800 font-medium text-xs hover:underline"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50 backdrop-blur-xs">
          <form
            onSubmit={save}
            className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150"
          >
            <h2 className="text-xl font-bold mb-5 text-[#003399] border-b pb-3">
              {editingId ? "Edit Kelas" : "Tambah Kelas Baru"}
            </h2>

            {error && (
              <div className="mb-4 p-2.5 bg-red-50 text-red-600 rounded-lg border border-red-200 text-xs">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Nama Kelas *
                </label>
                <input
                  type="text"
                  className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                  value={form.nama_kelas}
                  onChange={(e) => setForm({ ...form, nama_kelas: e.target.value })}
                  placeholder="Contoh: X PPLG 1"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Tingkat *
                </label>
                <select
                  className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-blue-500 bg-white text-sm"
                  value={form.tingkat}
                  onChange={(e) => setForm({ ...form, tingkat: e.target.value })}
                  required
                >
                  <option value="X">Tingkat X</option>
                  <option value="XI">Tingkat XI</option>
                  <option value="XII">Tingkat XII</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Jurusan *
                </label>
                <select
                  className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-blue-500 bg-white text-sm"
                  value={form.jurusan_id}
                  onChange={(e) => setForm({ ...form, jurusan_id: e.target.value })}
                  required
                >
                  <option value="">-- Pilih Jurusan --</option>
                  {jurusanList.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.kode_jurusan} — {j.nama_jurusan}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-7 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#003399] hover:bg-blue-800 text-white rounded-lg text-sm font-semibold transition shadow-sm"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
