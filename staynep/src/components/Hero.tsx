'use client';

import Link from 'next/link';
import { ArrowRight, Compass } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Floating animated dots – pure CSS keyframes injected via <style>  */
/* ------------------------------------------------------------------ */
function FloatingDots() {
  const dots = [
    { size: 6, x: '12%', y: '18%', delay: '0s', duration: '7s' },
    { size: 4, x: '78%', y: '25%', delay: '1.2s', duration: '9s' },
    { size: 8, x: '45%', y: '72%', delay: '0.5s', duration: '8s' },
    { size: 5, x: '88%', y: '60%', delay: '2s', duration: '6s' },
    { size: 3, x: '22%', y: '82%', delay: '1.8s', duration: '10s' },
    { size: 7, x: '65%', y: '15%', delay: '0.8s', duration: '7.5s' },
    { size: 4, x: '35%', y: '45%', delay: '3s', duration: '8.5s' },
    { size: 5, x: '92%', y: '40%', delay: '1.5s', duration: '9.5s' },
  ];

  return (
    <>
      <style>{`
        @keyframes float-dot {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          25% { transform: translate(12px, -18px) scale(1.15); opacity: 0.6; }
          50% { transform: translate(-8px, -28px) scale(0.9); opacity: 0.4; }
          75% { transform: translate(16px, -10px) scale(1.1); opacity: 0.55; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }
      `}</style>
      {dots.map((d, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-[#C9A24A]"
          style={{
            width: d.size,
            height: d.size,
            left: d.x,
            top: d.y,
            animation: `float-dot ${d.duration} ${d.delay} ease-in-out infinite`,
          }}
        />
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Map preview card – simulated map with gradient + marker dots       */
/* ------------------------------------------------------------------ */
function MapPreview() {
  const markers = [
    { x: '28%', y: '35%', label: 'Pokhara', pulse: true },
    { x: '55%', y: '28%', label: 'Kathmandu', pulse: true },
    { x: '75%', y: '42%', label: 'Everest', pulse: false },
    { x: '18%', y: '55%', label: 'Lumbini', pulse: false },
    { x: '62%', y: '58%', label: 'Chitwan', pulse: true },
    { x: '42%', y: '20%', label: 'Langtang', pulse: false },
    { x: '85%', y: '30%', label: 'Ilam', pulse: false },
  ];

  return (
    <div className="relative mx-auto mt-12 w-full max-w-3xl lg:mt-16">
      {/* Card glow */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#C9A24A]/20 via-[#C9A24A]/5 to-[#C9A24A]/20 blur-xl" />

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a1430]/80 shadow-2xl backdrop-blur-sm">
        {/* Toolbar */}
        <div className="flex items-center gap-2 border-b border-white/5 bg-white/[0.03] px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-400/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
          <span className="h-3 w-3 rounded-full bg-green-400/80" />
          <span className="ml-3 text-xs font-medium text-white/40">
            StayNEP — Tourism Intelligence Map
          </span>
        </div>

        {/* Map area */}
        <div className="relative h-64 overflow-hidden sm:h-72 lg:h-80">
          {/* Gradient terrain */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f2347] via-[#132d5e] to-[#0b1a38]" />

          {/* Grid lines */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* Topographic curves */}
          <svg className="absolute inset-0 h-full w-full opacity-[0.08]" viewBox="0 0 600 320" preserveAspectRatio="none">
            <path d="M0,160 Q100,80 200,140 T400,120 T600,160" fill="none" stroke="#C9A24A" strokeWidth="1" />
            <path d="M0,200 Q150,140 300,180 T600,170" fill="none" stroke="#C9A24A" strokeWidth="0.8" />
            <path d="M0,240 Q120,200 240,220 T480,210 T600,240" fill="none" stroke="#C9A24A" strokeWidth="0.6" />
          </svg>

          {/* Nepal shape hint */}
          <svg className="absolute inset-0 h-full w-full opacity-[0.07]" viewBox="0 0 600 320" preserveAspectRatio="none">
            <path
              d="M80,180 Q120,120 180,130 Q220,100 260,110 Q300,80 350,95 Q400,70 440,100 Q480,90 520,120 L530,150 Q490,160 460,180 Q420,200 380,190 Q340,210 300,200 Q260,220 220,200 Q180,220 140,200 Z"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
            />
          </svg>

          {/* Markers */}
          {markers.map((m, i) => (
            <div
              key={i}
              className="absolute flex flex-col items-center"
              style={{ left: m.x, top: m.y, transform: 'translate(-50%,-50%)' }}
            >
              {m.pulse && (
                <span
                  className="absolute h-6 w-6 rounded-full bg-[#C9A24A]/30"
                  style={{ animation: 'pulse-ring 2.5s ease-out infinite' }}
                />
              )}
              <span className="relative h-3 w-3 rounded-full border-2 border-[#C9A24A] bg-[#C9A24A]/80 shadow-lg shadow-[#C9A24A]/40" />
              <span className="mt-1 whitespace-nowrap rounded bg-black/40 px-1.5 py-0.5 text-[10px] font-medium text-white/70 backdrop-blur-sm">
                {m.label}
              </span>
            </div>
          ))}

          {/* Connecting lines */}
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="28" y1="35" x2="55" y2="28" stroke="#C9A24A" strokeWidth="0.15" strokeDasharray="1 1" opacity="0.4" />
            <line x1="55" y1="28" x2="62" y2="58" stroke="#C9A24A" strokeWidth="0.15" strokeDasharray="1 1" opacity="0.4" />
            <line x1="28" y1="35" x2="18" y2="55" stroke="#C9A24A" strokeWidth="0.15" strokeDasharray="1 1" opacity="0.4" />
            <line x1="18" y1="55" x2="62" y2="58" stroke="#C9A24A" strokeWidth="0.15" strokeDasharray="1 1" opacity="0.4" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mountain silhouette SVG                                            */
/* ------------------------------------------------------------------ */
function MountainSilhouette() {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
      <svg
        viewBox="0 0 1440 200"
        className="block w-full h-auto"
        preserveAspectRatio="none"
        fill="none"
      >
        {/* Far mountains – faintest */}
        <path
          d="M0,200 L0,140 Q60,100 120,130 Q180,80 240,110 Q300,60 360,95 Q420,50 480,85
             Q540,40 600,75 Q660,55 720,90 Q780,45 840,80 Q900,35 960,70
             Q1020,50 1080,85 Q1140,60 1200,95 Q1260,70 1320,110 Q1380,80 1440,120 L1440,200 Z"
          fill="#0a1530"
          opacity="0.5"
        />
        {/* Mid mountains */}
        <path
          d="M0,200 L0,155 Q80,125 160,145 Q240,110 320,135 Q400,95 480,125
             Q560,100 640,130 Q720,90 800,120 Q880,105 960,135
             Q1040,110 1120,140 Q1200,115 1280,145 Q1360,120 1440,150 L1440,200 Z"
          fill="#0c1935"
          opacity="0.7"
        />
        {/* Near mountains */}
        <path
          d="M0,200 L0,170 Q100,150 200,165 Q300,140 400,158 Q500,145 600,160
             Q700,148 800,162 Q900,152 1000,165 Q1100,155 1200,168
             Q1300,158 1440,172 L1440,200 Z"
          fill="#0D1B3E"
        />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stats bar                                                          */
/* ------------------------------------------------------------------ */
const stats = [
  { value: '1,200+', label: 'Hotels' },
  { value: '150+', label: 'Destinations' },
  { value: '7', label: 'Provinces' },
  { value: '24/7', label: 'Safety Network' },
];

function StatsBar() {
  return (
    <div className="relative z-20 mx-auto mt-16 max-w-4xl px-4 lg:mt-20">
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-5 shadow-xl backdrop-blur-xl sm:px-10 sm:py-6">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-4">
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <span className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {s.value}
              </span>
              <span className="mt-1 text-xs font-medium uppercase tracking-widest text-white/50 sm:text-sm">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero (default export)                                              */
/* ------------------------------------------------------------------ */
export default function Hero() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0D1B3E] pt-20 pb-32"
    >
      {/* ---- Background layers ---- */}

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(201,162,74,0.12),transparent_70%)]" />

      {/* Subtle dot grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Floating animated dots */}
      <FloatingDots />

      {/* ---- Content ---- */}
      <div className="relative z-20 mx-auto w-full max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#C9A24A]/20 bg-[#C9A24A]/10 px-4 py-1.5">
          <Compass className="h-4 w-4 text-[#C9A24A]" />
          <span className="text-xs font-semibold tracking-wide text-[#C9A24A]">
            GIS-Powered Tourism Intelligence
          </span>
        </div>

        {/* Headline */}
        <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Transforming Tourism{' '}
          <br className="hidden sm:block" />
          Through{' '}
          <span className="bg-gradient-to-r from-[#C9A24A] to-[#e0c374] bg-clip-text text-transparent">
            Location Intelligence
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg md:text-xl">
          A GIS-powered tourism intelligence platform connecting travelers, hotels,
          and destinations across Nepal.
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={() => scrollTo('map')}
            className="group inline-flex items-center gap-2 rounded-xl bg-[#C9A24A] px-7 py-3.5 text-sm font-semibold text-[#0D1B3E] shadow-lg shadow-[#C9A24A]/25 transition-all duration-300 hover:bg-[#d4af5a] hover:shadow-[#C9A24A]/35 hover:-translate-y-0.5"
          >
            Explore Map
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2 rounded-xl border border-[#C9A24A]/40 bg-transparent px-7 py-3.5 text-sm font-semibold text-[#C9A24A] transition-all duration-300 hover:border-[#C9A24A] hover:bg-[#C9A24A]/10 hover:-translate-y-0.5"
          >
            Open Portals
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Map preview card */}
        <MapPreview />

        {/* Stats bar */}
        <StatsBar />
      </div>

      {/* Mountain silhouette at bottom */}
      <MountainSilhouette />
    </section>
  );
}
