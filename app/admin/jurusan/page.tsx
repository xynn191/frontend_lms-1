"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type Jurusan = {
  id: number;
  kode_jurusan: string;
  nama_jurusan: string;
  deskripsi: string;
};

export default function JurusanPage() {
  const [data, setData] = useState<Jurusan[]>([]);
  const [form, setForm] = useState({ kode_jurusan: "", nama_jurusan: "", deskripsi: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/jurusan`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` }
      });
      const json = await res.json();
      setData(json || []);
    } catch (e) {
      console.error(e);
      setError("Gagal memuat data jurusan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreate = () => {
    setForm({ kode_jurusan: "", nama_jurusan: "", deskripsi: "" });
    setEditingId(null);
    setError("");
    setIsOpen(true);
  };

  const openEdit = (item: Jurusan) => {
    setForm({
      kode_jurusan: item.kode_jurusan,
      nama_jurusan: item.nama_jurusan,
      deskripsi: item.deskripsi || ""
    });
    setEditingId(item.id);
    setError("");
    setIsOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `${API_URL}/api/jurusan/${editingId}` : `${API_URL}/api/jurusan`;
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

      setMessage(editingId ? "Jurusan berhasil diperbarui" : "Jurusan baru berhasil ditambahkan");
      setTimeout(() => setMessage(""), 3500);
      setIsOpen(false);
      loadData();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus jurusan ini?")) return;
    try {
      const res = await fetch(`${API_URL}/api/jurusan/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` }
      });
      if (!res.ok) throw new Error("Gagal menghapus data");
      setMessage("Jurusan berhasil dihapus");
      setTimeout(() => setMessage(""), 3500);
      loadData();
    } catch (e: any) {
      alert(e.message || "Gagal menghapus jurusan");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-6xl mx-auto mt-6 text-slate-800 border border-slate-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1d3557]">Manajemen Jurusan</h1>
          <p className="text-xs text-slate-500 mt-1">Kelola data program & kompetensi keahlian</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-[#003399] hover:bg-blue-800 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition flex items-center gap-2 shadow-sm"
        >
          <span>+</span> Tambah Jurusan
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
              <th className="p-4 font-semibold">Kode Jurusan</th>
              <th className="p-4 font-semibold">Nama Jurusan</th>
              <th className="p-4 font-semibold">Deskripsi</th>
              <th className="p-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">Memuat data...</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">Belum ada data jurusan</td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition">
                  <td className="p-4 font-semibold">
                    <span className="inline-block bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-md text-xs font-bold tracking-wide">
                      {item.kode_jurusan}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-slate-800">{item.nama_jurusan}</td>
                  <td className="p-4 text-slate-500 text-xs max-w-md truncate">
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
            <h2 className="text-xl font-bold mb-5 text-[#1d3557] border-b pb-3">
              {editingId ? "Edit Jurusan" : "Tambah Jurusan Baru"}
            </h2>

            {error && (
              <div className="mb-4 p-2.5 bg-red-50 text-red-600 rounded-lg border border-red-200 text-xs">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Kode Jurusan *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: PPLG, TJKT, AKL"
                  className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm uppercase"
                  value={form.kode_jurusan}
                  onChange={(e) => setForm({ ...form, kode_jurusan: e.target.value.toUpperCase() })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Nama Jurusan *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Pengembangan Perangkat Lunak dan Gim"
                  className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                  value={form.nama_jurusan}
                  onChange={(e) => setForm({ ...form, nama_jurusan: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Deskripsi
                </label>
                <textarea
                  rows={3}
                  placeholder="Deskripsi singkat mengenai jurusan ini..."
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

