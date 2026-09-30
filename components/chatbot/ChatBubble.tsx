"use client";

import { CSSProperties, useEffect, useState } from "react";
import ZiaAvatar from "./ZiaAvatar";

interface ChatBubbleProps {
  isOpen: boolean;
  onClick: () => void;
}

// Intro sequence played when the site opens:
//   pending -> intro (pops up in the centre) -> hello (waves and says hi)
//   -> fly (glides to the bottom-right corner) -> done
type Phase = "pending" | "intro" | "hello" | "fly" | "done";

const POP_MS = 700;
const HELLO_MS = 2400;
const FLY_MS = 950;
const NUDGE_DELAY_MS = 1500;
const NUDGE_DISMISSED_KEY = "zia-nudge-dismissed";

// The button sits 24px from the corner and is 72px wide, so its centre is
// 60px from the right and bottom edges. This transform moves it to the
// middle of the viewport and enlarges it.
const CENTRE_TRANSFORM =
  "translate(calc(60px - 50vw), calc(60px - 50vh)) scale(2.2)";

function rememberNudgeDismissal() {
  try {
    sessionStorage.setItem(NUDGE_DISMISSED_KEY, "1");
  } catch {
    // Storage can be blocked; the nudge just shows again next time.
  }
}

export default function ChatBubble({ isOpen, onClick }: ChatBubbleProps) {
  const [phase, setPhase] = useState<Phase>("pending");
  const [showNudge, setShowNudge] = useState(false);

  // Start the intro, or skip straight to the corner for visitors who
  // prefer reduced motion.
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setPhase(reduceMotion ? "done" : "intro");
  }, []);

  // Advance the intro timeline.
  useEffect(() => {
    const next: Partial<Record<Phase, [Phase, number]>> = {
      intro: ["hello", POP_MS],
      hello: ["fly", HELLO_MS],
      fly: ["done", FLY_MS],
    };
    const step = next[phase];
    if (!step) return;

    const timer = setTimeout(() => setPhase(step[0]), step[1]);
    return () => clearTimeout(timer);
  }, [phase]);

  // After landing, offer a small "need help?" nudge once per session.
  useEffect(() => {
    if (phase !== "done" || isOpen) return;

    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(NUDGE_DISMISSED_KEY) === "1";
    } catch {
      // Ignore - treat as not dismissed.
    }
    if (dismissed) return;

    const timer = setTimeout(() => setShowNudge(true), NUDGE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [phase, isOpen]);

  // Opening the chat counts as having seen the nudge.
  useEffect(() => {
    if (!isOpen) return;
    setShowNudge(false);
    rememberNudgeDismissal();
  }, [isOpen]);

  const dismissNudge = () => {
    setShowNudge(false);
    rememberNudgeDismissal();
  };

  const skipIntro = () => {
    if (phase === "intro" || phase === "hello") setPhase("fly");
  };

  const handleClick = () => {
    if (phase !== "done") setPhase("done");
    onClick();
  };

  const introActive = phase === "intro" || phase === "hello";

  let moverStyle: CSSProperties = {};
  let moverClass = "";

  if (phase === "pending") {
    moverStyle = { opacity: 0 };
  } else if (phase === "intro") {
    moverClass = "zia-intro-pop";
  } else if (phase === "hello") {
    moverStyle = { transform: CENTRE_TRANSFORM };
  } else if (phase === "fly") {
    moverStyle = {
      transform: "translate(0, 0) scale(1)",
      transition: `transform ${FLY_MS}ms cubic-bezier(0.65, 0, 0.35, 1)`,
    };
  }

  return (
    <>
      {/* Soft backdrop while Zia says hello - click to skip */}
      {phase !== "done" && phase !== "pending" && (
        <div
          onClick={skipIntro}
          className={`fixed inset-0 z-40 bg-brand-900/30 backdrop-blur-[2px] transition-opacity duration-700 ${
            introActive ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {/* "Hi, I'm Zia" speech card shown above the mascot at centre */}
      {phase === "hello" && (
        <div className="zia-hello-card pointer-events-none fixed left-1/2 top-1/2 z-50">
          <div className="relative rounded-2xl bg-white px-6 py-4 text-center shadow-widget">
            <p className="text-lg font-bold text-brand-700">
              Hi, I&apos;m Zia! <span className="zia-wave inline-block">👋</span>
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Your guide to Ethiraj College for Women
            </p>
            <span className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-white" />
          </div>
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3">
        {showNudge && !isOpen && (
          <div className="zia-greeting relative mb-4 hidden max-w-[220px] rounded-2xl rounded-br-sm border border-brand-100 bg-white px-4 py-3 text-sm shadow-widget sm:block">
            <button
              onClick={dismissNudge}
              aria-label="Dismiss message"
              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-100 text-[11px] text-brand-700 transition hover:bg-brand-200"
            >
              ✕
            </button>
            <button onClick={onClick} className="text-left">
              <p className="font-semibold text-brand-700">Need help? 💬</p>
              <p className="mt-0.5 text-xs text-gray-600">
                Ask me about admissions, courses or campus life.
              </p>
            </button>
          </div>
        )}

        <div style={moverStyle} className={`${moverClass} shrink-0`}>
          <button
            onClick={handleClick}
            aria-label={isOpen ? "Close chat" : "Chat with Zia"}
            className="group relative block h-[72px] w-[72px] rounded-full focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-300"
          >
            {/* Breathing purple glow */}
            {!isOpen && (
              <span className="zia-glow pointer-events-none absolute -inset-2 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 blur-xl" />
            )}

            {/* Expanding ring once it has landed */}
            {!isOpen && phase === "done" && (
              <span className="zia-pulse pointer-events-none absolute inset-1 rounded-full border-2 border-brand-400/60" />
            )}

            {/* Mascot (closed state) */}
            <span
              className={`absolute inset-0 transition-all duration-300 ease-out ${
                isOpen
                  ? "scale-50 rotate-90 opacity-0"
                  : "scale-100 rotate-0 opacity-100"
              }`}
            >
              <span
                className={`block h-full w-full ${
                  phase === "hello" ? "zia-wiggle" : "zia-float"
                }`}
              >
                <span className="block h-full w-full drop-shadow-[0_0_10px_rgba(128,103,222,0.75)] transition-transform duration-200 group-hover:scale-110 group-active:scale-95">
                  <ZiaAvatar />
                </span>
              </span>
            </span>

            {/* Close button (open state) */}
            <span
              className={`absolute inset-1 flex items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-widget transition-all duration-300 ease-out group-hover:scale-105 ${
                isOpen
                  ? "scale-100 rotate-0 opacity-100"
                  : "scale-50 -rotate-90 opacity-0"
              }`}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.3 19.7l-1.42-1.41L9.17 12 2.88 5.71 4.3 4.29l6.29 6.3 6.3-6.3z" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
