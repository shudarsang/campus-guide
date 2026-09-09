"use client";

import { useCallback, useState } from "react";
import { sendChatMessage } from "@/services/api";
import { ChatMessage } from "@/types/chat";

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

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = {
      id: makeId(),
      role: "user",
      content: trimmed,
      timestamp: nowLabel(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const data = await sendChatMessage(trimmed);

      const botMessage: ChatMessage = {
        id: makeId(),
        role: "bot",
        content: data.response,
        timestamp: nowLabel(),
        sources: data.sources,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorMessage: ChatMessage = {
        id: makeId(),
        role: "bot",
        content:
          "Sorry, I'm having trouble reaching the server right now. Please try again in a moment.",
        timestamp: nowLabel(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, []);

  return { messages, isTyping, sendMessage };
}
