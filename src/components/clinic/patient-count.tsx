'use client';

import { useEffect, useState } from 'react';
import { PawPrint, TrendingUp } from 'lucide-react';

export default function PatientCount() {
    const [count, setCount] = useState<number | null>(null);

    // Replace with real API call
    useEffect(() => {
        // e.g. fetch('/api/patients/count').then(...)
        setCount(1284);
    }, []);

    return (
        <div className="relative overflow-hidden rounded-2xl bg-[#f0fdf6] border border-emerald-100 px-6 py-5 flex items-center justify-between">
            <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                    Total Patients Managed
                </p>
                <p className="text-4xl font-extrabold text-gray-900 leading-none">
                    {count !== null ? count.toLocaleString() : '—'}
                </p>
                <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-xs font-semibold text-emerald-600">+5% from last month</span>
                </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <PawPrint className="w-6 h-6 text-emerald-500" />
            </div>
        </div>
    );
}