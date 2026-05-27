"use client";

import { useState } from "react";
import { useAuthStore, OwnerProfile } from "@/store/auth";
import { updateProfile } from "@/libs/api/user";
import { toast } from "sonner";
import Image from "next/image";
import { ImageIcon, Trash, User } from "lucide-react";
import PetsPanel from "@/components/pet-panel";

type AddressForm = {
  country: string;
  state: string;
  city: string;
  zipCode: string;
};

type FormState = {
  fullname: string;
  phoneNumber: string;
  address: AddressForm;
};

export default function ProfilePage() {
  const { profile, setProfile } = useAuthStore();

  const ownerProfile: OwnerProfile | null =
    profile?.type === "owner" ? profile : null;

  const [form, setForm] = useState<FormState>(() => {
    if (!ownerProfile) {
      return {
        fullname: "",
        phoneNumber: "",
        address: {
          country: "",
          state: "",
          city: "",
          zipCode: "",
        },
      };
    }

    const addr = ownerProfile.address ?? {};

    return {
      fullname: ownerProfile.fullname ?? "",
      phoneNumber: ownerProfile.phoneNumber ?? "",
      address: {
        country: addr.country ?? "",
        state: addr.state ?? "",
        city: addr.city ?? "",
        zipCode: addr.zipCode ?? "",
      },
    };
  });

  if (!ownerProfile) {
    return <div className="p-6 text-sm text-gray-400">Loading...</div>;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const updated = await updateProfile({
        fullname: form.fullname,
        phoneNumber: form.phoneNumber,
        address: form.address,
      });

      toast.success("Profile updated");

      const token = localStorage.getItem("token") ?? "";
      setProfile(updated, token);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  };

  const inputClass =
    "w-full bg-white/70 backdrop-blur-sm px-4 py-2.5 text-sm rounded-xl " +
    "ring-1 ring-gray-200/70 focus:ring-2 focus:ring-green-400/60 " +
    "outline-none transition shadow-sm";

  const labelClass =
    "block text-[11px] font-semibold tracking-wide text-gray-400 uppercase mb-1.5";

  const firstPet = ownerProfile.pets?.[0];
  const petImage =
    firstPet?.photo && firstPet.photo.trim().length > 0
      ? firstPet.photo
      : null;

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen sec-ff">
      <h1 className="text-xl font-semibold mb-6 text-gray-800">
        Account Preferences
      </h1>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* LEFT */}
        <div className="flex-1 space-y-6">
          {/* HEADER */}
          <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm ring-1 ring-gray-100">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-green-50 flex items-center justify-center shadow-sm">
              {petImage ? (
                <Image
                  src={petImage}
                  alt="pet"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="text-green-500" />
              )}
            </div>

            <div className="flex-1">
              <p className="font-semibold text-gray-800">
                {ownerProfile.fullname}
              </p>
              <p className="text-xs text-gray-400">
                {ownerProfile.email}
              </p>
            </div>

            <div className="flex gap-2">
              <button className="text-xs px-3 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition flex items-center gap-1">
                <ImageIcon className="w-3 h-3" />
                Change
              </button>

              <button className="text-xs px-3 py-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition flex items-center gap-1">
                <Trash className="w-3 h-3" />
                Remove
              </button>
            </div>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-5 space-y-5 shadow-sm ring-1 ring-gray-100"
          >
            {/* NAME + PHONE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Full Name</label>
                <input
                  className={inputClass}
                  value={form.fullname}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      fullname: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className={labelClass}>Phone Number</label>
                <input
                  className={inputClass}
                  value={form.phoneNumber}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      phoneNumber: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            {/* ADDRESS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(Object.entries(form.address) as [
                keyof AddressForm,
                string
              ][]).map(([key, value]) => (
                <div key={key}>
                  <label className={labelClass}>{key}</label>
                  <input
                    className={inputClass}
                    value={value}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        address: {
                          ...p.address,
                          [key]: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button className="bg-green-500 hover:bg-green-600 transition text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-sm">
                Save Changes
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT */}
        <div className="w-full xl:w-80">
          <PetsPanel />
        </div>
      </div>
    </div>
  );
}