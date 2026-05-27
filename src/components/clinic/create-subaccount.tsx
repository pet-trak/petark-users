"use client";

import { useState, useEffect, useRef } from "react";
import {
    Building2, CreditCard, ChevronDown, CheckCircle2,
    Loader2, AlertCircle, Search, ShieldCheck,
    Banknote, ArrowRight, X,
} from "lucide-react";
import {
    createSubaccount,
    getBankList,
    resolveAccountName,
    type Bank,
    type CreateSubaccountResponse,
} from "@/libs/api/account";

type Step = "form" | "success" | "exists";

export default function CreateSubaccount() {
    const [step, setStep] = useState<Step>("form");
    const [banks, setBanks] = useState<Bank[]>([]);
    const [banksLoading, setBanksLoading] = useState(true);
    const [bankSearch, setBankSearch] = useState("");
    const [showBankDropdown, setShowBankDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [clinicName, setClinicName] = useState("");
    const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
    const [accountNumber, setAccountNumber] = useState("");
    const [resolvedName, setResolvedName] = useState<string | null>(null);
    const [resolving, setResolving] = useState(false);
    const [resolveError, setResolveError] = useState<string | null>(null);

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<CreateSubaccountResponse | null>(null);

    // Load banks
    useEffect(() => {
        getBankList()
            .then(setBanks)
            .catch(() => { })
            .finally(() => setBanksLoading(false));
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setShowBankDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    // Auto-resolve account name
    useEffect(() => {
        if (accountNumber.length === 10 && selectedBank) {
            setResolving(true);
            setResolvedName(null);
            setResolveError(null);
            resolveAccountName(accountNumber, selectedBank.code)
                .then((data) => setResolvedName(data.account_name))
                .catch((err: Error) => setResolveError(err.message))
                .finally(() => setResolving(false));
        } else {
            setResolvedName(null);
            setResolveError(null);
        }
    }, [accountNumber, selectedBank]);

    const filteredBanks = banks.filter((b) =>
        b.name.toLowerCase().includes(bankSearch.toLowerCase())
    );

    const isFormValid =
        clinicName.trim().length > 2 &&
        selectedBank !== null &&
        accountNumber.length === 10 &&
        resolvedName !== null;

    async function handleSubmit() {
        if (!isFormValid || !selectedBank) return;
        setSubmitting(true);
        setError(null);
        try {
            const data = await createSubaccount({
                clinicName: clinicName,
                bank_code: selectedBank.code,
                account_number: accountNumber,
            });
            setResult(data);
            setStep("success");
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Something went wrong";
            if (msg.toLowerCase().includes("already exists")) {
                setStep("exists");
            } else {
                setError(msg);
            }
        } finally {
            setSubmitting(false);
        }
    }

    // ── Already Exists ────────────────────────────────────────────────────────
    if (step === "exists") {
        return (
            <div className="flex items-center justify-center min-h-[60vh] px-4 sec-ff">
                <div className="w-full max-w-sm bg-white rounded-3xl border border-slate-100 shadow-sm p-8 flex flex-col items-center text-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center">
                        <ShieldCheck size={24} className="text-amber-500" />
                    </div>
                    <div>
                        <h2 className="text-[17px] font-black text-slate-800">Already Set Up</h2>
                        <p className="text-[13px] text-slate-400 mt-1.5 leading-relaxed">
                            A payout subaccount already exists for your clinic. You can only have one.
                        </p>
                    </div>
                    <button
                        onClick={() => window.location.href = "/dashboard"}
                        className="w-full rounded-xl bg-slate-800 text-white text-[13px] font-bold py-3 hover:bg-slate-900 transition-colors"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // ── Success ───────────────────────────────────────────────────────────────
    if (step === "success" && result) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] px-4 sec-ff">
                <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 px-8 py-10 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
                            <CheckCircle2 size={32} className="text-white" />
                        </div>
                        <h2 className="text-xl font-black text-white">Subaccount Created!</h2>
                        <p className="text-emerald-100 text-[13px] mt-1">
                            Your payout account is ready to receive payments
                        </p>
                    </div>

                    <div className="px-6 py-5">
                        {[
                            { label: "Clinic Name", value: clinicName },
                            { label: "Bank", value: selectedBank?.name ?? "—" },
                            { label: "Account Number", value: accountNumber },
                            { label: "Account Name", value: resolvedName ?? "—" },
                            { label: "Subaccount Code", value: result.subaccount_code },
                            { label: "Recipient Code", value: result.recipient_code },
                        ].map(({ label, value }) => (
                            <div key={label} className="flex items-start justify-between gap-4 py-2.5 border-b border-slate-50 last:border-0">
                                <span className="text-[11px] text-slate-400 flex-shrink-0">{label}</span>
                                <span className="text-[12px] font-semibold text-slate-700 text-right break-all">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // ── Form ──────────────────────────────────────────────────────────────────
    return (
        <div className="flex items-center justify-center min-h-[60vh] px-4 py-10 sec-ff">
            <div className="w-full max-w-lg">

                {/* Header */}
                <div className="mb-7">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center shadow shadow-emerald-200">
                            <Banknote size={15} className="text-white" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payout Setup</span>
                    </div>
                    <h1 className="text-2xl font-black text-slate-800 leading-tight">Create Payout Account</h1>
                    <p className="text-[13px] text-slate-400 mt-1.5">
                        Link your clinic`s bank account to receive payments directly from PetTrak.
                    </p>
                </div>

                {/* Security notice */}
                <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3.5 mb-5">
                    <ShieldCheck size={15} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[12px] text-emerald-700 leading-relaxed">
                        Your account details are securely processed by <strong>Paystack</strong>. We never store your full banking credentials.
                    </p>
                </div>

                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-visible">
                    <div className="px-6 sm:px-8 py-7 space-y-5">

                        {/* Clinic Name */}
                        <div>
                            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">
                                Clinic Name
                            </label>
                            <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 transition-colors ${clinicName ? "border-emerald-200 bg-emerald-50/30" : "border-slate-100 bg-slate-50"}`}>
                                <Building2 size={15} className="text-slate-400 flex-shrink-0" />
                                <input
                                    type="text"
                                    value={clinicName}
                                    onChange={(e) => setClinicName(e.target.value)}
                                    placeholder="e.g. Paws & Care Veterinary Clinic"
                                    className="flex-1 bg-transparent text-[13px] text-slate-700 placeholder:text-slate-400 outline-none"
                                />
                            </div>
                        </div>

                        {/* Bank Selection */}
                        <div className="relative" ref={dropdownRef}>
                            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">
                                Bank
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowBankDropdown((v) => !v)}
                                className={`w-full flex items-center gap-3 border rounded-xl px-4 py-3 transition-colors text-left ${selectedBank ? "border-emerald-200 bg-emerald-50/30" : "border-slate-100 bg-slate-50"}`}
                            >
                                <Search size={15} className="text-slate-400 flex-shrink-0" />
                                <span className={`flex-1 text-[13px] ${selectedBank ? "text-slate-700" : "text-slate-400"}`}>
                                    {selectedBank ? selectedBank.name : banksLoading ? "Loading banks..." : "Select your bank"}
                                </span>
                                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${showBankDropdown ? "rotate-180" : ""}`} />
                            </button>

                            {showBankDropdown && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden">
                                    <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-50">
                                        <Search size={13} className="text-slate-400 flex-shrink-0" />
                                        <input
                                            autoFocus
                                            value={bankSearch}
                                            onChange={(e) => setBankSearch(e.target.value)}
                                            placeholder="Search banks..."
                                            className="flex-1 text-[13px] text-slate-600 placeholder:text-slate-400 outline-none bg-transparent"
                                        />
                                        {bankSearch && (
                                            <button onClick={() => setBankSearch("")}>
                                                <X size={13} className="text-slate-400 hover:text-slate-600 transition-colors" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-52 overflow-y-auto">
                                        {filteredBanks.length === 0 ? (
                                            <p className="text-[12px] text-slate-400 text-center py-6">No banks found</p>
                                        ) : (
                                            filteredBanks.map((bank) => (
                                                <button
                                                    key={bank.code}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedBank(bank);
                                                        setShowBankDropdown(false);
                                                        setBankSearch("");
                                                    }}
                                                    className={`w-full text-left px-4 py-3 text-[13px] border-b border-slate-50 last:border-0 hover:bg-emerald-50 transition-colors ${selectedBank?.code === bank.code ? "bg-emerald-50 text-emerald-700 font-semibold" : "text-slate-700"}`}
                                                >
                                                    {bank.name}
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Account Number */}
                        <div>
                            <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-2">
                                Account Number
                            </label>
                            <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 transition-colors ${accountNumber.length === 10 && resolvedName ? "border-emerald-200 bg-emerald-50/30" : resolveError ? "border-red-200 bg-red-50/20" : "border-slate-100 bg-slate-50"}`}>
                                <CreditCard size={15} className="text-slate-400 flex-shrink-0" />
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={10}
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                                    placeholder="0123456789"
                                    className="flex-1 bg-transparent text-[13px] text-slate-700 placeholder:text-slate-400 outline-none tracking-widest font-mono"
                                />
                                {resolving && <Loader2 size={14} className="text-slate-400 animate-spin flex-shrink-0" />}
                                {resolvedName && !resolving && <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />}
                                {resolveError && !resolving && <AlertCircle size={14} className="text-red-400 flex-shrink-0" />}
                            </div>

                            {resolvedName && (
                                <div className="flex items-center gap-1.5 mt-2 px-1">
                                    <CheckCircle2 size={11} className="text-emerald-500" />
                                    <p className="text-[12px] font-semibold text-emerald-600">{resolvedName}</p>
                                </div>
                            )}
                            {resolveError && (
                                <div className="flex items-center gap-1.5 mt-2 px-1">
                                    <AlertCircle size={11} className="text-red-400" />
                                    <p className="text-[12px] text-red-400">{resolveError}</p>
                                </div>
                            )}
                            {!selectedBank && accountNumber.length > 0 && (
                                <p className="text-[11px] text-slate-400 mt-1.5 px-1">Select a bank first to verify your account</p>
                            )}
                        </div>

                        {/* Submit error */}
                        {error && (
                            <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                                <AlertCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                                <p className="text-[12px] text-red-500">{error}</p>
                            </div>
                        )}
                    </div>

                    <div className="px-6 sm:px-8 pb-7">
                        <button
                            onClick={handleSubmit}
                            disabled={!isFormValid || submitting}
                            className="w-full rounded-xl bg-emerald-500 text-white text-[13px] font-bold py-3.5 hover:bg-emerald-600 transition-colors shadow shadow-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {submitting ? (
                                <><Loader2 size={15} className="animate-spin" /> Creating Subaccount...</>
                            ) : (
                                <>Create Payout Account <ArrowRight size={15} /></>
                            )}
                        </button>
                        <p className="text-center text-[11px] text-slate-400 mt-3">
                            You can only create one subaccount per clinic.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}