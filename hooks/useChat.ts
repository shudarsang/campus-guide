"use client";

import { useCallback, useRef, useState } from "react";
import { sendChatMessage, sendVoiceMessage } from "@/services/api";
import {
  ChatMessage,
  ChatTurn,
  VoiceApiResponse,
  VoiceLanguage,
} from "@/types/chat";

// Turns replayed to the backend so follow-up questions make sense.
// Kept short deliberately: every turn is prompt tokens on each call,
// and the backend caps it at the same number anyway.
const HISTORY_LIMIT = 10;

const VOICE_PLACEHOLDER = "🎤 …";

function nowLabel(): string {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function botMessage(content: string, sources?: ChatMessage["sources"]): ChatMessage {
  return {
    id: makeId(),
    role: "bot",
    content,
    timestamp: nowLabel(),
    sources,
  };
}

const NETWORK_ERROR =
  "Sorry, I'm having trouble reaching the server right now. Please try again in a moment.";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // The callbacks are memoised with no dependencies, so reading
  // `messages` inside them would capture the value from first render
  // and every request would send an empty history. The ref always
  // holds the current list.
  const messagesRef = useRef<ChatMessage[]>([]);

  const commit = useCallback((next: ChatMessage[]) => {
    messagesRef.current = next;
    setMessages(next);
  }, []);

  // Snapshot before appending, so the user's new message is sent
  // as `message` rather than duplicated into the history too.
  const currentHistory = useCallback(
    (): ChatTurn[] =>
      messagesRef.current
        .filter((m) => m.content !== VOICE_PLACEHOLDER)
        .slice(-HISTORY_LIMIT)
        .map((m) => ({ role: m.role, content: m.content.replace(/^🎤 /, "") })),
    []
  );

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const history = currentHistory();

      const userMessage: ChatMessage = {
        id: makeId(),
        role: "user",
        content: trimmed,
        timestamp: nowLabel(),
      };

      commit([...messagesRef.current, userMessage]);
      setIsTyping(true);

      try {
        const data = await sendChatMessage(trimmed, history);
        commit([...messagesRef.current, botMessage(data.response, data.sources)]);
      } catch {
        commit([...messagesRef.current, botMessage(NETWORK_ERROR)]);
      } finally {
        setIsTyping(false);
      }
    },
    [commit, currentHistory]
  );

  // Sends a recording; the user's bubble shows a placeholder until the
  // transcript comes back. Returns the response so the caller can play
  // the audio, or null if the request failed.
  const sendVoice = useCallback(
    async (
      audio: string,
      mimeType: string,
      language: VoiceLanguage
    ): Promise<VoiceApiResponse | null> => {
      const history = currentHistory();

      const userId = makeId();
      commit([
        ...messagesRef.current,
        {
          id: userId,
          role: "user",
          content: VOICE_PLACEHOLDER,
          timestamp: nowLabel(),
        },
      ]);
      setIsTyping(true);

      try {
        const data = await sendVoiceMessage(audio, mimeType, language, history);

        const withTranscript = data.transcript
          ? messagesRef.current.map((m) =>
              m.id === userId ? { ...m, content: `🎤 ${data.transcript}` } : m
            )
          : messagesRef.current.filter((m) => m.id !== userId);

        commit([...withTranscript, botMessage(data.response, data.sources)]);

        return data;
      } catch {
        commit([
          ...messagesRef.current.filter((m) => m.id !== userId),
          botMessage(NETWORK_ERROR),
        ]);
        return null;
      } finally {
        setIsTyping(false);
      }
    },
    [commit, currentHistory]
  );

  return { messages, isTyping, sendMessage, sendVoice };
}
