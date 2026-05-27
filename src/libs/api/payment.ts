// src/libs/api/payment.ts

import axios from "axios";

// ── Types ──────────────────────────────────────────────────────────────────

export interface PaymentBreakdown {
  subtotal: number;
  vat: number;
  total: number;
}

export interface InitPaymentResponse {
  authorizationUrl: string;
  reference: string;
  breakdown: PaymentBreakdown;
}

export interface VisitPaymentData {
  _id: string;
  paymentStatus: "paid" | "pending" | "failed";
  paidAt?: string;
  payment?: PaymentBreakdown & { reference: string };
  userId?: string;
  clinicId?: string;
  status?: string;
}

export interface VerifyPaymentResponse {
  status: "success" | "fail";
  message: string;
  data?: VisitPaymentData;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function authHeader(): Record<string, string> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── Initiate ───────────────────────────────────────────────────────────────

export async function initPayment(visitId: string): Promise<InitPaymentResponse> {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/visit/${visitId}/pay`,
    {},
    { headers: authHeader() }
  );
  return res.data.data;
}

// ── Verify ─────────────────────────────────────────────────────────────────
// Express route: GET /verify/:reference

export async function verifyPayment(reference: string): Promise<VerifyPaymentResponse> {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/visit/verify/${reference}`,
    { headers: authHeader() }
  );
  return res.data;
}

// ── Callback URL ───────────────────────────────────────────────────────────
// Paystack hits your EXPRESS backend directly — not your Next.js frontend.
// Pass this as `callback_url` when initializing the transaction.
// Express verifies payment, updates DB, then redirects user to your success page.

export function getCallbackUrl(): string {
  return `${process.env.NEXT_PUBLIC_API_URL}/visit/callback`;
}