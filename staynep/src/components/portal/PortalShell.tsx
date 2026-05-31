"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MapPin, Menu, X, ChevronDown, LogOut, Home } from "lucide-react";
import type { PortalRole } from "@/lib/roles";
import { PORTALS, PORTAL_LIST } from "@/lib/roles";

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
    return pathname === base || (base !== config.basePath && pathname.startsWith(base));
  };

  return (
    <div className="flex min-h-screen bg-[#0D1B3E]">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-[#091428] transition-transform lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-4">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg ring-1"
            style={{ backgroundColor: config.accentMuted, borderColor: `${config.accent}50` }}
          >
            <MapPin className="h-5 w-5" style={{ color: config.accent }} />
          </span>
          <div>
            <span className="text-sm font-bold text-white">Stay</span>
            <span style={{ color: config.accent }} className="text-sm font-bold">
              NEP
            </span>
          </div>
        </div>

        <div className="border-b border-white/10 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            {config.title}
          </p>
          <p className="mt-0.5 text-xs text-gray-400">{config.subtitle}</p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {config.nav.map((item) => {
            const active = isActive(item.href) && !item.href.includes("#");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "text-[#0D1B3E]"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
                style={
                  active
                    ? { backgroundColor: config.accent, color: "#0D1B3E" }
                    : undefined
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setPortalMenuOpen((v) => !v)}
              className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-left text-sm hover:bg-white/10"
            >
              <span className="text-gray-300">Switch portal</span>
              <ChevronDown className={`h-4 w-4 text-gray-400 transition ${portalMenuOpen ? "rotate-180" : ""}`} />
            </button>
            {portalMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 rounded-xl border border-white/10 bg-[#0D1B3E] py-1 shadow-xl">
                {PORTAL_LIST.filter((p) => p.role !== config.role).map((p) => (
                  <Link
                    key={p.role}
                    href={p.basePath}
                    className="block px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
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
                  className="block border-t border-white/10 px-3 py-2 text-sm text-gray-400 hover:text-white"
                  onClick={() => setPortalMenuOpen(false)}
                >
                  All portals
                </Link>
              </div>
            )}
          </div>
          <Link
            href="/"
            className="mt-2 flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-500 hover:text-white"
          >
            <Home className="h-4 w-4" />
            Marketing site
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-[#0D1B3E]/90 px-4 backdrop-blur-xl lg:px-6">
          <button
            type="button"
            className="rounded-lg p-2 text-gray-400 hover:bg-white/10 lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden lg:block">
            <h1 className="text-lg font-semibold text-white">{config.title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-white">{userLabel}</p>
              <p className="text-xs text-gray-500">{userMeta}</p>
            </div>
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-[#0D1B3E]"
              style={{ backgroundColor: config.accent }}
            >
              {userLabel.charAt(0)}
            </div>
            <Link
              href="/dashboard"
              className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white"
              title="Exit"
            >
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>

      {sidebarOpen && (
        <button
          type="button"
          className="fixed right-4 top-4 z-50 rounded-lg bg-white/10 p-2 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-5 w-5 text-white" />
        </button>
      )}
    </div>
  );
}
