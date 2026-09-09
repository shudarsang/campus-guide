"use client";

import { useCallback, useRef, useState } from "react";
import { sendChatMessage } from "@/services/api";
import { ChatMessage, ChatTurn } from "@/types/chat";

// Turns replayed to the backend so follow-up questions make sense.
// Kept short deliberately: every turn is prompt tokens on each call,
// and the backend caps it at the same number anyway.
const HISTORY_LIMIT = 10;

function nowLabel(): string {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // sendMessage is memoised with no dependencies, so reading
  // `messages` inside it would capture the value from first render
  // and every request would send an empty history. The ref always
  // holds the current list.
  const messagesRef = useRef<ChatMessage[]>([]);

  const commit = useCallback((next: ChatMessage[]) => {
    messagesRef.current = next;
    setMessages(next);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      // Snapshot before appending, so the user's new message is sent
      // as `message` rather than duplicated into the history too.
      const history: ChatTurn[] = messagesRef.current
        .slice(-HISTORY_LIMIT)
        .map((m) => ({ role: m.role, content: m.content }));

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

        const botMessage: ChatMessage = {
          id: makeId(),
          role: "bot",
          content: data.response,
          timestamp: nowLabel(),
          sources: data.sources,
        };

        commit([...messagesRef.current, botMessage]);
      } catch (err) {
        const errorMessage: ChatMessage = {
          id: makeId(),
          role: "bot",
          content:
            "Sorry, I'm having trouble reaching the server right now. Please try again in a moment.",
          timestamp: nowLabel(),
        };

        commit([...messagesRef.current, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    },
    [commit]
  );

  return { messages, isTyping, sendMessage };
}
