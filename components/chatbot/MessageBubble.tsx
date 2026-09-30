import { ChatMessage } from "@/types/chat";
import MarkdownRenderer from "./MarkdownRenderer";
import ZiaAvatar from "./ZiaAvatar";

function BotAvatar() {
  return (
    <div className="h-8 w-8 shrink-0">
      <ZiaAvatar animated={false} sparkles={false} />
    </div>
  );
}

export default function MessageBubble({ message }: { message: ChatMessage }) {
  const isBot = message.role === "bot";

  if (isBot) {
    return (
      <div className="flex items-start gap-2">
        <BotAvatar />
        <div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-brand-50/90 px-4 py-3 shadow-xs border border-brand-100/50">
          <MarkdownRenderer content={message.content} />

          {/* Sources and Citations */}
          {message.sources && message.sources.length > 0 && (
            <div className="mt-2.5 pt-2 border-t border-brand-200/60">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-brand-700 mb-1 flex items-center gap-1">
                <span>📚</span> Verified Sources
              </p>
              <div className="flex flex-wrap gap-1">
                {Array.from(new Set(message.sources.map((s) => s.source))).map(
                  (src) => (
                    <span
                      key={src}
                      className="inline-flex items-center rounded bg-white px-1.5 py-0.5 text-[10px] font-medium text-brand-800 shadow-xs border border-brand-200"
                    >
                      {src.replace(/\.(md|json)$/i, "")}
                    </span>
                  )
                )}
              </div>
            </div>
          )}

          <span className="mt-1.5 block text-[11px] text-gray-400">
            {message.timestamp}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end">
      <div className="max-w-[82%] rounded-2xl rounded-tr-sm bg-brand-600 px-4 py-3 text-white shadow-xs">
        <p className="whitespace-pre-wrap text-sm leading-relaxed">
          {message.content}
        </p>
        <span className="mt-1 block text-right text-[11px] text-brand-100">
          {message.timestamp}
        </span>
      </div>
    </div>
  );
}
