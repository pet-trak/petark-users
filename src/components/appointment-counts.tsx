'use client';

import { JSX, useEffect, useState } from "react";
import { getAppointments, Appointment } from "@/libs/api/appointment";
import { toast } from "sonner";
import { Clock, CheckCircle, XCircle, CheckSquare, Calendar } from "lucide-react";
import Spinner from "./ui/spinner";

interface CountCardProps {
    title: string;
    count: number;
    icon: JSX.Element;
    colorClass: string;
}

function CountCard({ title, count, icon, colorClass }: Readonly<CountCardProps>) {
    return (
        <div className={`flex items-center gap-4 p-4 rounded-2xl shadow-md bg-(--pry-clr) ${colorClass} sec-ff`}>
            <div className="p-3 rounded-full bg-gray-100">{icon}</div>
            <div>
                <p className="text-gray-500 text-sm">{title}</p>
                <p className="text-xl font-bold text-gray-800">{count}</p>
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
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-1 max-w-6xl mx-auto font-semibold sec-ff">
            <CountCard title="Total" count={counts.total} icon={<Calendar className="w-6 h-6 text-gray-500" />} colorClass="" />
            <CountCard title="Pending" count={counts.pending} icon={<Clock className="w-6 h-6 text-yellow-500" />} colorClass="" />
            <CountCard title="Confirmed" count={counts.confirmed} icon={<CheckCircle className="w-6 h-6 text-blue-500" />} colorClass="" />
            <CountCard title="Completed" count={counts.completed} icon={<CheckSquare className="w-6 h-6 text-green-500" />} colorClass="" />
            <CountCard title="Cancelled" count={counts.cancelled} icon={<XCircle className="w-6 h-6 text-red-500" />} colorClass="" />
        </div>
    );
}