// app/dashboard/page.tsx
'use client';

import DashboardCard from "@/components/dashboard-card";


export default function UserDashboard() {
    return (
        <main className="p-6 space-y-6">
            <DashboardCard />
        </main>
    );
}