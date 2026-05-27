'use client';

import Link from 'next/link';
import { Bell, Inbox, PawPrint } from 'lucide-react';

export default function NotificationsPage() {
  return (
    <main className="min-h-[80vh] w-full flex flex-col items-center justify-center bg-(--bg-clr) text-center px-6 sec-ff p-3">
      
      {/* Icon Stack */}
      <div className="relative mb-6">
        <Bell
          className="w-20 h-20 text-(--acc-clr)"
          fill="currentColor"
        />
        <span className="absolute top-1 right-3 w-4 h-4 bg-red-500 rounded-full border-2 border-(--bg-clr)" />
      </div>

      {/* Heading */}
      <h1 className="text-4xl md:text-5xl font-bold text-(--sec-clr) mb-4">
        Notifications
      </h1>

      {/* Description */}
      <p className="text-lg text-gray-600 max-w-xl mb-2">
        This is where important updates will live.
      </p>
      <p className="text-md text-gray-500 max-w-xl mb-8">
        Appointment confirmations, reminders, vet actions, and system alerts —
        all in one place.
      </p>

      {/* Empty State Card */}
      <div className="bg-(--pry-clr) rounded-2xl shadow-lg p-8 max-w-md w-full flex flex-col items-center gap-4">
        <Inbox className="w-10 h-10 text-gray-400" />
        <p className="text-gray-600">
          You don’t have any notifications yet.
        </p>
        <p className="text-sm text-gray-400">
          When something happens, you’ll see it here.
        </p>
      </div>

      {/* Action */}
      <Link
        href="/clinic-dashboard"
        className="mt-10 inline-flex items-center gap-2 px-8 py-3 rounded-lg transition hover:brightness-110"
        style={{
          backgroundColor: 'var(--acc-clr)',
          color: '#fff',
        }}
      >
        <PawPrint className="w-5 h-5" />
        Back to Dashboard
      </Link>
    </main>
  );
}