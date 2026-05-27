// src/libs/api/clinic-visit.ts

import axios from 'axios';

const api_url = process.env.NEXT_PUBLIC_API_URL;

interface Vital {
    weight: number;
    temp: number;
    pulse: number;
    respiration: number;
    appetite: string;
    activity: string;
}

export type Billing = {
    professionalFee: number;
    vat: number;
    total: number;
};

export type VisitPet = {
    _id: string;
    name: string;
    species: string;
    breed: string;
    age: number;
    weight: number;
    gender: string;
    photo?: string;
};

export type Visit = {
    _id: string;
    appointmentId: string;
    petId: string;
    userId: string;
    clinicId: string;
    vetId: string | null;
    status: 'in-progress' | 'completed' | 'cancelled';
    vitals: Vital;
    notes?: string;
    billing: Billing;
    paymentStatus: 'unpaid' | 'paid';
    createdAt: string;
    completedAt: string | null;
    pet: VisitPet;
};

export type CreateVisitPayload = {
    appointmentId: string;
    petId: string;
    vetId?: string;
    vitals?: Vital;
    notes?: string;
};

export async function createVisit(payload: CreateVisitPayload): Promise<Visit> {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");

        const res = await axios.post(`${api_url}/visit`, payload, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return res.data.data as Visit;
    } catch (error: any) {
        throw error?.response?.data || error;
    }
}

export async function getClinicVisits(): Promise<Visit[]> {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");

        const res = await axios.get(`${api_url}/visit/clinic`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return res.data.data as Visit[];
    } catch (error: any) {
        throw error?.response?.data || error;
    }
}

export async function getVisitByAppointmentId(appointmentId: string): Promise<Visit | null> {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");

        const res = await axios.get(`${api_url}/visit/appointment/${appointmentId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return res.data.data as Visit;
    } catch (error: any) {
        if (error?.response?.status === 404) return null;
        throw error?.response?.data || error;
    }
}

export async function updateVitals(
    visitId: string,
    payload: { vitals?: Partial<Vital>; appointmentType?: string }
): Promise<Visit> {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");

        const res = await axios.patch(`${api_url}/visit/vitals/${visitId}`, payload, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return res.data.data as Visit;
    } catch (error: any) {
        throw error?.response?.data || error;
    }
}

export async function completeVisit(visitId: string): Promise<Visit> {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not authenticated");

        const res = await axios.patch(`${api_url}/visit/complete/${visitId}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return res.data.data as Visit;
    } catch (error: any) {
        throw error?.response?.data || error;
    }
}