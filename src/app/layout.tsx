import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FloatingNav } from "@/components/navigation/floating-nav";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Connect Foundation - Bridging Orphanages and Donors Worldwide",
  description: "Connect Foundation helps orphanages sign up, connect, and share issues they are facing. Join our community of donors making a real difference in children's lives.",
  keywords: ["orphanage", "donation", "charity", "foundation", "children", "help", "transparency"],
  authors: [{ name: "Connect Foundation" }],
  openGraph: {
    title: "Connect Foundation - Bridging Orphanages and Donors Worldwide",
    description: "Join our community of donors making a real difference in children's lives.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
          <FloatingNav />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
