"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bot, Loader2, Send, Sparkles, X } from "lucide-react";
import type { MapHotelSelection } from "@/lib/map-hotel-selection";
import type { BookingChatState, ChatMessage } from "@/lib/ai-booking-assistant";
import { initialAssistantMessage } from "@/lib/ai-booking-assistant";

interface HotelMapAiBookingProps {
  hotel: MapHotelSelection;
  onClose: () => void;
  onBooked?: () => void;
}

export default function HotelMapAiBooking({
  hotel,
  onClose,
  onBooked,
}: HotelMapAiBookingProps) {
  const [resolvedPartner, setResolvedPartner] = useState<string | null>(
    hotel.partnerName ?? null
  );
  const [propertyId, setPropertyId] = useState<string | undefined>(
    hotel.propertyId ?? undefined
  );
  const [resolving, setResolving] = useState(!hotel.propertyId);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [state, setState] = useState<BookingChatState | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      let pid = hotel.propertyId;
      let partner = hotel.partnerName ?? null;

      if (!pid) {
        setResolving(true);
        try {
          const res = await fetch(
            `/api/hotels/resolve?name=${encodeURIComponent(hotel.name)}&district=${encodeURIComponent(hotel.district)}&lat=${hotel.lat}&lng=${hotel.lng}`
          );
          const data = await res.json();
          if (res.ok && data.propertyId) {
            pid = data.propertyId;
            partner = data.partnerName ?? partner;
          }
        } catch {
          /* ignore */
        }
        if (!cancelled) setResolving(false);
      }

      if (cancelled) return;

      setPropertyId(pid ?? undefined);
      setResolvedPartner(partner);

      const initialState: BookingChatState = {
        mapHotelKey: hotel.key,
        mapHotelName: hotel.name,
        mapHotelDistrict: hotel.district,
        mapHotelLat: hotel.lat,
        mapHotelLng: hotel.lng,
        propertyId: pid ?? undefined,
        partnerName: partner ?? undefined,
      };

      setState(initialState);
      setMessages([
        {
          role: "assistant",
          content: initialAssistantMessage({
            name: hotel.name,
            isStayNepPartner: hotel.isStayNepPartner,
            partnerName: partner,
          }),
        },
      ]);
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [hotel]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading || !state || state.bookingId) return;

      const userMsg: ChatMessage = { role: "user", content: trimmed };
      const nextMessages = [...messages, userMsg];
      setMessages(nextMessages);
      setInput("");
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/ai/booking-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: nextMessages, state }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Something went wrong");
          return;
        }
        setState(data.state);
        if (data.state.propertyId) setPropertyId(data.state.propertyId);
        if (data.state.partnerName) setResolvedPartner(data.state.partnerName);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
        if (data.booked) onBooked?.();
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [loading, messages, onBooked, state]
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  const suggestions =
    !state || state.bookingId
      ? []
      : !state.checkIn
        ? ["Tomorrow for 3 nights", "2026-06-10 to 2026-06-13"]
        : !state.roomId
          ? ["Standard Trekker Room", "Deluxe Himalayan View"]
          : ["confirm"];

  if (resolving && !messages.length) {
    return (
      <div className="flex h-full min-h-[420px] items-center justify-center rounded-[20px] border border-fog bg-snow">
        <Loader2 className="h-6 w-6 animate-spin text-steel" />
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-[420px] flex-col rounded-[20px] border border-fog bg-snow shadow-lg">
      <div className="flex items-start justify-between gap-3 border-b border-fog px-4 py-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-blue-600 text-snow">
              <Bot className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">StayNEP AI</p>
              <p className="truncate text-xs text-steel">{hotel.name}</p>
            </div>
          </div>
          <p className="mt-2 flex items-center gap-1 text-[11px] text-steel">
            <Sparkles className="h-3 w-3 text-violet-600" />
            {propertyId
              ? "Live sync to hotel management"
              : "Matching StayNEP partner…"}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1.5 text-steel hover:bg-mist"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="border-b border-fog bg-mist/40 px-4 py-2 text-xs text-graphite">
        <span className="font-medium">{hotel.district}</span>
        {hotel.rating != null && (
          <>
            {" · "}
            {hotel.rating}★
          </>
        )}
        {hotel.priceRange && <> · {hotel.priceRange}</>}
        {resolvedPartner && resolvedPartner !== hotel.name && (
          <span className="block mt-1 text-steel">
            Booking via partner: {resolvedPartner}
          </span>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[92%] rounded-[16px] px-3.5 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-obsidian text-snow"
                  : "border border-fog bg-mist text-ink"
              }`}
            >
              <p className="whitespace-pre-wrap">{m.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-steel">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            StayNEP AI is checking availability…
          </div>
        )}
        {error && (
          <p className="rounded-[10px] bg-red-50 px-3 py-2 text-xs text-red-800">
            {error}
          </p>
        )}
      </div>

      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-fog px-4 py-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => sendMessage(s)}
              className="rounded-full border border-fog bg-snow px-3 py-1 text-xs text-graphite hover:bg-mist"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        className="border-t border-fog p-3"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
      >
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              state?.bookingId ? "Booking complete" : "Message StayNEP AI…"
            }
            disabled={loading || !state || !!state.bookingId}
            className="flex-1 rounded-full border border-fog bg-mist/50 px-4 py-2.5 text-sm outline-none focus:border-violet-400/50 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim() || !state || !!state.bookingId}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-obsidian text-snow disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
