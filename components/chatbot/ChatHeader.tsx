interface ChatHeaderProps {
  onMinimize: () => void;
  onClose: () => void;
}

export default function ChatHeader({ onMinimize, onClose }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-brand-700 to-brand-600 px-4 py-3 text-white">
      <div className="flex items-center gap-3">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg">
          🤖
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-brand-700 bg-green-400" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight">CampusGuide AI</p>
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
          aria-label="More options"
          className="rounded-full p-1.5 text-brand-100 transition hover:bg-white/10 hover:text-white"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>
        <button
          aria-label="Minimize chat"
          onClick={onMinimize}
          className="rounded-full p-1.5 text-brand-100 transition hover:bg-white/10 hover:text-white"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
            <rect x="5" y="11" width="14" height="2" rx="1" />
          </svg>
        </button>
        <button
          aria-label="Close chat"
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
