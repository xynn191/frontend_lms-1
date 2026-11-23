"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type KuisUjian = {
  id: number;
  guru_id: number;
  mata_pelajaran_id: number;
  nama_mapel: string;
  kelas_id: number;
  nama_kelas: string;
  judul: string;
  tipe: "kuis" | "ujian";
  durasi_menit: number;
  deskripsi: string;
  status: "draft" | "aktif" | "selesai";
  created_at: string;
};

type OptionItem = {
  id: number;
  nama: string;
};

export default function GuruKuisUjianPage() {
  const router = useRouter();
  const [data, setData] = useState<KuisUjian[]>([]);
  const [kelasList, setKelasList] = useState<OptionItem[]>([]);
  const [mapelList, setMapelList] = useState<OptionItem[]>([]);
  const [filterTipe, setFilterTipe] = useState("");
  const [form, setForm] = useState({
    judul: "",
    tipe: "kuis" as "kuis" | "ujian",
    mata_pelajaran_id: "",
    kelas_id: "",
    durasi_menit: 60,
    status: "draft" as "draft" | "aktif" | "selesai",
    deskripsi: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Bookmark lama tetap aman setelah menu dipisah menjadi Kuis dan Ujian.
  useEffect(() => { router.replace("/guru/kuis"); }, [router]);

  const loadData = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${localStorage.getItem("token") || ""}` };
      const url = filterTipe ? `${API_URL}/api/guru/kuis-ujian?tipe=${filterTipe}` : `${API_URL}/api/guru/kuis-ujian`;

      const [kuisRes, kelasRes, mapelRes] = await Promise.all([
        fetch(url, { headers }),
        fetch(`${API_URL}/api/kelas`, { headers }),
        fetch(`${API_URL}/api/guru/mata-pelajaran`, { headers }),
      ]);

      const kuisJson = await kuisRes.json();
      const kelasJson = await kelasRes.json();
      const mapelJson = await mapelRes.json();

      setData(kuisJson || []);
      setKelasList(kelasJson?.map((k: any) => ({ id: k.id, nama: k.nama_kelas })) || []);
      setMapelList(mapelJson?.map((m: any) => ({ id: m.id, nama: m.nama_mapel })) || []);
    } catch (e) {
      console.error(e);
      setError("Gagal memuat kuis dan ujian");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filterTipe]);

  const openCreate = () => {
    setForm({
      judul: "",
      tipe: "kuis",
      mata_pelajaran_id: mapelList[0]?.id ? String(mapelList[0].id) : "",
      kelas_id: kelasList[0]?.id ? String(kelasList[0].id) : "",
      durasi_menit: 60,
      status: "draft",
      deskripsi: "",
    });
    setEditingId(null);
    setError("");
    setIsOpen(true);
  };

  const openEdit = (item: KuisUjian) => {
    setForm({
      judul: item.judul,
      tipe: item.tipe || "kuis",
      mata_pelajaran_id: String(item.mata_pelajaran_id),
      kelas_id: String(item.kelas_id),
      durasi_menit: item.durasi_menit || 60,
      status: item.status || "draft",
      deskripsi: item.deskripsi || "",
    });
    setEditingId(item.id);
    setError("");
    setIsOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `${API_URL}/api/guru/kuis-ujian/${editingId}` : `${API_URL}/api/guru/kuis-ujian`;
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
          durasi_menit: Number(form.durasi_menit),
          mata_pelajaran_id: Number(form.mata_pelajaran_id),
          kelas_id: Number(form.kelas_id),
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Gagal menyimpan kuis/ujian");
      }

      setMessage(editingId ? "Kuis/Ujian berhasil diubah" : "Kuis/Ujian baru berhasil dibuat");
      setTimeout(() => setMessage(""), 3500);
      setIsOpen(false);
      loadData();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kuis/ujian ini?")) return;
    try {
      const res = await fetch(`${API_URL}/api/guru/kuis-ujian/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      });
      if (!res.ok) throw new Error("Gagal menghapus");
      setMessage("Berhasil dihapus");
      setTimeout(() => setMessage(""), 3500);
      loadData();
    } catch (e: any) {
      alert(e.message || "Gagal menghapus");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "aktif":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "draft":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "selesai":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xs p-6 max-w-6xl mx-auto text-slate-800 border border-slate-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1d3557]">Kuis & Ujian</h1>
          <p className="text-xs text-slate-500 mt-1">Kelola evaluasi belajar, kuis harian, UTS, dan UAS siswa</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-[#003399] hover:bg-blue-800 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition flex items-center gap-2 shadow-xs"
        >
          <span>+</span> Buat Kuis / Ujian
        </button>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 text-sm flex items-center gap-2">
          <span>✓</span> {message}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="mb-5 flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setFilterTipe("")}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
            filterTipe === "" ? "bg-[#003399] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Semua
        </button>
        <button
          onClick={() => setFilterTipe("kuis")}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
            filterTipe === "kuis" ? "bg-[#003399] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Kuis Harian
        </button>
        <button
          onClick={() => setFilterTipe("ujian")}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
            filterTipe === "ujian" ? "bg-[#003399] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Ujian Semester
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs">
              <th className="p-4 font-semibold">Judul Evaluasi</th>
              <th className="p-4 font-semibold">Tipe</th>
              <th className="p-4 font-semibold">Kelas & Mapel</th>
              <th className="p-4 font-semibold">Durasi</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">Memuat data...</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">Belum ada kuis atau ujian dibuat</td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition">
                  <td className="p-4">
                    <p className="font-bold text-slate-800 text-sm">{item.judul}</p>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{item.deskripsi || "Tanpa deskripsi"}</p>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider ${
                        item.tipe === "ujian"
                          ? "bg-purple-100 text-purple-700 border border-purple-200"
                          : "bg-amber-100 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {item.tipe}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-slate-800 text-xs">{item.nama_kelas}</p>
                    <p className="text-[11px] text-slate-500">{item.nama_mapel}</p>
                  </td>
                  <td className="p-4 text-xs font-mono text-slate-700 whitespace-nowrap">
                    ⏱️ {item.durasi_menit} Menit
                  </td>
                  <td className="p-4">
                    <span className={`inline-block border px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${getStatusBadge(item.status)}`}>
                      {item.status}
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
              {editingId ? "Edit Evaluasi" : "Buat Kuis / Ujian Baru"}
            </h2>

            {error && (
              <div className="mb-4 p-2.5 bg-red-50 text-red-600 rounded-lg border border-red-200 text-xs">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Judul Evaluasi *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Kuis 1: Pengenalan HTML & CSS"
                  className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                  value={form.judul}
                  onChange={(e) => setForm({ ...form, judul: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Tipe Evaluasi *
                  </label>
                  <select
                    className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-blue-500 bg-white text-sm"
                    value={form.tipe}
                    onChange={(e) => setForm({ ...form, tipe: e.target.value as "kuis" | "ujian" })}
                    required
                  >
                    <option value="kuis">Kuis Harian</option>
                    <option value="ujian">Ujian (UTS / UAS)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Durasi Pengerjaan (Menit) *
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={360}
                    className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                    value={form.durasi_menit}
                    onChange={(e) => setForm({ ...form, durasi_menit: Number(e.target.value) })}
                    required
                  />
                </div>
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
                  Status Publikasi *
                </label>
                <select
                  className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-blue-500 bg-white text-sm"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as "draft" | "aktif" | "selesai" })}
                  required
                >
                  <option value="draft">Draft (Belum Ditampilkan ke Siswa)</option>
                  <option value="aktif">Aktif (Sedang Berlangsung)</option>
                  <option value="selesai">Selesai (Ditutup)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Petunjuk & Informasi Evaluasi
                </label>
                <textarea
                  rows={3}
                  placeholder="Instruksi pengerjaan soal kuis/ujian..."
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


