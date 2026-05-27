"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui/spinner";
import axios from "axios";

export default function RegisterClinicForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    clinicName: "",
    email: "",
    phone: "",
    licenseNumber: "",
    password: "",
    address: { street: "", city: "", state: "", country: "" },
  });

  const [docs, setDocs] = useState({
    licenseDocument: null as File | null,
    registrationCertificate: null as File | null,
    additionalDocuments: [] as File[],
  });

  const inputClass =
    "p-3 border border-gray-300 rounded-md bg-gray-100 focus:ring-2 focus:ring-(--acc-clr) focus:border-(--acc-clr) transition";
  const fileInputClass =
    "w-full border border-gray-300 rounded-md p-2 bg-gray-50 focus:ring-2 focus:ring-(--acc-clr) focus:border-(--acc-clr) transition";
  const buttonClass =
    "bg-(--acc-clr) text-white py-3 px-6 rounded-md hover:bg-(--acc-clr)/80 transition disabled:opacity-50 cursor-pointer";

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrev = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();

      // Append string fields
      formData.append("clinicName", form.clinicName);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("password", form.password);
      formData.append("licenseNumber", form.licenseNumber);

      // Append address as JSON string
      formData.append("address", JSON.stringify(form.address));

      // Append required files
      if (docs.licenseDocument) formData.append("licenseDocument", docs.licenseDocument);
      if (docs.registrationCertificate)
        formData.append("registrationCertificate", docs.registrationCertificate);

      // Append optional files
      docs.additionalDocuments.forEach((file) => formData.append("additionalDocuments", file));

      // Send request
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clinic/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      router.push("/verification"); // Redirect to verification page
    } catch (err: unknown) {
      if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Registration failed. Please try again.");
            }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 p-6 pry-ff">
      <section className="w-full max-w-lg bg-white p-10 rounded-2xl shadow-xl border border-gray-200">
        <h1 className="text-3xl font-semibold mb-6 text-center">Register Your Clinic</h1>
        <p className="text-gray-600 mb-6 text-center">Fill in your clinic details step by step.</p>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Step 0: Clinic Info */}
          {step === 0 && (
            <>
              <input
                type="text"
                placeholder="Clinic Name"
                value={form.clinicName}
                onChange={(e) => setForm({ ...form, clinicName: e.target.value })}
                required
                className={inputClass}
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className={inputClass}
              />
              <input
                type="tel"
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
                className={inputClass}
              />
              <button type="button" className={buttonClass} onClick={handleNext}>
                Next →
              </button>
            </>
          )}

          {/* Step 1: Security */}
          {step === 1 && (
            <>
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className={inputClass}
              />
              <input
                placeholder="License Number"
                value={form.licenseNumber}
                onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
                required
                className={inputClass}
              />
              <div className="flex justify-between">
                <button type="button" className={buttonClass} onClick={handlePrev}>
                  ← Previous
                </button>
                <button type="button" className={buttonClass} onClick={handleNext}>
                  Next →
                </button>
              </div>
            </>
          )}

          {/* Step 2: Address */}
          {step === 2 && (
            <>
              <input
                placeholder="Street"
                value={form.address.street}
                onChange={(e) => setForm({ ...form, address: { ...form.address, street: e.target.value } })}
                required
                className={inputClass}
              />
              <input
                placeholder="City"
                value={form.address.city}
                onChange={(e) => setForm({ ...form, address: { ...form.address, city: e.target.value } })}
                required
                className={inputClass}
              />
              <input
                placeholder="State"
                value={form.address.state}
                onChange={(e) => setForm({ ...form, address: { ...form.address, state: e.target.value } })}
                required
                className={inputClass}
              />
              <input
                placeholder="Country"
                value={form.address.country}
                onChange={(e) => setForm({ ...form, address: { ...form.address, country: e.target.value } })}
                required
                className={inputClass}
              />
              <div className="flex justify-between">
                <button type="button" className={buttonClass} onClick={handlePrev}>
                  ← Previous
                </button>
                <button type="button" className={buttonClass} onClick={handleNext}>
                  Next →
                </button>
              </div>
            </>
          )}

          {/* Step 3: Documents */}
          {step === 3 && (
            <>
              <div>
                <label className="block font-medium text-gray-700 mb-1">License Document *</label>
                <input
                  type="file"
                  required
                  onChange={(e) => setDocs({ ...docs, licenseDocument: e.target.files?.[0] || null })}
                  className={fileInputClass}
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">Registration Certificate *</label>
                <input
                  type="file"
                  required
                  onChange={(e) => setDocs({ ...docs, registrationCertificate: e.target.files?.[0] || null })}
                  className={fileInputClass}
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">Additional Documents</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setDocs({ ...docs, additionalDocuments: Array.from(e.target.files || []) })}
                  className={fileInputClass}
                />
              </div>
              <div className="flex justify-between">
                <button type="button" className={buttonClass} onClick={handlePrev}>
                  ← Previous
                </button>
                <button type="submit" disabled={loading} className={buttonClass}>
                  {loading ? <Spinner /> : "Register Clinic"}
                </button>
              </div>
            </>
          )}

          {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
        </form>
      </section>
    </main>
  );
}