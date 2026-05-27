import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PetTrak",
  description:
    "PetTrak is an AI-powered app that helps you monitor, track, and personalize your pet’s health, diet, and activity. Keep your furry friend happy, healthy, and on track.",
  keywords: [
    "PetTrak",
    "AI pet care",
    "pet health tracker",
    "pet wellness app",
    "AI pet monitoring",
    "pet fitness",
    "pet care app",
  ],
  authors: [{ name: "PetTrak Team" }],
  openGraph: {
    title: "PetTrak | Smart AI Pet Care",
    description:
      "Your intelligent companion for personalized pet health tracking and care management.",
    url: "https://pettrak.com",
    siteName: "PetTrak",
    // images: [
    //   {
    //     url: "/og-image.png",
    //     width: 1200,
    //     height: 630,
    //     alt: "PetTrak AI Pet Care App",
    //   },
    // ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Manrope Google Fonts link */}
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope&display=swap"
          rel="stylesheet"
        />
        
        {/* Google Sans */}
        <link href="https://fonts.cdnfonts.com/css/google-sans"
          rel="stylesheet"
        />

      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
