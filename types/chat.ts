export type MessageRole = "bot" | "user";

export interface ChatSource {
  source: string;
  topic: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  sources?: ChatSource[];
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  prompt: string;
}

export interface ChatTurn {
  role: MessageRole;
  content: string;
}

export interface ChatApiResponse {
  success: boolean;
  agent: string;
  response: string;
  sources: ChatSource[];
  error: string | null;
}

export type VoiceLanguage = "en-IN" | "hi-IN" | "ta-IN" | "te-IN" | "ml-IN";

export interface VoiceApiResponse extends ChatApiResponse {
  transcript: string;
  language: VoiceLanguage;
  audio: string | null;
  audio_mime: string | null;
}

// idle -> recording -> processing -> speaking -> idle
export type VoiceState = "idle" | "recording" | "processing" | "speaking";
