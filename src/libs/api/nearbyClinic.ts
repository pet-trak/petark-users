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
  phoneNumber?: string;
  daysOpen: string[];
  startingTime: string;
  closingTime: string;
  servicesProvided: string[];
}

/* ================= RAW API SHAPES ================= */

interface RawClinicProfile {
  description?: string;
  clinicName?: string;
  servicesProvided?: string[];
}

interface RawClinic {
  _id: string;
  clinicName?: string;
  fullname?: string;
  phoneNumber?: string;
  phone?: string;
  address: Address;
  daysOpen?: string[];
  startingTime: string;
  closingTime: string;
  servicesProvided?: string[];
  clinicProfile?: RawClinicProfile;
}

interface FetchClinicsResponse {
  status: string;
  results: number;
  data: {
    clinics: RawClinic[];
  };
}

interface FetchClinicByIdResponse {
  status: string;
  data: {
    clinic: RawClinic;
  };
}

/* ================= HELPERS ================= */

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

function mergeServices(c: RawClinic): string[] {
  const rootServices = c.servicesProvided ?? [];
  const profileServices = c.clinicProfile?.servicesProvided ?? [];
  return Array.from(new Set([...rootServices, ...profileServices]));
}

function mapRawClinic(c: RawClinic): Clinic {
  return {
    _id: c._id,
    clinicName: c.clinicName ?? c.clinicProfile?.clinicName ?? c.fullname ?? 'Unnamed Clinic',
    address: c.address,
    phoneNumber: c.phoneNumber ?? c.phone,
    daysOpen: c.daysOpen ?? [],
    startingTime: c.startingTime,
    closingTime: c.closingTime,
    servicesProvided: mergeServices(c),
  };
}

/* ================= API ================= */

export async function fetchClinics(): Promise<Clinic[]> {
  const token = getToken();
  if (!token) throw new Error('Authentication required');

  const response = await axios.get<FetchClinicsResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/owner/clinics`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const clinics = response.data?.data?.clinics ?? [];
  return clinics.map(mapRawClinic);
}

/* ================= SINGLE CLINIC ================= */

export async function fetchClinicById(clinicId: string): Promise<Clinic | null> {
  const token = getToken();
  if (!token) return null;

  const response = await axios.get<FetchClinicByIdResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/user/clinic/${clinicId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const c = response.data?.data?.clinic;
  if (!c) return null;

  return mapRawClinic(c);
}