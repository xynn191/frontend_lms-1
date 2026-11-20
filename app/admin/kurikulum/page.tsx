"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type Kurikulum = {
  id: number;
  user_id: number;
  nip: string;
  nama_lengkap: string;
  no_telepon: string;
  email: string;
  username: string;
};

export default function KurikulumPage() {
  const [data, setData] = useState<Kurikulum[]>([]);
  const [form, setForm] = useState({
    nip: "",
    nama_lengkap: "",
    username: "",
    email: "",
    password: "",
    no_telepon: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/kurikulum`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      });
      const json = await res.json();
      setData(json || []);
    } catch (e) {
      console.error(e);
      setError("Gagal memuat data kurikulum");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreate = () => {
    setForm({
      nip: "",
      nama_lengkap: "",
      username: "",
      email: "",
      password: "",
      no_telepon: "",
    });
    setEditingId(null);
    setError("");
    setIsOpen(true);
  };

  const openEdit = (item: Kurikulum) => {
    setForm({
      nip: item.nip || "",
      nama_lengkap: item.nama_lengkap,
      username: item.username || "",
      email: item.email || "",
      password: "",
      no_telepon: item.no_telepon || "",
    });
    setEditingId(item.id);
    setError("");
    setIsOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `${API_URL}/api/kurikulum/${editingId}` : `${API_URL}/api/kurikulum`;
    const method = editingId ? "PUT" : "POST";

    if (!editingId && !form.password) {
      setError("Password wajib diisi untuk staf kurikulum baru");
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
        throw new Error(text || "Gagal menyimpan data");
      }

      setMessage(editingId ? "Data kurikulum berhasil diubah" : "Staf kurikulum baru berhasil ditambahkan");
      setTimeout(() => setMessage(""), 3500);
      setIsOpen(false);
      loadData();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus staf kurikulum ini beserta akunnya?")) return;
    try {
      const res = await fetch(`${API_URL}/api/kurikulum/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
      });
      if (!res.ok) throw new Error("Gagal menghapus data");
      setMessage("Data staf kurikulum berhasil dihapus");
      setTimeout(() => setMessage(""), 3500);
      loadData();
    } catch (e: any) {
      alert(e.message || "Gagal menghapus data");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-6xl mx-auto mt-6 text-slate-800 border border-slate-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#003399]">Manajemen Tim Kurikulum</h1>
          <p className="text-xs text-slate-500 mt-1">Kelola data tim penanggung jawab kurikulum dan akun akses sistem</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-[#003399] hover:bg-blue-800 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition flex items-center gap-2 shadow-sm"
        >
          <span>+</span> Tambah Kurikulum
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
              <th className="p-4 font-semibold">Akun (Username / Email)</th>
              <th className="p-4 font-semibold">No. Telepon</th>
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
                <td colSpan={5} className="p-8 text-center text-slate-500">Belum ada data staf kurikulum</td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition">
                  <td className="p-4 text-xs font-mono text-slate-600">
                    {item.nip || <span className="text-slate-400 italic">Tanpa NIP</span>}
                  </td>
                  <td className="p-4 font-semibold text-slate-800">{item.nama_lengkap}</td>
                  <td className="p-4 text-xs">
                    <p className="font-medium text-slate-800">{item.username}</p>
                    <p className="text-slate-500">{item.email}</p>
                  </td>
                  <td className="p-4 text-xs text-slate-600">{item.no_telepon || "-"}</td>
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
            <h2 className="text-xl font-bold mb-5 text-[#003399] border-b pb-3">
              {editingId ? "Edit Staf Kurikulum" : "Tambah Staf Kurikulum"}
            </h2>

            {error && (
              <div className="mb-4 p-2.5 bg-red-50 text-red-600 rounded-lg border border-red-200 text-xs">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Rina Melati, S.Pd., M.M"
                  className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                  value={form.nama_lengkap}
                  onChange={(e) => setForm({ ...form, nama_lengkap: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Username *
                  </label>
                  <input
                    type="text"
                    placeholder="Username login"
                    className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Email *
                  </label>
                  <input
                    type="email"
                    placeholder="kurikulum@educlass.com"
                    className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  {editingId ? "Password Baru (Opsional)" : "Password *"}
                </label>
                <input
                  type="password"
                  placeholder={editingId ? "Kosongkan jika tidak ingin mengubah password" : "Minimal 6 karakter"}
                  className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  {...(!editingId ? { required: true } : {})}
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
