"use client";

import { useEffect, useState } from "react";
import ChatBubble from "./ChatBubble";
import ChatWindow from "./ChatWindow";

const OPEN_EVENT = "campusguide:open-chat";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const openChat = () => setIsOpen(true);
    window.addEventListener(OPEN_EVENT, openChat);
    return () => window.removeEventListener(OPEN_EVENT, openChat);
  }, []);

  return (
    <>
      {isOpen && (
        <ChatWindow
          onMinimize={() => setIsOpen(false)}
          onClose={() => setIsOpen(false)}
        />
      )}
      <ChatBubble isOpen={isOpen} onClick={() => setIsOpen((prev) => !prev)} />
    </>
  );
}
