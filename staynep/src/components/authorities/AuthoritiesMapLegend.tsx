export default function AuthoritiesMapLegend() {
  const items = [
    { color: "bg-pink-500", ring: "ring-pink-200", label: "Travelers (GPS)" },
    { color: "bg-blue-600", ring: "ring-amber-300", label: "Registered hotels" },
    { color: "bg-amber-500", ring: "ring-amber-200", label: "Top rated (4★+)" },
    { color: "bg-cyan-500", ring: "ring-cyan-200", label: "Traffic corridors" },
    { color: "bg-red-600", ring: "ring-red-200", label: "Open reports" },
    { color: "bg-red-700", ring: "ring-red-400", label: "Emergency SOS", pulse: true },
  ];

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-[12px] border border-fog bg-mist/50 px-3 py-2.5">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-steel">
        Legend
      </span>
      {items.map((item) => (
        <span
          key={item.label}
          className="inline-flex items-center gap-2 text-xs text-graphite"
        >
          <span
            className={`h-2.5 w-2.5 rounded-full ${item.color} ring-2 ${item.ring} ${
              item.pulse ? "animate-pulse" : ""
            }`}
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}
