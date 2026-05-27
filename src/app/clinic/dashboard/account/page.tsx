// src/app/clinic/dashboard/account/page.tsx

"use client";

import { useEffect, useState } from "react";
import CreateSubaccount from "@/components/clinic/create-subaccount";
import GetSubaccount from "@/components/clinic/get-subaccount";
import { getSubaccount, type SubaccountData } from "@/libs/api/account";
import { Loader2 } from "lucide-react";

export default function AccountPage() {
    const [data, setData] = useState<SubaccountData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getSubaccount()
            .then(setData)
            .catch((err: Error) => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <main className="flex items-center justify-center min-h-screen bg-[#f8f9fb] sec-ff">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 size={22} className="text-emerald-500 animate-spin" />
                    <p className="text-[12px] text-slate-400">Loading account...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex items-center justify-center min-h-screen bg-[#f8f9fb] sec-ff">
                <div className="text-center space-y-2">
                    <p className="text-[14px] font-semibold text-slate-700">Failed to load account</p>
                    <p className="text-[12px] text-slate-400">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-3 px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-[13px] font-bold hover:bg-emerald-600 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#f8f9fb] sec-ff">
            {data?.has_subaccount ? <GetSubaccount /> : <CreateSubaccount />}
        </main>
    );
}