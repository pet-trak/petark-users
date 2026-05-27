// src/components/clinic/get-visit-detail.tsx

"use client";

import { Visit } from "@/libs/api/clinic-visit";
import { Activity, Heart, Clock, FileText, UtensilsCrossed, Zap } from "lucide-react";
import Image from "next/image";

const STATUS_COLOR: Record<string, string> = {
    "in-progress": "bg-blue-50 text-blue-700 border-blue-200",
    completed: "bg-green-50 text-green-700 border-green-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
};

export default function VisitDetail({ visit }: { visit: Visit }) {
    const pill = STATUS_COLOR[visit.status] ?? "bg-gray-50 text-gray-600 border-gray-200";

    return (
        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden pry-ff">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shadow-sm shadow-blue-200">
                        <Activity size={16} className="text-white" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-800 leading-none">Visit Record</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Visit already created for this appointment</p>
                    </div>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold capitalize ${pill}`}>
                    {visit.status}
                </span>
            </div>

            <div className="p-6 space-y-5">
                {/* Visit ID + Date */}
                <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-mono font-semibold">#{visit._id.slice(0, 8).toUpperCase()}</span>
                    <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {new Date(visit.createdAt).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric",
                        })}
                    </span>
                </div>

                {/* Pet */}
                {visit.pet && (
                    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-emerald-100 to-green-200">
                            {visit.pet.photo ? (
                                <Image src={visit.pet.photo} alt={visit.pet.name} width={40} height={40} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Heart size={16} className="text-emerald-300" />
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-800">{visit.pet.name}</p>
                            <p className="text-xs text-slate-400 capitalize">{visit.pet.breed} · {visit.pet.age} yrs · {visit.pet.gender}</p>
                        </div>
                    </div>
                )}

                {/* Vitals */}
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Vitals</p>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { label: "Weight", value: visit.vitals.weight, unit: "kg" },
                            { label: "Temperature", value: visit.vitals.temp, unit: "°C" },
                            { label: "Pulse", value: visit.vitals.pulse, unit: "bpm" },
                            { label: "Respiration", value: visit.vitals.respiration, unit: "breaths/min" },
                        ].map(({ label, value, unit }) => (
                            <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">{label}</p>
                                <p className="text-sm font-bold text-slate-700">
                                    {value ?? "—"}
                                    <span className="ml-1 text-[10px] font-normal text-slate-400">{unit}</span>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Assessment */}
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Assessment</p>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                            <div className="flex items-center gap-1.5 mb-1">
                                <UtensilsCrossed size={11} className="text-slate-400" />
                                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Appetite</span>
                            </div>
                            <p className="text-sm font-semibold text-slate-700 capitalize">{visit.vitals.appetite || "—"}</p>
                        </div>
                        <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                            <div className="flex items-center gap-1.5 mb-1">
                                <Zap size={11} className="text-slate-400" />
                                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Activity</span>
                            </div>
                            <p className="text-sm font-semibold text-slate-700 capitalize">{visit.vitals.activity || "—"}</p>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                {visit.notes && (
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Clinical Notes</p>
                        <div className="flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                            <FileText size={13} className="text-slate-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-slate-600 leading-relaxed">{visit.notes}</p>
                        </div>
                    </div>
                )}

                {/* Billing */}
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Billing</p>
                    <div className="rounded-xl border border-slate-100 overflow-hidden">
                        {[
                            { label: "Professional Fee", value: visit.billing.professionalFee },
                            { label: "VAT", value: visit.billing.vat },
                        ].map(({ label, value }) => (
                            <div key={label} className="flex items-center justify-between px-4 py-2.5 border-b border-slate-50 last:border-0 bg-white">
                                <span className="text-xs text-slate-500">{label}</span>
                                <span className="text-xs font-semibold text-slate-700">₦{value.toLocaleString()}</span>
                            </div>
                        ))}
                        <div className="flex items-center justify-between px-4 py-3 bg-slate-50">
                            <span className="text-xs font-bold text-slate-700">Total</span>
                            <span className="text-sm font-extrabold text-emerald-600">₦{visit.billing.total.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="mt-2 flex justify-end">
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold capitalize ${visit.paymentStatus === "paid"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-yellow-50 text-yellow-700 border-yellow-200"
                            }`}>
                            {visit.paymentStatus}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}