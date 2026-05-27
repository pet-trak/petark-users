// src/libs/api/user-visits.ts

import axios from 'axios';

const api_url = process.env.NEXT_PUBLIC_API_URL;

export type UserVisitPet = {
    _id: string;
    name: string;
    species: string;
    breed: string;
    age: number;
    gender: string;
    photo?: string;
};

export type UserVisit = {
    _id: string;
    status: 'in-progress' | 'completed' | 'cancelled';
    vitals: {
        weight: number;
        temp: number;
        pulse: number;
        respiration: number;
    };
    billing: {
        total: number;
    };
    paymentStatus: 'unpaid' | 'paid';
    createdAt: string;
    completedAt: string | null;
    appointmentType: string;
    pet: UserVisitPet;
};

export async function getUserVisits(): Promise<UserVisit[]> {
    try {
        const token = localStorage.getItem('token'); // 👈 verify this key matches
        if (!token) throw new Error('Not authenticated');

        const res = await axios.get(`${api_url}/visit/user`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        return res.data.data as UserVisit[];
    } catch (error: any) {
        throw error?.response?.data || error;
    }
}