"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type Materi = {
  id: number;
  guru_id: number;
  mata_pelajaran_id: number;
  nama_mapel: string;
  kelas_id: number;
  nama_kelas: string;
  judul: string;
  deskripsi: string;
  file_url: string;
  tautan_eksternal: string;
  created_at: string;
};

type OptionItem = {
  id: number;
  nama: string;
};

export default function GuruMateriPage() {
  const [data, setData] = useState<Materi[]>([]);
  const [kelasList, setKelasList] = useState<OptionItem[]>([]);
  const [mapelList, setMapelList] = useState<OptionItem[]>([]);
  const [filterKelas, setFilterKelas] = useState("");
  const [form, setForm] = useState({
    judul: "",
    mata_pelajaran_id: "",
    kelas_id: "",
    deskripsi: "",
    file_url: "",
    tautan_eksternal: "",
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
      const url = filterKelas ? `${API_URL}/api/guru/materi?kelas_id=${filterKelas}` : `${API_URL}/api/guru/materi`;

      const [materiRes, kelasRes, mapelRes] = await Promise.all([
        fetch(url, { headers }),
        fetch(`${API_URL}/api/kelas`, { headers }),
        fetch(`${API_URL}/api/guru/mata-pelajaran`, { headers }),
      ]);

      const materiJson = await materiRes.json();
      const kelasJson = await kelasRes.json();
      const mapelJson = await mapelRes.json();

      setData(materiJson || []);
      setKelasList(kelasJson?.map((k: any) => ({ id: k.id, nama: k.nama_kelas })) || []);
      setMapelList(mapelJson?.map((m: any) => ({ id: m.id, nama: m.nama_mapel })) || []);
    } catch (e) {
      console.error(e);
      setError("Gagal memuat data materi pembelajaran");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filterKelas]);

  const openCreate = () => {
    setForm({
      judul: "",
      mata_pelajaran_id: mapelList[0]?.id ? String(mapelList[0].id) : "",
      kelas_id: kelasList[0]?.id ? String(kelasList[0].id) : "",
      deskripsi: "",
      file_url: "",
      tautan_eksternal: "",
    });
    setEditingId(null);
    setError("");
    setIsOpen(true);
  };

  const openEdit = (item: Materi) => {
    setForm({
      judul: item.judul,
      mata_pelajaran_id: String(item.mata_pelajaran_id),
      kelas_id: String(item.kelas_id),
      deskripsi: item.deskripsi || "",
      file_url: item.file_url || "",
      tautan_eksternal: item.tautan_eksternal || "",
    });
    setEditingId(item.id);
    setError("");
    setIsOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `${API_URL}/api/guru/materi/${editingId}` : `${API_URL}/api/guru/materi`;
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
        throw new Error(text || "Gagal menyimpan materi");
      }

      setMessage(editingId ? "Materi berhasil diperbarui" : "Materi baru berhasil ditambahkan");
      setTimeout(() => setMessage(""), 3500);
      setIsOpen(false);
      loadData();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus materi ini?")) return;
    try {
      const res = await fetch(`${API_URL}/api/guru/materi/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      });
      if (!res.ok) throw new Error("Gagal menghapus materi");
      setMessage("Materi berhasil dihapus");
      setTimeout(() => setMessage(""), 3500);
      loadData();
    } catch (e: any) {
      alert(e.message || "Gagal menghapus materi");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xs p-6 max-w-6xl mx-auto text-slate-800 border border-slate-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1d3557]">Materi Pembelajaran</h1>
          <p className="text-xs text-slate-500 mt-1">Unggah bahan ajar, modul PDF, dan materi digital untuk kelas Anda</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-[#003399] hover:bg-blue-800 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition flex items-center gap-2 shadow-xs"
        >
          <span>+</span> Tambah Materi
        </button>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 text-sm flex items-center gap-2">
          <span>✓</span> {message}
        </div>
      )}

      {/* Filter Kelas Bar */}
      <div className="mb-5 flex flex-wrap items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Filter Kelas:</span>
        <button
          onClick={() => setFilterKelas("")}
          className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
            filterKelas === "" ? "bg-[#003399] text-white" : "bg-white text-slate-600 border border-slate-200"
          }`}
        >
          Semua Kelas
        </button>
        {kelasList.map((k) => (
          <button
            key={k.id}
            onClick={() => setFilterKelas(String(k.id))}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
              filterKelas === String(k.id) ? "bg-[#003399] text-white" : "bg-white text-slate-600 border border-slate-200"
            }`}
          >
            {k.nama}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs">
              <th className="p-4 font-semibold">Judul Materi</th>
              <th className="p-4 font-semibold">Kelas</th>
              <th className="p-4 font-semibold">Mata Pelajaran</th>
              <th className="p-4 font-semibold">Lampiran / Link</th>
              <th className="p-4 font-semibold">Waktu Dibuat</th>
              <th className="p-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">Memuat materi...</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">Belum ada materi pembelajaran</td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition">
                  <td className="p-4">
                    <p className="font-bold text-slate-800 text-sm">{item.judul}</p>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{item.deskripsi || "Tanpa deskripsi"}</p>
                  </td>
                  <td className="p-4">
                    <span className="inline-block bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded text-xs font-bold">
                      {item.nama_kelas}
                    </span>
                  </td>
                  <td className="p-4 text-xs font-medium text-slate-700">{item.nama_mapel}</td>
                  <td className="p-4 text-xs">
                    <div className="flex flex-col gap-1">
                      {item.file_url && (
                        <a
                          href={item.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                        >
                          📄 Berkas/Modul
                        </a>
                      )}
                      {item.tautan_eksternal && (
                        <a
                          href={item.tautan_eksternal}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-600 hover:underline flex items-center gap-1 font-semibold"
                        >
                          🔗 Tautan Web
                        </a>
                      )}
                      {!item.file_url && !item.tautan_eksternal && <span className="text-slate-500">-</span>}
                    </div>
                  </td>
                  <td className="p-4 text-xs text-slate-500 whitespace-nowrap">{item.created_at}</td>
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
              {editingId ? "Edit Materi Pembelajaran" : "Tambah Materi Baru"}
            </h2>

            {error && (
              <div className="mb-4 p-2.5 bg-red-50 text-red-600 rounded-lg border border-red-200 text-xs">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Judul Materi *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Pengenalan Sintaks HTML & CSS"
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
                    disabled={mapelList.length === 0}
                  >
                    <option value="">{mapelList.length === 0 ? "-- Anda belum memiliki mapel diampu --" : "-- Pilih Mapel yang Diampu --"}</option>
                    {mapelList.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nama}
                      </option>
                    ))}
                  </select>
                  {mapelList.length === 0 && (
                    <p className="text-[11px] text-amber-600 mt-1">
                      ⚠️ Anda belum ditugaskan mengampu mata pelajaran apapun. Silakan hubungi Admin atau Kurikulum.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Deskripsi / Petunjuk Belajar
                </label>
                <textarea
                  rows={3}
                  placeholder="Ringkasan atau panduan mempelajari materi ini..."
                  className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm resize-none"
                  value={form.deskripsi}
                  onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    URL File / Modul PDF
                  </label>
                  <input
                    type="url"
                    placeholder="https://.../modul.pdf"
                    className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                    value={form.file_url}
                    onChange={(e) => setForm({ ...form, file_url: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Tautan Web / Referensi
                  </label>
                  <input
                    type="url"
                    placeholder="https://developer.mozilla.org/..."
                    className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                    value={form.tautan_eksternal}
                    onChange={(e) => setForm({ ...form, tautan_eksternal: e.target.value })}
                  />
                </div>
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


