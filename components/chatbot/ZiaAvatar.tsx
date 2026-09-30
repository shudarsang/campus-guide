"use client";

import { useId } from "react";

interface ZiaAvatarProps {
  className?: string;
  // Blinking eyes and twinkling sparkles. Off for small, repeated
  // avatars (e.g. next to every message) so the chat stays calm.
  animated?: boolean;
  // Sparkles look good on the large bubble but clutter tiny avatars.
  sparkles?: boolean;
}

// Zia's mascot: a glossy speech bubble with a glowing robot face screen,
// drawn in the brand palette from tailwind.config.ts.
export default function ZiaAvatar({
  className = "h-full w-full",
  animated = true,
  sparkles = true,
}: ZiaAvatarProps) {
  // Gradient and filter ids must be unique per instance, since several
  // avatars are on the page at once. useId's colons are stripped so the
  // ids are safe inside url(#...).
  const uid = useId().replace(/:/g, "");
  const id = (name: string) => `zia-${name}-${uid}`;

  const body =
    "M32 5C46.9 5 59 15.7 59 29S46.9 53 32 53c-4 0-7.8-.8-11.3-2.2L9 56l3.1-10.5C7.7 41.1 5 35.3 5 29 5 15.7 17.1 5 32 5Z";

  return (
    <svg viewBox="0 0 64 64" className={`${className} overflow-visible`} aria-hidden="true">
      <defs>
        <linearGradient id={id("body")} x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="#a595e9" />
          <stop offset="45%" stopColor="#5f45d1" />
          <stop offset="100%" stopColor="#2c1f5e" />
        </linearGradient>
        <radialGradient id={id("gloss")} cx="0.32" cy="0.22" r="0.55">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("screen")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2c1f5e" />
          <stop offset="100%" stopColor="#180f3a" />
        </linearGradient>
        <filter id={id("glow")} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="1.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Bubble body with a tail at the bottom-left, plus gloss */}
      <path d={body} fill={`url(#${id("body")})`} />
      <path d={body} fill={`url(#${id("gloss")})`} />

      {/* Face screen */}
      <rect x="14" y="15.5" width="36" height="25" rx="12" fill={`url(#${id("screen")})`} />
      <rect
        x="14"
        y="15.5"
        width="36"
        height="25"
        rx="12"
        fill="none"
        stroke="#c7bff2"
        strokeOpacity="0.35"
        strokeWidth="1"
      />

      {/* Glowing eyes */}
      <g className={animated ? "zia-eyes" : undefined} filter={`url(#${id("glow")})`}>
        <ellipse cx="25" cy="26" rx="3.1" ry="3.9" fill="#e4e0f9" />
        <ellipse cx="39" cy="26" rx="3.1" ry="3.9" fill="#e4e0f9" />
      </g>

      {/* Smile */}
      <path
        d="M27.5 32.5q4.5 3.6 9 0"
        fill="none"
        stroke="#c7bff2"
        strokeWidth="2.2"
        strokeLinecap="round"
        filter={`url(#${id("glow")})`}
      />

      {/* Top gloss streak */}
      <path
        d="M16 15.5c3.2-4.6 8.6-7.4 14.8-7.8"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.55"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {sparkles && (
        <>
          <path
            className={animated ? "zia-sparkle" : undefined}
            d="M56 3l1.4 3.4 3.4 1.4-3.4 1.4L56 12.6l-1.4-3.4-3.4-1.4 3.4-1.4Z"
            fill="#e4e0f9"
          />
          <path
            className={animated ? "zia-sparkle zia-sparkle-late" : undefined}
            d="M60.5 17l.8 1.9 1.9.8-1.9.8-.8 1.9-.8-1.9-1.9-.8 1.9-.8Z"
            fill="#c7bff2"
          />
        </>
      )}
    </svg>
  );
}
