'use client';

import { useEffect, useState } from 'react';
import { getClinicSchedule, ClinicScheduleDay } from '@/libs/api/appointment';

interface ScheduleDisplayProps {
    clinicId: string;
}

export default function ScheduleDisplay({ clinicId }: ScheduleDisplayProps) {
    const [schedule, setSchedule] = useState<ClinicScheduleDay[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSchedule() {
            try {
                setLoading(true);
                const data = await getClinicSchedule(clinicId);
                setSchedule(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchSchedule();
    }, [clinicId]);

    if (loading) return <p>Loading schedule...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!schedule.length) return <p>No schedule available.</p>;

    return (
        <div className="space-y-4">
            {schedule.map(day => (
                <div key={day.date} className="border p-3 rounded-md">
                    <h3 className="font-semibold">
                        {day.day} — {day.date} {day.isOpen ? '(Open)' : '(Closed)'}
                    </h3>
                    {day.isOpen ? (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {day.slots.map(slot => (
                                <button
                                    key={slot.time}
                                    disabled={!slot.available}
                                    className={`px-3 py-1 rounded ${slot.available ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                        }`}
                                >
                                    {slot.time}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 mt-1">No slots available.</p>
                    )}
                </div>
            ))}
        </div>
    );
}
