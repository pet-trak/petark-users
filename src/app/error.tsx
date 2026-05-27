'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('PetTrak Error:', error);
  }, [error]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[var(--bg-clr)] pry-ff text-center px-6">
      {/* Icon */}
      <AlertCircle className="text-[var(--acc-clr)] w-20 h-20 mb-6" />

      {/* Heading */}
      <h1 className="text-5xl font-bold sec-clr mb-4">Something went wrong</h1>

      {/* Subheading / Error message */}
      <p className="text-lg sec-clr mb-2">
        {error.message || "We couldn't load this page."}
      </p>
      <p className="text-md sec-clr mb-8">
        Don’t worry, our team of pet experts is on it
      </p>

      {/* Retry button */}
      <button
        onClick={() => reset()}
        className="px-8 py-3 rounded-lg sec-ff transition hover:brightness-110"
        style={{
          backgroundColor: 'var(--acc-clr)',
          color: '#fff',
        }}
      >
        Try Again
      </button>
    </div>
  );
}