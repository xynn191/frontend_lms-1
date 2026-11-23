"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type Tugas = {
  id: number;
  guru_id: number;
  mata_pelajaran_id: number;
  nama_mapel: string;
  kelas_id: number;
  nama_kelas: string;
  judul: string;
  deskripsi: string;
  deadline: string;
  created_at: string;
  total_kumpul: number;
};

type OptionItem = {
  id: number;
  nama: string;
};

export default function GuruTugasPage() {
  const [data, setData] = useState<Tugas[]>([]);
  const [kelasList, setKelasList] = useState<OptionItem[]>([]);
  const [mapelList, setMapelList] = useState<OptionItem[]>([]);
  const [form, setForm] = useState({
    judul: "",
    mata_pelajaran_id: "",
    kelas_id: "",
    deskripsi: "",
    deadline: "",
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

      const [tugasRes, kelasRes, mapelRes] = await Promise.all([
        fetch(`${API_URL}/api/guru/tugas`, { headers }),
        fetch(`${API_URL}/api/kelas`, { headers }),
        fetch(`${API_URL}/api/mata-pelajaran`, { headers }),
      ]);

      const tugasJson = await tugasRes.json();
      const kelasJson = await kelasRes.json();
      const mapelJson = await mapelRes.json();

      setData(tugasJson || []);
      setKelasList(kelasJson?.map((k: any) => ({ id: k.id, nama: k.nama_kelas })) || []);
      setMapelList(mapelJson?.map((m: any) => ({ id: m.id, nama: m.nama_mapel })) || []);
    } catch (e) {
      console.error(e);
      setError("Gagal memuat daftar tugas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreate = () => {
    setForm({
      judul: "",
      mata_pelajaran_id: mapelList[0]?.id ? String(mapelList[0].id) : "",
      kelas_id: kelasList[0]?.id ? String(kelasList[0].id) : "",
      deskripsi: "",
      deadline: "",
    });
    setEditingId(null);
    setError("");
    setIsOpen(true);
  };

  const openEdit = (item: Tugas) => {
    // format datetime-local YYYY-MM-DDTHH:mm
    const dlFormatted = item.deadline ? item.deadline.replace(" ", "T") : "";
    setForm({
      judul: item.judul,
      mata_pelajaran_id: String(item.mata_pelajaran_id),
      kelas_id: String(item.kelas_id),
      deskripsi: item.deskripsi || "",
      deadline: dlFormatted,
    });
    setEditingId(item.id);
    setError("");
    setIsOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `${API_URL}/api/guru/tugas/${editingId}` : `${API_URL}/api/guru/tugas`;
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
          mata_pelajaran_id: Number(form.mata_pelajaran_id),
          kelas_id: Number(form.kelas_id),
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Gagal menyimpan tugas");
      }

      setMessage(editingId ? "Tugas berhasil diperbarui" : "Tugas baru berhasil dibuat");
      setTimeout(() => setMessage(""), 3500);
      setIsOpen(false);
      loadData();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus tugas ini? Data pengumpulan siswa juga akan terhapus.")) return;
    try {
      const res = await fetch(`${API_URL}/api/guru/tugas/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      });
      if (!res.ok) throw new Error("Gagal menghapus tugas");
      setMessage("Tugas berhasil dihapus");
      setTimeout(() => setMessage(""), 3500);
      loadData();
    } catch (e: any) {
      alert(e.message || "Gagal menghapus tugas");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xs p-6 max-w-6xl mx-auto text-slate-800 border border-slate-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1d3557]">Tugas Siswa</h1>
          <p className="text-xs text-slate-500 mt-1">Buat tugas proyek, latihan mandiri, dan pantau pengumpulan siswa</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-[#003399] hover:bg-blue-800 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition flex items-center gap-2 shadow-xs"
        >
          <span>+</span> Buat Tugas Baru
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
              <th className="p-4 font-semibold">Judul Tugas</th>
              <th className="p-4 font-semibold">Kelas</th>
              <th className="p-4 font-semibold">Mata Pelajaran</th>
              <th className="p-4 font-semibold">Batas Waktu (Deadline)</th>
              <th className="p-4 font-semibold">Mengumpulkan</th>
              <th className="p-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">Memuat data tugas...</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">Belum ada tugas dibuat</td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition">
                  <td className="p-4">
                    <p className="font-bold text-slate-800 text-sm">{item.judul}</p>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{item.deskripsi}</p>
                  </td>
                  <td className="p-4">
                    <span className="inline-block bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded text-xs font-bold">
                      {item.nama_kelas}
                    </span>
                  </td>
                  <td className="p-4 text-xs font-medium text-slate-700">{item.nama_mapel}</td>
                  <td className="p-4 text-xs font-semibold text-red-600 whitespace-nowrap">
                    ⏰ {item.deadline}
                  </td>
                  <td className="p-4 text-xs">
                    <span className="inline-block bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-bold">
                      {item.total_kumpul} siswa
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
            className="bg-white p-6 rounded-xl w-full max-w-lg shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150"
          >
            <h2 className="text-xl font-bold mb-5 text-[#1d3557] border-b pb-3">
              {editingId ? "Edit Tugas Siswa" : "Buat Tugas Siswa Baru"}
            </h2>

            {error && (
              <div className="mb-4 p-2.5 bg-red-50 text-red-600 rounded-lg border border-red-200 text-xs">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Judul Tugas *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Tugas 1: Membuat Layout Grid CSS"
                  className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                  value={form.judul}
                  onChange={(e) => setForm({ ...form, judul: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Kelas *
                  </label>
                  <select
                    className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-blue-500 bg-white text-sm"
                    value={form.kelas_id}
                    onChange={(e) => setForm({ ...form, kelas_id: e.target.value })}
                    required
                  >
                    <option value="">-- Pilih Kelas --</option>
                    {kelasList.map((k) => (
                      <option key={k.id} value={k.id}>
                        {k.nama}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Mata Pelajaran *
                  </label>
                  <select
                    className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-blue-500 bg-white text-sm"
                    value={form.mata_pelajaran_id}
                    onChange={(e) => setForm({ ...form, mata_pelajaran_id: e.target.value })}
                    required
                  >
                    <option value="">-- Pilih Mapel --</option>
                    {mapelList.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nama}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Batas Waktu (Deadline) *
                </label>
                <input
                  type="datetime-local"
                  className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-blue-500 bg-white text-sm"
                  value={form.deadline}
                  onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Instruksi & Petunjuk Pengerjaan *
                </label>
                <textarea
                  rows={4}
                  placeholder="Jelaskan detail instruksi pengerjaan tugas, kriteria penilaian, dan format file yang dikumpulkan..."
                  className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm resize-none"
                  value={form.deskripsi}
                  onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                  required
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
                className="px-5 py-2 bg-[#003399] hover:bg-blue-800 text-white rounded-lg text-sm font-semibold transition shadow-xs"
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


