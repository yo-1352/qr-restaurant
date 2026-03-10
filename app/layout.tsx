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
  title: "QR Restaurant Ordering",
  description: "Simple QR-based restaurant ordering system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen flex-col`}
      >
        <header className="w-full bg-white shadow-sm">
          <div className="mx-auto max-w-4xl px-4 py-3 flex justify-between items-center">
            <span className="font-semibold text-lg">QR Restaurant</span>
            <span className="text-sm text-gray-500">MVP Demo</span>
          </div>
        </header>
        <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}

