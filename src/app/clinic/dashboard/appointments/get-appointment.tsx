// components/clinic/get-appointments.tsx

'use client';

import { useEffect, useState } from "react";
import { getAppointments, Appointment } from "@/libs/api/clinic-appointment";
import { toast } from "sonner";
import dayjs from "dayjs";
import { Calendar, Clock, User, Heart, MessageCircle, Info, ChevronRight } from "lucide-react";
import Spinner from "@/components/ui/spinner";
import Link from "next/link";
import Image from "next/image";

const STATUS_TABS = ["all", "pending", "confirmed", "completed", "cancelled"] as const;

const STATUS_STYLES: Record<string, { dot: string; badge: string; label: string }> = {
    pending: { dot: "bg-yellow-400", badge: "bg-yellow-50 text-yellow-700 border border-yellow-200", label: "Pending" },
    confirmed: { dot: "bg-blue-400", badge: "bg-blue-50 text-blue-700 border border-blue-200", label: "Confirmed" },
    completed: { dot: "bg-green-500", badge: "bg-green-50 text-green-700 border border-green-200", label: "Completed" },
    cancelled: { dot: "bg-red-400", badge: "bg-red-50 text-red-700 border border-red-200", label: "Cancelled" },
};

export default function GetAppointmentPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
    const [activeTab, setActiveTab] = useState<typeof STATUS_TABS[number]>('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getAppointments();
                setAppointments(data);
                setFilteredAppointments(data);
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : 'An error occurred';
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    useEffect(() => {
        if (activeTab === "all") setFilteredAppointments(appointments);
        else setFilteredAppointments(appointments.filter(a => a.status === activeTab));
    }, [activeTab, appointments]);

    return (
        <div className="flex-1 min-w-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            {/* Panel Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-(--acc-clr)" />
                    <h2 className="text-sm font-bold text-(--sec-clr) sec-ff uppercase tracking-wide">Upcoming Appointments</h2>
                </div>

                {/* Status Tabs */}
                <div className="flex flex-wrap gap-1.5">
                    {STATUS_TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer sec-ff
                                ${activeTab === tab
                                    ? "bg-(--acc-clr) text-white shadow-sm"
                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table Header — visible on md+ */}
            <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_auto_auto] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100">
                {["Time / Pet", "Owner", "Specialization", "Status", "Action"].map(h => (
                    <span key={h} className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide sec-ff">{h}</span>
                ))}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                {loading && (
                    <div className="flex justify-center py-16">
                        <Spinner />
                    </div>
                )}

                {!loading && filteredAppointments.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 px-4">
                        <Calendar className="w-12 h-12 text-gray-200 mb-3" />
                        <p className="text-gray-400 text-sm font-semibold sec-ff">No appointments found.</p>
                    </div>
                )}

                {/* Desktop: Table rows */}
                <div className="hidden md:block">
                    {filteredAppointments.map((a: Appointment) => {
                        const status = STATUS_STYLES[a.status] ?? { dot: "bg-gray-300", badge: "bg-gray-50 text-gray-500 border border-gray-200", label: a.status };
                        return (
                            <Link key={a._id} href={`/clinic/dashboard/appointments/${a._id}`} className="block group">
                                <div className="grid grid-cols-[1fr_1fr_1fr_auto_auto] gap-4 items-center px-5 py-3.5 hover:bg-gray-50 transition-colors duration-150">
                                    {/* Time / Pet */}
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-green-100 flex-shrink-0">
                                            {a.pet?.photo ? (
                                                <Image width={40} height={40} src={a.pet.photo} alt={a.pet.name || 'Pet'} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Heart className="w-4 h-4 text-(--acc-clr)" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-(--sec-clr) sec-ff truncate">{a.pet?.name ?? 'Unknown'}</p>
                                            <div className="flex items-center gap-1 text-gray-400">
                                                <Clock className="w-3 h-3" />
                                                <span className="text-xs pry-ff">{a.time}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Owner */}
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                            <User className="w-3.5 h-3.5 text-(--acc-clr)" />
                                        </div>
                                        <span className="text-sm text-(--sec-clr) sec-ff truncate">{a.owner?.fullname ?? 'Unknown'}</span>
                                    </div>

                                    {/* Specialization */}
                                    <div>
                                        <span className="inline-block bg-green-50 text-green-700 border border-green-200 text-xs font-semibold px-2.5 py-1 rounded-lg sec-ff capitalize">
                                            {a.type ?? 'General Checkup'}
                                        </span>
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg sec-ff ${status.badge}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                                            {status.label}
                                        </span>
                                    </div>

                                    {/* Action */}
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            className="flex items-center gap-1.5 bg-(--acc-clr) hover:bg-green-500 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-sm transition-colors sec-ff"
                                            onClick={(e) => { e.preventDefault(); toast.info('Inference feature coming soon!'); }}
                                        >
                                            <MessageCircle className="w-3.5 h-3.5" />
                                            Create New Visit
                                        </button>
                                        <button
                                            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-xl flex items-center justify-center transition-colors"
                                            onClick={(e) => { e.preventDefault(); toast.info('More info coming soon!'); }}
                                        >
                                            <Info className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Mobile: Cards */}
                <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
                    {filteredAppointments.map((a: Appointment) => {
                        const status = STATUS_STYLES[a.status] ?? { dot: "bg-gray-300", badge: "bg-gray-50 text-gray-500 border border-gray-200", label: a.status };
                        return (
                            <Link key={a._id} href={`/clinic-dashboard/appointments/${a._id}`} className="block group">
                                <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200">
                                    {/* Pet image */}
                                    <div className="relative h-28 bg-green-100">
                                        {a.pet?.photo ? (
                                            <Image width={400} height={112} src={a.pet.photo} alt={a.pet.name || 'Pet'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Heart className="w-12 h-12 text-(--acc-clr)/30" />
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2">
                                            <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full sec-ff ${status.badge}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                                                {status.label}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-2 left-2">
                                            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
                                                <Clock className="w-3 h-3 text-(--acc-clr)" />
                                                <span className="text-xs font-semibold text-(--sec-clr) sec-ff">{a.time}</span>
                                                <span className="text-xs text-gray-400 sec-ff">· {dayjs(a.date).format("MMM D")}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-3">
                                        <div className="flex items-start gap-2 mb-2">
                                            <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                                                <User className="w-4 h-4 text-(--acc-clr)" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs text-gray-400 pry-ff">Owner</p>
                                                <p className="text-sm font-bold text-(--sec-clr) sec-ff truncate">{a.owner?.fullname ?? 'Unknown'}</p>
                                                <p className="text-xs text-gray-500 truncate sec-ff">{a.pet?.name ?? 'Unknown'} · {a.pet?.breed ?? 'Mixed'}</p>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-xl px-3 py-2 mb-3 border border-gray-100">
                                            <p className="text-[10px] text-gray-400 pry-ff">Specialization</p>
                                            <p className="text-xs font-semibold text-(--sec-clr) capitalize sec-ff">{a.type ?? 'General Checkup'}</p>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
                                                onClick={(e) => { e.preventDefault(); toast.info('More info coming soon!'); }}
                                            >
                                                <Info className="w-4 h-4 text-gray-500" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}