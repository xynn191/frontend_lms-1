"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type MataPelajaran = {
  id: number;
  kode_mapel: string;
  nama_mapel: string;
  kelompok: "umum" | "kejuruan" | "muatan_lokal";
  deskripsi: string;
};

export default function MataPelajaranPage() {
  const [data, setData] = useState<MataPelajaran[]>([]);
  const [form, setForm] = useState({
    kode_mapel: "",
    nama_mapel: "",
    kelompok: "kejuruan" as "umum" | "kejuruan" | "muatan_lokal",
    deskripsi: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/mata-pelajaran`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` }
      });
      const json = await res.json();
      setData(json || []);
    } catch (e) {
      console.error(e);
      setError("Gagal memuat data mata pelajaran");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreate = () => {
    setForm({ kode_mapel: "", nama_mapel: "", kelompok: "kejuruan", deskripsi: "" });
    setEditingId(null);
    setError("");
    setIsOpen(true);
  };

  const openEdit = (item: MataPelajaran) => {
    setForm({
      kode_mapel: item.kode_mapel,
      nama_mapel: item.nama_mapel,
      kelompok: item.kelompok || "kejuruan",
      deskripsi: item.deskripsi || "",
    });
    setEditingId(item.id);
    setError("");
    setIsOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `${API_URL}/api/mata-pelajaran/${editingId}` : `${API_URL}/api/mata-pelajaran`;
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Gagal menyimpan data");
      }

      setMessage(editingId ? "Mata pelajaran berhasil diubah" : "Mata pelajaran baru berhasil ditambahkan");
      setTimeout(() => setMessage(""), 3500);
      setIsOpen(false);
      loadData();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus mata pelajaran ini?")) return;
    try {
      const res = await fetch(`${API_URL}/api/mata-pelajaran/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` }
      });
      if (!res.ok) throw new Error("Gagal menghapus data");
      setMessage("Mata pelajaran berhasil dihapus");
      setTimeout(() => setMessage(""), 3500);
      loadData();
    } catch (e: any) {
      alert(e.message || "Gagal menghapus mata pelajaran");
    }
  };

  const getBadgeColor = (kelompok: string) => {
    switch (kelompok) {
      case "umum":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "kejuruan":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "muatan_lokal":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getKelompokLabel = (kelompok: string) => {
    switch (kelompok) {
      case "umum":
        return "Umum";
      case "kejuruan":
        return "Kejuruan";
      case "muatan_lokal":
        return "Muatan Lokal";
      default:
        return kelompok;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-6xl mx-auto mt-6 text-slate-800 border border-slate-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#003399]">Manajemen Mata Pelajaran</h1>
          <p className="text-xs text-slate-500 mt-1">Kelola kurikulum dan daftar mata pelajaran sekolah</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-[#003399] hover:bg-blue-800 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition flex items-center gap-2 shadow-sm"
        >
          <span>+</span> Tambah Mata Pelajaran
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
              <th className="p-4 font-semibold">Kode Mapel</th>
              <th className="p-4 font-semibold">Nama Mata Pelajaran</th>
              <th className="p-4 font-semibold">Kelompok</th>
              <th className="p-4 font-semibold">Deskripsi</th>
              <th className="p-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">Memuat data...</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">Belum ada mata pelajaran</td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition">
                  <td className="p-4 font-semibold">
                    <span className="inline-block bg-slate-100 text-slate-800 border border-slate-300 px-2 py-0.5 rounded text-xs font-mono">
                      {item.kode_mapel}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-slate-800">{item.nama_mapel}</td>
                  <td className="p-4">
                    <span className={`inline-block border px-2.5 py-0.5 rounded-full text-xs font-semibold ${getBadgeColor(item.kelompok)}`}>
                      {getKelompokLabel(item.kelompok)}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 text-xs max-w-xs truncate">
                    {item.deskripsi || "-"}
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
          <form onSubmit={save} className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <h2 className="text-xl font-bold mb-5 text-[#003399] border-b pb-3">
              {editingId ? "Edit Mata Pelajaran" : "Tambah Mata Pelajaran"}
            </h2>

            {error && (
              <div className="mb-4 p-2.5 bg-red-50 text-red-600 rounded-lg border border-red-200 text-xs">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Kode Mapel *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: RPL01, MTK, BING"
                  className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm uppercase"
                  value={form.kode_mapel}
                  onChange={(e) => setForm({ ...form, kode_mapel: e.target.value.toUpperCase() })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Nama Mata Pelajaran *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Pemrograman Web dan Perangkat Bergerak"
                  className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                  value={form.nama_mapel}
                  onChange={(e) => setForm({ ...form, nama_mapel: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Kelompok *
                </label>
                <select
                  className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-blue-500 bg-white text-sm"
                  value={form.kelompok}
                  onChange={(e) => setForm({ ...form, kelompok: e.target.value as any })}
                  required
                >
                  <option value="umum">Umum (Muatan Nasional & Kewilayahan)</option>
                  <option value="kejuruan">Kejuruan (Peminatan / Keahlian)</option>
                  <option value="muatan_lokal">Muatan Lokal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Deskripsi
                </label>
                <textarea
                  rows={3}
                  placeholder="Deskripsi materi atau silabus mata pelajaran..."
                  className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm resize-none"
                  value={form.deskripsi}
                  onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                />
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
