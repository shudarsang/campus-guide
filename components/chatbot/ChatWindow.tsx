"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@/hooks/useChat";
import { QuickAction } from "@/types/chat";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import QuickActions from "./QuickActions";
import TypingIndicator from "./TypingIndicator";
import ZiaAvatar from "./ZiaAvatar";

interface ChatWindowProps {
  onMinimize: () => void;
  onClose: () => void;
}

export default function ChatWindow({ onMinimize, onClose }: ChatWindowProps) {
  const { messages, isTyping, sendMessage } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Escape shrinks an expanded window back to its compact size.
  useEffect(() => {
    if (!isExpanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isExpanded]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleQuickAction = (action: QuickAction) => {
    sendMessage(action.prompt);
  };

  return (
    <div
      className={`fixed bottom-24 right-6 z-50 flex max-h-[calc(100vh-7.5rem)] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl bg-white shadow-widget transition-[width,height] duration-300 ease-out ${
        isExpanded ? "h-[calc(100vh-7.5rem)] w-[760px]" : "h-[600px] w-[380px]"
      }`}
    >
      <ChatHeader
        isExpanded={isExpanded}
        onToggleExpand={() => setIsExpanded((prev) => !prev)}
        onMinimize={onMinimize}
        onClose={onClose}
      />

      <div className="chat-scroll flex-1 space-y-4 overflow-y-auto p-4">
        <div className="flex items-start gap-2">
          <div className="h-8 w-8 shrink-0">
            <ZiaAvatar animated={false} sparkles={false} />
          </div>
          <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-brand-50 px-4 py-3">
            <p className="text-sm font-semibold text-brand-700">
              Welcome to Ethiraj College Site! 👋
            </p>
            <p className="mt-1 text-sm leading-relaxed text-gray-700">
              I&apos;m Zia, your CampusGuide AI assistant. How can I help
              you today?
            </p>
          </div>
        </div>

        {messages.length === 0 && (
          <>
            <QuickActions variant="grid" onSelect={handleQuickAction} />

            <div className="rounded-xl bg-brand-50 p-3">
              <p className="mb-2 text-xs font-semibold text-brand-700">
                You can also ask me anything about:
              </p>
              <ul className="space-y-1 text-xs text-gray-600">
                {[
                  "Departments and Programs",
                  "Scholarships and Financial Aid",
                  "Placements and Internships",
                  "Hostel and Accommodation",
                  "Examinations and Results",
                  "And much more!",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isTyping && <TypingIndicator />}

        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={sendMessage} disabled={isTyping} />

      <div className="flex items-center justify-center gap-1 border-t border-gray-100 py-2 text-[11px] text-gray-400">
        Powered by <span className="font-medium text-brand-600">Multi-Agent AI &amp; RAG</span>
      </div>
    </div>
  );
}
