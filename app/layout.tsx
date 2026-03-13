import type { Metadata } from "next";
import Image from "next/image";
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
  title: "Περίγυρος",
  description: "Περίγυρος – παραγγελίες τραπεζιού",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="el">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen flex-col`}
      >
        <header className="w-full bg-white shadow-sm">
          <div className="w-full px-4 lg:px-6 py-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Περίγυρος"
                width={120}
                height={40}
                className="h-10 w-auto object-contain"
                priority
              />
              <span className="font-semibold text-lg text-gray-800">Περίγυρος</span>
            </div>
            <span className="text-sm text-gray-500">Παραγγελίες</span>
          </div>
        </header>
        <main className="flex-1 w-full px-4 lg:px-6 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}

