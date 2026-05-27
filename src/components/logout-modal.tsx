"use client";

import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface LogoutModalProps {
    onClose: () => void;
    onLogout: () => void;
}

export default function LogoutModal({ onClose, onLogout }: LogoutModalProps) {
    const router = useRouter();

    const handleLogout = () => {
        onLogout();
        router.push("/login");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full border-4 border-red-600 flex items-center justify-center mb-4">
                        <AlertCircle className="w-10 h-10 text-red-600" />
                    </div>

                    <h2 className="text-lg font-semibold text-gray-900 mb-1">
                        Log out of your account
                    </h2>

                    <p className="text-sm text-gray-500 mb-6">
                        You can log back in later
                    </p>

                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition"
                        >
                            Proceed
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
