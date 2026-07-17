"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { verifyEmailOTP, resendEmailOTP } from "@/libs/api/auth";
import { toast } from "sonner";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds
const OTP_VALIDITY = 599; // 9:59 in seconds, matches backend's 10-minute expiry

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function ConfirmEmailComp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const [expiresIn, setExpiresIn] = useState(OTP_VALIDITY);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const isExpired = expiresIn <= 0;

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    if (expiresIn <= 0) return;
    const timer = setInterval(() => setExpiresIn((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [expiresIn]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // digits only

    const next = [...digits];
    next[index] = value.slice(-1);
    setDigits(next);

    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim().slice(0, OTP_LENGTH);
    if (!/^\d+$/.test(pasted)) return;

    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((char, i) => (next[i] = char));
    setDigits(next);
    inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      if (isExpired) {
        setError("This code has expired. Please request a new one.");
        toast.error("This code has expired. Please request a new one.");
        return;
      }

      const otp = digits.join("");

      if (otp.length !== OTP_LENGTH) {
        setError(`Please enter the full ${OTP_LENGTH}-digit code.`);
        toast.error(`Please enter the full ${OTP_LENGTH}-digit code.`);
        return;
      }
      if (!email) {
        setError("Missing email. Please register again.");
        toast.error("Missing email. Please register again.");
        return;
      }

      setLoading(true);
      setError("");
      setSuccess("");

      try {
        const res = await verifyEmailOTP({ email, otp });
        setSuccess(res.message || "Email verified successfully.");

        toast.success("Email verified successfully.");
        setTimeout(() => router.push("/login"), 1200);

      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Verification failed.");
        toast.error("Verification failed.");

      } finally {
        setLoading(false);
      }
    },
    [digits, email, router, isExpired]
  );

  const handleResend = async () => {
    if (!email || cooldown > 0) return;

    setResending(true);
    setError("");
    setSuccess("");

    try {
      const res = await resendEmailOTP({ email });
      toast.success(res.message || "A new OTP has been sent to your email.");
      setCooldown(RESEND_COOLDOWN);

      setExpiresIn(OTP_VALIDITY);
      setDigits(Array(OTP_LENGTH).fill(""));
      inputsRef.current[0]?.focus();

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to resend OTP.");
      toast.error(err instanceof Error ? err.message : "Failed to resend OTP.");
      
    } finally {
      setResending(false);
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center pry-ff p-4"
      style={{ backgroundColor: "var(--bg-clr)" }}
    >
      <div className="w-full max-w-4xl flex rounded-2xl shadow-xl overflow-hidden bg-pry-clr">

        {/* ── Left: Branding (desktop only) ── */}
        <section
          className="hidden md:flex w-[340px] shrink-0 flex-col justify-between p-6 relative overflow-hidden"
          style={{ backgroundColor: "var(--acc-clr)" }}
        >
          <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full opacity-10 bg-pry-clr" />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full opacity-10 bg-pry-clr" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full opacity-5 bg-white" />

          <div className="relative z-10 flex flex-col gap-6">
            <Link href="/">
              <Image
                src="/petark_logo-remove.png"
                alt="PetArk Logo"
                width={300}
                height={300}
                className="h-20 w-auto object-contain"
              />
            </Link>

            <div>
              <p className="text-pry-clr text-2xl font-bold leading-snug">
                Almost there.
              </p>
              <p className="text-pry-clr/80 text-sm mt-2 leading-relaxed">
                Just one more step to secure your account.
              </p>
            </div>
          </div>

          <div className="relative z-10">
            <p className="text-pry-clr/70 text-xs">
              Didn&apos;t get an email? Check spam, or resend below.
            </p>
          </div>
        </section>

        {/* ── Right: Form ── */}
        <section className="flex-1 flex flex-col justify-start md:justify-center p-8 md:p-12">

          <div className="flex md:hidden justify-center mb-3">
            <Link href="/">
              <Image
                src="/white_petark_logo-remove.png"
                alt="PetArk Logo"
                width={800}
                height={700}
                className="h-24 w-auto object-contain"
              />
            </Link>
          </div>

          <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--sec-clr)" }}>
            Confirm Your Email
          </h1>
          <p className="text-sm mb-1" style={{ color: "var(--sec-clr)", opacity: 0.6 }}>
            {email ? (
              <>Enter the 6-digit code sent to <span className="font-semibold">{email}</span></>
            ) : (
              "Enter the 6-digit code sent to your email."
            )}
          </p>

          {/* Expiry countdown */}
          <p
            className="text-xs mb-8 font-medium"
            style={{ color: isExpired ? "#ef4444" : "var(--sec-clr)", opacity: isExpired ? 1 : 0.5 }}
          >
            {isExpired ? (
              "Code expired. Please resend."
            ) : (
              <>Code expires in <span className="tabular-nums">{formatTime(expiresIn)}</span></>
            )}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">

            {/* OTP inputs */}
            <div className="flex gap-2 justify-between">
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputsRef.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  disabled={isExpired}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-14 text-center text-xl font-semibold border rounded-lg outline-none bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ borderColor: "#e5e7eb", color: "var(--sec-clr)" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--acc-clr)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
                />
              ))}
            </div>

            {error && <p className="text-red-500 text-xs text-center">{error}</p>}
            {success && <p className="text-green-600 text-xs text-center">{success}</p>}

            <button
              type="submit"
              disabled={loading || isExpired}
              className="w-full py-3 rounded-lg text-pry-clr font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
              style={{ backgroundColor: "var(--acc-clr)" }}
              onMouseEnter={(e) => { if (!loading && !isExpired) e.currentTarget.style.filter = "brightness(1.1)"; }}
              onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
            >
              {loading ? <Loader2 className="animate-spin" /> : "Verify Email"}
            </button>

            <p className="text-sm text-center" style={{ color: "var(--sec-clr)", opacity: 0.7 }}>
              Didn&apos;t receive a code?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={cooldown > 0 || resending}
                className="font-semibold hover:underline underline-offset-4 disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed"
                style={{ color: "var(--acc-clr)" }}
              >
                {resending
                  ? "Sending..."
                  : cooldown > 0
                  ? `Resend in ${cooldown}s`
                  : "Resend code"}
              </button>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}