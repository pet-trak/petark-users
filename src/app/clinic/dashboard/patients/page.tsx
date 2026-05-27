'use client';

import { Microscope, Stethoscope, Bell, Plus } from 'lucide-react';
import PatientCount from '@/components/clinic/patient-count';
import PatientDirectory from '@/components/clinic/patient-directory';

/* ── Stat card (Pending Lab Reports / Recent Diagnoses) ── */
function StatCard({
    label,
    value,
    sub,
    subColor,
    icon: Icon,
}: {
    label: string;
    value: number;
    sub: string;
    subColor: 'red' | 'green';
    icon: React.ElementType;
}) {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-[#f0fdf6] border border-emerald-100 px-6 py-5 flex items-center justify-between">
            <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
                <p className="text-4xl font-extrabold text-gray-900 leading-none">{value}</p>
                <div className="flex items-center gap-1 mt-2">
                    <span className={`text-xs font-semibold ${subColor === 'red' ? 'text-red-500' : 'text-emerald-600'}`}>
                        {sub}
                    </span>
                </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6 text-emerald-500" />
            </div>
        </div>
    );
}

/* ── Today's Appointments ── */
function TodaysAppointments() {
    const appointments = [
        { time: '09:00', label: 'Toby (Owner: Linda)' },
        { time: '10:30', label: 'Ginger (Owner: Rob)' },
    ];

    return (
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-bold text-gray-800 pry-ff">Today's Appointments</h3>
            </div>
            <div className="divide-y divide-gray-50">
                {appointments.map(a => (
                    <div key={a.time} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors group">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                                {a.time}
                            </span>
                            <span className="text-sm text-gray-700 font-medium">{a.label}</span>
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="w-6 h-6 flex flex-col items-center justify-center gap-0.5">
                                {[0, 1, 2].map(i => <span key={i} className="w-1 h-1 rounded-full bg-gray-400" />)}
                            </span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ── Clinic Notices ── */
function ClinicNotices() {
    return (
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-yellow-400 flex items-center justify-center">
                    <span className="text-[9px] font-black text-white">!</span>
                </div>
                <h3 className="text-sm font-bold text-gray-800 pry-ff">Clinic Notices</h3>
            </div>
            <div className="p-5">
                <div className="border-l-4 border-emerald-400 bg-emerald-50/60 pl-4 py-2 rounded-r-xl">
                    <p className="text-xs font-bold text-gray-800 mb-1">Lab Update</p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        External lab reports for biopsy cases are now integrated directly into the dashboard. No manual upload needed.
                    </p>
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════
   PAGE
══════════════════════════════════════ */
export default function PatientsPage() {
    return (
        <div className="pry-ff min-h-screen bg-white">
            {/* Top bar */}
            <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <h1 className="text-xl font-extrabold text-gray-900">Patient Medical Records</h1>
                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative hidden sm:block">
                        <input
                            type="text"
                            placeholder="Global search..."
                            className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-xs font-medium text-gray-700 placeholder:text-gray-300 focus:outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all w-56"
                        />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                        </svg>
                    </div>

                    {/* Add External Record */}
                    <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm shadow-emerald-200 transition-all active:scale-95">
                        <Plus className="w-4 h-4" />
                        Add External Record
                    </button>

                    {/* Bell */}
                    <button className="relative w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors">
                        <Bell className="w-4 h-4 text-gray-500" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
                    </button>
                </div>
            </div>

            <div className="px-6 py-6 space-y-6 max-w-screen-xl mx-auto">
                {/* Stat cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <PatientCount />
                    <StatCard
                        label="Pending Lab Reports"
                        value={12}
                        sub="⚠ 4 urgent reviews"
                        subColor="red"
                        icon={Microscope}
                    />
                    <StatCard
                        label="Recent Diagnoses"
                        value={48}
                        sub="● +12% weekly increase"
                        subColor="green"
                        icon={Stethoscope}
                    />
                </div>

                {/* Patient Directory */}
                <PatientDirectory />

                {/* Bottom row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TodaysAppointments />
                    <ClinicNotices />
                </div>
            </div>
        </div>
    );
}