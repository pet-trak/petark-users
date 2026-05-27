
// src/app/role-gate/page.tsx


'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

export default function RoleGate() {
    const router = useRouter();
    const { profile } = useAuthStore();

    useEffect(() => {
        if (!profile) {
            router.replace('/login'); // Not logged in → go to login
            return;
        }

        // Redirect based on role
        switch (profile.type) {
            case 'owner':
                router.replace('/dashboard'); // pet owner dashboard
                break;
            case 'clinic':
                router.replace('/clinic/dashboard');
                break;
            case 'vet':
                router.replace('/vet/dashboard');
                break;
            default:
                router.replace('/login'); // fallback
                break;
        }
    }, [profile, router]);

    return null; // nothing renders
}