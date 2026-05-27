'use client';

import { JSX, useEffect, useState } from "react";
import { getAppointments, Appointment } from "@/libs/api/clinic-appointment";
import { toast } from "sonner";
import { Clock, CheckCircle, XCircle, CheckSquare, Calendar } from "lucide-react";
import Spinner from "../ui/spinner";

interface CountCardProps {
    title: string;
    count: number;
    icon: JSX.Element;
    accent: string;
    bg: string;
}

function CountCard({ title, count, icon, accent, bg }: Readonly<CountCardProps>) {
    return (
        <div className={`relative flex items-center gap-4 p-5 rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow duration-200`}>
            {/* Subtle accent stripe */}
            <div className={`absolute left-0 top-0 h-full w-1 rounded-l-2xl ${accent}`} />
            <div className={`p-3 rounded-xl ${bg} flex-shrink-0`}>
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-xs text-gray-500 font-medium sec-ff uppercase tracking-wide">{title}</p>
                <p className="text-2xl font-bold text-(--sec-clr) sec-ff leading-tight">{count}</p>
            </div>
        </div>
    );
}

export default function AppointmentCounts() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getAppointments();
                setAppointments(data);
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : 'An error occurred';
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const counts = {
        pending: appointments.filter(a => a.status === 'pending').length,
        confirmed: appointments.filter(a => a.status === 'confirmed').length,
        completed: appointments.filter(a => a.status === 'completed').length,
        cancelled: appointments.filter(a => a.status === 'cancelled').length,
        total: appointments.length,
    };

    if (loading) return <div className="flex justify-center p-6"><Spinner /></div>;

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 w-full sec-ff">
            <CountCard
                title="Total"
                count={counts.total}
                icon={<Calendar className="w-5 h-5 text-(--acc-clr)" />}
                accent="bg-(--acc-clr)"
                bg="bg-green-50"
            />
            <CountCard
                title="Pending"
                count={counts.pending}
                icon={<Clock className="w-5 h-5 text-yellow-500" />}
                accent="bg-yellow-400"
                bg="bg-yellow-50"
            />
            <CountCard
                title="Confirmed"
                count={counts.confirmed}
                icon={<CheckCircle className="w-5 h-5 text-blue-500" />}
                accent="bg-blue-400"
                bg="bg-blue-50"
            />
            <CountCard
                title="Completed"
                count={counts.completed}
                icon={<CheckSquare className="w-5 h-5 text-green-600" />}
                accent="bg-green-500"
                bg="bg-green-50"
            />
            <CountCard
                title="Cancelled"
                count={counts.cancelled}
                icon={<XCircle className="w-5 h-5 text-red-500" />}
                accent="bg-red-400"
                bg="bg-red-50"
            />
        </div>
    );
}