'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Settings,
    Calendar,
    ChevronLeft,
    ChevronRight,
    LogOut,
    ClipboardCheck,
} from 'lucide-react';

import { useSidebar } from '@/context/sidebar-context';
import { useAuthStore } from '@/store/auth';
import { logout } from '@/libs/api/auth';

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { collapsed, setCollapsed } = useSidebar();
    const { profile, logout } = useAuthStore();

    const handleLogout = async () => {
        if (!profile) {
            logout();
            router.replace('/login');
            return;
        }

        await logout();
        router.replace('/login');
    };

    const navItems = [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
        { label: 'Records', href: '/dashboard/records', icon: ClipboardCheck },
    ];

    return (
        <>
            {/* ───────── Desktop Sidebar ───────── */}
            <aside
                className={`
          hidden md:flex fixed top-0 left-0 h-screen z-40
          flex-col bg-white border-r border-gray-100 shadow-sm
          transition-all duration-300 pry-ff
          ${collapsed ? 'w-[72px]' : 'w-60'}
        `}
            >
                {/* Brand */}
                <div
                    className={`
            flex items-center h-16 px-4 border-b border-gray-100
            ${collapsed ? 'justify-center' : 'gap-3'}
          `}
                >
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <Image
                            src="/green_logo_icon-removebg.png"
                            alt="PetTrak logo"
                            width={32}
                            height={32}
                            priority
                        />
                        {!collapsed && (
                            <span className="text-lg font-bold text-gray-800 tracking-tight">
                                PetTrak
                            </span>
                        )}
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 overflow-y-auto">
                    {!collapsed && (
                        <p className="px-3 mb-3 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                            Menu
                        </p>
                    )}

                    <ul className="space-y-1">
                        {navItems.map(({ label, href, icon: Icon }) => {
                            const isActive = pathname === href;

                            return (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        title={collapsed ? label : undefined}
                                        className={`
                      flex items-center px-3 py-2.5 rounded-xl
                      transition-all duration-150
                      active:scale-[0.96]
                      ${collapsed ? 'justify-center' : 'gap-3'}
                      ${isActive
                                                ? 'bg-(--acc-clr) text-white shadow-sm'
                                                : 'hover:bg-gray-100 text-gray-700'
                                            }
                    `}
                                    >
                                        <Icon
                                            className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'
                                                }`}
                                        />
                                        {!collapsed && (
                                            <span className="text-sm font-medium">{label}</span>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Footer */}
                <div className="p-3 border-t border-gray-100 space-y-1">
                    <Link
                        href="/dashboard/settings"
                        title={collapsed ? 'Settings' : undefined}
                        className={`
              flex items-center px-3 py-2.5 rounded-xl
              transition-all duration-150 active:scale-[0.96]
              ${collapsed ? 'justify-center' : 'gap-3'}
              ${pathname === '/dashboard/settings'
                                ? 'bg-(--acc-clr) text-white'
                                : 'hover:bg-gray-100 text-gray-700'
                            }
            `}
                    >
                        <Settings className="w-5 h-5" />
                        {!collapsed && (
                            <span className="text-sm font-medium">Settings</span>
                        )}
                    </Link>

                    <button
                        onClick={handleLogout}
                        className={`
              flex items-center w-full px-3 py-2.5 rounded-xl
              text-red-500 hover:bg-red-50
              transition-all duration-150 active:scale-[0.96]
              ${collapsed ? 'justify-center' : 'gap-3'}
            `}
                    >
                        <LogOut className="w-5 h-5" />
                        {!collapsed && (
                            <span className="text-sm font-medium">Sign out</span>
                        )}
                    </button>

                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className={`
              flex items-center w-full px-3 py-2.5 rounded-xl
              text-gray-400 hover:bg-gray-100
              transition-all duration-150
              ${collapsed ? 'justify-center' : 'gap-3'}
            `}
                    >
                        {collapsed ? (
                            <ChevronRight className="w-4 h-4" />
                        ) : (
                            <>
                                <ChevronLeft className="w-4 h-4" />
                                <span className="text-xs font-medium">Collapse</span>
                            </>
                        )}
                    </button>
                </div>
            </aside>

            {/* ───────── Mobile Bottom Navbar ───────── */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200">
                <ul className="flex justify-around py-2">
                    {navItems.map(({ label, href, icon: Icon }) => {
                        const isActive = pathname === href;

                        return (
                            <li key={href}>
                                <Link
                                    href={href}
                                    className={`
                    flex flex-col items-center justify-center
                    px-3 py-1 rounded-xl
                    transition-all duration-150
                    active:scale-[0.9]
                  `}
                                >
                                    <Icon
                                        className={`w-5 h-5 ${isActive ? 'text-(--acc-clr)' : 'text-gray-400'
                                            }`}
                                    />

                                    {/* Hidden on very small screens */}
                                    <span
                                        className={`
                      hidden xs:block text-[10px] font-medium
                      ${isActive
                                                ? 'text-(--acc-clr)'
                                                : 'text-gray-500'
                                            }
                    `}
                                    >
                                        {label}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </>
    );
}