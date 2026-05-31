export type GeminiChatMessage = {
  role: "user" | "assistant";
  content: string;
};

/**
 * Google Gemini generateContent API.
 * Set GEMINI_API_KEY in .env (https://aistudio.google.com/apikey)
 */
export async function generateGeminiText(
  systemInstruction: string,
  messages: GeminiChatMessage[]
): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GEMINI_MODEL ?? "gemini-2.0-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const contents = messages.map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }],
  }));

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemInstruction }],
        },
        contents,
        generationConfig: {
          temperature: 0.45,
          maxOutputTokens: 512,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[gemini]", res.status, err.slice(0, 300));
      return null;
    }

    const data = (await res.json()) as {
      candidates?: {
        content?: { parts?: { text?: string }[] };
      }[];
    };

    const text = data.candidates?.[0]?.content?.parts
      ?.map((p) => p.text ?? "")
      .join("")
      .trim();

    return text || null;
  } catch (e) {
    console.error("[gemini]", e);
    return null;
  }
}
