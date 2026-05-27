// frontend/src/libs/api/clinic.ts
import axios, { AxiosError } from 'axios';
import { ClinicProfile } from '@/store/auth';

export async function getClinicProfile(): Promise<ClinicProfile> {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/clinic/profile`;

    const { data } = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const clinic = data.data.clinic;

    return {
      id: clinic._id ?? clinic.id,
      clinicName: clinic.clinicName ?? null,
      email: clinic.email ?? null,
      phone: clinic.phone ?? null,
      address: clinic.address ?? undefined,
      vets: clinic.vets ?? [],
      type: 'clinic',
      servicesProvided: clinic.servicesProvided ?? [],
      pricing: clinic.pricing ?? [],
    };
  } catch (error: unknown) {
    let message = 'Clinic profile fetch failed';

    if (error instanceof AxiosError) {
      message =
        (error.response?.data as any)?.message ??
        error.message ??
        message;
    }

    throw new Error(message);
  }
}