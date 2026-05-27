// Dashboard.tsx
"use client";

import ProfilePage from "@/app/(owner)/dashboard/profile/page";
import GetAppointmentPage from "@/app/(owner)/dashboard/appointments/getAppointment";
import HealthAlerts from "./health-alerts";

export default function Dashboard() {
    return (
        <main className="min-h-screen bg-[#f8faf9] px-4 md:px-6 py-6">
            {/* Header */}

            {/* Main Grid */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left / Main content */}
                <div className="lg:col-span-8 space-y-6">
                    {/* My Pets (inside ProfilePage or split later) */}

                    {/* Upcoming Appointments */}
                    <GetAppointmentPage />
                </div>

                {/* Right rail */}
                <aside className="lg:col-span-4 space-y-6">
                    <HealthAlerts />
                </aside>
            </section>
        </main>
    );
}