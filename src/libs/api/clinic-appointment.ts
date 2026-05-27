// src/libs/api/clinic-appointment.ts
import axios from 'axios';
import type { AppointmentType } from '@/constants/appointmentTypes';

export { APPOINTMENT_TYPES } from '@/constants/appointmentTypes';
export type { AppointmentType } from '@/constants/appointmentTypes';

/* =========================
   Appointment Status
========================= */
export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled';

export type UserAddress = {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string | null;
};

/* =========================
   Sub-types (exported for use in components)
========================= */
export type AppointmentOwner = {
  _id: string;
  fullname: string;
  email: string;
  phoneNumber?: string;
  address?: UserAddress;
};

export type AppointmentPet = {
  _id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight?: number;
  gender?: string;
  photo?: string;
  qrCode?: string;
};

export type AppointmentVet = {
  _id: string;
  fullname: string;
  email: string;
  phone: string;
};

export type AppointmentClinic = {
  _id: string;
  clinicName: string;
  email: string;
  phone: string;
  address?: UserAddress;
  startingTime?: string;
  closingTime?: string;
};

/* =========================
   Appointment Model
========================= */
export type Appointment = {
  _id: string;
  time: string;
  date: string;
  status: AppointmentStatus;
  notes?: string;
  type?: AppointmentType;

  // Populated by aggregation pipeline on the backend
  owner: AppointmentOwner | null;
  pet: AppointmentPet | null;
  clinic: AppointmentClinic | null;
  vet?: AppointmentVet | null;

  confirmedBy?: string | null;
  confirmedAt?: string | null;
  completedAt?: string | null;
  completedBy?: string | null;
};

/* =========================
   Response shapes
========================= */
interface AppointmentsResponse {
  status: string;
  count: number;
  appointments: Appointment[];
}

interface ApiErrorResponse {
  message?: string;
}

/* =========================
   Roles
========================= */
export type AppointmentRole = 'vet' | 'clinic';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

/* =========================
   Fetch Appointments
========================= */
export async function getAppointments(): Promise<Appointment[]> {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role') as AppointmentRole | null;

  if (!token) throw new Error('No authentication token found');
  if (role !== 'clinic' && role !== 'vet') throw new Error('Invalid role for fetching appointments');

  const url =
    role === 'clinic'
      ? `${apiUrl}/appointment/clinics`
      : `${apiUrl}/appointment/vets`;

  try {
    const res = await axios.get<AppointmentsResponse>(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data.appointments;
  } catch (error: unknown) {
    let message = 'Failed to fetch appointments';
    if (axios.isAxiosError(error)) {
      const data = error.response?.data as ApiErrorResponse | undefined;
      message = data?.message ?? error.message ?? message;
    }
    throw new Error(message);
  }
}

/* =========================
   Fetch Appointment by ID
========================= */
export async function getAppointmentById(
  appointmentId: string,
  role: AppointmentRole
): Promise<Appointment> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');
  if (!appointmentId) throw new Error('Appointment ID is required');

  const url =
    role === 'clinic'
      ? `${apiUrl}/appointment/clinics/${appointmentId}`
      : `${apiUrl}/appointment/vets/${appointmentId}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = (await res.json()) as {
    message?: string;
    data?: { appointment: Appointment };
  };

  if (!res.ok) throw new Error(data?.message || 'Failed to fetch appointment');

  return data.data!.appointment;
}

/* =========================
   Update Appointment Status
========================= */
export async function updateAppointmentStatus(
  appointmentId: string,
  status: AppointmentStatus
): Promise<Appointment> {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');

  const res = await axios.patch(
    `${apiUrl}/appointment/${appointmentId}/status`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return res.data.data as Appointment;
}