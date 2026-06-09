// app/dashboard/page.tsx
'use client';

import NearbyClinicsPage from "@/components/nearby-clinics";;

export default function Dashboard() {
    return (
        <main className="p-3 sm:p-4 md:p-6">
            <NearbyClinicsPage />
        </main>
    );
}