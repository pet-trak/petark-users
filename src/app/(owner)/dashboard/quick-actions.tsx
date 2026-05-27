'use client';

import { Calendar, Clock, Plus } from "lucide-react";

interface QuickActionsProps {
  setActiveTab: (
    tab: "overview" | "today" | "upcoming" | "all plans"
  ) => void;
  onBookAppointment: () => void;
}

export default function QuickActions({
  setActiveTab,
  onBookAppointment,
}: Readonly<QuickActionsProps>) {
  return (
    <div className="mb-6 p-6 sm:p-8 bg-white rounded-2xl shadow-lg flex flex-col gap-4">
      <h1 className="text-lg sm:text-xl font-bold text-(--sec-clr) pry-ff">Quick Actions</h1>

      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
        {/* Book Appointment */}
        <button
          onClick={onBookAppointment}
          className="w-full sm:w-auto px-4 py-2 bg-(--acc-clr) text-(--pry-clr) rounded-xl flex items-center gap-2 font-semibold sec-ff justify-center"
        >
          <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-sm sm:text-base">Book Appointment</span>
        </button>

        {/* Today's Appointment */}
        <button
          onClick={() => setActiveTab("today")}
          className="w-full sm:w-auto px-4 py-2 bg-[#B9F8CF]/80 text-green-600 rounded-xl flex items-center gap-2 font-semibold sec-ff justify-center"
        >
          <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-sm sm:text-base">View Today&apos;s Appointment</span>
        </button>

        {/* Upcoming */}
        <button
          onClick={() => setActiveTab("upcoming")}
          className="w-full sm:w-auto px-4 py-2 bg-[#DBEAFE]/80 text-blue-500 rounded-xl flex items-center gap-2 font-semibold sec-ff justify-center"
        >
          <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="text-sm sm:text-base">View Upcoming</span>
        </button>
      </div>
    </div>
  );
}