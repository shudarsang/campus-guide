import ZiaAvatar from "./ZiaAvatar";

interface ChatHeaderProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
  onMinimize: () => void;
  onClose: () => void;
}

export default function ChatHeader({
  isExpanded,
  onToggleExpand,
  onMinimize,
  onClose,
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-brand-700 to-brand-600 px-4 py-3 text-white">
      <div className="flex items-center gap-3">
        <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/15 p-1 ring-1 ring-white/25">
          <ZiaAvatar sparkles={false} />
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-brand-700 bg-green-400" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight">Zia</p>
          <p className="text-xs leading-tight text-brand-100">
            Your AI Assistant for Ethiraj College
          </p>
          <p className="flex items-center gap-1 text-[11px] leading-tight text-brand-100">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            Online
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          aria-label={isExpanded ? "Collapse chat" : "Expand chat"}
          title={isExpanded ? "Collapse" : "Expand"}
          onClick={onToggleExpand}
          className="rounded-full p-1.5 text-brand-100 transition hover:bg-white/10 hover:text-white"
        >
          {isExpanded ? (
            // Arrows pointing inward
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M4 14h6v6" />
              <path d="M20 10h-6V4" />
              <path d="M14 10l7-7" />
              <path d="M3 21l7-7" />
            </svg>
          ) : (
            // Arrows pointing outward
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M15 3h6v6" />
              <path d="M9 21H3v-6" />
              <path d="M21 3l-7 7" />
              <path d="M3 21l7-7" />
            </svg>
          )}
        </button>
        <button
          aria-label="Minimize chat"
          title="Minimize"
          onClick={onMinimize}
          className="rounded-full p-1.5 text-brand-100 transition hover:bg-white/10 hover:text-white"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <rect x="5" y="11" width="14" height="2" rx="1" />
          </svg>
        </button>
        <button
          aria-label="Close chat"
          title="Close"
          onClick={onClose}
          className="rounded-full p-1.5 text-brand-100 transition hover:bg-white/10 hover:text-white"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.3 19.7l-1.42-1.41L9.17 12 2.88 5.71 4.3 4.29l6.29 6.3 6.3-6.3z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
