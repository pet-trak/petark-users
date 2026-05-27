'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);


  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="shrink-0 font-bold text-lg sm:text-2xl">
              <Image src="/official_logo_remove.png" alt="PetTrak Logo" width={150} height={300} />
            </div>

            {/* Desktop Links */}
            {/* <div className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="hover:text-green-200 transition font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </div> */}

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay with Glass Effect */}
      {isOpen && (
        <div className="fixed inset-0 z-40">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          {/* <div className="absolute top-16 left-0 right-0 bg-green-700/90 shadow-md px-4 py-6 flex flex-col space-y-2 backdrop-blur-md animate-slideDown">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600 transition text-(--pry-clr)"
              >
                {item.label}
              </Link>
            ))}
          </div> */}
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          0% {
            transform: translateY(-20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideDown {
          animation: slideDown 0.25s ease-out forwards;
        }
      `}</style>
    </>
  );
}