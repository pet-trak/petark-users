'use client';

import { useState } from "react";
import { registerOwner } from "@/libs/api/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Spinner from "@/components/ui/spinner";

export default function RegisterComp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // added
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // send lowercase 'fullname' and phoneNumber to backend
      await registerOwner({ fullname: fullName, email, phoneNumber, password });
      // redirect to login page
      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col sm:flex-row items-stretch justify-center min-h-screen p-4 sm:p-10 font-sans shadow rounded-2xl pry-ff">

      {/* Left side - Branding */}
      <section
        className="hidden sm:flex w-[400px] p-10 rounded-l-2xl flex-col justify-start gap-4"
        style={{ backgroundColor: "var(--acc-clr)", color: "var(--pry-clr)" }}
      >
        <div className="flex items-start justify-start">
          <Image
            src="/official_logo_remove.png"
            alt="PetTrak Logo"
            width={200}
            height={200}
            className="h-10 w-auto object-contain"
          />
        </div>
        <p className="text-3xl font-medium">Hey! Welcome to PetTrak</p>
        <p>Manage your pet’s health and happiness, all in one place.</p>
      </section>

      {/* Right side - Registration form */}
      <section className="flex-1 p-10 rounded-2xl sm:rounded-l-none sm:rounded-r-2xl flex flex-col justify-center bg-white max-w-md w-full">
        <h1 className="text-3xl font-semibold mb-6 text-center">
          Register for an Account
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Please enter your details to create your account.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <input
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded-md bg-gray-100"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded-md bg-gray-100"
          />

          {/* Phone Number */}
          <input
            type="tel"
            placeholder="Phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded-md bg-gray-100"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-2 border border-gray-300 rounded-md bg-gray-100"
          />

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? <Spinner /> : "Sign Up"}
          </button>

          <div className="flex items-center justify-center max-w-md w-full gap-2 text-sm mt-2">
            <span className="text-gray-600">Already have an account?</span>
            <Link href="/login" className="text-green-600 hover:underline">
              Login here
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}