"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function RegisterComp() {
    const router = useRouter();
    const [index, setIndex] = useState(0);

    const messages = [
        "A unified system for veterinary clinics and pet owners.",
        "Track vaccinations, treatments, and appointments in one place.",
        "Built for modern clinics and responsible pet owners.",
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % messages.length);
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    const roles = [
        {
            name: "Veterinary Clinic",
            route: "/signup/clinic",
            description: "Manage appointments, records, staff, and client communication.",
        },
        {
            name: "Pet Owner",
            route: "/signup/pet-owner",
            description: "Book visits, track vaccinations, and receive smart health reminders.",
        },
    ];

    return (
        <main className="flex flex-col sm:flex-row items-stretch justify-center min-h-screen p-4 sm:p-10 pry-ff shadow rounded-2xl">

            {/* Left side - Branding */}
            <section className="hidden sm:flex w-[400px] bg-(--acc-clr) text-(--pry-clr) p-10 rounded-l-2xl flex-col justify-between">
                <div className="flex flex-col gap-6">
                    <Link href="/">
                        <Image
                            src="/official_logo_remove.png"
                            alt="PetTrak Logo"
                            width={200}
                            height={200}
                            className="h-10 w-auto object-contain"
                        />
                    </Link>

                    <p className="text-3xl font-medium leading-tight">Welcome to PetTrak</p>

                    <p
                        key={index}
                        className="text-xl opacity-90 transition-opacity duration-700 ease-in-out"
                    >
                        {messages[index]}
                    </p>
                </div>

                <p className="text-sm opacity-70">Precision pet healthcare infrastructure.</p>
            </section>

            {/* Right side - Role Selection */}
            <section className="flex-1 p-10 rounded-2xl sm:rounded-l-none sm:rounded-r-2xl flex flex-col justify-center bg-white max-w-md w-full">

                <h1 className="text-3xl font-semibold mb-4 text-center">Create Your Account</h1>
                <p className="text-gray-600 mb-10 text-center">Select how you want to use PetTrak.</p>

                <div className="flex flex-col gap-5 w-full">
                    {roles.map((role) => (
                        <button
                            key={role.name}
                            onClick={() => router.push(role.route)}
                            className="group w-full border border-gray-300 rounded-xl p-5 text-left 
                         transition-all duration-300 ease-out 
                         hover:-translate-y-1 hover:shadow-lg hover:border-(--acc-clr) 
                         active:scale-[0.98] cursor-pointer"
                        >
                            <p className="font-semibold text-lg flex items-center justify-between">
                                {role.name}
                                <span className="opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                    →
                                </span>
                            </p>
                            <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                        </button>
                    ))}
                </div>

                <div className="flex items-center justify-center mt-10 text-sm gap-2">
                    <span className="text-(--sec-clr)">Already have an account?</span>
                    <Link href="/login" className="text-(--acc-clr) hover:underline">Log in</Link>
                </div>
            </section>
        </main>
    );
}