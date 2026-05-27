'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast, Toaster } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import Spinner from '@/components/ui/spinner';
import { login, UserRole } from '@/libs/api/auth';
import { useAuthStore, Profile, OwnerProfile, ClinicProfile, VetProfile } from '@/store/auth';

export default function LoginComp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const setProfile = useAuthStore((state) => state.setProfile);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const roles: UserRole[] = ['owner', 'clinic', 'vet'];
    let data: Awaited<ReturnType<typeof login>> | null = null;

    for (const role of roles) {
      try {
        data = await login(role, { email, password });
        break;
      } catch {
        // try next role
      }
    }

    if (!data) {
      setLoading(false);
      setError('Invalid email or password');
      toast.error('Login failed');
      return;
    }

    try {
      let profile: Profile;

      if (data.user.role === 'owner') {
        const ownerProfile: OwnerProfile = {
          id: data.user.id,
          fullname: data.user.fullname ?? null,
          email: data.user.email,
          phoneNumber: '',
          address: { country: null, city: null, street: null, zipCode: null },
          pets: [],
          type: 'owner',
        };
        profile = ownerProfile;
      } else if (data.user.role === 'clinic') {
        const clinicProfile: ClinicProfile = {
          id: data.user.id,
          clinicName: data.user.clinicName ?? null,
          email: data.user.email,
          phone: '',
          address: { country: null, city: null, street: null, state: null, zipCode: null },
          vets: [],
          servicesProvided: [],
          pricing: [],
          type: 'clinic',
        };
        profile = clinicProfile;
      } else {
        const vetProfile: VetProfile = {
          id: data.user.id,
          fullname: data.user.fullname ?? null,
          email: data.user.email,
          phone: '',
          clinicId: '',
          type: 'vet',
        };
        profile = vetProfile;
      }

      setProfile(profile, data.token);
      localStorage.setItem('role', data.user.role);

      toast.success(`Logged in as ${data.user.role}!`);
      router.push('/role-gate');
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Login failed');
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />

      <main className="flex flex-col sm:flex-row items-stretch justify-center min-h-screen p-4 sm:p-10 pry-ff shadow rounded-2xl">
        {/* Left side */}
        <section className="hidden sm:flex w-[400px] bg-(--acc-clr) text-(--pry-clr) p-10 rounded-l-2xl flex-col gap-4">
          <div
            onClick={() => router.push('/')}
            className="flex items-start justify-start cursor-pointer">
            <Image
              src="/official_logo_remove.png"
              alt="PetTrak Logo"
              width={200}
              height={200}
              className="h-10 w-auto object-contain"
            />
          </div>
          <p className="text-3xl font-medium">Welcome back!</p>
          <p>Manage your pet&apos;s health and happiness, all in one place.</p>
        </section>

        {/* Right side */}
        <section className="flex-1 p-10 rounded-2xl sm:rounded-l-none sm:rounded-r-2xl flex flex-col justify-center bg-white max-w-md w-full">
          <h1 className="text-3xl font-semibold mb-6 text-center">Login to your Account</h1>
          <p className="text-gray-600 mb-6 text-center">Please enter your credentials to access your dashboard.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-2 border border-gray-300 rounded-md bg-gray-100"
            />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 pr-10 border border-gray-300 rounded-md bg-gray-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && <p className="text-red-600 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="bg-(--acc-clr) text-white py-2 rounded-md hover:bg-(--acc-clr)/80 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? <Spinner /> : 'Login'}
            </button>

            <div className="flex items-center justify-center max-w-md w-full gap-2 text-sm mt-2">
              <span className="text-(--sec-clr)">Don&apos;t have an account?</span>
              <Link href="/signup" className="text-(--acc-clr)">Sign up for free</Link>
            </div>
          </form>
        </section>
      </main>
    </>
  );
}