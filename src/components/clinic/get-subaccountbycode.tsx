"use client";

import { useEffect, useState } from "react";
import {
    Banknote, AlertCircle, Loader2, RefreshCw,
    Copy, Check, BadgeCheck, BadgeX, ChevronRight,
} from "lucide-react";
import { getSubaccountByCode, type SubaccountByCodeData } from "@/libs/api/account";

function CopyButton({ value }: { value: string }) {
    const [copied, setCopied] = useState(false);
    function handleCopy() {
        navigator.clipboard.writeText(value).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }
    return (
        <button
            onClick={handleCopy}
            className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
            title="Copy"
        >
            {copied
                ? <Check size={12} className="text-emerald-500" />
                : <Copy size={12} className="text-slate-400" />
            }
        </button>
    );
}

type Props = {
    /** Pass the subaccount_code directly, e.g. from route params or parent state */
    subaccountCode: string;
};

export default function GetSubaccountByCode({ subaccountCode }: Props) {
    const [data, setData] = useState<SubaccountByCodeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    function load() {
        setLoading(true);
        setError(null);
        getSubaccountByCode(subaccountCode)
            .then(setData)
            .catch((err: Error) => setError(err.message))
            .finally(() => setLoading(false));
    }

    useEffect(() => { load(); }, [subaccountCode]);

    // ── Loading ───────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[40vh] sec-ff">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 size={22} className="text-emerald-500 animate-spin" />
                    <p className="text-[12px] text-slate-400">Fetching subaccount...</p>
                </div>
            </div>
        );
    }

    // ── Error ─────────────────────────────────────────────────────────────────
    if (error || !data) {
        const isUnauthorized = error?.toLowerCase().includes("unauthorized");
        return (
            <div className="flex items-center justify-center min-h-[40vh] px-4 sec-ff">
                <div className="w-full max-w-sm bg-white rounded-3xl border border-red-100 shadow-sm p-8 flex flex-col items-center text-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
                        <AlertCircle size={22} className="text-red-400" />
                    </div>
                    <div>
                        <p className="text-[15px] font-black text-slate-800">
                            {isUnauthorized ? "Access Denied" : "Failed to Load"}
                        </p>
                        <p className="text-[12px] text-slate-400 mt-1 leading-relaxed">
                            {isUnauthorized
                                ? "This subaccount doesn't belong to your clinic."
                                : error ?? "Could not retrieve subaccount details."
                            }
                        </p>
                    </div>
                    {!isUnauthorized && (
                        <button
                            onClick={load}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 text-white text-[12px] font-bold hover:bg-slate-900 transition-colors"
                        >
                            <RefreshCw size={13} /> Try Again
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // ── Data ──────────────────────────────────────────────────────────────────
    const topRows = [
        { label: "Business Name", value: data.clinicName },
        { label: "Bank", value: data.bank_name ?? data.settlement_bank ?? "—" },
        { label: "Account Number", value: data.account_number, copyable: true },
        { label: "Bank Code", value: data.bank_code },
        { label: "Charge Rate", value: `${data.percentage_charge}%` },
    ];

    const codeRows = [
        { label: "Subaccount Code", value: data.subaccount_code, copyable: true },
        ...(data.recipient_code
            ? [{ label: "Recipient Code", value: data.recipient_code, copyable: true }]
            : []),
    ];

    return (
        <div className="px-4 py-8 sec-ff">
            <div className="max-w-lg mx-auto space-y-5">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subaccount</p>
                            <ChevronRight size={10} className="text-slate-300" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate max-w-[140px]">
                                {subaccountCode}
                            </p>
                        </div>
                        <h2 className="text-xl font-black text-slate-800">Full Details</h2>
                    </div>
                    <button
                        onClick={load}
                        className="w-9 h-9 rounded-xl border border-slate-100 bg-white flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm"
                        title="Refresh"
                    >
                        <RefreshCw size={13} className="text-slate-500" />
                    </button>
                </div>

                {/* Hero card */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl px-6 py-5 flex items-center gap-4 shadow-md">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                        <Banknote size={22} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Business</p>
                        <p className="text-white font-black text-[15px] mt-0.5 truncate">{data.clinicName}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{data.bank_name ?? data.settlement_bank}</p>
                    </div>
                    <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 flex-shrink-0 ${data.is_verified ? "bg-emerald-500/20" : "bg-red-500/20"}`}>
                        {data.is_verified
                            ? <BadgeCheck size={12} className="text-emerald-400" />
                            : <BadgeX size={12} className="text-red-400" />
                        }
                        <span className={`text-[10px] font-black ${data.is_verified ? "text-emerald-400" : "text-red-400"}`}>
                            {data.is_verified ? "Verified" : "Unverified"}
                        </span>
                    </div>
                </div>

                {/* Business details */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-slate-50 bg-slate-50/60">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Business Details</p>
                    </div>
                    {topRows.map(({ label, value, copyable }) => (
                        <div key={label} className="flex items-center justify-between px-5 py-3.5 border-b border-slate-50 last:border-0">
                            <span className="text-[11px] text-slate-400">{label}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-[12px] font-semibold text-slate-700 font-mono">{value}</span>
                                {copyable && <CopyButton value={value} />}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Codes */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-slate-50 bg-slate-50/60">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Integration Codes</p>
                    </div>
                    {codeRows.map(({ label, value, copyable }) => (
                        <div key={label} className="flex items-center justify-between px-5 py-4 border-b border-slate-50 last:border-0">
                            <span className="text-[11px] text-slate-400">{label}</span>
                            <div className="flex items-center gap-2 min-w-0">
                                <span className="text-[11px] font-bold text-slate-700 font-mono truncate max-w-[160px] sm:max-w-none">
                                    {value}
                                </span>
                                {copyable && <CopyButton value={value} />}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charge notice */}
                <div className="flex items-start gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                    <p className="text-[12px] text-slate-500 leading-relaxed">
                        This subaccount is configured with a <strong className="text-slate-700">{data.percentage_charge}%</strong> charge rate. Payouts are settled directly to the linked bank account.
                    </p>
                </div>
            </div>
        </div>
    );
}