"use client";

import { useEffect, useState } from "react";
import { getClinicVisits, Visit } from "@/libs/api/clinic-visit";
import VisitDetail from "@/components/clinic/get-visit-detail";
import {
    ChevronLeft, ChevronRight, Heart, Search,
    SlidersHorizontal, Thermometer, Weight, Activity, Zap,
} from "lucide-react";
import Image from "next/image";
import Spinner from "@/components/ui/spinner";

const FILTER_TABS = ["All Records", "Completed", "Upcoming", "Verified"];
const PER_PAGE = 8;

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function RecordsPage() {
    const [visits, setVisits] = useState<Visit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState("All Records");
    const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
    const [page, setPage] = useState(1);

    useEffect(() => {
        getClinicVisits()
            .then((data) => {
                setVisits(data);
                if (data.length > 0) setSelectedVisit(data[0]);
            })
            .catch((err) => setError(err?.message || "Failed to load visits"))
            .finally(() => setLoading(false));
    }, []);

    const latest = visits[0] ?? null;

    const filtered = visits.filter((v) => {
        if (activeFilter === "Completed") return v.status === "completed";
        if (activeFilter === "Upcoming") return v.status === "in-progress";
        return true;
    });

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen text-slate-400 text-sm sec-ff">
            <Spinner />
            <span className="ml-2">Loading visits...</span>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center min-h-screen text-red-400 text-sm sec-ff">
            {error}
        </div>
    );

    if (!visits.length) return (
        <div className="flex items-center justify-center min-h-screen text-slate-400 text-sm sec-ff">
            <Spinner />
            <span className="ml-2">No visits found.</span>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-[#f8f9fb] sec-ff">

            {/* ── Center ── */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Header */}
                <header className="bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-between gap-6">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Medical Records:</p>
                        <h1 className="text-[22px] font-black text-slate-800 leading-tight">{latest?.pet?.name ?? "—"}</h1>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 w-52">
                        <Search size={13} className="text-slate-400" />
                        <input className="bg-transparent text-[13px] text-slate-600 placeholder:text-slate-400 outline-none flex-1" placeholder="Search records..." />
                    </div>
                </header>

                <div className="flex-1 overflow-auto px-8 py-6 space-y-5">

                    {/* Latest Vitals */}
                    {latest && (
                        <section>
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Latest Vitals</p>
                                <p className="text-[11px] text-slate-400">Last updated: {formatDate(latest.createdAt)}</p>
                            </div>
                            <div className="grid grid-cols-4 gap-3">
                                {[
                                    { label: "Weight", value: latest.vitals.weight, unit: "kg", icon: <Weight size={14} />, sub: `${latest.vitals.weight > 30 ? "Above avg" : "Normal range"}`, subGreen: latest.vitals.weight <= 30 },
                                    { label: "Heart Rate", value: latest.vitals.pulse, unit: "bpm", icon: <Activity size={14} />, sub: latest.vitals.pulse > 120 ? "Elevated" : "Normal", subGreen: latest.vitals.pulse <= 120 },
                                    { label: "Temperature", value: latest.vitals.temp, unit: "°C", icon: <Thermometer size={14} />, sub: latest.vitals.temp > 39.5 ? "High" : "Normal Range", subGreen: latest.vitals.temp <= 39.5 },
                                    { label: "Activity", value: latest.vitals.activity, unit: "", icon: <Zap size={14} />, sub: latest.vitals.appetite, subGreen: latest.vitals.appetite === "good" },
                                ].map((v) => (
                                    <div key={v.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[11px] font-semibold text-slate-500">{v.label}</span>
                                            <span className="text-slate-400">{v.icon}</span>
                                        </div>
                                        <p className="text-2xl font-black text-slate-800 leading-none capitalize">
                                            {typeof v.value === "number" ? v.value : v.value}
                                            {typeof v.value === "number" && (
                                                <span className="text-[11px] font-semibold text-slate-400 ml-1">{v.unit}</span>
                                            )}
                                        </p>
                                        <p className={`text-[11px] font-semibold mt-1.5 capitalize ${v.subGreen ? "text-emerald-500" : "text-amber-500"}`}>{v.sub}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Records Table */}
                    <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        {/* Filter bar */}
                        <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-slate-50">
                            <div className="flex items-center gap-2">
                                {FILTER_TABS.map((tab) => (
                                    <button key={tab} onClick={() => { setActiveFilter(tab); setPage(1); }}
                                        className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-colors ${activeFilter === tab ? "bg-emerald-500 text-white shadow shadow-emerald-200" : "text-slate-500 hover:bg-slate-50"}`}>
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <button className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors">
                                <SlidersHorizontal size={12} />Sort by: Newest First
                            </button>
                        </div>

                        {/* Column headers */}
                        <div className="grid grid-cols-[200px_1fr_1fr] gap-4 px-6 py-3 bg-slate-50/60">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date &amp; Service</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pet / Status</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Summary Findings</p>
                        </div>

                        {/* Rows */}
                        {paginated.map((visit) => (
                            <button key={visit._id} onClick={() => setSelectedVisit(visit)}
                                className={`w-full text-left grid grid-cols-[200px_1fr_1fr] gap-4 px-6 py-4 border-b border-slate-50 last:border-0 hover:bg-emerald-50/30 transition-colors ${selectedVisit?._id === visit._id ? "bg-emerald-50/50" : ""}`}>
                                <div>
                                    <p className="text-[13px] font-semibold text-slate-700">{formatDate(visit.createdAt)}</p>
                                    <span className={`inline-flex items-center gap-1 mt-1 text-[10px] font-bold capitalize px-2 py-0.5 rounded-full ${visit.status === "completed" ? "bg-emerald-50 text-emerald-600" :
                                            visit.status === "in-progress" ? "bg-blue-50 text-blue-600" :
                                                "bg-red-50 text-red-500"
                                        }`}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                        {visit.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-emerald-100 to-green-200 flex items-center justify-center">
                                        {visit.pet?.photo
                                            ? <Image src={visit.pet.photo} alt={visit.pet.name} width={32} height={32} className="w-full h-full object-cover" />
                                            : <Heart size={13} className="text-emerald-400" />}
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-semibold text-slate-700">{visit.pet?.name ?? "—"}</p>
                                        <p className="text-[11px] text-slate-400 capitalize">{visit.pet?.breed}</p>
                                    </div>
                                </div>
                                <p className="text-[13px] text-slate-500 truncate self-center">
                                    {visit.notes ?? `Wt: ${visit.vitals.weight}kg · Temp: ${visit.vitals.temp}°C · Pulse: ${visit.vitals.pulse}bpm`}
                                </p>
                            </button>
                        ))}

                        {/* Pagination */}
                        <div className="px-6 py-4 flex items-center justify-between border-t border-slate-50">
                            <p className="text-[11px] text-slate-400">Showing {paginated.length} of {filtered.length} records</p>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                    className="w-8 h-8 rounded-lg border border-slate-100 bg-white flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 transition-colors">
                                    <ChevronLeft size={13} className="text-slate-500" />
                                </button>
                                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0}
                                    className="w-8 h-8 rounded-lg border border-slate-100 bg-white flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 transition-colors">
                                    <ChevronRight size={13} className="text-slate-500" />
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {/* ── Right Panel ── */}
            <aside className="w-[280px] flex-shrink-0 border-l border-slate-100 bg-white px-5 py-7 flex flex-col gap-6 overflow-auto">

                {/* Pet Summary */}
                <section>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Pet Summary</p>
                    {latest?.pet ? (
                        <div className="flex flex-col items-center text-center gap-3">
                            <div className="w-[88px] h-[88px] rounded-full overflow-hidden border-4 border-emerald-100 shadow-md bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                                {latest.pet.photo
                                    ? <Image src={latest.pet.photo} alt={latest.pet.name} width={88} height={88} className="w-full h-full object-cover" />
                                    : <Heart size={28} className="text-amber-400" />}
                            </div>
                            <div>
                                <p className="text-lg font-black text-slate-800">{latest.pet.name}</p>
                                <p className="text-[12px] text-slate-400">{latest.pet.breed} • {latest.pet.age} yrs</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 rounded-full bg-slate-100 text-[9px] font-black text-slate-600 uppercase tracking-widest capitalize">{latest.pet.gender}</span>
                                <span className="px-3 py-1 rounded-full bg-slate-100 text-[9px] font-black text-slate-600 uppercase tracking-widest capitalize">{latest.pet.species}</span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-[12px] text-slate-400 text-center">No pet data</p>
                    )}
                </section>

                {/* Visit Detail */}
                {selectedVisit && (
                    <section className="flex-1 overflow-auto">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Visit Detail</p>
                        <VisitDetail visit={selectedVisit} />
                    </section>
                )}

                {/* Premium upsell */}
                <div className="rounded-2xl bg-slate-800 text-white p-4 flex flex-col gap-3">
                    <div>
                        <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Premium Plan</p>
                        <p className="text-[13px] font-semibold mt-1 text-slate-200 leading-snug">Unlimited records and priority vet chat.</p>
                    </div>
                    <button className="w-full rounded-xl bg-white text-slate-800 text-[13px] font-bold py-2.5 hover:bg-slate-100 transition-colors">
                        Upgrade Now
                    </button>
                </div>
            </aside>
        </div>
    );
}