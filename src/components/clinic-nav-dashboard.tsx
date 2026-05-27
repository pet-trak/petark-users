'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '@/store/auth';
import type { ClinicProfile } from '@/store/auth';
import { getClinicProfile } from '@/libs/api/clinic';
import { toast } from 'sonner';
import Link from 'next/link';
import { Search, Bell, ChevronDown, LogOut, User } from 'lucide-react';
import Spinner from './ui/spinner';

export default function NavDashboard() {
    const { profile, setProfile, logout, token } = useAuthStore();

    // 🔒 clinic-only narrowing
    const clinicProfile =
        profile?.type === 'clinic' ? (profile as ClinicProfile) : null;

    const [loading, setLoading] = useState(!clinicProfile);
    const [searchQuery, setSearchQuery] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // ⛔ already hydrated
        if (clinicProfile) {
            setLoading(false);
            return;
        }

        const loadClinicProfile = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const data = await getClinicProfile();
                setProfile(data, token);
            } catch (err) {
                toast.error(
                    err instanceof Error ? err.message : 'Failed to load clinic profile'
                );
                logout();
            } finally {
                setLoading(false);
            }
        };

        loadClinicProfile();
    }, [clinicProfile, token, setProfile, logout]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    /* =========================
       UI
    ========================= */
    return (
        <nav className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm sec-ff">
            <div className="max-w-[1220px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">

                {/* Search */}
                <div className="flex-1 max-w-md relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search patients, owners, or records..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--acc-clr)]/30 focus:border-[var(--acc-clr)] focus:bg-white transition-all duration-150 sec-ff"
                    />
                </div>

                {/* Right actions */}
                <div className="flex items-center gap-2">

                    {/* Notifications */}
                    <Link
                        href="/clinic-dashboard/notifications"
                        className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors duration-150 group"
                        aria-label="Notifications"
                    >
                        <Bell className="w-5 h-5 text-gray-500 group-hover:text-gray-700 transition-colors" strokeWidth={1.8} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--acc-clr)] rounded-full ring-2 ring-white" />
                    </Link>

                    <div className="w-px h-6 bg-gray-200 mx-1" />

                    {/* Loading */}
                    {loading && (
                        <div className="w-10 h-10 flex items-center justify-center">
                            <Spinner />
                        </div>
                    )}

                    {/* Clinic profile dropdown */}
                    {!loading && clinicProfile && (
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="flex items-center gap-2.5 pl-1 pr-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors duration-150 group"
                            >
                                {/* Clinic avatar */}
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#38E07B] to-[#2bc466] flex items-center justify-center shadow-sm flex-shrink-0">
                                    <span className="text-white text-xs font-bold">
                                        {clinicProfile.clinicName?.charAt(0)?.toUpperCase() ?? 'C'}
                                    </span>
                                </div>

                                {/* Name */}
                                <div className="hidden sm:flex flex-col leading-tight">
                                    <span className="text-sm font-semibold text-gray-800 truncate max-w-[140px]">
                                        {clinicProfile.clinicName}
                                    </span>

                                </div>

                                <ChevronDown
                                    className={`w-3.5 h-3.5 text-gray-400 hidden sm:block flex-shrink-0 transition-transform duration-150 ${menuOpen ? 'rotate-180' : ''}`}
                                />
                            </button>

                            {/* Dropdown */}
                            {menuOpen && (
                                <div
                                    onClick={(e) => e.stopPropagation()}
                                    className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-lg shadow-black/10 overflow-hidden z-50 sec-ff"
                                >
                                    <div className="px-4 py-3 border-b border-gray-50 sec-ff">
                                        <p className="text-xs text-gray-400 pry-ff">Signed in as</p>
                                        <p className="text-sm font-semibold text-gray-800 truncate">
                                            {clinicProfile.clinicName}
                                        </p>
                                    </div>

                                    <div className="p-1.5">
                                        <Link
                                            href="/clinic-dashboard/profiles"
                                            onClick={() => setMenuOpen(false)}
                                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 sec-ff"
                                        >
                                            <User className="w-4 h-4 text-gray-400" />
                                            View Profile
                                        </Link>

                                        <button
                                            onClick={() => { logout(); setMenuOpen(false); }}
                                            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors duration-150 sec-ff"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Fallback */}
                    {!loading && !clinicProfile && (
                        <button
                            onClick={() => (window.location.href = '/login')}
                            className="bg-[var(--acc-clr)] text-white text-sm font-semibold py-2 px-5 rounded-xl hover:bg-green-500 transition"
                        >
                            Sign In
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}