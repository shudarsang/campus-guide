"use client";

import { LiveActivity, LiveStatus } from "@/types/chat";
import ZiaAvatar from "./ZiaAvatar";

interface LiveVoicePanelProps {
  status: LiveStatus;
  activity: LiveActivity;
  languageLabel: string;
  userCaption: string;
  ziaCaption: string;
  level: number;
  onEnd: () => void;
}

const STATUS_TEXT: Record<LiveActivity, string> = {
  listening: "Listening… just speak",
  searching: "Checking college information…",
  speaking: "Zia is speaking — talk anytime to interrupt",
};

export default function LiveVoicePanel({
  status,
  activity,
  languageLabel,
  userCaption,
  ziaCaption,
  level,
  onEnd,
}: LiveVoicePanelProps) {
  const connecting = status === "connecting";
  const listening = !connecting && activity === "listening";

  // The ring around Zia grows with the user's voice while listening,
  // and pulses while she talks.
  const ringScale = listening ? 1 + level * 0.35 : 1;

  return (
    <div
      role="dialog"
      aria-label="Live voice conversation with Zia"
      className="absolute inset-0 z-10 flex flex-col items-center bg-gradient-to-b from-brand-50 via-white to-brand-50 px-6 pb-6 pt-8"
    >
      <p className="text-xs font-medium uppercase tracking-wider text-brand-600">
        Live voice · {languageLabel}
      </p>

      <div className="relative mt-8 flex h-40 w-40 items-center justify-center">
        <span
          aria-hidden="true"
          className={`absolute inset-0 rounded-full bg-brand-200/60 transition-transform duration-100 ${
            activity === "speaking" && !connecting ? "animate-ping" : ""
          }`}
          style={{ transform: `scale(${ringScale})` }}
        />
        <span aria-hidden="true" className="absolute inset-3 rounded-full bg-brand-100" />
        <div className="relative h-24 w-24">
          <ZiaAvatar animated sparkles={activity === "speaking"} />
        </div>
      </div>

      <p className="mt-6 flex items-center gap-2 text-sm font-medium text-brand-700" aria-live="polite">
        {connecting ? (
          <>
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
            Connecting to Zia…
          </>
        ) : (
          STATUS_TEXT[activity]
        )}
      </p>

      {connecting && (
        <p className="mt-1 text-center text-[11px] text-gray-400">
          The first call can take up to a minute while the server wakes up.
        </p>
      )}

      <div className="mt-6 w-full flex-1 space-y-3 overflow-y-auto text-center">
        {userCaption && (
          <p className="text-sm italic text-gray-500">&ldquo;{userCaption}&rdquo;</p>
        )}
        {ziaCaption && (
          <p className="text-[15px] leading-relaxed text-gray-800">{ziaCaption}</p>
        )}
      </div>

      <button
        type="button"
        onClick={onEnd}
        aria-label="End voice conversation"
        className="mt-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition hover:bg-red-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
          <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08a.956.956 0 0 1 0-1.36C3.32 8.84 7.46 7 12 7s8.68 1.84 11.71 4.72c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28a11.27 11.27 0 0 0-2.67-1.85.996.996 0 0 1-.56-.9v-3.1C15.15 9.25 13.6 9 12 9Z" />
        </svg>
      </button>
      <p className="mt-2 text-[11px] text-gray-400">Tip: use headphones so Zia doesn&apos;t hear herself.</p>
    </div>
  );
}
