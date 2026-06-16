import { Metadata } from "next";
import TermsCard from "@/components/terms-card";

export const metadata: Metadata = {
  title: "Terms of Service - PetArk",
  description: "Read the terms of service for using PetArk, your trusted pet care companion.",
};

export default function TermsPage() {
  return <TermsCard />;
}