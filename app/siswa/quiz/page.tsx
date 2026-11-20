"use client";

import { useEffect, useState } from "react";

const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function Evaluasi({ tipe = "quiz" }: { tipe?: "quiz" | "ujian" }) {
  const [items, setItems] = useState<any[]>([]);
  const [detail, setDetail] = useState<any>(null);
  const [jawab, setJawab] = useState<Record<number, number>>({});
  const [msg, setMsg] = useState("");
  const headers = () => ({
    Authorization: `Bearer ${typeof window === "undefined" ? "" : localStorage.getItem("token") || ""}`,
  });
  const label = tipe === "quiz" ? "Quiz" : "Ujian";

  const load = async () => {
    const response = await fetch(`${api}/api/siswa/${tipe}`, { headers: headers() });
    const body = await response.json();
    if (!response.ok) { setItems([]); setMsg(body.message || `Gagal memuat ${label.toLowerCase()}`); return; }
    setItems(Array.isArray(body) ? body : []);
  };
  useEffect(() => { void load(); }, [tipe]);
  const open = async (id: number) => { const r = await fetch(`${api}/api/siswa/${tipe}/${id}`, { headers: headers() }); const body = await r.json(); if (r.ok) { setDetail(body); setJawab({}); } else setMsg(body.message || "Evaluasi tidak dapat dibuka"); };
  const submit = async () => { if (!detail || !confirm("Kirim jawaban? Jawaban tidak dapat diubah.")) return; const jawaban = Object.entries(jawab).map(([soal_id, pilihan_id]) => ({ soal_id: Number(soal_id), pilihan_id })); const r = await fetch(`${api}/api/siswa/${tipe}/${detail.id}/submit`, { method: "POST", headers: { ...headers(), "Content-Type": "application/json" }, body: JSON.stringify({ jawaban }) }); const body = await r.json(); setMsg(body.message || "Gagal mengirim jawaban"); if (r.ok) { setDetail(null); void load(); } };

  return <div><h1 className="text-2xl font-bold text-[#003399]">{label}</h1>{msg && <p className="mt-3 text-sm">{msg}</p>}{!detail && items.map(item => <div key={item.id} className="bg-white border rounded-xl p-4 mt-4"><b>{item.judul}</b><p className="text-sm">{item.deskripsi}</p><p className="text-xs text-slate-500">{item.mata_pelajaran} · {item.durasi_menit} menit · {item.progress}</p>{item.progress !== "selesai" && <button onClick={() => open(item.id)} className="mt-2 text-sm text-blue-700">Mulai</button>}</div>)}{!detail && !items.length && <p className="mt-4 text-sm text-slate-500">Belum ada {label.toLowerCase()} tersedia.</p>}{detail && <section className="mt-4"><h2 className="font-bold">{detail.judul}</h2><p className="text-sm">{detail.deskripsi}</p>{(detail.soal || []).map((soal: any, index: number) => <div key={soal.id} className="bg-white border rounded-xl p-4 mt-4"><b>{index + 1}. {soal.pertanyaan}</b>{(soal.pilihan || []).map((pilihan: any) => <label key={pilihan.id} className="block mt-2 text-sm"><input type="radio" name={`s${soal.id}`} onChange={() => setJawab({ ...jawab, [soal.id]: pilihan.id })} /> {pilihan.teks}</label>)}</div>)}<button onClick={submit} className="mt-5 bg-[#003399] text-white rounded px-4 py-2">Kirim jawaban</button></section>}</div>;
}
