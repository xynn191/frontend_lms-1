"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type Guru = {
  id: number;
  user_id: number;
  nip: string;
  nama_lengkap: string;
  jenis_kelamin: "L" | "P";
  no_telepon: string;
  alamat: string;
  status: "aktif" | "nonaktif";
  email: string;
  username: string;
  mata_pelajaran_ids?: number[];
  mata_pelajaran?: string[];
};

type MataPelajaran = {
  id: number;
  kode_mapel: string;
  nama_mapel: string;
  kelompok: string;
  deskripsi: string;
};

export default function GuruPage() {
  const [data, setData] = useState<Guru[]>([]);
  const [mapelList, setMapelList] = useState<MataPelajaran[]>([]);
  const [form, setForm] = useState({
    nip: "",
    nama_lengkap: "",
    username: "",
    email: "",
    password: "",
    jenis_kelamin: "L" as "L" | "P",
    no_telepon: "",
    alamat: "",
    status: "aktif" as "aktif" | "nonaktif",
    mata_pelajaran_ids: [] as number[],
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/guru`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      });
      const json = await res.json();
      setData(json || []);
    } catch (e) {
      console.error(e);
      setError("Gagal memuat data guru");
    } finally {
      setLoading(false);
    }
  };

  const loadMapel = async () => {
    try {
      const res = await fetch(`${API_URL}/api/mata-pelajaran`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      });
      if (res.ok) {
        const json = await res.json();
        setMapelList(json || []);
      }
    } catch (e) {
      console.error("Gagal memuat mata pelajaran:", e);
    }
  };

  useEffect(() => {
    loadData();
    loadMapel();
  }, []);

  const openCreate = () => {
    setForm({
      nip: "",
      nama_lengkap: "",
      username: "",
      email: "",
      password: "",
      jenis_kelamin: "L",
      no_telepon: "",
      alamat: "",
      status: "aktif",
      mata_pelajaran_ids: [],
    });
    setEditingId(null);
    setError("");
    setIsOpen(true);
  };

  const openEdit = (item: Guru) => {
    setForm({
      nip: item.nip || "",
      nama_lengkap: item.nama_lengkap,
      username: item.username || "",
      email: item.email || "",
      password: "",
      jenis_kelamin: item.jenis_kelamin || "L",
      no_telepon: item.no_telepon || "",
      alamat: item.alamat || "",
      status: item.status || "aktif",
      mata_pelajaran_ids: item.mata_pelajaran_ids || [],
    });
    setEditingId(item.id);
    setError("");
    setIsOpen(true);
  };

  const handleAddMapel = (id: number) => {
    if (!id) return;
    if (!form.mata_pelajaran_ids.includes(id)) {
      setForm((prev) => ({
        ...prev,
        mata_pelajaran_ids: [...prev.mata_pelajaran_ids, id],
      }));
    }
  };

  const handleRemoveMapel = (id: number) => {
    setForm((prev) => ({
      ...prev,
      mata_pelajaran_ids: prev.mata_pelajaran_ids.filter((item) => item !== id),
    }));
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `${API_URL}/api/guru/${editingId}` : `${API_URL}/api/guru`;
    const method = editingId ? "PUT" : "POST";

    if (!editingId && !form.password) {
      setError("Password wajib diisi untuk guru baru");
      return;
    }

    if (form.mata_pelajaran_ids.length === 0) {
      setError("Minimal 1 mata pelajaran yang diampu wajib dipilih");
      return;
    }

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Gagal menyimpan data guru");
      }

      setMessage(editingId ? "Data guru berhasil diubah" : "Guru baru berhasil ditambahkan");
      setTimeout(() => setMessage(""), 3500);
      setIsOpen(false);
      loadData();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus guru ini beserta akun login-nya?")) return;
    try {
      const res = await fetch(`${API_URL}/api/guru/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      });
      if (!res.ok) throw new Error("Gagal menghapus guru");
      setMessage("Data guru berhasil dihapus");
      setTimeout(() => setMessage(""), 3500);
      loadData();
    } catch (e: any) {
      alert(e.message || "Gagal menghapus data guru");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-6xl mx-auto mt-6 text-slate-800 border border-slate-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1d3557]">Manajemen Guru</h1>
          <p className="text-xs text-slate-500 mt-1">Kelola data tenaga pendidik, mata pelajaran yang diampu, dan akun login pengajar</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-[#003399] hover:bg-blue-800 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition flex items-center gap-2 shadow-sm"
        >
          <span>+</span> Tambah Guru
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
              <th className="p-4 font-semibold">NIP</th>
              <th className="p-4 font-semibold">Nama Lengkap</th>
              <th className="p-4 font-semibold">Mata Pelajaran Diampu</th>
              <th className="p-4 font-semibold">Akun (Username / Email)</th>
              <th className="p-4 font-semibold">L/P</th>
              <th className="p-4 font-semibold">No. Telepon</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-500">Memuat data...</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-500">Belum ada data guru</td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition">
                  <td className="p-4 text-xs font-mono text-slate-600">
                    {item.nip || <span className="text-slate-400 italic">Tanpa NIP</span>}
                  </td>
                  <td className="p-4 font-semibold text-slate-800">{item.nama_lengkap}</td>
                  <td className="p-4">
                    {item.mata_pelajaran && item.mata_pelajaran.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 max-w-xs">
                        {item.mata_pelajaran.map((nama, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-[#003399] border border-blue-200"
                          >
                            📖 {nama}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs italic">Belum ada mapel</span>
                    )}
                  </td>
                  <td className="p-4 text-xs">
                    <p className="font-medium text-slate-800">{item.username}</p>
                    <p className="text-slate-500">{item.email}</p>
                  </td>
                  <td className="p-4 text-xs font-medium">
                    {item.jenis_kelamin === "L" ? "Laki-laki" : "Perempuan"}
                  </td>
                  <td className="p-4 text-xs text-slate-600">{item.no_telepon || "-"}</td>
                  <td className="p-4">
                    <span
                      className={`inline-block border px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        item.status === "aktif"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-red-50 text-red-600 border-red-200"
                      }`}
                    >
                      {item.status === "aktif" ? "Aktif" : "Nonaktif"}
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
            className="bg-white p-6 rounded-xl w-full max-w-xl shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150"
          >
            <h2 className="text-xl font-bold mb-5 text-[#1d3557] border-b pb-3">
              {editingId ? "Edit Data Guru" : "Tambah Guru Baru"}
            </h2>

            {error && (
              <div className="mb-4 p-2.5 bg-red-50 text-red-600 rounded-lg border border-red-200 text-xs">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Dra. Siti Rahmawati, M.Pd"
                  className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                  value={form.nama_lengkap}
                  onChange={(e) => setForm({ ...form, nama_lengkap: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  NIP
                </label>
                <input
                  type="text"
                  placeholder="Nomor Induk Pegawai"
                  className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                  value={form.nip}
                  onChange={(e) => setForm({ ...form, nip: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Jenis Kelamin *
                </label>
                <select
                  className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-blue-500 bg-white text-sm"
                  value={form.jenis_kelamin}
                  onChange={(e) => setForm({ ...form, jenis_kelamin: e.target.value as "L" | "P" })}
                  required
                >
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>

              {/* Pemilihan Mata Pelajaran yang Diampu (Multi-Select Badge) */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Mata Pelajaran yang Diampu *
                </label>
                
                <select
                  className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-blue-500 bg-white text-sm mb-2"
                  value=""
                  onChange={(e) => handleAddMapel(Number(e.target.value))}
                >
                  <option value="">+ Pilih Mata Pelajaran untuk Ditambahkan...</option>
                  {mapelList
                    .filter((m) => !form.mata_pelajaran_ids.includes(m.id))
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        [{m.kode_mapel}] {m.nama_mapel} ({m.kelompok})
                      </option>
                    ))}
                </select>

                {/* Badge Tag Mapel Terpilih */}
                <div className="min-h-[42px] p-2 bg-slate-50 border border-slate-200 rounded-lg flex flex-wrap gap-2 items-center">
                  {form.mata_pelajaran_ids.length === 0 ? (
                    <span className="text-xs text-amber-600 font-medium italic">
                      ⚠️ Belum ada mata pelajaran dipilih (Wajib pilih minimal 1 mata pelajaran)
                    </span>
                  ) : (
                    form.mata_pelajaran_ids.map((id) => {
                      const mapel = mapelList.find((m) => m.id === id);
                      return (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-[#003399] border border-blue-200 rounded-lg text-xs font-semibold shadow-2xs"
                        >
                          <span>📖 {mapel ? `${mapel.nama_mapel} (${mapel.kode_mapel})` : `Mapel #${id}`}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveMapel(id)}
                            className="w-4 h-4 rounded-full bg-blue-200 hover:bg-blue-300 text-[#003399] flex items-center justify-center font-bold text-xs transition"
                            title="Hapus mata pelajaran"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Username Akun *
                </label>
                <input
                  type="text"
                  placeholder="Username untuk login"
                  className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Email Akun *
                </label>
                <input
                  type="email"
                  placeholder="guru@educlass.com"
                  className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  {editingId ? "Password Baru (Opsional)" : "Password *"}
                </label>
                <input
                  type="password"
                  placeholder={editingId ? "Kosongkan jika tidak diubah" : "Minimal 6 karakter"}
                  className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  {...(!editingId ? { required: true } : {})}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  No. Telepon
                </label>
                <input
                  type="text"
                  placeholder="0812xxxxxxxx"
                  className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                  value={form.no_telepon}
                  onChange={(e) => setForm({ ...form, no_telepon: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Status Kepegawaian *
                </label>
                <select
                  className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-blue-500 bg-white text-sm"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as "aktif" | "nonaktif" })}
                  required
                >
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Alamat Rumah
                </label>
                <textarea
                  rows={2}
                  placeholder="Alamat domisili lengkap..."
                  className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm resize-none"
                  value={form.alamat}
                  onChange={(e) => setForm({ ...form, alamat: e.target.value })}
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
