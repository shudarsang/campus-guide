import { ChatApiResponse, ChatTurn } from "@/types/chat";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://campusg-backend.onrender.com";

// The backend is stateless, so recent turns are replayed with each
// message - otherwise every reply starts over with a fresh greeting.
export async function sendChatMessage(
  message: string,
  history: ChatTurn[] = []
): Promise<ChatApiResponse> {
  const res = await fetch(`${API_BASE_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, history }),
  });

  // A 503 still carries a usable ChatResponse explaining why (out
  // of quota, not configured). Treating every non-2xx as a network
  // failure would replace that explanation with a generic
  // "can't reach the server", which is what hid the real cause.
  let data: ChatApiResponse | null = null;

  try {
    data = (await res.json()) as ChatApiResponse;
  } catch {
    data = null;
  }

  if (data?.response) {
    return data;
  }

  if (!res.ok) {
    throw new Error(`Chat request failed with status ${res.status}`);
  }

  throw new Error("Chat request returned an unreadable response");
}
