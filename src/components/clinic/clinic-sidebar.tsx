'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Settings,
  ClipboardCheck,
  Box,
  Calendar,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { useSidebar } from '@/context/sidebar-context';
import { useAuthStore } from '@/store/auth';
import { logout } from '@/libs/api/auth';
import { label } from 'framer-motion/client';

export default function ClinicSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { collapsed, setCollapsed } = useSidebar();
  const { profile, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.warn("Logout API error:", err);
    }
    logout();
    router.replace("/login");
  };

  const navItems = [
    { label: 'Dashboard', href: '/clinic/dashboard', icon: LayoutDashboard },
    { label: 'Appointments', href: '/clinic/dashboard/appointments', icon: Calendar },
    { label: 'Medical Records', href: '/clinic/dashboard/records', icon: ClipboardCheck },
    { label: 'Settings', href: '/clinic/dashboard/settings', icon: Settings },
  ];

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside
        className={`hidden md:flex fixed top-0 left-0 h-screen flex-col z-40
          transition-all duration-300 bg-white border-r border-gray-100 shadow-sm sec-ff
          ${collapsed ? 'w-[72px]' : 'w-60'}`}
      >
        {/* Brand */}
        <div className={`flex items-center gap-3 px-4 h-16 border-b border-gray-100 flex-shrink-0
          ${collapsed ? 'justify-center' : 'justify-start'}`}>
          <Link href="/clinic-dashboard" className="flex items-center gap-3">
            <Image
              src="/green_logo_icon-removebg.png"
              alt="PetTrak logo"
              width={32}
              height={32}
              priority
              className="flex-shrink-0"
            />
            {!collapsed && (
              <span className="text-lg font-bold text-gray-800 sec-ff tracking-tight">PetTrak</span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          {!collapsed && (
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-3 sec-ff">
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
                    className={`flex items-center rounded-xl px-3 py-2.5 transition-all duration-150 group
                      ${collapsed ? 'justify-center' : 'gap-3'}
                      ${isActive
                        ? 'bg-(--acc-clr) shadow-sm'
                        : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 transition-colors
                      ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`}
                    />
                    {!collapsed && (
                      <span className={`text-sm font-medium sec-ff transition-colors
                        ${isActive ? 'text-white' : 'text-gray-700 group-hover:text-gray-900'}`}>
                        {label}
                      </span>
                    )}
                    {/* Active indicator dot when collapsed */}
                    {isActive && collapsed && (
                      <span className="sr-only">{label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Collapse toggle + Logout */}
        <div className="flex flex-col gap-2 p-3 border-t border-gray-100">
          <button
            onClick={handleLogout}
            title={collapsed ? 'Sign out' : undefined}
            className={`flex items-center w-full px-3 py-2.5 rounded-xl
              text-red-500 hover:bg-red-50 transition-all duration-150 group
              ${collapsed ? 'justify-center' : 'gap-3'}`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium sec-ff">Sign out</span>}
          </button>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`flex items-center w-full px-3 py-2.5 rounded-xl
              text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-150
              ${collapsed ? 'justify-center' : 'gap-3'}`}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="text-xs font-medium sec-ff">Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* ── Mobile Bottom Navigation ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        {/* Frosted glass pill */}
        <div className="mx-3 mb-3 bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg shadow-black/10 px-2 py-1.5 flex items-center justify-around">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-150
                  ${isActive ? 'bg-(--acc-clr)' : 'hover:bg-gray-100'}`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                <span className={`text-[10px] font-semibold sec-ff leading-none
                  ${isActive ? 'text-white' : 'text-gray-500'}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}