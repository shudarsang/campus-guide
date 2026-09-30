import ZiaAvatar from "./ZiaAvatar";

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-2">
      <div className="h-8 w-8 shrink-0">
        <ZiaAvatar sparkles={false} />
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-brand-50 px-4 py-3">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-400 [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-400 [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-400" />
      </div>
    </div>
  );
}
