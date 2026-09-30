"use client";

import ZiaAvatar from "@/components/chatbot/ZiaAvatar";

import { useEffect, useState } from "react";

const SLIDES = [
  "/1786600676905-322198755.jpg",
  "/ethiraj-image.webp",
  "/ethiraj-image-2.avif",
  "/new1.d9da12d6e1fc5ab462ef.png",
];

const SLIDE_INTERVAL_MS = 5000;

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % SLIDES.length);
    }, SLIDE_INTERVAL_MS);

    return () => clearInterval(id);
  }, []);

  const openChat = () => {
    window.dispatchEvent(new Event("campusguide:open-chat"));
  };

  return (
    <section
      id="home"
      className="relative flex min-h-[560px] items-center overflow-hidden text-white md:min-h-[640px]"
    >
      {SLIDES.map((src, slideIndex) => (
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ease-in-out ${
            slideIndex === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-r from-brand-900/90 via-brand-900/65 to-brand-900/40" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-20">
        <p className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-brand-100 backdrop-blur">
          Autonomous &middot; Affiliated to the University of Madras
        </p>
        <h1 className="max-w-2xl text-4xl font-bold leading-tight md:text-5xl">
          Empowering Generations of Women since 1948.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-brand-50/90 md:text-lg">
          For over seven decades, we&apos;ve nurtured minds, inspired
          leaders, and built a community grounded in values that stand the
          test of time.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a
            href="#academics"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-lg transition hover:bg-brand-50"
          >
            Explore Programs
          </a>
          <button
            onClick={openChat}
            className="inline-flex items-center gap-2 rounded-full border border-white/70 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <ZiaAvatar className="h-5 w-5" animated={false} sparkles={false} />
          Chat with Zia
          </button>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {SLIDES.map((src, slideIndex) => (
          <button
            key={src}
            aria-label={`Show slide ${slideIndex + 1}`}
            onClick={() => setIndex(slideIndex)}
            className={`h-1.5 rounded-full transition-all ${
              slideIndex === index ? "w-6 bg-white" : "w-1.5 bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
