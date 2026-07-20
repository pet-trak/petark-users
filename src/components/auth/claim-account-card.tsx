// src/components/auth/claim-account-card.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { getClaimPreview, claimAccount, ClaimPreview } from "@/libs/api/auth";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ClaimAccountCard() {
    const { token } = useParams<{ token: string }>();
    const router = useRouter();

    const [preview, setPreview] = useState<ClaimPreview | null>(null);
    const [loadingPreview, setLoadingPreview] = useState(true);
    const [previewError, setPreviewError] = useState<string | null>(null);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            try {
                const data = await getClaimPreview(token);
                setPreview(data);
            } catch (err) {
                const message =
                    err instanceof AxiosError
                        ? err.response?.data?.message ?? "This claim link is invalid or has expired."
                        : "This claim link is invalid or has expired.";
                setPreviewError(message);
            } finally {
                setLoadingPreview(false);
            }
        }
        load();
    }, [token]);

    const handleSubmit = async () => {
        setError(null);
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords don't match.");
            return;
        }

        setSubmitting(true);
        try {
            await claimAccount(token, password);
            toast.success("Account created! You can now log in.");
            router.push("/login");
        } catch (err) {
            const message =
                err instanceof AxiosError
                    ? err.response?.data?.message ?? "Failed to set up your account. Please try again."
                    : "Failed to set up your account. Please try again.";
            setError(message);
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingPreview) {
        return (
            <div className="flex items-center justify-center min-h-[40vh]">
                <Loader2 size={24} className="animate-spin text-acc-clr" />
            </div>
        );
    }

    if (previewError || !preview) {
        return (
            <div className="max-w-md mx-auto text-center p-6">
                <h1 className="text-lg font-semibold text-sec-clr mb-2">Link unavailable</h1>
                <p className="text-sm text-gray-500">{previewError}</p>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto px-4 py-8 space-y-6 pry-ff bg-pry-clr rounded-lg shadow">
            <div>
                <h1 className="text-xl font-semibold text-sec-clr">Set up your account</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Hi {preview.fullname}, create a password to finish setting up your PetArk account for {preview.email}.
                </p>
            </div>

            {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
                    {error}
                </div>
            )}

            <div className="space-y-3">
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-acc-clr focus:border-acc-clr transition"
                />
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-acc-clr focus:border-acc-clr transition"
                />
            </div>

            <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-acc-clr text-pry-clr rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
            >
                {submitting ? (
                    <>
                        <Loader2 size={14} className="animate-spin" /> Setting up...
                    </>
                ) : (
                    "Set Up My Account"
                )}
            </button>
        </div>
    );
}