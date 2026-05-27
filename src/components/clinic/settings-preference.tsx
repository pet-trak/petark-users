"use client";

import { Bell, HelpCircle, LogOut, ChevronRight } from "lucide-react";
import { useState } from "react";
import LogoutModal from "@/components/logout-modal";
import { useAuthStore } from "@/store/auth";
import Link from "next/link";

export default function SettingsPreference() {
    const { logout } = useAuthStore();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    return (
        <>
            <section className="px-4 mt-2 w-full pb-24 md:pb-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">
                    Preferences
                </p>

                <div className="space-y-2">
                    {/* Push Notifications */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3.5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[var(--acc-clr)] flex items-center justify-center shadow-sm">
                                <Bell className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <p className="text-[13px] font-semibold text-slate-800">Push Notifications</p>
                                <p className="text-[11px] text-slate-400">
                                    {notificationsEnabled ? "Enabled" : "Disabled"}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                            className={`relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${notificationsEnabled
                                    ? "bg-[var(--acc-clr)] shadow-sm"
                                    : "bg-slate-200"
                                }`}
                        >
                            <span
                                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${notificationsEnabled ? "left-[22px]" : "left-0.5"
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Contact Support */}
                    <Link
                        href="/clinic/dashboard/settings/support"
                        className="bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3.5 flex items-center justify-between hover:bg-slate-50/80 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-[var(--acc-clr)] flex items-center justify-center shadow-sm">
                                <HelpCircle className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <p className="text-[13px] font-semibold text-slate-800">Contact Support</p>
                                <p className="text-[11px] text-slate-400">Get help from our team</p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all" />
                    </Link>

                    {/* Logout */}
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm px-4 py-3.5 flex items-center justify-between hover:bg-red-50/40 hover:border-red-100 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
                                <LogOut className="w-4 h-4 text-red-500" />
                            </div>
                            <div className="text-left">
                                <p className="text-[13px] font-semibold text-red-500">Log Out</p>
                                <p className="text-[11px] text-slate-400">Sign out of your account</p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-red-300 group-hover:translate-x-0.5 transition-all" />
                    </button>
                </div>
            </section>

            {showLogoutModal && (
                <LogoutModal
                    onClose={() => setShowLogoutModal(false)}
                    onLogout={logout}
                />
            )}
        </>
    );
}