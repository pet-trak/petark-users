'use client';

import { JSX, useEffect, useState } from "react";
import { getAppointments, Appointment } from "@/libs/api/appointment";
import { toast } from "sonner";
import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react";
import Spinner from "@/components/ui/spinner";
import dayjs from "dayjs";

interface CountCardProps {
    title: string;
    count: number;
    icon: JSX.Element;
    colorClass?: string;
}

function CountCard({ title, count, icon, colorClass = "" }: Readonly<CountCardProps>) {
    return (
        <div className={`flex items-center justify-between gap-4 p-6 rounded-xl shadow-lg bg-(--pry-clr) ${colorClass} sec-ff w-full`}>
            <div>
                <p className="text-gray-500 text-sm">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{count}</p>
            </div>
            <div className="p-4 rounded-full bg-gray-100">{icon}</div>
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

    const today = dayjs().startOf("day");
    const counts = {
        totalPlans: appointments.length,
        todaysPlans: appointments.filter(a => dayjs(a.date).isSame(today, "day")).length,
        upcomingPlans: appointments.filter(a => dayjs(a.date).isAfter(today, "day")).length,
        completedToday: appointments.filter(a => a.status === "completed" && dayjs(a.date).isSame(today, "day")).length,
    };

    if (loading) return <div className="flex justify-center p-8"><Spinner /></div>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4 max-w-7xl mx-auto font-semibold sec-ff">
            <CountCard title="Total Plans" count={counts.totalPlans} icon={<Calendar className="w-8 h-8 text-gray-500" />} />
            <CountCard title="Today's Plans" count={counts.todaysPlans} icon={<Clock className="w-8 h-8 text-yellow-500" />} />
            <CountCard title="Upcoming Plans" count={counts.upcomingPlans} icon={<CheckCircle className="w-8 h-8 text-blue-500" />} />
            <CountCard title="Completed Today" count={counts.completedToday} icon={<CheckCircle className="w-8 h-8 text-green-500" />} />
        </div>
    );
}