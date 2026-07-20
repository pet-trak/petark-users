// src/app/(auth)/claim/[token]/page.tsx

import { Metadata } from "next";
import ClaimAccountCard from "@/components/auth/claim-account-card";

export const metadata: Metadata = {
    title: "Set Up Your Account",
    description: "Claim your PetArk account",
};

export default function ClaimPage() {
    return (
        <main className="py-6">
            <ClaimAccountCard />
        </main>
    );
}