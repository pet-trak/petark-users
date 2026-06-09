// src/app/(owner)/dashboard/pets/[id]/page.tsx

"use client";

import { use } from "react";
import { useAuthStore, OwnerProfile } from "@/store/auth";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  PawPrint,
  ArrowLeft,
  Venus,
  Mars,
  CircleHelp,
  Cake,
  Weight,
  Dna,
  QrCode,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function GenderIcon({ gender }: { gender?: string }) {
  if (gender?.toLowerCase() === "female")
    return <Venus className="w-4 h-4 text-pink-400" />;
  if (gender?.toLowerCase() === "male")
    return <Mars className="w-4 h-4 text-blue-400" />;
  return <CircleHelp className="w-4 h-4 text-gray-400" />;
}

export default function PetDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { profile } = useAuthStore();

  const ownerProfile =
    profile?.type === "owner" ? (profile as OwnerProfile) : null;
  const pet = ownerProfile?.pets?.find((p) => p.id === id);

  if (!ownerProfile) {
    return <div className="p-6 text-sm text-gray-400">Loading...</div>;
  }

  if (!pet) {
    notFound();
  }

  const stats = [
    {
      icon: <GenderIcon gender={pet.gender} />,
      label: "Gender",
      value: pet.gender ?? null,
    },
    {
      icon: <Cake className="w-4 h-4 text-orange-400" />,
      label: "Age",
      value: pet.age ? `${pet.age} yrs` : null,
    },
    {
      icon: <Weight className="w-4 h-4 text-violet-400" />,
      label: "Weight",
      value: pet.weight ? `${pet.weight} kg` : null,
    },
    {
      icon: <Dna className="w-4 h-4 text-green-400" />,
      label: "Breed",
      value: pet.breed ?? null,
    },
    {
      icon: <CalendarDays className="w-4 h-4 text-sky-400" />,
      label: "Added",
      value: formatDate(pet.createdAt),
    },
  ];

  return (
    <main className="p-6 max-w-6xl mx-auto min-h-screen sec-ff">
      {/* BACK */}
      <Link
        href="/dashboard/profile"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Profile
      </Link>

      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-100 overflow-hidden mb-14">
        {/* PHOTO */}
        <div className="w-full h-56 bg-gray-100 relative">
          {pet.photo ? (
            <Image
              src={pet.photo}
              alt={pet.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <PawPrint className="w-12 h-12 text-gray-300" />
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="p-6 space-y-5">
          {/* NAME + SPECIES */}
          <div>
            <h1 className="text-xl font-bold text-gray-800">{pet.name}</h1>
            <p className="text-sm text-gray-400 mt-0.5 capitalize">
              {pet.species}
              {pet.breed ? ` · ${pet.breed}` : ""}
            </p>
          </div>

          {/* STATS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {stats.map(({ icon, label, value }) =>
              value ? (
                <div
                  key={label}
                  className="bg-gray-50 rounded-xl px-4 py-3 flex items-start gap-2.5"
                >
                  <div className="mt-0.5 shrink-0">{icon}</div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-0.5">
                      {label}
                    </p>
                    <p className="text-sm font-semibold text-gray-700 truncate">
                      {value}
                    </p>
                  </div>
                </div>
              ) : null
            )}
          </div>

          {/* QR CODE */}
          {pet.qrCode && (
            <div className="pt-1">
              <div className="flex items-center gap-1.5 mb-3">
                <QrCode className="w-4 h-4 text-gray-400" />
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  QR Code
                </p>
              </div>
              <Image
                src={pet.qrCode}
                alt={`${pet.name} QR Code`}
                width={120}
                height={120}
                className="rounded-xl border border-gray-100"
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}