import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ShopProvider } from "@/components/dashboard/shop-provider";

export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ShopProvider>
      <DashboardShell>{children}</DashboardShell>
    </ShopProvider>
  );
}
