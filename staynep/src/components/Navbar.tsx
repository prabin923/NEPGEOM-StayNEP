'use client';

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#0D1B3E]/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/10'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group flex items-center gap-2 outline-none"
            aria-label="Scroll to top"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#C9A24A]/15 ring-1 ring-[#C9A24A]/30 transition-all duration-300 group-hover:bg-[#C9A24A]/25 group-hover:ring-[#C9A24A]/50">
              <MapPin className="h-5 w-5 text-[#C9A24A]" />
            </span>
            <span className="text-xl font-bold tracking-tight lg:text-2xl">
              <span className="text-white">Stay</span>
              <span className="text-[#C9A24A]">NEP</span>
            </span>
          </button>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="relative rounded-lg px-4 py-2 text-sm font-medium text-white/70 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A24A]/50"
              >
                {link.label}
                <span className="absolute inset-x-4 -bottom-px h-px scale-x-0 bg-[#C9A24A] transition-transform duration-300 group-hover:scale-x-100" />
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-3 md:flex">
            <button
              onClick={() => scrollTo('map')}
              className="relative overflow-hidden rounded-lg bg-[#C9A24A] px-5 py-2.5 text-sm font-semibold text-[#0D1B3E] shadow-lg shadow-[#C9A24A]/20 transition-all duration-300 hover:bg-[#d4af5a] hover:shadow-[#C9A24A]/30 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A24A]/50"
            >
              <span className="relative z-10">Get Started</span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 hover:translate-x-full" />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white md:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile overlay menu */}
      <div
        className={`fixed inset-0 top-16 z-40 transition-all duration-300 md:hidden ${
          mobileOpen
            ? 'visible opacity-100'
            : 'invisible opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />

        {/* Panel */}
        <div
          className={`relative mx-4 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#0D1B3E]/95 backdrop-blur-xl shadow-2xl transition-all duration-300 ${
            mobileOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          }`}
        >
          <div className="flex flex-col gap-1 p-4">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="rounded-xl px-4 py-3 text-left text-base font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </button>
            ))}
            <div className="my-2 h-px bg-white/10" />
            <button
              onClick={() => scrollTo('map')}
              className="rounded-xl bg-[#C9A24A] px-4 py-3 text-center text-base font-semibold text-[#0D1B3E] transition-colors hover:bg-[#d4af5a]"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
