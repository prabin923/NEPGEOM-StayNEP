'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { MapPin, Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Features', href: 'features' },
  { label: 'Map', href: 'map' },
  { label: 'Dashboard', href: 'dashboard' },
  { label: 'Impact', href: 'impact' },
  { label: 'Roadmap', href: 'roadmap' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const scrollTo = useCallback((id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        scrolled
          ? 'bg-snow/80 backdrop-blur-xl border-b border-fog shadow-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group flex items-center gap-2 outline-none cursor-pointer"
            aria-label="Scroll to top"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-fog transition-transform duration-200 active:scale-95">
              <MapPin className="h-5 w-5 text-graphite" />
            </span>
            <span className="text-xl font-bold tracking-tight lg:text-2xl font-cosmica text-obsidian">
              StayNEP
            </span>
          </button>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="group relative rounded-lg px-4 py-2 text-sm font-medium text-ink/75 hover:text-obsidian focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-obsidian/50 cursor-pointer"
              >
                {link.label}
                <span className="absolute inset-x-4 bottom-1 h-px scale-x-0 bg-obsidian transition-transform duration-200 group-hover:scale-x-100" />
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/dashboard"
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-ink/75 transition hover:text-obsidian"
            >
              Portals
            </Link>
            <Link
              href="/dashboard"
              className="relative rounded-[36px] bg-obsidian px-5 py-2.5 text-sm font-medium text-snow shadow-button transition-transform duration-200 active:scale-95"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-[12px] text-ink transition-transform duration-200 active:scale-95 md:hidden cursor-pointer"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile overlay menu */}
      <div
        className={`fixed inset-0 top-16 z-40 md:hidden ${
          mobileOpen
            ? 'visible opacity-100'
            : 'invisible opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-obsidian/20 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />

        {/* Panel */}
        <div
          className={`relative mx-4 mt-2 overflow-hidden rounded-[28px] border border-fog bg-snow/95 backdrop-blur-xl shadow-md transition-transform duration-300 ${
            mobileOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          }`}
        >
          <div className="flex flex-col gap-1 p-4">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="rounded-xl px-4 py-3 text-left text-base font-medium text-ink/80 hover:text-obsidian hover:bg-fog/50 cursor-pointer"
              >
                {link.label}
              </button>
            ))}
            <div className="my-2 h-px bg-fog" />
            <Link
              href="/dashboard"
              className="rounded-[36px] bg-obsidian px-4 py-3 text-center text-base font-medium text-snow shadow-button"
              onClick={() => setMobileOpen(false)}
            >
              Open Portals
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
