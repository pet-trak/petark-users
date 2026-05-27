"use client";

import { useEffect, useState } from "react";
import {
    Banknote, CheckCircle2, AlertCircle, Loader2,
    ShieldOff, Copy, Check, RefreshCw, Building2, CreditCard, Hash,
} from "lucide-react";
import { getSubaccount, getSubaccountByCode, type SubaccountData, type SubaccountByCodeData } from "@/libs/api/account";

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
            className="p-1 rounded-lg hover:bg-slate-100 transition-colors flex-shrink-0"
            title="Copy to clipboard"
        >
            {copied
                ? <Check size={12} className="text-emerald-500" />
                : <Copy size={12} className="text-slate-400" />
            }
        </button>
    );
}

export default function GetSubaccount() {
    const [summary, setSummary] = useState<SubaccountData | null>(null);
    const [details, setDetails] = useState<SubaccountByCodeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    function load() {
        setLoading(true);
        setError(null);
        getSubaccount()
            .then(async (data) => {
                setSummary(data);
                if (data.has_subaccount && data.subaccount_code) {
                    const full = await getSubaccountByCode(data.subaccount_code);
                    setDetails(full);
                }
            })
            .catch((err: Error) => setError(err.message))
            .finally(() => setLoading(false));
    }

    useEffect(() => { load(); }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[40vh] sec-ff">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 size={22} className="text-emerald-500 animate-spin" />
                    <p className="text-[12px] text-slate-400">Loading payout account...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[40vh] px-4 sec-ff">
                <div className="w-full max-w-sm bg-white rounded-3xl border border-red-100 shadow-sm p-8 flex flex-col items-center text-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
                        <AlertCircle size={22} className="text-red-400" />
                    </div>
                    <div>
                        <p className="text-[15px] font-black text-slate-800">Something went wrong</p>
                        <p className="text-[12px] text-slate-400 mt-1">{error}</p>
                    </div>
                    <button onClick={load} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 text-white text-[12px] font-bold hover:bg-slate-900 transition-colors">
                        <RefreshCw size={13} /> Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!summary?.has_subaccount) {
        return (
            <div className="flex items-center justify-center min-h-[40vh] px-4 sec-ff">
                <div className="w-full max-w-sm bg-white rounded-3xl border border-slate-100 shadow-sm p-8 flex flex-col items-center text-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center">
                        <ShieldOff size={24} className="text-slate-400" />
                    </div>
                    <div>
                        <p className="text-[16px] font-black text-slate-800">No Payout Account Yet</p>
                        <p className="text-[13px] text-slate-400 mt-1.5 leading-relaxed">
                            You haven't set up a payout account yet. Create one to start receiving payments.
                        </p>
                    </div>
                    <a href="/clinic/dashboard/account" className="w-full rounded-xl bg-emerald-500 text-white text-[13px] font-bold py-3 hover:bg-emerald-600 transition-colors text-center shadow shadow-emerald-100">
                        Create Payout Account
                    </a>
                </div>
            </div>
        );
    }

    // ── Log details to confirm what Paystack actually returns ─────────────────
    console.log('Subaccount details from Paystack:', details);

    const rows = [
        {
            label: "Clinic Name",
            value: details?.clinicName ?? "—",  // ✅ business_name not clinicName
            icon: <Building2 size={14} className="text-slate-400" />,
            copyable: false,
        },
        {
            label: "Bank",
            value: details?.bank_name ?? details?.settlement_bank ?? "—",
            icon: <Hash size={14} className="text-slate-400" />,
            copyable: false,
        },
        {
            label: "Account Number",
            value: details?.account_number ?? "—",
            icon: <CreditCard size={14} className="text-slate-400" />,
            copyable: !!details?.account_number,
        },
    ];

    return (
        <div className="px-4 py-8 sec-ff">
            <div className="max-w-lg mx-auto space-y-5">

                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Payout Account</p>
                        <h2 className="text-xl font-black text-slate-800">Account Details</h2>
                    </div>
                    <button onClick={load} className="w-9 h-9 rounded-xl border border-slate-100 bg-white flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm" title="Refresh">
                        <RefreshCw size={13} className="text-slate-500" />
                    </button>
                </div>

                <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl px-6 py-5 flex items-center gap-4 shadow shadow-emerald-200">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                        <Banknote size={22} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-black text-emerald-100 uppercase tracking-widest">Payout Ready</p>
                        <p className="text-white font-black text-[16px] mt-0.5 truncate">
                            {details?.clinicName ?? "—"}  {/* ✅ business_name */}
                        </p>
                        <p className="text-emerald-100 text-[12px] mt-0.5">
                            {details?.bank_name ?? details?.settlement_bank ?? ""}
                        </p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1.5 flex-shrink-0">
                        <CheckCircle2 size={11} className="text-white" />
                        <span className="text-[10px] font-black text-white">Active</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-slate-50 bg-slate-50/60">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Bank Account Info</p>
                    </div>
                    {rows.map(({ label, value, icon, copyable }) => (
                        <div key={label} className="flex items-center justify-between px-5 py-4 border-b border-slate-50 last:border-0">
                            <div className="flex items-center gap-2.5">
                                {icon}
                                <span className="text-[12px] text-slate-500">{label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[13px] font-semibold text-slate-800 font-mono">{value}</span>
                                {copyable && value !== "—" && <CopyButton value={value} />}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}