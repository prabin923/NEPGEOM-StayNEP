"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ChevronDown, Home } from "lucide-react";
import Logo from "@/components/Logo";
import SignOutButton from "@/components/auth/SignOutButton";
import type { PortalRole } from "@/lib/roles";
import { PORTALS, PORTAL_LIST } from "@/lib/roles";
import ThemeToggle from "@/components/ThemeToggle";

interface PortalShellProps {
  role: PortalRole;
  userLabel: string;
  userMeta: string;
  children: React.ReactNode;
}

export default function PortalShell({
  role,
  userLabel,
  userMeta,
  children,
}: PortalShellProps) {
  const config = PORTALS[role];
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [portalMenuOpen, setPortalMenuOpen] = useState(false);

  const isActive = (href: string) => {
    const base = href.split("#")[0];
    return pathname === base;
  };

  return (
    <div className="flex min-h-screen bg-mist font-cosmica">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-obsidian/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-fog bg-snow transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center border-b border-fog px-4">
          <Logo href="/" size="sm" />
        </div>

        <div className="border-b border-fog px-4 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-steel">
            {config.title}
          </p>
          <p className="mt-1 text-xs text-steel">{config.subtitle}</p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {config.nav.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-obsidian text-snow shadow-button"
                    : "text-steel hover:bg-fog hover:text-obsidian"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-fog p-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setPortalMenuOpen((v) => !v)}
              className="flex w-full items-center justify-between rounded-[12px] border border-fog bg-mist px-3 py-2.5 text-left text-sm text-graphite transition hover:bg-fog"
            >
              <span>Switch portal</span>
              <ChevronDown
                className={`h-4 w-4 text-steel transition ${portalMenuOpen ? "rotate-180" : ""}`}
              />
            </button>
            {portalMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 overflow-hidden rounded-[16px] border border-fog bg-snow py-1 shadow-md">
                {PORTAL_LIST.filter((p) => p.role !== config.role).map((p) => (
                  <Link
                    key={p.role}
                    href={p.basePath}
                    className="block px-3 py-2 text-sm text-steel hover:bg-fog hover:text-obsidian"
                    onClick={() => {
                      setPortalMenuOpen(false);
                      setSidebarOpen(false);
                    }}
                  >
                    {p.title}
                  </Link>
                ))}
                <Link
                  href="/dashboard"
                  className="block border-t border-fog px-3 py-2 text-sm text-steel hover:text-obsidian"
                  onClick={() => setPortalMenuOpen(false)}
                >
                  All portals
                </Link>
              </div>
            )}
          </div>
          <Link
            href="/"
            className="mt-2 flex items-center gap-2 rounded-[12px] px-3 py-2 text-sm text-steel transition hover:bg-fog hover:text-obsidian"
          >
            <Home className="h-4 w-4" />
            Marketing site
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-fog bg-snow/80 px-4 backdrop-blur-xl lg:px-8">
          <button
            type="button"
            className="rounded-[12px] p-2 text-graphite transition hover:bg-fog lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden lg:block">
            <h1 className="text-lg font-semibold text-obsidian">{config.title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-obsidian">{userLabel}</p>
              <p className="text-xs text-steel">{userMeta}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-obsidian text-sm font-semibold text-snow">
              {userLabel.charAt(0).toUpperCase()}
            </div>
            <SignOutButton />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>

      {sidebarOpen && (
        <button
          type="button"
          className="fixed right-4 top-4 z-50 rounded-[12px] border border-fog bg-snow p-2 shadow-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        >
          <X className="h-5 w-5 text-graphite" />
        </button>
      )}
    </div>
  );
}
