interface ChatBubbleProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function ChatBubble({ isOpen, onClick }: ChatBubbleProps) {
  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? "Close chat" : "Open chat"}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-2xl text-white shadow-widget transition hover:bg-brand-700"
    >
      {isOpen ? (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.3 19.7l-1.42-1.41L9.17 12 2.88 5.71 4.3 4.29l6.29 6.3 6.3-6.3z" />
        </svg>
      ) : (
        <span>🤖</span>
      )}
    </button>
  );
}
