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
