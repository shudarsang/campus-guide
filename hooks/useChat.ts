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

function message(
  role: ChatMessage["role"],
  content: string,
  sources?: ChatMessage["sources"]
): ChatMessage {
  return { id: makeId(), role, content, timestamp: nowLabel(), sources };
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
        .map((m) => ({ role: m.role, content: m.content.replace(/^🎤 /, "") }));

      commit([...messagesRef.current, message("user", trimmed)]);
      setIsTyping(true);

      try {
        const data = await sendChatMessage(trimmed, history);
        commit([...messagesRef.current, message("bot", data.response, data.sources)]);
      } catch {
        commit([
          ...messagesRef.current,
          message(
            "bot",
            "Sorry, I'm having trouble reaching the server right now. Please try again in a moment."
          ),
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    [commit]
  );

  // Records one spoken exchange from a live voice call in the chat, so
  // the conversation is still readable (and typed follow-ups have
  // context) after the call ends.
  const addVoiceTurn = useCallback(
    (userText: string, ziaText: string) => {
      const next = [...messagesRef.current];
      if (userText.trim()) next.push(message("user", `🎤 ${userText.trim()}`));
      if (ziaText.trim()) next.push(message("bot", ziaText.trim()));
      if (next.length !== messagesRef.current.length) commit(next);
    },
    [commit]
  );

  return { messages, isTyping, sendMessage, addVoiceTurn };
}
