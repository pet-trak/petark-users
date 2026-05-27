// src/app/(owner)/dashboard/records/[visitId]/payment/page.tsx

"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { initPayment } from "@/libs/api/payment";
import type { PaymentBreakdown } from "@/libs/api/payment";

export default function InitiatePaymentPage() {
  const { visitId } = useParams<{ visitId: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [breakdown, setBreakdown] = useState<PaymentBreakdown | null>(null);

  const handlePay = async () => {
    setLoading(true);
    setError(null);
    try {
      const { authorizationUrl, breakdown } = await initPayment(visitId);
      setBreakdown(breakdown);
      setTimeout(() => {
        window.location.href = authorizationUrl;
      }, 1200);
    } catch (err: unknown) {
      const message =
        axios.isAxiosError(err)
          ? err.response?.data?.message ?? "Failed to initiate payment"
          : "Failed to initiate payment";
      setError(message);
      setLoading(false);
    }
  };

  const fmt = (val: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(val);

  return (
    <main className="min-h-screen bg-[#f7f5f0] flex items-center justify-center px-4 sec-ff">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0f2e1f] mb-4">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7eca8f"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-[#0f2e1f] tracking-tight">
            Visit Payment
          </h1>
          <p className="text-sm text-[#6b7a6e] mt-1">
            Secure checkout via Paystack
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#e8e4dc] overflow-hidden">
          {/* Visit ID strip */}
          <div className="bg-[#0f2e1f] px-6 py-3 flex items-center justify-between">
            <span className="text-[#7eca8f] text-xs font-medium uppercase tracking-widest">
              Record ID
            </span>
            <span className="text-white text-xs font-mono">{visitId}</span>
          </div>

          <div className="px-6 py-8">
            {breakdown ? (
              <div className="mb-6 space-y-3 animate-fade-in">
                <BreakdownRow label="Subtotal" value={fmt(breakdown.subtotal)} />
                <BreakdownRow label="VAT (7.5%)" value={fmt(breakdown.vat)} />
                <div className="border-t border-dashed border-[#e0dbd0] pt-3">
                  <BreakdownRow
                    label="Total"
                    value={fmt(breakdown.total)}
                    bold
                  />
                </div>
                <p className="text-xs text-center text-[#7eca8f] pt-1 animate-pulse">
                  Redirecting to Paystack…
                </p>
              </div>
            ) : (
              <p className="text-sm text-[#6b7a6e] leading-relaxed mb-6">
                You`re about to pay for this completed visit. A VAT of{" "}
                <span className="font-medium text-[#0f2e1f]">7.5%</span> will
                be applied to the billed amount. You`ll be redirected to
                Paystack to complete payment securely.
              </p>
            )}

            {error && (
              <div className="mb-5 flex items-start gap-2 rounded-xl bg-[#fff1f1] border border-[#fcd4d4] px-4 py-3">
                <svg
                  className="mt-0.5 shrink-0"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#d9534f"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-sm text-[#b33a3a]">{error}</p>
              </div>
            )}

            <button
              onClick={handlePay}
              disabled={loading || !!breakdown}
              className="w-full bg-[#0f2e1f] hover:bg-[#1a4a31] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              {loading || breakdown ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {breakdown ? "Redirecting…" : "Processing…"}
                </>
              ) : (
                <>
                  Proceed to Payment
                  <svg
                    className="group-hover:translate-x-0.5 transition-transform"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
            </button>

            <p className="text-xs text-center text-[#a0a89e] mt-4 flex items-center justify-center gap-1">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Payments processed securely by Paystack
            </p>
          </div>
        </div>

        <button
          onClick={() => router.back()}
          className="mt-6 mx-auto flex items-center gap-1.5 text-xs text-[#a0a89e] hover:text-[#0f2e1f] transition-colors"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to record
        </button>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.35s ease both;
        }
      `}</style>
    </main>
  );
}

function BreakdownRow({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={`text-sm ${bold ? "font-semibold text-[#0f2e1f]" : "text-[#6b7a6e]"}`}
      >
        {label}
      </span>
      <span
        className={`text-sm ${bold ? "font-semibold text-[#0f2e1f]" : "text-[#2e3d31]"}`}
      >
        {value}
      </span>
    </div>
  );
}