'use client';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import dayjs from "dayjs";
import Spinner from "@/components/ui/spinner";
import { MapPin, Clock, Stethoscope, PawPrint } from "lucide-react";
import { getMyPets, getClinicSchedule, bookAppointments, Appointment } from "@/libs/api/appointment";
import BookAppointment from "@/components/book-appointment";

interface Address {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode?: string;
}

export interface Clinic {
    _id: string;
    clinicName: string;
    address: string | Address;
    daysOpen: string[];
    startingTime: string;
    closingTime: string;
    servicesProvided?: string[];
}

// Fetch clinic by ID
async function fetchClinicById(clinicId: string): Promise<Clinic | null> {
    if (!clinicId) return null;
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/user/clinic/${clinicId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        return response.data.data.clinic || null;
    } catch (error: unknown) {
        console.error("Error fetching clinic by ID:", error);
        return null;
    }
}

const parseAddress = (address: string | Address): string => {
    if (!address) return "";
    if (typeof address === "string") return address;
    return `${address.street}, ${address.city}, ${address.state}, ${address.country}`;
};

export default function ClinicByIdPage() {
    const params = useParams();
    const clinicId = Array.isArray(params.id) ? params.id[0] : params.id;

    const [clinic, setClinic] = useState<Clinic | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showBooking, setShowBooking] = useState(false);

    useEffect(() => {
        if (!clinicId) return;

        const loadClinic = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchClinicById(clinicId);
                if (data) setClinic(data);
                else setError("Clinic not found.");
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Failed to fetch clinic.");
            } finally {
                setLoading(false);
            }
        };
        loadClinic();
    }, [clinicId]);

    if (loading) return <div className="flex justify-center py-16"><Spinner /></div>;
    if (error) return <p className="text-red-500 text-center mt-8">{error}</p>;
    if (!clinic) return null;

    return (
        <main className="p-4 sm:p-6 md:p-8 space-y-6 max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 sec-ff">{clinic.clinicName}</h1>

            {/* Location */}
            <div className="p-4 bg-white shadow-md rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <MapPin size={20} className="text-green-500" />
                <div className="flex-1">
                    <h2 className="text-sm font-semibold text-gray-700 sec-ff">Location</h2>
                    <p className="text-gray-600 text-sm pry-ff">{parseAddress(clinic.address)}</p>
                </div>
            </div>

            {/* Opening Hours */}
            <div className="p-4 bg-white shadow-md rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <Clock size={20} className="text-green-500" />
                <div className="flex-1">
                    <h2 className="text-sm font-semibold text-gray-700 sec-ff">Opening Hours</h2>
                    <p className="text-gray-600 text-sm pry-ff">
                        {clinic.daysOpen.join(", ")} ({clinic.startingTime} - {clinic.closingTime})
                    </p>
                </div>
            </div>

            {/* Services */}
            {clinic.servicesProvided && clinic.servicesProvided.length > 0 && (
                <div className="p-4 bg-white shadow-md rounded-xl">
                    <h2 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2 sec-ff">
                        <Stethoscope size={16} className="text-green-500" /> Services Provided
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {clinic.servicesProvided.map((service, idx) => (
                            <span
                                key={idx}
                                className="bg-green-100 pry-ff text-green-600 text-xs px-3 py-1 rounded-full min-w-max"
                            >
                                {service}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* SPA Booking */}
            <div className="relative">
                {!showBooking ? (
                    <button
                        onClick={() => setShowBooking(true)}
                        className="w-full mt-4 flex items-center justify-center gap-2 bg-[var(--acc-clr)] pry-ff text-white py-3 rounded-xl hover:bg-green-600 text-sm font-semibold cursor-pointer"
                    >
                        <PawPrint size={16} /> Book Appointment
                    </button>
                ) : (
                    <BookAppointment clinicId={clinic._id}/>
                )}
            </div>
        </main>
    );
}
