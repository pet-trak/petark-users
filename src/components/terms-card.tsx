"use client";

import {
  ShieldCheck,
  PawPrint,
  CheckCircle2,
  XCircle,
  Database,
  FileText,
  UserCheck,
  Stethoscope,
  Lock,
  RefreshCw,
} from "lucide-react";

const sections = [
  {
    icon: <PawPrint size={18} />,
    title: "Introduction",
    content: (
      <p className="text-sm leading-relaxed" style={{ color: "var(--sec-clr)", opacity: 0.75 }}>
        Welcome to <strong>PetArk</strong>, a platform operated by <strong>Ark Systems Ltd</strong> that helps you manage your pet&apos;s health, appointments, and veterinary care in one place.
        PetArk is a <em>software platform only</em> — we do not provide veterinary services or medical advice. By using PetArk, you agree to these terms.
      </p>
    ),
  },
  {
    icon: <CheckCircle2 size={18} />,
    title: "What You Can Do",
    content: (
      <ul className="flex flex-col gap-2 mt-1">
        {[
          "Create and manage pet profiles",
          "Book appointments with veterinary clinics",
          "View vaccination and treatment updates",
          "Track your pet's health history",
          "View vital signs and summary health updates only",
        ].map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm" style={{ color: "var(--sec-clr)", opacity: 0.75 }}>
            <CheckCircle2 size={14} className="mt-0.5 shrink-0" style={{ color: "var(--acc-clr)" }} />
            {item}
          </li>
        ))}
      </ul>
    ),
  },
  {
    icon: <XCircle size={18} />,
    title: "What You Cannot Do",
    content: (
      <>
        <ul className="flex flex-col gap-2 mt-1">
          {[
            "Access full veterinary clinical notes",
            "View internal diagnoses or professional vet commentary",
            "Edit medical records created by clinics",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm" style={{ color: "var(--sec-clr)", opacity: 0.75 }}>
              <XCircle size={14} className="mt-0.5 shrink-0 text-red-400" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-xs mt-3 italic" style={{ color: "var(--sec-clr)", opacity: 0.55 }}>
          You only receive a filtered view (vitals + summaries) of your pet&apos;s medical record.
        </p>
      </>
    ),
  },
  {
    icon: <Database size={18} />,
    title: "Your Data & Privacy",
    content: (
      <div className="flex flex-col gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--acc-clr)" }}>We collect</p>
          <ul className="flex flex-col gap-1">
            {["Account information", "Pet profile data (name, breed, age, etc.)", "Appointment history", "Summary health updates shared by clinics"].map((item) => (
              <li key={item} className="text-sm flex items-start gap-2" style={{ color: "var(--sec-clr)", opacity: 0.75 }}>
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "var(--acc-clr)" }} />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--acc-clr)" }}>We use it to</p>
          <ul className="flex flex-col gap-1">
            {["Enable veterinary coordination", "Show pet health summaries", "Manage bookings and records"].map((item) => (
              <li key={item} className="text-sm flex items-start gap-2" style={{ color: "var(--sec-clr)", opacity: 0.75 }}>
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "var(--acc-clr)" }} />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm font-semibold" style={{ color: "var(--acc-clr)" }}>We do not sell your data.</p>
      </div>
    ),
  },
  {
    icon: <FileText size={18} />,
    title: "Medical Records Handling",
    content: (
      <ul className="flex flex-col gap-2 mt-1">
        {[
          "Full medical records are created and controlled by veterinary clinics",
          "Records are stored securely in PetArk's database",
          "Pet owners only see approved summaries and vitals",
          "PetArk does not modify or interpret medical content",
        ].map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm" style={{ color: "var(--sec-clr)", opacity: 0.75 }}>
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "var(--acc-clr)" }} />
            {item}
          </li>
        ))}
      </ul>
    ),
  },
  {
    icon: <UserCheck size={18} />,
    title: "Your Responsibility",
    content: (
      <ul className="flex flex-col gap-2 mt-1">
        {[
          "Information you provide is accurate",
          "You will not misuse clinic data",
          "You are responsible for keeping your account secure",
        ].map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm" style={{ color: "var(--sec-clr)", opacity: 0.75 }}>
            <CheckCircle2 size={14} className="mt-0.5 shrink-0" style={{ color: "var(--acc-clr)" }} />
            {item}
          </li>
        ))}
      </ul>
    ),
  },
  {
    icon: <Stethoscope size={18} />,
    title: "Platform Role",
    content: (
      <>
        <p className="text-sm mb-2" style={{ color: "var(--sec-clr)", opacity: 0.75 }}>
          PetArk is not a veterinary provider. We do not:
        </p>
        <ul className="flex flex-col gap-2">
          {["Diagnose pets", "Recommend treatments", "Interfere with veterinary decisions"].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm" style={{ color: "var(--sec-clr)", opacity: 0.75 }}>
              <XCircle size={14} className="mt-0.5 shrink-0 text-red-400" />
              {item}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    icon: <Lock size={18} />,
    title: "Data Security",
    content: (
      <ul className="flex flex-col gap-2 mt-1">
        {[
          "Encryption (in transit and at rest)",
          "Role-based access control",
          "Secure authentication systems",
        ].map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm" style={{ color: "var(--sec-clr)", opacity: 0.75 }}>
            <ShieldCheck size={14} className="mt-0.5 shrink-0" style={{ color: "var(--acc-clr)" }} />
            {item}
          </li>
        ))}
      </ul>
    ),
  },
  {
    icon: <RefreshCw size={18} />,
    title: "Changes",
    content: (
      <p className="text-sm leading-relaxed" style={{ color: "var(--sec-clr)", opacity: 0.75 }}>
        We may update these terms as the platform evolves. Continued use of PetArk means acceptance of any changes.
      </p>
    ),
  },
];

export default function TermsCard() {
  return (
    <main
      className="min-h-screen pry-ff py-12 px-4"
      style={{ backgroundColor: "var(--bg-clr)" }}
    >
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-10 text-center">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{ backgroundColor: "var(--acc-clr)", color: "var(--pry-clr)" }}
          >
            <PawPrint size={12} />
            PetArk – Pet Owner Terms & Privacy v1.1
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: "var(--sec-clr)" }}>
            Terms of Service
          </h1>
          <p className="text-sm" style={{ color: "var(--sec-clr)", opacity: 0.55 }}>
            Please read these terms carefully before using PetArk.
          </p>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-4">
          {sections.map((section, index) => (
            <div
              key={section.title}
              className="rounded-xl p-5 bg-pry-clr shadow-sm border"
              style={{ borderColor: "#e5e7eb" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                  style={{ backgroundColor: "var(--acc-clr)", color: "var(--pry-clr)" }}
                >
                  {section.icon}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold" style={{ color: "var(--acc-clr)", opacity: 0.6 }}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-sm font-bold" style={{ color: "var(--sec-clr)" }}>
                    {section.title}
                  </h2>
                </div>
              </div>
              {section.content}
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-xs text-center mt-8" style={{ color: "var(--sec-clr)", opacity: 0.4 }}>
          © {new Date().getFullYear()} Ark Systems Ltd · All rights reserved
        </p>
      </div>
    </main>
  );
}