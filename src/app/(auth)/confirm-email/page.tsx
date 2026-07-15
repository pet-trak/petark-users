import { Metadata } from "next";
import { Suspense } from "react";
import ConfirmEmailComp from "./confirm-email";

export const metadata: Metadata = {
  title: "Confirm Email | PetArk",
  description: "Please confirm your email address to activate your account.",
};

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmEmailComp />
    </Suspense>
  );
}