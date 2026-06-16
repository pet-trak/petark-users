"use client";

import { useState } from "react";
import { registerOwner } from "@/libs/api/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Loader2, Eye, EyeOff } from "lucide-react";
import PhoneInput from "react-phone-number-input";

export default function RegisterComp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await registerOwner({ fullname: fullName, email, phoneNumber, password });
      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Registration failed");
    } finally {
      setLoading(false);
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
                Simplifying care for<br />every animal.
              </p>
              <p className="text-pry-clr/80 text-sm mt-2 leading-relaxed">
                Manage your pet&apos;s health and happiness, all in one place.
              </p>
            </div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white/60 bg-white/20 -ml-2 first:ml-0"
                />
              ))}
            </div>
            <p className="text-pry-clr/70 text-xs">Trusted by over 3,000 pet owners</p>
          </div>
        </section>

        {/* ── Right: Form ── */}
        <section className="flex-1 flex flex-col justify-start md:justify-center p-8 md:p-12">

          {/* mobile logo */}
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
            Create Your Account
          </h1>
          <p className="text-sm mb-8" style={{ color: "var(--sec-clr)", opacity: 0.6 }}>
            Please enter your details to get started.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">

            {/* Full name */}
            <input
              type="text"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="p-3 border rounded-lg text-sm outline-none bg-gray-50"
              style={{ borderColor: "#e5e7eb", color: "var(--sec-clr)" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--acc-clr)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
            />

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-3 border rounded-lg text-sm outline-none bg-gray-50"
              style={{ borderColor: "#e5e7eb", color: "var(--sec-clr)" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--acc-clr)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
            />

            {/* Phone with country selector */}
            <div
              className="phone-container flex items-center border rounded-lg bg-gray-50 px-3"
              style={{ borderColor: "#e5e7eb" }}
            >
              <PhoneInput
                international
                defaultCountry="NG"
                value={phoneNumber}
                onChange={(val) => setPhoneNumber(val ?? "")}
                className="w-full text-sm outline-none bg-transparent"
                style={{ color: "var(--sec-clr)" }}
                onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                  const parent = e.currentTarget.closest(".phone-container") as HTMLElement;
                  if (parent) parent.style.borderColor = "var(--acc-clr)";
                }}
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                  const parent = e.currentTarget.closest(".phone-container") as HTMLElement;
                  if (parent) parent.style.borderColor = "#e5e7eb";
                }}
              />
            </div>

            {/* Password with eye toggle */}
            <div
              className="flex items-center border rounded-lg bg-gray-50 px-3"
              style={{ borderColor: "#e5e7eb" }}
            >
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="flex-1 py-3 text-sm outline-none bg-transparent"
                style={{ color: "var(--sec-clr)" }}
                onFocus={(e) => {
                  const parent = e.currentTarget.parentElement as HTMLElement;
                  if (parent) parent.style.borderColor = "var(--acc-clr)";
                }}
                onBlur={(e) => {
                  const parent = e.currentTarget.parentElement as HTMLElement;
                  if (parent) parent.style.borderColor = "#e5e7eb";
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Terms & Conditions checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative mt-0.5 shrink-0">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className="w-4 h-4 rounded border-2 flex items-center justify-center transition-all"
                  style={{
                    borderColor: agreedToTerms ? "var(--acc-clr)" : "#d1d5db",
                    backgroundColor: agreedToTerms ? "var(--acc-clr)" : "transparent",
                  }}
                >
                  {agreedToTerms && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-xs leading-relaxed" style={{ color: "var(--sec-clr)", opacity: 0.7 }}>
                I have read and agree to PetArk&apos;s{" "}
                <Link
                  href="/terms"
                  target="_blank"
                  className="font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity"
                  style={{ color: "var(--acc-clr)", opacity: 1 }}
                >
                  Terms of Service & Privacy Policy
                </Link>
              </span>
            </label>

            {error && (
              <p className="text-red-500 text-xs text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !agreedToTerms}
              className="mt-2 w-full py-3 rounded-lg text-pry-clr font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
              style={{ backgroundColor: "var(--acc-clr)" }}
              onMouseEnter={(e) => { if (!loading && agreedToTerms) e.currentTarget.style.filter = "brightness(1.1)"; }}
              onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
            >
              {loading ? <Loader2 className="animate-spin" /> : "Sign up"}
            </button>

            <p className="text-sm text-center mt-2" style={{ color: "var(--sec-clr)", opacity: 0.7 }}>
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold hover:underline underline-offset-4"
                style={{ color: "var(--acc-clr)", opacity: 1 }}
              >
                Log in
              </Link>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}