'use client';

import { ArrowRight, Compass } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Map preview card – simulated map with clean light theme layout     */
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
      <div className="relative overflow-hidden rounded-[36px] border border-fog bg-snow">
        {/* Toolbar */}
        <div className="flex items-center gap-2 border-b border-fog bg-fog/50 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-ash/30" />
          <span className="h-3 w-3 rounded-full bg-ash/30" />
          <span className="h-3 w-3 rounded-full bg-ash/30" />
          <span className="ml-3 text-xs font-medium text-steel">
            StayNEP — Tourism Intelligence Map
          </span>
        </div>

        {/* Map area */}
        <div className="relative h-64 overflow-hidden sm:h-72 lg:h-80">
          {/* Gradient terrain */}
          <div className="absolute inset-0 bg-gradient-to-br from-mist via-snow to-mist" />

          {/* Grid lines */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                'linear-gradient(#09090b 1px, transparent 1px), linear-gradient(90deg, #09090b 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* Topographic curves */}
          <svg className="absolute inset-0 h-full w-full opacity-[0.2]" viewBox="0 0 600 320" preserveAspectRatio="none">
            <path d="M0,160 Q100,80 200,140 T400,120 T600,160" fill="none" stroke="#a1a1aa" strokeWidth="1" />
            <path d="M0,200 Q150,140 300,180 T600,170" fill="none" stroke="#a1a1aa" strokeWidth="0.8" />
            <path d="M0,240 Q120,200 240,220 T480,210 T600,240" fill="none" stroke="#a1a1aa" strokeWidth="0.6" />
          </svg>

          {/* Nepal shape hint */}
          <svg className="absolute inset-0 h-full w-full opacity-[0.15]" viewBox="0 0 600 320" preserveAspectRatio="none">
            <path
              d="M80,180 Q120,120 180,130 Q220,100 260,110 Q300,80 350,95 Q400,70 440,100 Q480,90 520,120 L530,150 Q490,160 460,180 Q420,200 380,190 Q340,210 300,200 Q260,220 220,200 Q180,220 140,200 Z"
              fill="none"
              stroke="#71717a"
              strokeWidth="1.5"
            />
          </svg>

          {/* Markers */}
          {markers.map((m, i) => (
            <div
              key={i}
              className="absolute flex flex-col items-center animate-fade-in-up"
              style={{
                left: m.x,
                top: m.y,
                transform: 'translate(-50%,-50%)',
                animationDelay: `${i * 0.1}s`,
              }}
            >
              {m.pulse && (
                <span
                  className="absolute h-6 w-6 rounded-full bg-obsidian/10 animate-pulse-dot"
                />
              )}
              <span className="relative h-3 w-3 rounded-full border-2 border-snow bg-obsidian shadow-sm" />
              <span className="mt-1 whitespace-nowrap rounded-[8px] border border-fog bg-snow px-1.5 py-0.5 text-[10px] font-medium text-graphite">
                {m.label}
              </span>
            </div>
          ))}

          {/* Connecting lines */}
          <svg className="absolute inset-0 h-full w-full opacity-[0.25]" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="28" y1="35" x2="55" y2="28" stroke="#3f3f46" strokeWidth="0.15" strokeDasharray="1 1" />
            <line x1="55" y1="28" x2="62" y2="58" stroke="#3f3f46" strokeWidth="0.15" strokeDasharray="1 1" />
            <line x1="28" y1="35" x2="18" y2="55" stroke="#3f3f46" strokeWidth="0.15" strokeDasharray="1 1" />
            <line x1="18" y1="55" x2="62" y2="58" stroke="#3f3f46" strokeWidth="0.15" strokeDasharray="1 1" />
          </svg>
        </div>
      </div>
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
      <div className="rounded-[36px] border border-fog bg-snow p-6">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-4">
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <span className="text-[40px] font-bold leading-none tracking-tight text-obsidian font-cosmica">
                {s.value}
              </span>
              <span className="mt-1 text-[13px] font-medium tracking-tight text-steel">
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
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-mist pt-28 pb-32"
    >
      {/* ---- Content ---- */}
      <div className="relative z-20 mx-auto w-full max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-fog bg-snow px-4 py-1.5">
          <Compass className="h-4 w-4 text-steel" />
          <span className="text-[12px] font-medium tracking-tight text-steel">
            GIS-Powered Tourism Intelligence
          </span>
        </div>

        {/* Headline */}
        <h1 className="mx-auto max-w-4xl text-[38px] leading-[1.1] sm:text-[48px] md:text-[56px] font-bold tracking-tight text-obsidian font-cosmica">
          Transforming Nepal's Tourism <br className="hidden sm:block" />
          Through <span className="text-ash">Location Intelligence</span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-6 max-w-2xl text-[16px] leading-[1.5] text-steel font-cosmica">
          A GIS-powered tourism intelligence platform connecting travelers, hotels,
          and destinations across Nepal.
        </p>

        {/* CTA buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={() => scrollTo('map')}
            className="group inline-flex items-center gap-2 rounded-[36px] bg-obsidian px-6 py-3 text-sm font-medium text-snow shadow-button transition-transform duration-200 active:scale-95 cursor-pointer"
          >
            Explore Map
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
          <button
            onClick={() => scrollTo('dashboard')}
            className="group inline-flex items-center gap-2 rounded-[36px] border border-graphite bg-snow px-6 py-3 text-sm font-medium text-graphite transition-transform duration-200 active:scale-95 cursor-pointer"
          >
            View Dashboard
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Map preview card */}
        <MapPreview />

        {/* Stats bar */}
        <StatsBar />
      </div>
    </section>
  );
}
