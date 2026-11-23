"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type NilaiSiswa = {
  id: number;
  siswa_id: number;
  nis: string;
  nama_siswa: string;
  kelas_id: number;
  nama_kelas: string;
  mata_pelajaran_id: number;
  nama_mapel: string;
  nilai_tugas: number;
  nilai_kuis: number;
  nilai_ujian: number;
  nilai_akhir: number;
  catatan: string;
};

type OptionItem = {
  id: number;
  nama: string;
};

export default function GuruNilaiPage() {
  const searchParams = useSearchParams();
  const initialKelas = searchParams.get("kelas_id") || "3";
  const initialMapel = searchParams.get("mapel_id") || "5";

  const [selectedKelas, setSelectedKelas] = useState(initialKelas);
  const [selectedMapel, setSelectedMapel] = useState(initialMapel);
  const [kelasList, setKelasList] = useState<OptionItem[]>([]);
  const [mapelList, setMapelList] = useState<OptionItem[]>([]);
  const [data, setData] = useState<NilaiSiswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadOptions = async () => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem("token") || ""}` };
      const [kRes, mRes] = await Promise.all([
        fetch(`${API_URL}/api/kelas`, { headers }),
        fetch(`${API_URL}/api/guru/mata-pelajaran`, { headers }),
      ]);
      const kJson = await kRes.json();
      const mJson = await mRes.json();
      setKelasList(kJson?.map((k: any) => ({ id: k.id, nama: k.nama_kelas })) || []);
      setMapelList(mJson?.map((m: any) => ({ id: m.id, nama: m.nama_mapel })) || []);
    } catch (e) {
      console.error(e);
    }
  };

  const loadNilai = async () => {
    try {
      setLoading(true);
      setError("");
      const headers = { Authorization: `Bearer ${localStorage.getItem("token") || ""}` };
      const res = await fetch(`${API_URL}/api/guru/nilai?kelas_id=${selectedKelas}&mapel_id=${selectedMapel}`, {
        headers,
      });
      if (!res.ok) throw new Error("Gagal mengambil data nilai siswa");
      const json = await res.json();
      setData(json || []);
    } catch (e: any) {
      setError(e.message || "Gagal memuat nilai siswa");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOptions();
  }, []);

  useEffect(() => {
    if (selectedKelas && selectedMapel) {
      loadNilai();
    }
  }, [selectedKelas, selectedMapel]);

  const updateItem = (siswaId: number, field: "nilai_tugas" | "nilai_kuis" | "nilai_ujian" | "catatan", val: any) => {
    setData((prev) =>
      prev.map((item) => {
        if (item.siswa_id === siswaId) {
          const updated = { ...item, [field]: val };
          // Hitung realtime nilai akhir: 30% tugas, 30% kuis, 40% ujian
          const t = Number(updated.nilai_tugas || 0);
          const k = Number(updated.nilai_kuis || 0);
          const u = Number(updated.nilai_ujian || 0);
          updated.nilai_akhir = Number(((t * 0.3) + (k * 0.3) + (u * 0.4)).toFixed(2));
          return updated;
        }
        return item;
      })
    );
  };

  const saveSingle = async (item: NilaiSiswa) => {
    try {
      setSavingId(item.siswa_id);
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      };

      const res = await fetch(`${API_URL}/api/guru/nilai`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          siswa_id: item.siswa_id,
          kelas_id: Number(selectedKelas),
          mata_pelajaran_id: Number(selectedMapel),
          nilai_tugas: Number(item.nilai_tugas || 0),
          nilai_kuis: Number(item.nilai_kuis || 0),
          nilai_ujian: Number(item.nilai_ujian || 0),
          catatan: item.catatan || "",
        }),
      });

      if (!res.ok) throw new Error("Gagal menyimpan nilai");
      setMessage(`Nilai ${item.nama_siswa} berhasil disimpan!`);
      setTimeout(() => setMessage(""), 3000);
    } catch (e: any) {
      alert(e.message || "Gagal menyimpan nilai");
    } finally {
      setSavingId(null);
    }
  };

  const getPredikat = (na: number) => {
    if (na >= 85) return { label: "A (Sangat Baik)", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
    if (na >= 75) return { label: "B (Baik)", color: "text-blue-700 bg-blue-50 border-blue-200" };
    if (na >= 65) return { label: "C (Cukup)", color: "text-amber-700 bg-amber-50 border-amber-200" };
    return { label: "D (Kurang)", color: "text-red-700 bg-red-50 border-red-200" };
  };

  return (
    <div className="bg-white rounded-xl shadow-xs p-6 max-w-6xl mx-auto text-slate-800 border border-slate-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1d3557]">Rekap Nilai Siswa</h1>
          <p className="text-xs text-slate-500 mt-1">
            Input & kelola nilai tugas (30%), kuis (30%), dan ujian (40%) untuk siswa Anda
          </p>
        </div>
        <div className="text-xs bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-lg font-medium">
          🔒 Aturan: Nilai ini hanya dapat diakses oleh Guru & Admin (disembunyikan dari Siswa)
        </div>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 text-sm flex items-center gap-2">
          <span>✓</span> {message}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg border border-red-200 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Filter Rombel & Mata Pelajaran */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            Pilih Kelas *
          </label>
          <select
            className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-blue-500 bg-white text-sm"
            value={selectedKelas}
            onChange={(e) => setSelectedKelas(e.target.value)}
          >
            {kelasList.map((k) => (
              <option key={k.id} value={k.id}>
                {k.nama}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
            Pilih Mata Pelajaran *
          </label>
          <select
            className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:border-blue-500 bg-white text-sm"
            value={selectedMapel}
            onChange={(e) => setSelectedMapel(e.target.value)}
          >
            {mapelList.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nama}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabel Input Nilai Siswa */}
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs">
              <th className="p-4 font-semibold">Siswa</th>
              <th className="p-4 font-semibold w-28 text-center">Tugas (30%)</th>
              <th className="p-4 font-semibold w-28 text-center">Kuis (30%)</th>
              <th className="p-4 font-semibold w-28 text-center">Ujian (40%)</th>
              <th className="p-4 font-semibold text-center">Nilai Akhir</th>
              <th className="p-4 font-semibold text-center">Predikat</th>
              <th className="p-4 font-semibold">Catatan Guru</th>
              <th className="p-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-500">Memuat siswa dan nilai...</td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-500">
                  Tidak ada data siswa terdaftar di kelas ini
                </td>
              </tr>
            ) : (
              data.map((item) => {
                const pred = getPredikat(item.nilai_akhir || 0);
                return (
                  <tr key={item.siswa_id} className="border-b border-slate-100 hover:bg-slate-50/80 transition">
                    <td className="p-4">
                      <p className="font-bold text-slate-800">{item.nama_siswa}</p>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">NIS: {item.nis}</p>
                    </td>

                    <td className="p-4 text-center">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step="0.1"
                        className="w-20 text-center border border-slate-300 p-1.5 rounded-md outline-none focus:border-blue-500 text-sm font-semibold"
                        value={item.nilai_tugas ?? 0}
                        onChange={(e) => updateItem(item.siswa_id, "nilai_tugas", parseFloat(e.target.value) || 0)}
                      />
                    </td>

                    <td className="p-4 text-center">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step="0.1"
                        className="w-20 text-center border border-slate-300 p-1.5 rounded-md outline-none focus:border-blue-500 text-sm font-semibold"
                        value={item.nilai_kuis ?? 0}
                        onChange={(e) => updateItem(item.siswa_id, "nilai_kuis", parseFloat(e.target.value) || 0)}
                      />
                    </td>

                    <td className="p-4 text-center">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step="0.1"
                        className="w-20 text-center border border-slate-300 p-1.5 rounded-md outline-none focus:border-blue-500 text-sm font-semibold"
                        value={item.nilai_ujian ?? 0}
                        onChange={(e) => updateItem(item.siswa_id, "nilai_ujian", parseFloat(e.target.value) || 0)}
                      />
                    </td>

                    <td className="p-4 text-center font-bold text-base text-[#1d3557]">
                      {item.nilai_akhir ?? 0}
                    </td>

                    <td className="p-4 text-center">
                      <span className={`inline-block border px-2 py-0.5 rounded-md text-[11px] font-bold ${pred.color}`}>
                        {pred.label}
                      </span>
                    </td>

                    <td className="p-4">
                      <input
                        type="text"
                        placeholder="Catatan perkembangan..."
                        className="w-full border border-slate-300 p-1.5 rounded-md outline-none focus:border-blue-500 text-xs"
                        value={item.catatan || ""}
                        onChange={(e) => updateItem(item.siswa_id, "catatan", e.target.value)}
                      />
                    </td>

                    <td className="p-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => saveSingle(item)}
                        disabled={savingId === item.siswa_id}
                        className="bg-[#003399] hover:bg-blue-800 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-xs"
                      >
                        {savingId === item.siswa_id ? "Menyimpan..." : "Simpan Nilai"}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


