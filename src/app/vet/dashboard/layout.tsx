'use client';

import { ReactNode } from 'react';
import Sidebar from '@/components/clinic/clinic-sidebar';
import { SidebarProvider, useSidebar } from '@/context/sidebar-context';
import NavDashboard from '@/components/nav-dashboard';
import { Toaster } from 'sonner';

interface LayoutProps {
    children: ReactNode;
}

function InnerLayout({ children }: Readonly<LayoutProps>) {
    const { collapsed } = useSidebar();

    return (
        <div className="flex bg-gray-100 min-h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main content */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? 'md:pl-20' : 'md:pl-64'}`}>
                <main className="flex-1 p-6 md:pt-4">
                    {/* Navbar at the top */}
                    <NavDashboard />

                    {/* Page content */}
                    {children}

                    <Toaster position="top-center" />
                </main>
            </div>
        </div>
    );
}

export default function Layout({ children }: LayoutProps) {
    return (
        <SidebarProvider>
            <InnerLayout>{children}</InnerLayout>
        </SidebarProvider>
    );
}