'use client';

import Link from 'next/link';
import { PawPrint } from 'lucide-react';

export default function ComingSoon() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-(--bg-clr) pry-ff text-center px-6">
      {/* Icon */}
      <PawPrint className="text-(--acc-clr) w-20 h-20 mb-6" />

      {/* Heading */}
      <h1 className="text-6xl font-bold sec-clr mb-4">Coming Soon</h1>

      {/* Subheading */}
      <p className="text-xl sec-clr mb-2">
        This feature is still in the lab.
      </p>
      <p className="text-md sec-clr mb-8">
        We’re training it to be something special.
      </p>

      {/* Button */}
      <Link
        href="/login"
        className="px-8 py-3 rounded-lg sec-ff transition hover:brightness-110"
        style={{
          backgroundColor: 'var(--acc-clr)',
          color: '#fff',
        }}
      >
        Back to Home
      </Link>
    </div>
  );
}