// src/libs/api/nearbyClinic.ts

import axios from 'axios';

/* ================= TYPES ================= */

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string;
}

export interface Clinic {
  _id: string;
  clinicName: string;
  address: Address;
  phone?: string;
  daysOpen: string[];
  startingTime: string;
  closingTime: string;
  servicesProvided: string[]; // ✅ raw strings
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
}

/* ================= HELPERS ================= */

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

/* ================= API ================= */

function mergeServices(c: any): string[] {
  const rootServices = c.servicesProvided ?? [];
  const profileServices = c.clinicProfile?.servicesProvided ?? [];
  // Merge and remove duplicates
  return Array.from(new Set([...rootServices, ...profileServices]));
}

export async function fetchClinics(): Promise<Clinic[]> {
  const token = getToken();
  if (!token) throw new Error('Authentication required');

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/user/clinics`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const clinics = response.data?.data?.clinics ?? [];

  const mapped: Clinic[] = clinics.map((c: any) => ({
    _id: c._id,
    clinicName: c.clinicProfile?.clinicName ?? c.fullname ?? 'Unnamed Clinic',
    address: c.address,
    phone: c.phone || c.phoneNumber,
    daysOpen: c.daysOpen ?? [],
    startingTime: c.startingTime,
    closingTime: c.closingTime,
    servicesProvided: mergeServices(c),
    location: c.location,
  }));

  return mapped;
}

/* ================= SINGLE CLINIC ================= */

export async function fetchClinicById(clinicId: string): Promise<Clinic | null> {
  const token = getToken();
  if (!token) return null;

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/user/clinic/${clinicId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const c = response.data?.data?.clinic;
  if (!c) return null;

  return {
    _id: c._id,
    clinicName: c.clinicProfile?.clinicName ?? c.fullname ?? 'Unnamed Clinic',
    address: c.address,
    phone: c.phone || c.phoneNumber,
    daysOpen: c.daysOpen ?? [],
    startingTime: c.startingTime,
    closingTime: c.closingTime,
    servicesProvided: mergeServices(c),
    location: c.location,
  };
}