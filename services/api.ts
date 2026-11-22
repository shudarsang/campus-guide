import {
  ChatApiResponse,
  ChatTurn,
  VoiceApiResponse,
  VoiceLanguage,
} from "@/types/chat";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://campusg-backend.onrender.com";

// A 503 still carries a usable response explaining why (out of
// quota, not configured). Treating every non-2xx as a network
// failure would replace that explanation with a generic
// "can't reach the server", which is what hid the real cause.
async function readResponse<T extends ChatApiResponse>(
  res: Response,
  label: string
): Promise<T> {
  let data: T | null = null;

  try {
    data = (await res.json()) as T;
  } catch {
    data = null;
  }

  if (data?.response) {
    return data;
  }

  if (!res.ok) {
    throw new Error(`${label} request failed with status ${res.status}`);
  }

  throw new Error(`${label} request returned an unreadable response`);
}

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

  return readResponse<ChatApiResponse>(res, "Chat");
}

// One round trip: recording in, transcript + answer + spoken audio out.
export async function sendVoiceMessage(
  audio: string,
  mimeType: string,
  language: VoiceLanguage,
  history: ChatTurn[] = []
): Promise<VoiceApiResponse> {
  const res = await fetch(`${API_BASE_URL}/api/voice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      audio,
      mime_type: mimeType,
      language,
      history,
    }),
  });

  return readResponse<VoiceApiResponse>(res, "Voice");
}
