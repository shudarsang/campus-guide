"use client";

import { FormEvent, useState } from "react";
import { VoiceLanguage, VoiceState } from "@/types/chat";
import { VOICE_LANGUAGES } from "@/hooks/useVoice";

interface VoiceControls {
  state: VoiceState;
  language: VoiceLanguage;
  onLanguageChange: (language: VoiceLanguage) => void;
  onToggle: () => void;
  error: string | null;
}

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  voice?: VoiceControls;
}

const PLACEHOLDERS: Record<VoiceState, string> = {
  idle: "Type or tap the mic...",
  recording: "Listening... tap the mic to send",
  processing: "Zia is thinking...",
  speaking: "Zia is speaking... tap to stop",
};

const MIC_LABELS: Record<VoiceState, string> = {
  idle: "Speak to Zia",
  recording: "Stop and send voice message",
  processing: "Processing voice message",
  speaking: "Stop Zia speaking",
};

function MicIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2Z" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}

function Spinner() {
  return (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
  );
}

export default function ChatInput({ onSend, disabled, voice }: ChatInputProps) {
  const [value, setValue] = useState("");

  const voiceState = voice?.state ?? "idle";
  const voiceBusy = voiceState !== "idle";

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim() || disabled || voiceBusy) return;
    onSend(value);
    setValue("");
  };

  const micClass =
    voiceState === "recording"
      ? "bg-red-500 text-white animate-pulse hover:bg-red-600"
      : voiceState === "speaking"
        ? "bg-brand-100 text-brand-700 hover:bg-brand-200"
        : "bg-brand-50 text-brand-600 hover:bg-brand-100";

  return (
    <div className="border-t border-gray-100">
      {voice?.error && (
        <p role="alert" className="px-4 pt-2 text-[11px] text-red-600">
          {voice.error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3">
        {voice && (
          <select
            value={voice.language}
            onChange={(e) => voice.onLanguageChange(e.target.value as VoiceLanguage)}
            disabled={voiceBusy}
            aria-label="Voice language"
            title="Language for voice replies"
            className="h-9 w-20 shrink-0 cursor-pointer rounded-full border border-gray-200 bg-gray-50 px-2 text-xs text-gray-700 outline-none focus:border-brand-400 disabled:opacity-60"
          >
            {VOICE_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        )}

        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={PLACEHOLDERS[voiceState]}
          disabled={disabled || voiceBusy}
          className="min-w-0 flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm outline-none focus:border-brand-400 focus:bg-white disabled:opacity-60"
        />

        {voice && (
          <button
            type="button"
            onClick={voice.onToggle}
            disabled={voiceState === "processing" || (disabled && voiceState === "idle")}
            aria-label={MIC_LABELS[voiceState]}
            title={MIC_LABELS[voiceState]}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition disabled:cursor-not-allowed disabled:opacity-50 ${micClass}`}
          >
            {voiceState === "processing" ? (
              <Spinner />
            ) : voiceState === "idle" ? (
              <MicIcon />
            ) : (
              <StopIcon />
            )}
          </button>
        )}

        <button
          type="submit"
          disabled={disabled || voiceBusy || !value.trim()}
          aria-label="Send message"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path d="M3.4 20.6 21 12 3.4 3.4 3 10l12 2-12 2z" />
          </svg>
        </button>
      </form>
    </div>
  );
}
