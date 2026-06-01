"use client";

import { useState, useEffect } from "react";
import {
  ShieldAlert,
  Plane,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  PhoneCall,
  User,
  Calendar,
  AlertTriangle,
  Clock,
  Navigation,
} from "lucide-react";
import { embassies } from "@/data/embassies";
import { PortalSectionTitle, StatusBadge } from "@/components/portal/PortalUI";

interface EnrollmentData {
  originCountry: string;
  emergencyName: string;
  emergencyPhone: string;
  isTrekking: boolean;
  trekRoute: string;
  trekStyle: string;
  guideContact: string;
  districts: string[];
  startDate: string;
  endDate: string;
  optInAlerts: boolean;
  enableSafeCheck: boolean;
  safeCheckInterval: number; // hours
}

const DEFAULT_DATA: EnrollmentData = {
  originCountry: "United States",
  emergencyName: "",
  emergencyPhone: "",
  isTrekking: false,
  trekRoute: "Annapurna Circuit Trek",
  trekStyle: "guided",
  guideContact: "",
  districts: ["Kaski"],
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date(Date.now() + 10 * 86400000).toISOString().slice(0, 10),
  optInAlerts: true,
  enableSafeCheck: true,
  safeCheckInterval: 48,
};

const NEPAL_TREK_ROUTES = [
  "Annapurna Circuit Trek",
  "Everest Base Camp Trek",
  "Langtang Valley Trek",
  "Manaslu Circuit Trek",
  "Mardi Himal Trek",
  "Upper Mustang Trek",
  "Custom Route",
];

const NEPAL_DISTRICTS = [
  "Kathmandu",
  "Kaski",
  "Solukhumbu",
  "Mustang",
  "Manang",
  "Chitwan",
  "Lumbini",
  "Langtang / Rasuwa",
  "Gorkha",
  "Dolpo",
];

export default function TravelerStepEnrollment() {
  const [step, setStep] = useState(1);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [formData, setFormData] = useState<EnrollmentData>(DEFAULT_DATA);
  const [lastCheckIn, setLastCheckIn] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("staynep_step_enrollment");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed.data);
        setIsEnrolled(parsed.isEnrolled);
        setLastCheckIn(parsed.lastCheckIn);
      } catch {
        // Fallback to default
      }
    }
  }, []);

  // Save helper
  const saveState = (enrolled: boolean, checkInTime: string | null) => {
    localStorage.setItem(
      "staynep_step_enrollment",
      JSON.stringify({ data: formData, isEnrolled: enrolled, lastCheckIn: checkInTime })
    );
  };

  const handleNext = () => setStep((s) => Math.min(3, s + 1));
  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  const handleInputChange = (
    key: keyof EnrollmentData,
    value: string | boolean | string[] | number
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleDistrictToggle = (district: string) => {
    const current = [...formData.districts];
    const index = current.indexOf(district);
    if (index > -1) {
      if (current.length > 1) {
        current.splice(index, 1);
      }
    } else {
      current.push(district);
    }
    handleInputChange("districts", current);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsEnrolled(true);
      const checkInStr = new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }) + " today";
      setLastCheckIn(checkInStr);
      saveState(true, checkInStr);
      setIsSubmitting(false);
      setStep(1);
    }, 1200);
  };

  const handleCheckIn = () => {
    const checkInStr = new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }) + " today";
    setLastCheckIn(checkInStr);
    saveState(true, checkInStr);
  };

  const handleUnenroll = () => {
    if (confirm("Are you sure you want to unenroll from STEP-Nepal?")) {
      setIsEnrolled(false);
      setFormData(DEFAULT_DATA);
      setLastCheckIn(null);
      localStorage.removeItem("staynep_step_enrollment");
    }
  };

  // Find embassy linked to the origin country
  const matchedEmbassy = embassies.find(
    (e) => e.country.toLowerCase() === formData.originCountry.toLowerCase()
  ) ?? embassies[0]; // fallback to US Embassy

  if (isEnrolled) {
    return (
      <div>
        {/* Active Enrollment Panel */}
        <div className="flex items-start justify-between gap-3 border-b border-fog pb-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-600 animate-pulse" />
            <div>
              <h3 className="text-[18px] font-semibold text-ink font-cosmica">
                STEP-Nepal Enrollment Active
              </h3>
              <p className="text-[14px] text-steel font-cosmica">
                Trip safety tracking and consular link are online
              </p>
            </div>
          </div>
          <StatusBadge tone="success">Enrolled</StatusBadge>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {/* Section: Trip info */}
          <div className="rounded-[16px] border border-fog bg-mist/30 p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-steel font-cosmica">
              Active Itinerary
            </h4>
            <div className="mt-3 space-y-2">
              <p className="text-sm font-semibold text-ink font-cosmica">
                {formData.isTrekking ? formData.trekRoute : "General Sightseeing"}
              </p>
              <div className="flex items-center gap-2 text-xs text-graphite">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {formData.startDate} to {formData.endDate}
                </span>
              </div>
              <div className="flex items-start gap-2 text-xs text-graphite">
                <Navigation className="h-3.5 w-3.5 mt-0.5" />
                <span>Districts: {formData.districts.join(", ")}</span>
              </div>
              {formData.isTrekking && (
                <p className="text-[11px] text-steel">
                  Trek Style: <span className="capitalize">{formData.trekStyle}</span>
                  {formData.guideContact && ` · Guide: ${formData.guideContact}`}
                </p>
              )}
            </div>
          </div>

          {/* Section: Consular Help */}
          <div className="rounded-[16px] border border-fog bg-mist/30 p-4 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-steel font-cosmica">
                Assigned Consulate
              </h4>
              <p className="mt-2 text-sm font-bold text-ink font-cosmica">
                {matchedEmbassy.name}
              </p>
              <p className="text-xs text-steel">{matchedEmbassy.address}</p>
            </div>

            <a
              href={`tel:${matchedEmbassy.emergencyPhone}`}
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-[10px] bg-red-600 hover:bg-red-700 text-snow py-2 px-3 text-xs font-semibold shadow-sm transition"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              Consular Emergency: {matchedEmbassy.emergencyPhone}
            </a>
          </div>
        </div>

        {/* Section: SafeCheck Check-in */}
        {formData.enableSafeCheck && (
          <div className="mt-4 rounded-[20px] border border-emerald-100 bg-emerald-50/30 p-4 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 mt-0.5 text-emerald-700" />
              <div>
                <p className="text-sm font-bold text-emerald-800 font-cosmica">
                  SafeCheck Verification
                </p>
                <p className="text-xs text-emerald-700">
                  Last verified Check-in: <span className="font-semibold">{lastCheckIn || "Pending"}</span>. Check-in interval: Every {formData.safeCheckInterval} hours.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCheckIn}
              className="rounded-[12px] bg-emerald-600 hover:bg-emerald-700 text-snow text-xs font-bold py-2 px-4 shadow-sm transition"
            >
              Check-in Now
            </button>
          </div>
        )}

        {/* Footer options */}
        <div className="mt-6 flex justify-between gap-3 border-t border-fog pt-4">
          <button
            type="button"
            onClick={() => setIsEnrolled(false)}
            className="text-xs font-medium text-obsidian underline transition hover:text-steel"
          >
            Update Trip Details
          </button>
          <button
            type="button"
            onClick={handleUnenroll}
            className="text-xs font-medium text-red-600 transition hover:text-red-700"
          >
            Unenroll from STEP-Nepal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* STEP Registration Form */}
      <div className="flex items-start justify-between gap-3 border-b border-fog pb-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-graphite" />
          <div>
            <h3 className="text-[18px] font-semibold text-ink font-cosmica">
              STEP-Nepal Enrollment
            </h3>
            <p className="text-[14px] text-steel font-cosmica">
              Emergency registry and itinerary sharing system
            </p>
          </div>
        </div>
        <StatusBadge tone="neutral">Step {step} of 3</StatusBadge>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {step === 1 && (
          <div className="space-y-4">
            <div className="rounded-[12px] bg-mist p-3 text-xs text-graphite leading-relaxed flex gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-steel mt-0.5" />
              <span>
                Registering your travel details allows diplomatic representatives and local Tourist Police to locate you quickly during helicopter search-and-rescues, avalanches, or monsoons.
              </span>
            </div>

            {/* Country */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-steel mb-1.5 font-cosmica">
                Country of Origin
              </label>
              <select
                value={formData.originCountry}
                onChange={(e) => handleInputChange("originCountry", e.target.value)}
                className="w-full rounded-[12px] border border-fog bg-snow py-2.5 px-3 text-sm text-ink outline-none focus:border-obsidian focus:ring-1 focus:ring-obsidian"
              >
                {embassies.map((emb) => (
                  <option key={emb.id} value={emb.country}>
                    {emb.country}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[11px] text-steel">
                We will link your profile with the registered **{matchedEmbassy.name}** in Kathmandu.
              </p>
            </div>

            {/* Emergency Contact */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-steel mb-1.5 font-cosmica">
                  Emergency Contact Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jane Doe"
                  value={formData.emergencyName}
                  onChange={(e) => handleInputChange("emergencyName", e.target.value)}
                  className="w-full rounded-[12px] border border-fog bg-snow py-2 px-3 text-sm text-ink outline-none focus:border-obsidian"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-steel mb-1.5 font-cosmica">
                  Emergency Contact Phone
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +1-555-0199"
                  value={formData.emergencyPhone}
                  onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                  className="w-full rounded-[12px] border border-fog bg-snow py-2 px-3 text-sm text-ink outline-none focus:border-obsidian"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            {/* Trekking Toggle */}
            <div className="flex items-center justify-between rounded-[14px] border border-fog bg-mist/30 p-3">
              <div>
                <p className="text-sm font-semibold text-ink font-cosmica">Trekking in Wilderness?</p>
                <p className="text-xs text-steel">Are you planning treks above 2,500 meters?</p>
              </div>
              <div className="flex gap-1.5 bg-snow border border-fog rounded-[10px] p-0.5">
                <button
                  type="button"
                  onClick={() => handleInputChange("isTrekking", true)}
                  className={`rounded-[8px] px-3.5 py-1 text-xs font-bold transition ${
                    formData.isTrekking
                      ? "bg-obsidian text-snow shadow-button"
                      : "text-steel hover:bg-mist"
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange("isTrekking", false)}
                  className={`rounded-[8px] px-3.5 py-1 text-xs font-bold transition ${
                    !formData.isTrekking
                      ? "bg-obsidian text-snow shadow-button"
                      : "text-steel hover:bg-mist"
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Trek details if yes */}
            {formData.isTrekking && (
              <div className="grid gap-3 sm:grid-cols-2 rounded-[16px] border border-fog p-4 bg-snow">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-steel mb-1.5 font-cosmica">
                    Trek Route
                  </label>
                  <select
                    value={formData.trekRoute}
                    onChange={(e) => handleInputChange("trekRoute", e.target.value)}
                    className="w-full rounded-[10px] border border-fog bg-snow py-2 px-3 text-sm text-ink outline-none focus:border-obsidian"
                  >
                    {NEPAL_TREK_ROUTES.map((route) => (
                      <option key={route} value={route}>
                        {route}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-steel mb-1.5 font-cosmica">
                    Trek Guide
                  </label>
                  <input
                    type="text"
                    placeholder="sherpa name / agency"
                    value={formData.guideContact}
                    onChange={(e) => handleInputChange("guideContact", e.target.value)}
                    className="w-full rounded-[10px] border border-fog bg-snow py-2 px-3 text-sm text-ink outline-none focus:border-obsidian"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-steel mb-1.5 font-cosmica">
                    Guide Contact / Radio
                  </label>
                  <input
                    type="text"
                    placeholder="guide phone / channel"
                    value={formData.guideContact}
                    onChange={(e) => handleInputChange("guideContact", e.target.value)}
                    className="w-full rounded-[10px] border border-fog bg-snow py-2 px-3 text-sm text-ink outline-none focus:border-obsidian"
                  />
                </div>
              </div>
            )}

            {/* Travel Dates */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-steel mb-1.5 font-cosmica">
                  Arrival / Start Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                  className="w-full rounded-[12px] border border-fog bg-snow py-2 px-3 text-sm text-ink outline-none focus:border-obsidian"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-steel mb-1.5 font-cosmica">
                  Departure / End Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  className="w-full rounded-[12px] border border-fog bg-snow py-2 px-3 text-sm text-ink outline-none focus:border-obsidian"
                />
              </div>
            </div>

            {/* Target Districts */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-steel mb-1.5 font-cosmica">
                Districts to Visit (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {NEPAL_DISTRICTS.map((d) => {
                  const isChecked = formData.districts.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleDistrictToggle(d)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                        isChecked
                          ? "bg-obsidian text-snow shadow-button"
                          : "border border-fog bg-snow text-graphite hover:bg-mist"
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="rounded-[16px] border border-fog bg-snow p-4 space-y-4">
              {/* Alert Toggle */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.optInAlerts}
                  onChange={(e) => handleInputChange("optInAlerts", e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-fog text-obsidian focus:ring-obsidian"
                />
                <div>
                  <p className="text-sm font-semibold text-ink font-cosmica">
                    Opt-in to Location Alerts
                  </p>
                  <p className="text-xs text-steel leading-relaxed">
                    Receive immediate email and push notifications about land closures, active monsoons, road maintenance, and local political disturbances.
                  </p>
                </div>
              </label>

              {/* SafeCheck Toggle */}
              <label className="flex items-start gap-3 cursor-pointer border-t border-fog pt-4">
                <input
                  type="checkbox"
                  checked={formData.enableSafeCheck}
                  onChange={(e) => handleInputChange("enableSafeCheck", e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-fog text-obsidian focus:ring-obsidian"
                />
                <div>
                  <p className="text-sm font-semibold text-ink font-cosmica">
                    Enable SafeCheck Automation
                  </p>
                  <p className="text-xs text-steel leading-relaxed">
                    If you enter remote trekking zones, you will need to check in periodically. If you miss your scheduled check-in window, authorities will be alerted.
                  </p>
                </div>
              </label>

              {formData.enableSafeCheck && (
                <div className="border-t border-fog pt-3 ml-7">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-steel mb-1.5 font-cosmica">
                    Verification Interval
                  </label>
                  <div className="flex gap-2">
                    {[24, 48, 72].map((hours) => (
                      <button
                        key={hours}
                        type="button"
                        onClick={() => handleInputChange("safeCheckInterval", hours)}
                        className={`rounded-[10px] px-3.5 py-1.5 text-xs font-semibold transition ${
                          formData.safeCheckInterval === hours
                            ? "bg-obsidian text-snow"
                            : "border border-fog bg-mist/20 text-graphite hover:bg-fog"
                        }`}
                      >
                        Every {hours}h
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <div className="rounded-[12px] bg-red-50/50 border border-red-100 p-3.5 text-xs text-red-800 leading-relaxed flex gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
              <span>
                **Disclaimer**: StayNEP's Smart Traveler Enrollment is an emergency assistance and route coordination registry. Standard evacuation charges apply and are the responsibility of the traveler. Always ensure you have appropriate high-altitude rescue insurance.
              </span>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-3 border-t border-fog pt-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="rounded-[12px] border border-fog bg-snow px-4 py-2 text-xs font-bold text-graphite transition hover:bg-mist"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="rounded-[12px] bg-obsidian hover:bg-graphite text-snow text-xs font-bold py-2 px-5 transition shadow-button"
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-[12px] bg-obsidian hover:bg-graphite text-snow text-xs font-bold py-2 px-5 transition shadow-button flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Registering…
                </>
              ) : (
                "Enroll Journey"
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
