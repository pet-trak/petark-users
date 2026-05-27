// src/app/clinic/dashboard/profiles/profile-comp.tsx

'use client';

import { useEffect, useState } from 'react';
import { getClinicProfile } from '@/libs/api/clinic';
import { useAuthStore } from '@/store/auth';
import type { ClinicProfile } from '@/store/auth';

type VetForm = {
    _id: string;
    fullname: string;
    email: string;
    phone: string;
};

export default function ProfileComp() {
    const { profile, setProfile, token } = useAuthStore();

    // 🔒 Clinic-only narrowing
    const clinicProfile =
        profile?.type === 'clinic' ? (profile as ClinicProfile) : null;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        clinicName: '',
        email: '',
        phone: '',
        address: {
            street: '',
            city: '',
            state: '',
            country: '',
            zipCode: '',
        },
        vets: [] as VetForm[],
    });

    useEffect(() => {
        const hydrateForm = (data: ClinicProfile) => {
            setFormData({
                clinicName: data.clinicName ?? '',
                email: data.email ?? '',
                phone: data.phone ?? '',
                address: {
                    street: data.address?.street ?? '',
                    city: data.address?.city ?? '',
                    state: data.address?.state ?? '',
                    country: data.address?.country ?? '',
                    zipCode: data.address?.zipCode ?? '',
                },
                vets:
                    data.vets?.map(v => ({
                        _id: v.id, // normalized
                        fullname: v.fullname ?? '',
                        email: v.email ?? '',
                        phone: v.phone ?? '',
                    })) ?? [],
            });
        };

        const loadProfile = async () => {
            try {
                if (clinicProfile) {
                    hydrateForm(clinicProfile);
                    return;
                }

                const data = await getClinicProfile();
                if (token) setProfile(data, token);
                hydrateForm(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load clinic profile');
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, [clinicProfile, setProfile, token]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name.startsWith('address.')) {
            const key = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: { ...prev.address, [key]: value },
            }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    /* =========================
       Guards
    ========================= */
    if (loading) {
        return <main className="p-6 text-[var(--sec-clr)]">Loading profile…</main>;
    }

    if (error) {
        return <main className="p-6 text-red-500">{error}</main>;
    }

    if (!clinicProfile) {
        return <main className="p-6 text-red-500">Clinic profile not found</main>;
    }

    /* =========================
       UI
    ========================= */
    return (
        <main className="p-6 pry-ff max-w-4xl mx-auto space-y-6 bg-[var(--bg-clr)] rounded-lg shadow-md">
            <h1 className="text-3xl font-semibold text-[var(--sec-clr)]">
                Clinic Profile
            </h1>

            {/* Clinic Info */}
            <section className="bg-[var(--pry-clr)] p-6 rounded-md shadow-inner space-y-4">
                <h2 className="text-xl font-semibold text-[var(--sec-clr)]">
                    Clinic Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="clinicName"
                        placeholder="Clinic Name"
                        value={formData.clinicName}
                        onChange={handleChange}
                        className="p-2 border rounded-md w-full bg-[var(--bg-clr)]"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="p-2 border rounded-md w-full bg-[var(--bg-clr)]"
                    />

                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="p-2 border rounded-md w-full bg-[var(--bg-clr)]"
                    />
                </div>
            </section>

            {/* Address */}
            <section className="bg-[var(--pry-clr)] p-6 rounded-md shadow-inner space-y-4">
                <h2 className="text-xl font-semibold text-[var(--sec-clr)]">Address</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(['street', 'city', 'state', 'country', 'zipCode'] as const).map(
                        field => (
                            <input
                                key={field}
                                type="text"
                                name={`address.${field}`}
                                placeholder={field}
                                value={formData.address[field]}
                                onChange={handleChange}
                                className="p-2 border rounded-md w-full bg-[var(--bg-clr)]"
                            />
                        )
                    )}
                </div>
            </section>

            {/* Vets */}
            <section className="bg-[var(--pry-clr)] p-6 rounded-md shadow-inner space-y-4">
                <h2 className="text-xl font-semibold text-[var(--sec-clr)]">Vets</h2>

                {formData.vets.length === 0 ? (
                    <p className="text-[var(--sec-clr)]">No registered vets yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.vets.map(vet => (
                            <div
                                key={vet._id}
                                className="space-y-2 border p-3 rounded-md bg-[var(--bg-clr)]"
                            >
                                <input
                                    type="text"
                                    value={vet.fullname}
                                    readOnly
                                    className="p-2 border rounded-md w-full bg-[var(--bg-clr)]"
                                />
                                <input
                                    type="email"
                                    value={vet.email}
                                    readOnly
                                    className="p-2 border rounded-md w-full bg-[var(--bg-clr)]"
                                />
                                <input
                                    type="text"
                                    value={vet.phone}
                                    readOnly
                                    className="p-2 border rounded-md w-full bg-[var(--bg-clr)]"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}