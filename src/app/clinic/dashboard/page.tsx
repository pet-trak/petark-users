// app/dashboard/page.tsx
'use client';
import ClinicDashboard from "@/components/clinic/clinic-dashboard";

export default function Dashboard() {
    return (
        <main className="p-6 space-y-6">
            <ClinicDashboard />
        </main>
    );
}