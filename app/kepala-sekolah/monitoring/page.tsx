"use client";

import { useEffect, useState, useMemo } from "react";

export default function KepalaSekolahMonitoringPage() {
  const [activeSubTab, setActiveSubTab] = useState<"nilai" | "evaluasi" | "tugas">("nilai");
  const [loading, setLoading] = useState(true);
  const [selectedKelas, setSelectedKelas] = useState("all");
  const [selectedMapel, setSelectedMapel] = useState("all");
  const [selectedItemDetail, setSelectedItemDetail] = useState<any>(null);

  // Data Nilai Siswa
  const [nilaiList, setNilaiList] = useState<any[]>([]);
  // Data Kuis & Ujian
  const [evaluasiList, setEvaluasiList] = useState<any[]>([]);
  // Data Tugas & Kepatuhan
  const [tugasList, setTugasList] = useState<any[]>([]);

  useEffect(() => {
    fetchMonitoringData();
  }, []);

  const fetchMonitoringData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      // 1. Fetch Nilai
      const resNilai = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/kurikulum/nilai`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resNilai.ok) {
        const d = await resNilai.json();
        setNilaiList(d.nilai || []);
      }

      // 2. Fetch Monitoring Evaluasi & Tugas
      const resMon = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/kurikulum/monitoring`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resMon.ok) {
        const d = await resMon.json();
        setEvaluasiList(d.evaluasi || []);
        setTugasList(d.tugas || []);
      }
    } catch (err) {
      console.warn("Using fallback monitoring data:", err);
      // Fallback Nilai
      setNilaiList([
        {
          siswa_id: 1,
          nis: "10245678",
          nama_siswa: "Dewi Nur Azizah",
          kelas: "XI PPLG 1",
          mapel: "Pemrograman Web & Basis Data",
          nilai_tugas: 88,
          nilai_kuis: 85,
          nilai_ujian: 90,
          nilai_akhir: 87.9,
          predikat: "A",
          status_kkm: "Tuntas",
        },
        {
          siswa_id: 2,
          nis: "10245679",
          nama_siswa: "Ahmad Rizky Pratama",
          kelas: "XI PPLG 1",
          mapel: "Pemrograman Web & Basis Data",
          nilai_tugas: 80,
          nilai_kuis: 78,
          nilai_ujian: 82,
          nilai_akhir: 80.2,
          predikat: "B",
          status_kkm: "Tuntas",
        },
        {
          siswa_id: 3,
          nis: "10245680",
          nama_siswa: "Bagas Maulana",
          kelas: "XI PPLG 2",
          mapel: "Basis Data",
          nilai_tugas: 75,
          nilai_kuis: 70,
          nilai_ujian: 76,
          nilai_akhir: 73.9,
          predikat: "C",
          status_kkm: "Belum Tuntas",
        },
        {
          siswa_id: 4,
          nis: "10245681",
          nama_siswa: "Citra Anggraini",
          kelas: "X PPLG 1",
          mapel: "Dasar Pemrograman",
          nilai_tugas: 92,
          nilai_kuis: 90,
          nilai_ujian: 94,
          nilai_akhir: 92.2,
          predikat: "A",
          status_kkm: "Tuntas",
        },
      ]);

      // Fallback Evaluasi Kuis & Ujian
      setEvaluasiList([
        {
          id: 1,
          tipe: "kuis",
          judul: "Kuis Formatif Bab 1 - Struktur JSON & REST API",
          mapel: "Pemrograman Web",
          guru: "Budi Santoso, S.Kom.",
          kelas: "XI PPLG 1, XI PPLG 2",
          durasi: "45 Menit",
          total_soal: 15,
          rata_nilai: 82.5,
          status: "Selesai",
        },
        {
          id: 2,
          tipe: "ujian",
          judul: "Ujian Sumatif Tengah Semester - Basis Data Relasional",
          mapel: "Basis Data",
          guru: "Budi Santoso, S.Kom.",
          kelas: "XI PPLG 1, XI PPLG 2",
          durasi: "90 Menit",
          total_soal: 30,
          rata_nilai: 80.4,
          status: "Aktif",
        },
        {
          id: 3,
          tipe: "kuis",
          judul: "Kuis Harian - Konsep OOP Inheritance",
          mapel: "Pemrograman Berorientasi Objek",
          guru: "Siti Rahmawati, M.Kom.",
          kelas: "XI PPLG 1",
          durasi: "30 Menit",
          total_soal: 10,
          rata_nilai: 85.0,
          status: "Selesai",
        },
      ]);

      // Fallback Tugas
      setTugasList([
        {
          id: 1,
          judul: "Pembuatan Endpoint REST API dengan Golang",
          mapel: "Pemrograman Web",
          guru: "Budi Santoso, S.Kom.",
          kelas: "XI PPLG 1",
          deadline: "25 Nov 2026, 23:59",
          total_siswa: 30,
          mengumpulkan: 28,
          belum_mengumpulkan: 2,
          persentase: 93.3,
        },
        {
          id: 2,
          judul: "Desain Skema ERD Toko Online (Normalisasi 3NF)",
          mapel: "Basis Data",
          guru: "Budi Santoso, S.Kom.",
          kelas: "XI PPLG 2",
          deadline: "22 Nov 2026, 23:59",
          total_siswa: 28,
          mengumpulkan: 24,
          belum_mengumpulkan: 4,
          persentase: 85.7,
        },
        {
          id: 3,
          judul: "Praktik Class dan Interface Kendaraan",
          mapel: "Pemrograman Berorientasi Objek",
          guru: "Siti Rahmawati, M.Kom.",
          kelas: "XI PPLG 1",
          deadline: "20 Nov 2026, 17:00",
          total_siswa: 30,
          mengumpulkan: 30,
          belum_mengumpulkan: 0,
          persentase: 100,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Filtered Nilai
  const filteredNilai = useMemo(() => {
    return nilaiList.filter((n) => {
      const matchK = selectedKelas === "all" || n.kelas === selectedKelas;
      const matchM = selectedMapel === "all" || n.mapel?.includes(selectedMapel);
      return matchK && matchM;
    });
  }, [nilaiList, selectedKelas, selectedMapel]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[11px] font-bold text-[#003399] mb-2">
            <span>📈</span>
            <span>Pengawasan Mutu & Hasil Asesmen (Read-Only)</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            Monitoring Perkembangan Akademik
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pantau rekapitulasi nilai akhir, statistik kuis & ujian CBT, serta tingkat kepatuhan pengumpulan tugas siswa.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 rounded-2xl bg-slate-100 border border-slate-200 shrink-0">
          <button
            onClick={() => setActiveSubTab("nilai")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeSubTab === "nilai"
                ? "bg-[#003399] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🎯 Rekap Nilai Siswa
          </button>
          <button
            onClick={() => setActiveSubTab("evaluasi")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeSubTab === "evaluasi"
                ? "bg-[#003399] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            ⏱️ Kuis & Ujian CBT
          </button>
          <button
            onClick={() => setActiveSubTab("tugas")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              activeSubTab === "tugas"
                ? "bg-[#003399] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            📝 Kepatuhan Tugas
          </button>
        </div>
      </div>

      {/* ================= TAB 1: REKAP NILAI SISWA ================= */}
      {activeSubTab === "nilai" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-bold text-slate-600">Filter Rombel:</span>
              <select
                value={selectedKelas}
                onChange={(e) => setSelectedKelas(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-semibold focus:outline-none focus:border-[#003399]"
              >
                <option value="all">Semua Rombel Kelas</option>
                <option value="X PPLG 1">X PPLG 1</option>
                <option value="XI PPLG 1">XI PPLG 1</option>
                <option value="XI PPLG 2">XI PPLG 2</option>
                <option value="XII PPLG 1">XII PPLG 1</option>
              </select>

              <span className="font-bold text-slate-600 ml-2">Mata Pelajaran:</span>
              <select
                value={selectedMapel}
                onChange={(e) => setSelectedMapel(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-semibold focus:outline-none focus:border-[#003399]"
              >
                <option value="all">Semua Mata Pelajaran</option>
                <option value="Pemrograman Web">Pemrograman Web</option>
                <option value="Basis Data">Basis Data</option>
                <option value="Dasar Pemrograman">Dasar Pemrograman</option>
              </select>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
              <span>✓ Standar KKM Sekolah: 75.0</span>
            </div>
          </div>

          {/* Table Nilai */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                    <th className="py-3.5 px-4 w-12 text-center">No</th>
                    <th className="py-3.5 px-4">Nama Siswa</th>
                    <th className="py-3.5 px-4">Kelas</th>
                    <th className="py-3.5 px-4">Mata Pelajaran</th>
                    <th className="py-3.5 px-3 text-center">Tugas (30%)</th>
                    <th className="py-3.5 px-3 text-center">Kuis (30%)</th>
                    <th className="py-3.5 px-3 text-center">Ujian (40%)</th>
                    <th className="py-3.5 px-4 text-center font-black text-[#003399]">Nilai Akhir</th>
                    <th className="py-3.5 px-3 text-center">Predikat</th>
                    <th className="py-3.5 px-4 text-center">Status KKM</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredNilai.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 text-center text-slate-400 font-medium">{idx + 1}</td>
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-800">{item.nama_siswa}</p>
                        <p className="text-[10px] text-slate-400 font-mono">NIS: {item.nis}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                          {item.kelas}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">{item.mapel}</td>
                      <td className="py-3 px-3 text-center font-semibold text-slate-700">{item.nilai_tugas}</td>
                      <td className="py-3 px-3 text-center font-semibold text-slate-700">{item.nilai_kuis}</td>
                      <td className="py-3 px-3 text-center font-semibold text-slate-700">{item.nilai_ujian}</td>
                      <td className="py-3 px-4 text-center font-black text-sm text-[#003399]">
                        {item.nilai_akhir}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-slate-700">{item.predikat}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          item.status_kkm === "Tuntas"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}>
                          {item.status_kkm}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: KUIS & UJIAN CBT ================= */}
      {activeSubTab === "evaluasi" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {evaluasiList.map((ev) => (
              <div
                key={ev.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      ev.tipe === "ujian"
                        ? "bg-amber-50 text-amber-800 border border-amber-200"
                        : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    }`}>
                      {ev.tipe === "ujian" ? "Ujian CBT Semester" : "Kuis Formatif"}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">⏱️ {ev.durasi}</span>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-800 leading-snug">
                    {ev.judul}
                  </h3>
                  <p className="text-[11px] text-[#003399] font-bold mt-1">{ev.mapel}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Guru: {ev.guru}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Kelas: {ev.kelas}</p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <p className="text-[10px] text-slate-400">Total Soal</p>
                      <p className="font-extrabold text-slate-800">{ev.total_soal} Butir</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400">Rata-rata Nilai</p>
                      <p className="font-extrabold text-[#003399]">{ev.rata_nilai || 82.5}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedItemDetail(ev)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-[#003399] text-slate-700 hover:text-white font-bold text-xs transition"
                  >
                    Pratinjau Butir Soal &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 3: KEPATUHAN TUGAS ================= */}
      {activeSubTab === "tugas" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tugasList.map((tugas) => (
              <div
                key={tugas.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      Penugasan Siswa
                    </span>
                    <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                      Deadline: {tugas.deadline}
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-800 leading-snug">
                    {tugas.judul}
                  </h3>
                  <p className="text-[11px] text-[#003399] font-bold mt-1">{tugas.mapel}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Guru: {tugas.guru}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Rombel: {tugas.kelas}</p>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600">Tingkat Pengumpulan:</span>
                      <span className="font-extrabold text-[#003399]">{tugas.persentase}%</span>
                    </div>
                    {/* Progress */}
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-600 h-2 rounded-full"
                        style={{ width: `${tugas.persentase}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                      <span>✓ {tugas.mengumpulkan} Mengumpulkan</span>
                      <span className="text-rose-600">✗ {tugas.belum_mengumpulkan} Belum</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedItemDetail(tugas)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-[#003399] text-slate-700 hover:text-white font-bold text-xs transition"
                  >
                    Detail Penugasan &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= MODAL DETAIL / PRATINJAU ================= */}
      {selectedItemDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-[#003399] bg-blue-50 px-2 py-0.5 rounded-md uppercase">
                  {selectedItemDetail.tipe || "Penugasan"}
                </span>
                <h3 className="text-base font-extrabold text-slate-800 mt-1">
                  {selectedItemDetail.judul}
                </h3>
              </div>
              <button
                onClick={() => setSelectedItemDetail(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Mata Pelajaran:</span>
                  <span className="font-bold text-slate-800">{selectedItemDetail.mapel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Guru Pendidik:</span>
                  <span className="font-bold text-[#003399]">{selectedItemDetail.guru}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rombel Sasaran:</span>
                  <span className="font-semibold text-slate-700">{selectedItemDetail.kelas}</span>
                </div>
              </div>

              {selectedItemDetail.total_soal && (
                <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2">
                  <p className="font-bold text-[#003399]">Konfigurasi Soal CBT:</p>
                  <p className="text-slate-600 leading-relaxed">
                    Ujian ini memuat <b>{selectedItemDetail.total_soal} butir soal pilihan ganda & esai</b> berbobot akademik resmi. Seluruh butir soal telah diverifikasi oleh tim kurikulum sekolah.
                  </p>
                </div>
              )}

              {selectedItemDetail.deadline && (
                <div className="p-3.5 rounded-2xl bg-slate-50 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Batas Waktu:</span>
                    <span className="font-bold text-rose-600">{selectedItemDetail.deadline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tingkat Penyelesaian:</span>
                    <span className="font-bold text-emerald-600">{selectedItemDetail.mengumpulkan} dari {selectedItemDetail.total_siswa} Siswa</span>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedItemDetail(null)}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
            >
              Tutup Pratinjau
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
