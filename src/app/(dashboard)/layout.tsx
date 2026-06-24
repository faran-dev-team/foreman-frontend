import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export const dynamic = "force-dynamic";

const navItems = [
  { href: "/calls", label: "Calls" },
  { href: "/jobs", label: "Jobs" },
  { href: "/settings", label: "Settings" },
] as const;

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="flex w-64 flex-col border-r border-slate-200 bg-foreman-navy text-white">
        <div className="border-b border-slate-700 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
            Foreman
          </p>
          <h1 className="mt-1 text-lg font-semibold">Owner Dashboard</h1>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-slate-700 px-4 py-4">
          <UserButton
            afterSignOutUrl="/sign-in"
            appearance={{
              elements: {
                avatarBox: "h-9 w-9",
              },
            }}
          />
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="border-b border-slate-200 bg-white px-8 py-4">
          <p className="text-sm text-slate-500">Foreman MVP · Owner portal</p>
        </header>
        <main className="flex-1 px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
