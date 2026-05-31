"use client";

import { Building2, Compass, Shield } from "lucide-react";
import type { PortalRole } from "@/lib/roles";

const roles: {
  value: PortalRole;
  label: string;
  description: string;
  icon: typeof Compass;
}[] = [
  {
    value: "traveler",
    label: "Traveler",
    description: "Explore Nepal, book stays, and get safety alerts",
    icon: Compass,
  },
  {
    value: "hotel",
    label: "Hotel Partner",
    description: "Manage rooms, bookings, and occupancy",
    icon: Building2,
  },
  {
    value: "authorities",
    label: "Tourism Authority",
    description: "National analytics, policy, and incident monitoring",
    icon: Shield,
  },
];

interface RoleSelectorProps {
  value: PortalRole;
  onChange: (role: PortalRole) => void;
  name?: string;
}

export default function RoleSelector({
  value,
  onChange,
  name = "role",
}: RoleSelectorProps) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-medium text-obsidian font-cosmica">
        I am a…
      </legend>
      <input type="hidden" name={name} value={value} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {roles.map((role) => {
          const Icon = role.icon;
          const selected = value === role.value;
          return (
            <button
              key={role.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(role.value)}
              className={`group flex min-h-[132px] flex-col rounded-[20px] border p-4 text-left transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-obsidian/40 ${
                selected
                  ? "border-obsidian bg-obsidian text-snow shadow-button scale-[1.02]"
                  : "border-fog bg-snow text-ink hover:border-graphite hover:bg-mist/40"
              }`}
            >
              <span
                className={`mb-3 flex h-10 w-10 items-center justify-center rounded-[12px] transition-colors ${
                  selected ? "bg-snow/15" : "bg-fog group-hover:bg-fog/80"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${selected ? "text-snow" : "text-graphite"}`}
                  strokeWidth={1.8}
                />
              </span>
              <span className="text-sm font-semibold font-cosmica">{role.label}</span>
              <span
                className={`mt-1.5 flex-1 text-xs leading-relaxed ${
                  selected ? "text-snow/75" : "text-steel"
                }`}
              >
                {role.description}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
