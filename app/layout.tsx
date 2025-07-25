import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BoneHealth AI - AI-Powered Osteoporosis Detection",
  description: "Revolutionizing bone health with AI-powered osteoporosis risk prediction and early detection. Advanced machine learning for personalized bone health insights.",
  keywords: "osteoporosis, bone health, AI, machine learning, risk prediction, early detection, healthcare",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-white text-black`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
