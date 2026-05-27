'use client';

import { useEffect, useState, useRef } from 'react';
import {
    getClinicSchedule,
    ClinicScheduleDay,
    bookAppointments,
    BookAppointmentQuery,
} from '@/libs/api/appointment';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Spinner from './ui/spinner';
import { toast } from 'sonner';

// Fetch user's pets
async function getMyPets() {
    const token = localStorage.getItem('token');
    const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/appointment/user/me/pets`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data.data.pets as { _id: string; name: string }[];
}

interface Props {
    clinicId: string;
    vetId?: string;
}

export default function BookAppointment({ clinicId, vetId }: Props) {
    const [schedule, setSchedule] = useState<ClinicScheduleDay[]>([]);
    const [pets, setPets] = useState<{ _id: string; name: string }[]>([]);
    const [selectedPetId, setSelectedPetId] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [loading, setLoading] = useState(false);

    const dateRef = useRef<HTMLDivElement | null>(null);
    const timeRef = useRef<HTMLDivElement | null>(null);

    const today = new Date();

    const filteredSchedule = schedule
        .filter(d => new Date(d.date) >= today)
        .map(d => ({
            ...d,
            isOpen: d.slots.some(s => s.available),
        }));

    const selectedDay = filteredSchedule.find(d => d.date === selectedDate);

    useEffect(() => {
        async function fetchData() {
            try {
                const sched = await getClinicSchedule(clinicId);
                setSchedule(sched);
                const myPets = await getMyPets();
                setPets(myPets);
            } catch (err: any) {
                toast.error(err.message || "Failed to load schedule");
            }
        }
        fetchData();
    }, [clinicId]);

    const scroll = (ref: React.RefObject<HTMLDivElement | null>, dir: 'left' | 'right') => {
        ref.current?.scrollBy({ left: dir === 'left' ? -250 : 250, behavior: 'smooth' });
    };

    const handleBook = async () => {
        if (!selectedPetId || !selectedDate || !selectedTime) {
            toast.error('Select pet, date and time');
            return;
        }

        setLoading(true);
        try {
            const query: BookAppointmentQuery = { clinicId, vetId };
            await bookAppointments(
                { petId: selectedPetId, date: selectedDate, time: selectedTime },
                query
            );

            toast.success(`Appointment booked for ${selectedTime}`);

            // Mark slot as unavailable locally
            setSchedule(prev =>
                prev.map(day => {
                    if (day.date !== selectedDate) return day;
                    return {
                        ...day,
                        slots: day.slots.map(slot =>
                            slot.time === selectedTime ? { ...slot, available: false } : slot
                        ),
                        isOpen: day.slots.some(s => s.available),
                    };
                })
            );

            setSelectedTime('');
            setSelectedDate('');
        } catch (err: any) {
            if (axios.isAxiosError(err)) {
                const message =
                    err.response?.data?.message ||
                    (typeof err.response?.data === 'string'
                        ? err.response.data
                        : 'Failed to book appointment');
                toast.error(message);
            } else {
                toast.error('Failed to book appointment');
            }
        } finally {
            setLoading(false);
        }
    };

    const getMonthHeader = () => {
        if (!filteredSchedule.length) return '';
        const firstDate = new Date(filteredSchedule[0].date);
        return firstDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-[#D7F9E5] p-4 sm:p-6 lg:p-8 pry-ff">
            <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-[#38E07B] p-6 sm:p-8 rounded-t-3xl text-white">
                    <h1 className="text-2xl sm:text-3xl font-bold">Book an Appointment</h1>
                    <p className="text-white/90 mt-1">Select your pet, date, and time</p>
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                    {/* PET SELECTION */}
                    <div>
                        <label className="block font-semibold mb-2">Select Your Pet</label>
                        <select
                            value={selectedPetId}
                            onChange={e => setSelectedPetId(e.target.value)}
                            className="w-full border-2 border-[#38E07B]/30 p-3 sm:p-4 rounded-xl focus:outline-none focus:border-[#38E07B]"
                        >
                            <option value="">-- Select a pet --</option>
                            {pets.map(p => (
                                <option key={p._id} value={p._id}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* DATE SELECTION */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="font-bold text-lg">{getMonthHeader() || 'Available Dates'}</h2>
                            <div className="flex gap-2">
                                <button onClick={() => scroll(dateRef, 'left')} className="p-2 rounded-full bg-[#D7F9E5] hover:bg-[#38E07B] hover:text-white">
                                    <ChevronLeft size={20} />
                                </button>
                                <button onClick={() => scroll(dateRef, 'right')} className="p-2 rounded-full bg-[#D7F9E5] hover:bg-[#38E07B] hover:text-white">
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>

                        <div ref={dateRef} className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                            {filteredSchedule.map(day => {
                                const dateObj = new Date(day.date);
                                const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                                const dayNum = dateObj.getDate();
                                const hasAvailableSlots = day.slots.some(s => s.available);

                                return (
                                    <button
                                        key={day.date}
                                        onClick={() => hasAvailableSlots && setSelectedDate(day.date)}
                                        disabled={!hasAvailableSlots}
                                        className={`relative flex flex-col items-center justify-center min-w-[72px] sm:min-w-[80px] p-2 rounded-2xl font-semibold transition-all transform hover:scale-105
                                            ${selectedDate === day.date
                                                ? 'bg-[#38E07B] text-white shadow-lg'
                                                : hasAvailableSlots
                                                    ? 'bg-white border-2 border-[#38E07B]/30 text-[#333333]'
                                                    : 'bg-gray-100 border-2 border-gray-200 text-gray-300 cursor-not-allowed opacity-70'
                                            }`}
                                    >
                                        <span className={`text-xs sm:text-sm ${!hasAvailableSlots ? 'line-through decoration-red-400' : ''}`}>
                                            {dayName}
                                        </span>
                                        <span className={`text-lg sm:text-xl ${!hasAvailableSlots ? 'line-through decoration-red-400' : ''}`}>
                                            {dayNum}
                                        </span>
                                        {!hasAvailableSlots && (
                                            <span className="text-[9px] font-bold uppercase tracking-wide text-red-400 leading-tight mt-0.5">
                                                Full
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* TIMES */}
                        {selectedDay && (
                            <div>
                                <h3 className="font-bold mb-2">Available Times</h3>
                                <div ref={timeRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 overflow-x-auto pb-2">
                                    {selectedDay.slots.map(slot => (
                                        <button
                                            key={slot.time}
                                            onClick={() => slot.available && setSelectedTime(slot.time)}
                                            disabled={!slot.available}
                                            className={`px-3 py-2 rounded-xl border font-medium transition-all transform hover:scale-105
                                                ${selectedTime === slot.time
                                                    ? 'bg-[#38E07B] text-white shadow-lg'
                                                    : slot.available
                                                        ? 'bg-white border-[#38E07B]/30 text-[#333333]'
                                                        : 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed opacity-70 line-through decoration-red-400'
                                                }`}
                                        >
                                            {slot.time}
                                        </button>
                                    ))}
                                </div>

                                {selectedDay.slots.every(s => !s.available) && (
                                    <p className="text-gray-500 text-center mt-2">No available time slots for this date</p>
                                )}
                            </div>
                        )}

                        {/* CONFIRM BUTTON */}
                        {selectedPetId && selectedDate && selectedTime && (
                            <button
                                onClick={handleBook}
                                disabled={loading}
                                className="w-full bg-[#38E07B] text-white py-4 rounded-2xl font-bold hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {loading ? <Spinner /> : `Confirm Booking - ${new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${selectedTime}`}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
            `}</style>
        </div>
    );
}