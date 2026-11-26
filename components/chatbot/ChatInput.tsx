"use client";

import { FormEvent, useState } from "react";

interface LiveControls {
  onStart: () => void;
  error: string | null;
}

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  live?: LiveControls;
}

export default function ChatInput({ onSend, disabled, live }: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue("");
  };

  return (
    <div className="border-t border-gray-100">
      {live?.error && (
        <p role="alert" className="px-4 pt-2 text-[11px] text-red-600">
          {live.error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-3 py-3 sm:px-4">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={live ? "Type, or tap the call button..." : "Type your message..."}
          disabled={disabled}
          className="min-w-0 flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-base outline-none sm:text-sm focus:border-brand-400 focus:bg-white disabled:opacity-60"
        />

        {live && (
          <button
            type="button"
            onClick={live.onStart}
            aria-label="Talk to Zia live"
            title="Talk to Zia live — in English, Hindi, Tamil, Telugu or Malayalam"
            className="flex h-10 w-10 shrink-0 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-brand-50 text-brand-600 transition hover:bg-brand-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M7 10h2v4H7v-4Zm4-4h2v12h-2V6Zm4 2h2v8h-2V8ZM3 11h2v2H3v-2Zm16 0h2v2h-2v-2Z" />
            </svg>
          </button>
        )}

        <button
          type="submit"
          disabled={disabled || !value.trim()}
          aria-label="Send message"
          className="flex h-10 w-10 shrink-0 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-brand-600 text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
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
