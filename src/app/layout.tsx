// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Global CSS for Tailwind
import { WagmiClientProvider } from '../providers/WagmiClientProvider'; // Import our new client provider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tipstiq",
  description: "Fan to Creator Tipping App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Wrap your children with the WagmiClientProvider */}
        <WagmiClientProvider>
          {children}
        </WagmiClientProvider>
      </body>
    </html>
  );
}
