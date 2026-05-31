"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Menu,
  PanelLeftClose,
  PanelLeft,
  Bell,
  MoreVertical,
  X,
} from "lucide-react";
import { LogoImage } from "@/components/Logo";
import SignOutButton from "@/components/auth/SignOutButton";
import HotelCommandPalette from "@/components/hotel/HotelCommandPalette";
import { HOTEL_NAV_GROUPS } from "@/lib/hotel-nav";
import type { HotelSearchItem } from "@/lib/hotel-search";

interface HotelAdminShellProps {
  userName: string;
  userEmail: string;
  searchItems: HotelSearchItem[];
  unreadNotifications?: number;
  children: React.ReactNode;
}

function isNavActive(pathname: string, href: string) {
  if (href === "/dashboard/hotel") {
    return pathname === "/dashboard/hotel";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function HotelAdminShell({
  userName,
  userEmail,
  searchItems,
  unreadNotifications = 0,
  children,
}: HotelAdminShellProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <>
      <div className="flex h-16 items-center gap-2 border-b border-fog px-4">
        <LogoImage size="sm" className="!h-8" />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-obsidian font-cosmica">
            StayNEP
          </p>
          <p className="truncate text-[10px] text-steel">Hotel Management</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {HOTEL_NAV_GROUPS.map((group) => (
          <div key={group.title} className="mb-5">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-steel">
              {group.title}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isNavActive(pathname, item.href);
                const Icon = item.icon;
                const showBadge =
                  item.href === "/dashboard/hotel/notifications" &&
                  unreadNotifications > 0;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-[10px] px-3 py-2 text-sm font-medium transition ${
                        active
                          ? "bg-[#ebe6dc] text-obsidian"
                          : "text-graphite hover:bg-fog/80 hover:text-obsidian"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0 opacity-70" strokeWidth={1.75} />
                      <span className="flex-1">{item.label}</span>
                      {showBadge && (
                        <span className="rounded-full bg-obsidian px-1.5 py-0.5 text-[10px] font-semibold text-snow">
                          {unreadNotifications}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-fog p-3">
        <div className="flex items-center gap-3 rounded-[12px] px-2 py-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-obsidian text-xs font-semibold text-snow">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-obsidian">{userName}</p>
            <p className="truncate text-xs text-steel">{userEmail}</p>
          </div>
          <Link
            href="/dashboard/hotel/settings"
            className="shrink-0 rounded-[8px] p-1 text-steel hover:bg-fog"
            aria-label="Settings"
          >
            <MoreVertical className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-2 px-2 pb-1">
          <SignOutButton showLabel />
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-[#f7f7f8] font-cosmica">
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-obsidian/20 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-full w-[240px] flex-col border-r border-fog bg-snow transition-transform lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${!sidebarOpen ? "lg:hidden" : ""}`}
      >
        {sidebarContent}
        <button
          type="button"
          className="absolute right-3 top-3 rounded-[8px] p-1.5 text-steel hover:bg-fog lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-fog bg-snow px-4 lg:px-6">
          <button
            type="button"
            onClick={() => {
              if (window.innerWidth < 1024) setMobileOpen(true);
              else setSidebarOpen((v) => !v);
            }}
            className="rounded-[10px] p-2 text-graphite hover:bg-fog"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? (
              <PanelLeftClose className="h-5 w-5 hidden lg:block" />
            ) : (
              <PanelLeft className="h-5 w-5 hidden lg:block" />
            )}
            <Menu className="h-5 w-5 lg:hidden" />
          </button>

          <HotelCommandPalette items={searchItems} />

          <Link
            href="/dashboard/hotel/notifications"
            className="relative shrink-0 rounded-[10px] border border-fog p-2 text-graphite hover:bg-fog"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadNotifications > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-obsidian px-1 text-[9px] font-bold text-snow">
                {unreadNotifications > 9 ? "9+" : unreadNotifications}
              </span>
            )}
          </Link>
          <SignOutButton />
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
