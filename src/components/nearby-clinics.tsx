'use client';

import { useState, useEffect, useRef } from "react";
import { fetchClinics, Clinic } from "@/libs/api/nearbyClinic";
import {
    getClinicSchedule,
    ClinicScheduleDay,
    bookAppointments,
    BookAppointmentQuery,
} from '@/libs/api/appointment';
import { getUserProfile, Pet } from '@/libs/api/user';
import axios from 'axios';
import Spinner from "@/components/ui/spinner";
import {
    MapPin, Clock, Stethoscope, ChevronLeft, ChevronRight,
    Calendar, Info, Phone, ChevronDown, ArrowLeft
} from "lucide-react";
import FilterClinic from "@/app/(owner)/dashboard/nearby-clinic/filter-clinic";
import { toast } from 'sonner';

interface Address {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode?: string;
}

// Converts "14:30" → "2:30 PM", "09:00" → "9:00 AM"
function to12Hour(time24: string): string {
    const [h, m] = time24.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

function formatServiceLabel(service: string): string {
    return service
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (s) => s.toUpperCase())
        .trim();
}

export default function NearbyClinicsPage() {
    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [filteredClinics, setFilteredClinics] = useState<Clinic[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
    const [schedule, setSchedule] = useState<ClinicScheduleDay[]>([]);
    const [pets, setPets] = useState<Pet[]>([]);
    const [selectedPetId, setSelectedPetId] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [bookingLoading, setBookingLoading] = useState(false);
    const [scheduleLoading, setScheduleLoading] = useState(false);
    const [mobileView, setMobileView] = useState<'list' | 'booking'>('list');

    const dateRef = useRef<HTMLDivElement>(null);
    const today = new Date();

    const filteredSchedule = schedule
        .filter(d => new Date(d.date) >= today)
        .map(d => ({ ...d, isOpen: d.slots.some(s => s.available) }));

    const selectedDay = filteredSchedule.find(d => d.date === selectedDate);
    const morningSlots = selectedDay?.slots.filter(s => parseInt(s.time.split(':')[0]) < 12) ?? [];
    const afternoonSlots = selectedDay?.slots.filter(s => parseInt(s.time.split(':')[0]) >= 12) ?? [];

    useEffect(() => {
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchClinics();
                if (data?.length > 0) {
                    setClinics(data);
                    setFilteredClinics(data);
                } else {
                    setError("No clinics found.");
                }
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Failed to fetch clinics");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        if (!selectedClinic) return;
        (async () => {
            setScheduleLoading(true);
            setSelectedDate('');
            setSelectedTime('');
            try {
                const [sched, profile] = await Promise.all([
                    getClinicSchedule(selectedClinic._id),
                    getUserProfile(),
                ]);
                setSchedule(sched);
                setPets(profile.pets ?? []);
            } catch (err: any) {
                toast.error(err.message || "Failed to load schedule");
            } finally {
                setScheduleLoading(false);
            }
        })();
    }, [selectedClinic]);

    const handleSelectClinic = (clinic: Clinic) => {
        setSelectedClinic(clinic);
        setMobileView('booking');
    };

    const parseAddress = (address: string | Address): string => {
        if (!address) return "";
        if (typeof address === "string") return address;
        return `${address.street}, ${address.city}, ${address.state}, ${address.country}`;
    };

    const scroll = (dir: 'left' | 'right') => {
        dateRef.current?.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
    };

    const getMonthHeader = () => {
        if (!filteredSchedule.length) return 'Available Dates';
        return new Date(filteredSchedule[0].date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    const handleBook = async () => {
        if (!selectedPetId || !selectedDate || !selectedTime) {
            toast.error('Select pet, date and time');
            return;
        }
        setBookingLoading(true);
        try {
            const query: BookAppointmentQuery = { clinicId: selectedClinic!._id };
            // Slots come back as "10:30" (24h) — backend expects "10:30 AM" (12h)
            const time12 = to12Hour(selectedTime);
            await bookAppointments({ petId: selectedPetId, date: selectedDate, time: time12 }, query);
            toast.success(`Appointment booked for ${time12}`);
            setSchedule(prev => prev.map(day => {
                if (day.date !== selectedDate) return day;
                return {
                    ...day,
                    slots: day.slots.map(slot =>
                        slot.time === selectedTime ? { ...slot, available: false } : slot
                    ),
                    isOpen: day.slots.some(s => s.available),
                };
            }));
            setSelectedTime('');
            setSelectedDate('');
        } catch (err: any) {
            if (axios.isAxiosError(err)) {
                toast.error(err.response?.data?.message || (typeof err.response?.data === 'string' ? err.response.data : 'Failed to book appointment'));
            } else {
                toast.error('Failed to book appointment');
            }
        } finally {
            setBookingLoading(false);
        }
    };

    const selectedPetName = pets.find(p => p.id === selectedPetId)?.name;

    const timeSlotClass = (time: string, available: boolean) => {
        if (selectedTime === time) return 'bg-(--acc-clr) text-white shadow-sm border border-transparent';
        if (available) return 'bg-white border border-gray-200 text-(--sec-clr) hover:border-(--acc-clr) hover:bg-green-50';
        return 'bg-gray-50 border border-gray-100 text-gray-300 cursor-not-allowed line-through decoration-red-300';
    };

    return (
        <div className="w-full sec-ff">
            <div className="mb-4">
                <h1 className="text-xl font-bold text-(--sec-clr) pry-ff">Book Appointment</h1>
                <p className="text-gray-400 text-xs mt-0.5 sec-ff">Find the best care for your furry friends.</p>
            </div>

            {/* ─── DESKTOP layout ─── */}
            <div className="hidden lg:flex gap-5 items-start w-full">
                <div className="w-[360px] xl:w-[400px] flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-3 border-b border-gray-100 space-y-2">
                        <FilterClinic clinics={clinics} setFilteredClinics={setFilteredClinics} />
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <select className="w-full appearance-none bg-gray-50 border border-gray-200 text-sm text-gray-600 rounded-xl px-3 py-2 pr-7 focus:outline-none focus:border-(--acc-clr) sec-ff cursor-pointer">
                                    <option>All Specialties</option>
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                            </div>
                            <div className="relative flex-1">
                                <select className="w-full appearance-none bg-gray-50 border border-gray-200 text-sm text-gray-600 rounded-xl px-3 py-2 pr-7 focus:outline-none focus:border-(--acc-clr) sec-ff cursor-pointer">
                                    <option>Any Availability</option>
                                </select>
                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                    <div className="overflow-y-auto divide-y divide-gray-50" style={{ maxHeight: 'calc(100vh - 240px)' }}>
                        {loading && <div className="flex justify-center py-10"><Spinner /></div>}
                        {error && <p className="text-red-500 text-sm text-center py-6 px-4">{error}</p>}
                        {!loading && filteredClinics.map(clinic => {
                            const isSelected = selectedClinic?._id === clinic._id;
                            const services = clinic.servicesProvided ?? [];
                            return (
                                <button key={clinic._id} onClick={() => handleSelectClinic(clinic)}
                                    className={`w-full text-left px-4 py-3.5 flex items-start gap-3 transition-all duration-150 border-l-4
                                        ${isSelected ? 'bg-green-50 border-(--acc-clr)' : 'hover:bg-gray-50 border-transparent'}`}>
                                    <div className="w-11 h-11 rounded-xl bg-green-50 flex-shrink-0 flex items-center justify-center">
                                        <Stethoscope className="w-5 h-5 text-(--acc-clr)" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-bold truncate sec-ff ${isSelected ? 'text-(--acc-clr)' : 'text-(--sec-clr)'}`}>{clinic.clinicName}</p>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                            <p className="text-xs text-gray-500 truncate pry-ff">{parseAddress(clinic.address)}</p>
                                        </div>
                                        <div className="flex flex-wrap gap-1 mt-1.5">
                                            {services.slice(0, 4).map((s, i) => (
                                                <span key={i} className="text-[10px] font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase tracking-wide">
                                                    {formatServiceLabel(s)}
                                                </span>
                                            ))}
                                            {services.length > 4 && (
                                                <span className="text-[10px] font-semibold bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
                                                    +{services.length - 4} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                        {!loading && filteredClinics.length === 0 && <p className="text-gray-400 text-sm text-center py-8 sec-ff">No clinics match your search.</p>}
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <DesktopBookingPanel
                        selectedClinic={selectedClinic}
                        scheduleLoading={scheduleLoading}
                        filteredSchedule={filteredSchedule}
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        selectedTime={selectedTime}
                        setSelectedTime={setSelectedTime}
                        selectedPetId={selectedPetId}
                        setSelectedPetId={setSelectedPetId}
                        selectedPetName={selectedPetName}
                        pets={pets}
                        morningSlots={morningSlots}
                        afternoonSlots={afternoonSlots}
                        selectedDay={selectedDay}
                        getMonthHeader={getMonthHeader}
                        scroll={scroll}
                        dateRef={dateRef}
                        handleBook={handleBook}
                        bookingLoading={bookingLoading}
                        timeSlotClass={timeSlotClass}
                    />
                </div>
            </div>

            {/* ─── MOBILE layout ─── */}
            <div className="lg:hidden w-full max-w-md mx-auto">
                {mobileView === 'list' ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden w-full">
                        <div className="p-3 border-b border-gray-100 space-y-2">
                            <FilterClinic clinics={clinics} setFilteredClinics={setFilteredClinics} />
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <select className="w-full appearance-none bg-gray-50 border border-gray-200 text-sm text-gray-600 rounded-xl px-3 py-2 pr-7 focus:outline-none focus:border-(--acc-clr) sec-ff">
                                        <option>All Specialties</option>
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                                </div>
                                <div className="relative flex-1">
                                    <select className="w-full appearance-none bg-gray-50 border border-gray-200 text-sm text-gray-600 rounded-xl px-3 py-2 pr-7 focus:outline-none focus:border-(--acc-clr) sec-ff">
                                        <option>Any Availability</option>
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {loading && <div className="flex justify-center py-10"><Spinner /></div>}
                            {error && <p className="text-red-500 text-sm text-center py-6 px-4">{error}</p>}
                            {!loading && filteredClinics.map(clinic => {
                                const isSelected = selectedClinic?._id === clinic._id;
                                const services = clinic.servicesProvided ?? [];
                                return (
                                    <button key={clinic._id} onClick={() => handleSelectClinic(clinic)}
                                        className={`w-full text-left px-4 py-3.5 flex items-start gap-3 transition-all duration-150 border-l-4
                                            ${isSelected ? 'bg-green-50 border-(--acc-clr)' : 'hover:bg-gray-50 border-transparent'}`}>
                                        <div className="w-10 h-10 rounded-xl bg-green-50 flex-shrink-0 flex items-center justify-center">
                                            <Stethoscope className="w-4 h-4 text-(--acc-clr)" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-bold truncate sec-ff ${isSelected ? 'text-(--acc-clr)' : 'text-(--sec-clr)'}`}>{clinic.clinicName}</p>
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                                <p className="text-xs text-gray-500 truncate pry-ff">{parseAddress(clinic.address)}</p>
                                            </div>
                                            <div className="flex flex-wrap gap-1 mt-1.5">
                                                {services.slice(0, 3).map((s, i) => (
                                                    <span key={i} className="text-[10px] font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase tracking-wide">
                                                        {formatServiceLabel(s)}
                                                    </span>
                                                ))}
                                                {services.length > 3 && (
                                                    <span className="text-[10px] font-semibold bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
                                                        +{services.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1" />
                                    </button>
                                );
                            })}
                            {!loading && filteredClinics.length === 0 && <p className="text-gray-400 text-sm text-center py-8 sec-ff">No clinics match your search.</p>}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden w-full">
                        <div className="flex items-center justify-between gap-2 px-4 py-3.5 border-b border-gray-100">
                            <div className="flex items-center gap-2 min-w-0">
                                <button onClick={() => setMobileView('list')}
                                    className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0">
                                    <ArrowLeft className="w-4 h-4 text-gray-600" />
                                </button>
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-(--sec-clr) sec-ff truncate">{selectedClinic?.clinicName}</p>
                                    <p className="text-[11px] text-gray-400 pry-ff">{selectedPetId ? `${selectedPetName}'s visit` : 'Select pet, date & time'}</p>
                                </div>
                            </div>
                            <div className="relative flex-shrink-0">
                                <select
                                    value={selectedPetId}
                                    onChange={e => setSelectedPetId(e.target.value)}
                                    className="appearance-none bg-gray-50 border border-gray-200 text-xs font-semibold text-(--sec-clr) rounded-xl pl-2.5 pr-6 py-2 focus:outline-none focus:border-(--acc-clr) sec-ff cursor-pointer max-w-[120px]"
                                >
                                    <option value="">Select pet</option>
                                    {pets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                                <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {scheduleLoading ? (
                            <div className="flex justify-center py-12"><Spinner /></div>
                        ) : (
                            <div className="p-4 space-y-5">
                                {(selectedClinic?.servicesProvided ?? []).length > 0 && (
                                    <div>
                                        <h3 className="text-xs font-bold text-(--sec-clr) sec-ff uppercase tracking-wide mb-2">Services Offered</h3>
                                        <div className="flex flex-wrap gap-1.5">
                                            {selectedClinic!.servicesProvided.map((s, i) => (
                                                <span key={i} className="text-[10px] font-semibold bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded-full flex items-center gap-1 sec-ff">
                                                    <Stethoscope className="w-2.5 h-2.5" />
                                                    {formatServiceLabel(s)}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h2 className="text-xs font-bold text-(--sec-clr) sec-ff uppercase tracking-wide">{getMonthHeader()}</h2>
                                        <div className="flex gap-1">
                                            <button onClick={() => scroll('left')} className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                                                <ChevronLeft className="w-3.5 h-3.5 text-gray-600" />
                                            </button>
                                            <button onClick={() => scroll('right')} className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                                                <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
                                            </button>
                                        </div>
                                    </div>
                                    <div ref={dateRef} className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                                        {filteredSchedule.map(day => {
                                            const dateObj = new Date(day.date);
                                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                                            const dayNum = dateObj.getDate();
                                            const hasSlots = day.slots.some(s => s.available);
                                            const isActive = selectedDate === day.date;
                                            return (
                                                <button key={day.date} onClick={() => hasSlots && setSelectedDate(day.date)} disabled={!hasSlots}
                                                    className={`flex flex-col items-center justify-center min-w-[48px] px-2 py-2.5 rounded-xl font-semibold flex-shrink-0 transition-all duration-150
                                                        ${isActive ? 'bg-(--acc-clr) text-white shadow-sm'
                                                            : hasSlots ? 'bg-gray-50 border border-gray-200 text-(--sec-clr) hover:border-(--acc-clr) hover:bg-green-50'
                                                                : 'bg-gray-50 border border-gray-100 opacity-60 cursor-not-allowed'}`}>
                                                    <span className={`text-[10px] font-semibold uppercase tracking-wide leading-none ${isActive ? 'text-white/80' : !hasSlots ? 'text-gray-300 line-through' : 'text-gray-400'}`}>{dayName}</span>
                                                    <span className={`text-sm font-bold leading-tight mt-0.5 ${!hasSlots && !isActive ? 'text-gray-300 line-through' : ''}`}>{dayNum}</span>
                                                    {!hasSlots && <span className="text-[8px] font-bold text-red-400 uppercase mt-0.5">Full</span>}
                                                </button>
                                            );
                                        })}
                                        {filteredSchedule.length === 0 && <p className="text-xs text-gray-400 py-3 sec-ff">No available dates.</p>}
                                    </div>
                                </div>

                                {selectedDay && (
                                    <div className="space-y-3">
                                        <h3 className="text-xs font-bold text-(--sec-clr) sec-ff uppercase tracking-wide">Available Times</h3>
                                        {morningSlots.length > 0 && (
                                            <div>
                                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5 pry-ff">Morning</p>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {morningSlots.map(slot => (
                                                        <button key={slot.time} onClick={() => slot.available && setSelectedTime(slot.time)} disabled={!slot.available}
                                                            className={`py-2 rounded-xl text-xs font-semibold transition-all duration-150 sec-ff ${timeSlotClass(slot.time, slot.available)}`}>
                                                            {to12Hour(slot.time)}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {afternoonSlots.length > 0 && (
                                            <div>
                                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5 pry-ff">Afternoon</p>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {afternoonSlots.map(slot => (
                                                        <button key={slot.time} onClick={() => slot.available && setSelectedTime(slot.time)} disabled={!slot.available}
                                                            className={`py-2 rounded-xl text-xs font-semibold transition-all duration-150 sec-ff ${timeSlotClass(slot.time, slot.available)}`}>
                                                            {to12Hour(slot.time)}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {selectedDay.slots.every(s => !s.available) && (
                                            <p className="text-gray-400 text-xs text-center py-3 sec-ff">No available time slots.</p>
                                        )}
                                    </div>
                                )}

                                <div className="bg-green-50 border border-green-100 rounded-2xl p-3 flex gap-2.5">
                                    <Info className="w-3.5 h-3.5 text-(--acc-clr) flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-gray-600 pry-ff leading-relaxed">
                                        Appointments must be manually confirmed by the clinic before they are finalized.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3 border border-gray-100">
                                        <Clock className="w-4 h-4 text-(--acc-clr) flex-shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-bold text-(--acc-clr) uppercase sec-ff">Hours</p>
                                            <p className="text-xs font-bold text-(--sec-clr) sec-ff truncate">
                                                {selectedClinic?.startingTime && selectedClinic?.closingTime
                                                    ? `${selectedClinic.startingTime} – ${selectedClinic.closingTime}`
                                                    : 'See schedule'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-3 border border-gray-100">
                                        <Phone className="w-4 h-4 text-(--acc-clr) flex-shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-bold text-(--acc-clr) uppercase sec-ff">Call</p>
                                            <p className="text-xs font-bold text-(--sec-clr) sec-ff truncate">{selectedClinic?.phone ?? '—'}</p>
                                        </div>
                                    </div>
                                </div>

                                {selectedPetId && selectedDate && selectedTime && (
                                    <button onClick={handleBook} disabled={bookingLoading}
                                        className="w-full bg-(--acc-clr) hover:bg-green-500 text-white py-3.5 rounded-2xl font-bold text-sm shadow-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sec-ff">
                                        {bookingLoading ? <Spinner /> : (
                                            <>
                                                <Calendar className="w-4 h-4 flex-shrink-0" />
                                                <span className="truncate">
                                                    Request — {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, {to12Hour(selectedTime)}
                                                </span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Desktop booking panel ──
function DesktopBookingPanel({
    selectedClinic, scheduleLoading, filteredSchedule,
    selectedDate, setSelectedDate, selectedTime, setSelectedTime,
    selectedPetId, setSelectedPetId, selectedPetName, pets,
    morningSlots, afternoonSlots, selectedDay,
    getMonthHeader, scroll, dateRef, handleBook,
    bookingLoading, timeSlotClass
}: any) {
    if (!selectedClinic) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-24 px-6">
                <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mb-4">
                    <Calendar className="w-8 h-8 text-(--acc-clr)" />
                </div>
                <p className="text-base font-semibold text-(--sec-clr) sec-ff">Select a clinic to book</p>
                <p className="text-sm text-gray-400 mt-1 text-center pry-ff">Choose a clinic from the list to view available slots.</p>
            </div>
        );
    }

    const services: string[] = selectedClinic.servicesProvided ?? [];

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden w-full max-w-2xl mx-auto">
            <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-4 h-4 text-(--acc-clr)" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-(--sec-clr) sec-ff truncate">{selectedClinic.clinicName}</p>
                        <p className="text-xs text-gray-400 pry-ff">
                            {selectedPetId ? `Select a date and time for ${selectedPetName}'s visit` : 'Select your pet, then pick a date and time'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-gray-500 sec-ff">Booking for:</span>
                    <div className="relative">
                        <select
                            value={selectedPetId}
                            onChange={e => setSelectedPetId(e.target.value)}
                            className="appearance-none bg-gray-50 border border-gray-200 text-sm font-semibold text-(--sec-clr) rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:border-(--acc-clr) sec-ff cursor-pointer"
                        >
                            <option value="">Select pet</option>
                            {pets.map((p: Pet) => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {scheduleLoading ? <div className="flex justify-center py-16"><Spinner /></div> : (
                <div className="p-6 space-y-6">
                    {selectedPetId && (
                        <div className="bg-green-50 border border-green-100 rounded-2xl p-3 flex items-center gap-3">
                            <Stethoscope className="w-5 h-5 text-(--acc-clr) flex-shrink-0" />
                            <p className="text-sm font-semibold text-(--sec-clr) sec-ff">
                                Booking for <span className="font-bold">{selectedPetName}</span>
                            </p>
                        </div>
                    )}

                    {services.length > 0 && (
                        <div>
                            <h3 className="text-sm font-bold text-(--sec-clr) sec-ff mb-2">Services Offered</h3>
                            <div className="flex flex-wrap gap-1.5">
                                {services.map((s: string, i: number) => (
                                    <span key={i} className="text-[11px] font-semibold bg-green-50 text-green-700 border border-green-100 px-2.5 py-1 rounded-full flex items-center gap-1 sec-ff">
                                        <Stethoscope className="w-3 h-3" />
                                        {formatServiceLabel(s)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-bold text-(--sec-clr) sec-ff">{getMonthHeader()}</h2>
                            <div className="flex gap-1.5">
                                <button onClick={() => scroll('left')} className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                                </button>
                                <button onClick={() => scroll('right')} className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors">
                                    <ChevronRight className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>
                        </div>
                        <div ref={dateRef} className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                            {filteredSchedule.map((day: any) => {
                                const dateObj = new Date(day.date);
                                const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                                const dayNum = dateObj.getDate();
                                const hasSlots = day.slots.some((s: any) => s.available);
                                const isActive = selectedDate === day.date;
                                return (
                                    <button key={day.date} onClick={() => hasSlots && setSelectedDate(day.date)} disabled={!hasSlots}
                                        className={`flex flex-col items-center justify-center min-w-[56px] px-2 py-3 rounded-xl font-semibold flex-shrink-0 transition-all duration-150
                                            ${isActive ? 'bg-(--acc-clr) text-white shadow-sm'
                                                : hasSlots ? 'bg-gray-50 border border-gray-200 text-(--sec-clr) hover:border-(--acc-clr) hover:bg-green-50'
                                                    : 'bg-gray-50 border border-gray-100 opacity-60 cursor-not-allowed'}`}>
                                        <span className={`text-[10px] font-semibold uppercase tracking-wide ${isActive ? 'text-white/80' : !hasSlots ? 'text-gray-300 line-through' : 'text-gray-400'}`}>{dayName}</span>
                                        <span className={`text-base font-bold leading-tight mt-0.5 ${!hasSlots && !isActive ? 'text-gray-300 line-through' : ''}`}>{dayNum}</span>
                                        {!hasSlots && <span className="text-[8px] font-bold text-red-400 uppercase mt-0.5">Full</span>}
                                    </button>
                                );
                            })}
                            {filteredSchedule.length === 0 && <p className="text-sm text-gray-400 py-4 sec-ff">No available dates.</p>}
                        </div>
                    </div>

                    {selectedDay && (
                        <div>
                            <h3 className="text-sm font-bold text-(--sec-clr) sec-ff mb-3">Available Time Slots</h3>
                            {morningSlots.length > 0 && (
                                <div className="mb-4">
                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2 pry-ff">Morning</p>
                                    <div className="grid grid-cols-4 xl:grid-cols-5 gap-2">
                                        {morningSlots.map((slot: any) => (
                                            <button key={slot.time} onClick={() => slot.available && setSelectedTime(slot.time)} disabled={!slot.available}
                                                className={`py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 sec-ff ${timeSlotClass(slot.time, slot.available)}`}>
                                                {to12Hour(slot.time)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {afternoonSlots.length > 0 && (
                                <div>
                                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2 pry-ff">Afternoon</p>
                                    <div className="grid grid-cols-4 xl:grid-cols-5 gap-2">
                                        {afternoonSlots.map((slot: any) => (
                                            <button key={slot.time} onClick={() => slot.available && setSelectedTime(slot.time)} disabled={!slot.available}
                                                className={`py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 sec-ff ${timeSlotClass(slot.time, slot.available)}`}>
                                                {to12Hour(slot.time)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {selectedDay.slots.every((s: any) => !s.available) && (
                                <p className="text-gray-400 text-sm text-center py-4 sec-ff">No available time slots for this date.</p>
                            )}
                        </div>
                    )}

                    <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex gap-3">
                        <Info className="w-4 h-4 text-(--acc-clr) flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-(--sec-clr) sec-ff">Booking Policy</p>
                            <p className="text-xs text-gray-600 pry-ff mt-0.5 leading-relaxed">
                                Your request is pending. Appointments must be manually confirmed by the clinic before they are finalized.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                            <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                                <Clock className="w-5 h-5 text-(--acc-clr)" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-semibold text-(--acc-clr) uppercase tracking-wide sec-ff">Hours</p>
                                <p className="text-sm font-bold text-(--sec-clr) sec-ff truncate">
                                    {selectedClinic.startingTime && selectedClinic.closingTime
                                        ? `${selectedClinic.startingTime} – ${selectedClinic.closingTime}`
                                        : 'See schedule'}
                                </p>
                                <p className="text-xs text-gray-500 pry-ff truncate">
                                    {(selectedClinic.daysOpen ?? []).slice(0, 3).join(', ') || '—'}
                                    {(selectedClinic.daysOpen ?? []).length > 3 ? '…' : ''}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                            <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                                <Phone className="w-5 h-5 text-(--acc-clr)" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-semibold text-(--acc-clr) uppercase tracking-wide sec-ff">Need Help?</p>
                                <p className="text-sm font-bold text-(--sec-clr) sec-ff">Call Clinic</p>
                                <p className="text-xs text-gray-500 pry-ff truncate">{selectedClinic.phone ?? '—'}</p>
                            </div>
                        </div>
                    </div>

                    {selectedPetId && selectedDate && selectedTime && (
                        <button onClick={handleBook} disabled={bookingLoading}
                            className="w-full bg-(--acc-clr) hover:bg-green-500 text-white py-4 rounded-2xl font-bold text-sm shadow-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sec-ff">
                            {bookingLoading ? <Spinner /> : (
                                <>
                                    <Calendar className="w-4 h-4 flex-shrink-0" />
                                    Request Appointment — {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, {to12Hour(selectedTime)}
                                </>
                            )}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}