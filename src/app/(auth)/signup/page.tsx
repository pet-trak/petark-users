import { Metadata } from "next";
import RegisterComp from "./registerComp"

export const metadata: Metadata = {
  title: "Sign up | PetArk",
  description: "Create an account to manage your pet's appointments and more.",
}

export default function SignupPage() {
  return (
    <main>
      <RegisterComp />
    </main>
  )
}