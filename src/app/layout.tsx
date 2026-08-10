import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

import { Outfit, IBM_Plex_Mono } from "next/font/google";
import { NotificationProvider } from "@/components/providers/NotificationProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";

import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-mono" });

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Foreman",
    template: "%s | Foreman",
  },
  description:
    "Foreman — AI front office for HVAC and trades. Never miss another job.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" }
    ],
    shortcut: "/favicon.png",
    apple: "/foreman-app-icon-512.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`min-h-screen antialiased ${outfit.variable} ${mono.variable}`}>
          <QueryProvider>
            <NotificationProvider>{children}</NotificationProvider>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

