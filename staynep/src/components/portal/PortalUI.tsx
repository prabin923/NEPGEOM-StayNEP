import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function PortalPageHeader({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-steel">{eyebrow}</p>
      <h2 className="mt-1 text-[28px] font-bold leading-tight tracking-tight text-obsidian font-cosmica">
        {title}
      </h2>
    </div>
  );
}

export function PortalBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-fog bg-snow px-3 py-1 text-[12px] font-medium text-obsidian">
      {children}
    </span>
  );
}

export function PortalCard({
  id,
  children,
  className = "",
  variant = "fog",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  variant?: "fog" | "snow" | "mist";
}) {
  const variants = {
    fog: "bg-fog border-fog",
    snow: "bg-snow border-fog",
    mist: "bg-mist border-fog",
  };
  return (
    <section
      id={id}
      className={`rounded-[28px] border p-6 ${variants[variant]} ${className}`}
    >
      {children}
    </section>
  );
}

export function PortalSectionTitle({
  title,
  subtitle,
  icon: Icon,
  action,
}: {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div className="flex items-start gap-2">
        {Icon && <Icon className="mt-0.5 h-5 w-5 shrink-0 text-graphite" />}
        <div>
          <h3 className="text-[18px] font-semibold text-ink font-cosmica">{title}</h3>
          {subtitle && (
            <p className="mt-0.5 text-[14px] text-steel font-cosmica">{subtitle}</p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
}

export function PortalInnerCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[16px] border border-fog bg-snow p-4">{children}</div>
  );
}

export function PortalListRow({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-between rounded-[12px] border border-fog bg-snow px-3 py-3">
      {children}
    </div>
  );
}

export function StatusBadge({
  tone,
  children,
}: {
  tone: "success" | "warning" | "info" | "neutral";
  children: ReactNode;
}) {
  const tones = {
    success: "bg-snow text-obsidian border-fog",
    warning: "bg-mist text-graphite border-fog",
    info: "bg-fog text-ink border-fog",
    neutral: "bg-mist text-steel border-fog",
  };
  return (
    <span
      className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export const portalChartAxis = {
  tick: { fill: "#a1a1aa", fontSize: 11, fontFamily: "var(--font-cosmica)" },
};

export function PortalChartTooltip({
  active,
  payload,
  label,
  unit = "",
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  unit?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[12px] border border-fog bg-snow/95 px-4 py-3 shadow-sm backdrop-blur-md">
      <p className="mb-1 text-xs font-medium text-steel font-cosmica">{label}</p>
      <p className="text-lg font-bold text-obsidian font-cosmica">
        {payload[0].value.toLocaleString()}
        {unit && <span className="ml-1.5 text-xs font-normal text-steel">{unit}</span>}
      </p>
    </div>
  );
}

export const portalTableHead =
  "border-b border-fog text-steel text-[13px] font-medium font-cosmica";
export const portalTableRow = "border-b border-fog/80 last:border-0";
