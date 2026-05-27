'use client';

import { ReactNode } from 'react';
import Sidebar from '@/components/sidebar';
import { SidebarProvider, useSidebar } from '@/context/sidebar-context';
import NavDashboard from '@/components/nav-dashboard';
import { Toaster } from 'sonner';

interface LayoutProps {
    children: ReactNode;
}

function InnerLayout({ children }: Readonly<LayoutProps>) {
    const { collapsed } = useSidebar();

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar for desktop and tablet */}
            <Sidebar />

            {/* Main content area */}
            <div
                className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? 'md:pl-20' : 'md:pl-64'
                    }`}
            >
                {/* Navbar for desktop */}
                <div className="hidden md:block">
                    <NavDashboard />
                </div>

                {/* Mobile Navbar */}
                <div className="md:hidden sticky top-0 z-50">
                    <NavDashboard />
                </div>

                {/* Main content */}
                <main className="flex-1 overflow-auto pt-0 md:pt-4">
                    {children}
                    <Toaster position="top-center" />
                </main>
            </div>
        </div>
    );
}

export default function Layout({ children }: Readonly<LayoutProps>) {
    return (
        <SidebarProvider>
            <InnerLayout>{children}</InnerLayout>
        </SidebarProvider>
    );
}