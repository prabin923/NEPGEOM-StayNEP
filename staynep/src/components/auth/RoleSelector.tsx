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
    <div className="space-y-2">
      <p className="text-sm font-medium text-obsidian">I am a…</p>
      <input type="hidden" name={name} value={value} />
      <div className="grid gap-3 sm:grid-cols-3">
        {roles.map((role) => {
          const Icon = role.icon;
          const selected = value === role.value;
          return (
            <button
              key={role.value}
              type="button"
              onClick={() => onChange(role.value)}
              className={`rounded-[20px] border p-4 text-left transition ${
                selected
                  ? "border-obsidian bg-obsidian text-snow shadow-button"
                  : "border-fog bg-snow text-ink hover:border-graphite"
              }`}
            >
              <Icon
                className={`mb-2 h-5 w-5 ${selected ? "text-snow" : "text-graphite"}`}
              />
              <p className="text-sm font-semibold">{role.label}</p>
              <p
                className={`mt-1 text-xs leading-relaxed ${
                  selected ? "text-snow/80" : "text-steel"
                }`}
              >
                {role.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
