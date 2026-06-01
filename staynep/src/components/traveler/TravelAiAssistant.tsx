"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bot, Loader2, Send, Sparkles } from "lucide-react";
import {
  TRAVEL_AI_SUGGESTIONS,
  type TravelChatMessage,
} from "@/lib/travel-ai-assistant";
import { PortalSectionTitle } from "@/components/portal/PortalUI";

function renderMarkdownLite(text: string) {
  return text.split("\n").map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={i} className={line ? "mb-1 last:mb-0" : "mb-1"}>
        {parts.map((part, j) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={j} className="font-semibold text-obsidian">
                {part.slice(2, -2)}
              </strong>
            );
          }
          if (part.startsWith("_") && part.endsWith("_")) {
            return (
              <em key={j} className="text-steel">
                {part.slice(1, -1)}
              </em>
            );
          }
          return <span key={j}>{part}</span>;
        })}
      </p>
    );
  });
}

export default function TravelAiAssistant() {
  const [messages, setMessages] = useState<TravelChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your **StayNEP travel assistant** — full trip planning for Nepal:\n\n• **Hotel recommendations** (catalog + bookable partners)\n• Day-by-day **itineraries**, budgets & distances\n• Treks, packing tips & more\n\nTry: *Recommend hotels in Pokhara mid-range*",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError(null);
    const userMsg: TravelChatMessage = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/travel-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong");
        return;
      }
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setError("Could not reach the assistant. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, [loading, messages]);

  return (
    <div className="flex flex-col">
      <PortalSectionTitle
        title="AI travel assistant"
        subtitle="Hotel recommendations, itineraries, budgets, distances & any Nepal travel question"
        icon={Sparkles}
      />

      <div className="mt-4 flex flex-wrap gap-2">
        {TRAVEL_AI_SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => send(s)}
            disabled={loading}
            className="rounded-full border border-fog bg-snow px-3 py-1.5 text-[11px] font-medium text-graphite transition hover:border-graphite hover:bg-mist disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>

      <div
        ref={scrollRef}
        className="mt-4 max-h-[min(480px,55vh)] min-h-[220px] overflow-y-auto rounded-[20px] border border-fog bg-mist/40 p-4"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-3 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[90%] rounded-[16px] px-3.5 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-obsidian text-snow"
                  : "border border-fog bg-snow text-ink"
              }`}
            >
              {m.role === "assistant" ? (
                <div className="font-cosmica">{renderMarkdownLite(m.content)}</div>
              ) : (
                m.content
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-sm text-steel">
            <Loader2 className="h-4 w-4 animate-spin" />
            Calculating…
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="mt-3 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Itinerary, budget, distances, hotels, packing, anything…"
          disabled={loading}
          className="min-w-0 flex-1 rounded-[36px] border border-fog bg-snow px-4 py-2.5 text-sm outline-none focus:border-graphite disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-obsidian text-snow disabled:opacity-40"
          aria-label="Send message"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </form>

      <p className="mt-2 flex items-center gap-1.5 text-[10px] text-steel">
        <Bot className="h-3 w-3" />
        Plans use StayNEP places data; distances are GIS estimates (~25% longer by road in hills).
      </p>
    </div>
  );
}
