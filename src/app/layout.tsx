import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "Foreman",
    template: "%s | Foreman",
  },
  description:
    "Foreman — AI front office for HVAC and trades. Never miss another job.",
  icons: {
    icon: "/foreman-app-icon-512.png",
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
        <body className="min-h-screen antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}
