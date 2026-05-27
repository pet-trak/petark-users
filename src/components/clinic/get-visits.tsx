// don't use this component. Use the get-visit-detail component instead, which is more comprehensive and better designed. This component is now deprecated and will be removed in future updates.

"use client";

import { useEffect, useState } from "react";
import { getClinicVisits, Visit } from "@/libs/api/clinic-visit";
import Spinner from "../ui/spinner";
import { Activity, ChevronRight, ChevronDown, Heart } from "lucide-react";
import Image from "next/image";

const STATUS_COLOR: Record<string, string> = {
    "in-progress": "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    cancelled: "bg-red-100 text-red-700",
};

export default function GetVisits() {
    const [visits, setVisits] = useState<Visit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVisits = async () => {
            try {
                const data = await getClinicVisits();
                setVisits(data);
            } catch (err: any) {
                setError(err?.message || "Failed to fetch visits");
            } finally {
                setLoading(false);
            }
        };

        fetchVisits();
    }, []);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col w-full lg:w-80 xl:w-96 flex-shrink-0">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-(--acc-clr)" />
                    <h2 className="text-sm font-bold text-(--sec-clr) sec-ff uppercase tracking-wide">
                        Recent Medical Visits
                    </h2>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <Spinner />
                    </div>
                )}

                {!loading && error && (
                    <p className="text-red-500 text-sm text-center py-8 px-4">{error}</p>
                )}

                {!loading && !error && visits.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 px-4">
                        <Activity className="w-10 h-10 text-gray-200 mb-3" />
                        <p className="text-gray-400 text-sm sec-ff">No visits found</p>
                    </div>
                )}

                {!loading && !error && visits
                    .filter((visit) => visit?._id && visit?.status)
                    .map((visit) => (
                        <div
                            key={visit._id}
                            className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition-colors duration-150 group cursor-pointer"
                        >
                            {/* Pet Avatar */}
                            <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 mt-0.5 bg-gradient-to-br from-[#38E07B] to-[#2bc466]">
                                {visit.pet?.photo ? (
                                    <Image
                                        src={visit.pet.photo}
                                        alt={visit.pet.name}
                                        width={40}
                                        height={40}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Heart className="w-4 h-4 text-white/60" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-0.5">
                                    <p className="text-sm font-semibold text-(--sec-clr) sec-ff truncate">
                                        {visit.pet?.name ?? "Unknown Pet"}
                                    </p>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full sec-ff flex-shrink-0 capitalize ${STATUS_COLOR[visit.status] ?? "bg-gray-100 text-gray-600"}`}>
                                        {visit.status}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 mb-1">
                                    {visit.pet?.age != null && (
                                        <span className="text-xs text-gray-500 pry-ff">
                                            {visit.pet.age} yrs
                                        </span>
                                    )}
                                    {visit.pet?.age != null && (
                                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                                    )}
                                    <span className="text-xs text-gray-400 pry-ff font-mono">
                                        #{visit.petId.slice(0, 8).toUpperCase()}
                                    </span>
                                </div>

                                {visit.notes && (
                                    <p className="text-xs text-gray-600 pry-ff line-clamp-2 leading-relaxed">
                                        {visit.notes}
                                    </p>
                                )}

                                <p className="text-[11px] text-gray-400 pry-ff mt-1.5">
                                    {new Date(visit.createdAt).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>

                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-400 flex-shrink-0 mt-2 transition-colors" />
                        </div>
                    ))}
            </div>

            <div className="flex items-center justify-center w-full">
                <button className="text-sm text-[var(--sec-clr)]/60 hover:text-gray-700 pry-ff flex items-center gap-1 justify-center py-3 transition-colors cursor-pointer border border-dotted border-gray-400 px-12 mt-4 mb-3">
                    <ChevronDown className="w-4 h-4 text-[var(--sec-clr)]/60 group-hover:text-gray-400 flex-shrink-0 transition-colors" />
                    <span>View History</span>
                </button>
            </div>
        </div>
    );
}