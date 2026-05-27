'use client';

import Navigation from '@/components/navigation';
import Image from 'next/image';
import { Bell, Users, MessageCircle, Activity, MapPin, Stethoscope } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Page() {
  const features = [
    { title: "Smart Pet Tracker", description: "Monitor your pet’s health, activity, and daily routines all in one place.", icon: Activity },
    { title: "Smart Reminders", description: "Get alerts for vet visits, medication, and daily routines to keep pets on track.", icon: Bell },
    { title: "Personalized Bot", description: "Chat with your AI pet assistant for tips, reminders, and advice.", icon: MessageCircle },
    { title: "Vet Finder", description: "Locate nearby veterinarians and clinics quickly with ease.", icon: MapPin },
    { title: 'Symptom Checker', description: 'Input symptoms and get instant advice on pet health concerns.', icon: Stethoscope }
  ];

  const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

  return (
    <div className="flex flex-col w-full min-h-screen pry-ff">
      <Navigation />

      {/* Hero Section */}
      <motion.section
        className="relative bg-gradient-to-r from-green-600 to-green-400 text-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        variants={fadeUp}
      >
        <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col-reverse md:flex-row items-center gap-10">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
              Keep Your Pets Happy & Healthy
            </h1>
            <p className="text-lg sm:text-xl text-green-100">
              Track your pets, get expert tips, and never miss a vet appointment.
              PetTrak makes caring for your furry friend effortless and fun!
            </p>
            <div className="flex flex-wrap gap-4">
              {/* ✅ Fixed Login Button */}
              <Link
                href="/login"
                className="bg-white text-green-600 font-semibold px-6 py-3 rounded-full shadow hover:bg-green-50 transition inline-block text-center"
              >
                Login
              </Link>

              <button className="border border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white hover:text-green-600 transition cursor-pointer">
                Learn More
              </button>
            </div>
          </div>

          <div className="flex-1 relative w-full h-80 md:h-96">
            <Image src="/pets.jpg" alt="Happy pets" fill className="object-contain" />
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-10">
            {features.map(({ title, description, icon: Icon }, idx) => (
              <motion.div
                key={title}
                className="bg-white rounded-xl shadow p-6 text-center hover:scale-105 transform transition"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                variants={fadeUp}
              >
                <Icon className="mx-auto mb-4 text-green-600" size={40} />
                <h3 className="font-semibold text-xl mb-2">{title}</h3>
                <p className="text-gray-600">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: Bell, title: 'Sign Up', text: 'Join our waitlist and create your PetTrak account easily.' },
              { icon: Activity, title: 'Track Your Pet', text: 'Monitor your pet’s health, activity, and daily routines effortlessly.' },
              { icon: MessageCircle, title: 'Get Personalized Tips', text: 'Receive AI-based recommendations and reminders tailored to your pet.' }
            ].map(({ icon: Icon, title, text }, idx) => (
              <motion.div
                key={title}
                className="flex flex-col items-center p-6 bg-gray-50 rounded-xl shadow hover:scale-105 transform transition"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                variants={fadeUp}
              >
                <Icon className="text-green-600 mb-4" size={40} />
                <h3 className="font-semibold text-xl mb-2">{title}</h3>
                <p className="text-gray-600">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-600 text-white py-6 text-center">
        <p>&copy; {new Date().getFullYear()} PetTrak. All rights reserved.</p>
      </footer>
    </div>
  );
}