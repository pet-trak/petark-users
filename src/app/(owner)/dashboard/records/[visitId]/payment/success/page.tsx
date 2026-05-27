// src/app/(owner)/dashboard/records/[visitId]/payment/success/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { verifyPayment } from "@/libs/api/payment";
import type { VisitPaymentData } from "@/libs/api/payment";

type Status = "verifying" | "confirmed" | "failed";

export default function PaymentSuccessPage() {
  const { visitId } = useParams<{ visitId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get("reference");

  // Derive initial state from reference — avoids calling setState inside effect
  const [status, setStatus] = useState<Status>(
    reference ? "verifying" : "failed"
  );
  const [visit, setVisit] = useState<VisitPaymentData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(
    reference ? null : "No payment reference found."
  );

  useEffect(() => {
    if (!reference) return;

    verifyPayment(reference)
      .then((res) => {
        if (res.status === "success" && res.data) {
          setVisit(res.data);
          setStatus("confirmed");
        } else {
          setErrorMsg(res.message);
          setStatus("failed");
        }
      })
      .catch((err: unknown) => {
        const message = axios.isAxiosError(err)
          ? (err.response?.data?.message ?? "Verification failed")
          : "Verification failed";
        setErrorMsg(message);
        setStatus("failed");
      });
  }, [reference]);

  const fmt = (val: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(val);

  const fmtDate = (d?: string) =>
    d
      ? new Date(d).toLocaleDateString("en-NG", { dateStyle: "medium" })
      : "—";

  // ── Verifying ────────────────────────────────────────────────────────────
  if (status === "verifying") {
    return (
      <main className="min-h-screen bg-[#f7f5f0] flex items-center justify-center px-4 sec-ff">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 border-4 border-[#e0dbd0] border-t-[#0f2e1f] rounded-full animate-spin mx-auto" />
          <p className="text-sm text-[#6b7a6e] font-medium">
            Confirming your payment…
          </p>
        </div>
      </main>
    );
  }

  // ── Failed ───────────────────────────────────────────────────────────────
  if (status === "failed") {
    return (
      <main className="min-h-screen bg-[#f7f5f0] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#fff1f1] border border-[#fcd4d4] mb-5">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#d9534f"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-[#0f2e1f] mb-2">
            Payment Not Confirmed
          </h1>
          <p className="text-sm text-[#6b7a6e] mb-1">
            {errorMsg ?? "We couldn't verify your payment."}
          </p>
          {reference && (
            <p className="text-xs text-[#a0a89e] mb-8">
              Reference:{" "}
              <span className="font-mono font-medium text-[#0f2e1f]">
                {reference}
              </span>
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() =>
                router.push(`/dashboard/records/${visitId}/payment`)
              }
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-[#0f2e1f] text-white text-sm font-semibold hover:bg-[#1a4a31] transition-colors"
            >
              Try Again
            </button>
            <a
              href="mailto:support@pettrak.com"
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl border border-[#e0dbd0] bg-white text-[#0f2e1f] text-sm font-semibold hover:border-[#0f2e1f] transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </main>
    );
  }

  // ── Confirmed ────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#f7f5f0] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Badge */}
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center w-20 h-20 mb-4">
            <div className="absolute inset-0 rounded-full bg-[#d4f0dc] animate-ping opacity-25" />
            <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#0f2e1f]">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7eca8f"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-[#0f2e1f] tracking-tight">
            Payment Successful
          </h1>
          <p className="text-sm text-[#6b7a6e] mt-1">
            This visit has been paid for.
          </p>
        </div>

        {/* Receipt */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#e8e4dc] overflow-hidden">
          <div className="bg-[#0f2e1f] px-6 py-3 flex items-center justify-between">
            <span className="text-[#7eca8f] text-xs font-medium uppercase tracking-widest">
              Reference
            </span>
            <span className="text-white text-xs font-mono">{reference}</span>
          </div>

          <div className="px-6 py-6 space-y-3">
            {visit?.payment && (
              <>
                <Row label="Subtotal" value={fmt(visit.payment.subtotal)} />
                <Row label="VAT (7.5%)" value={fmt(visit.payment.vat)} />
                <div className="border-t border-dashed border-[#e0dbd0] pt-3">
                  <Row
                    label="Total Paid"
                    value={fmt(visit.payment.total)}
                    bold
                  />
                </div>
              </>
            )}

            <div className="border-t border-dashed border-[#e0dbd0] pt-3 space-y-3">
              <Row
                label="Record ID"
                value={<span className="font-mono text-xs">{visitId}</span>}
              />
              <Row label="Date Paid" value={fmtDate(visit?.paidAt)} />
              <Row
                label="Status"
                value={
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1a7a3c] bg-[#d4f0dc] px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1a7a3c] inline-block" />
                    Paid
                  </span>
                }
              />
            </div>
          </div>

          <div className="px-6 pb-6 flex flex-col gap-3">
            <button
              onClick={() => router.push(`/dashboard/records/${visitId}`)}
              className="w-full bg-[#0f2e1f] hover:bg-[#1a4a31] text-white text-sm font-semibold py-3.5 rounded-2xl transition-colors"
            >
              View Record
            </button>
            <button
              onClick={() => router.push("/dashboard/records")}
              className="w-full border border-[#e0dbd0] bg-white hover:border-[#0f2e1f] text-[#0f2e1f] text-sm font-semibold py-3.5 rounded-2xl transition-colors"
            >
              Back to Records
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-[#a0a89e] mt-6">
          A receipt has been sent to your registered email.
        </p>
      </div>
    </main>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: React.ReactNode;
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