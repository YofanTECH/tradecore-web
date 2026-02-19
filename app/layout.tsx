import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// --- UPDATED METADATA ---
export const metadata: Metadata = {
  title: "Gavblue | Premium Global Trading",
  description: "Trade 2,000+ instruments on institutional-grade infrastructure with Gavblue. Access Forex, Crypto, Indices, and Commodities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}