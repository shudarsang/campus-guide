"use client";

import ZiaAvatar from "@/components/chatbot/ZiaAvatar";

const NAV_LINKS = [
  { label: "About Us", href: "#about" },
  { label: "Academics", href: "#academics" },
  { label: "Campus Life", href: "#campus-life" },
  { label: "Admissions", href: "#admissions" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <a href="#home" className="flex items-center gap-3">
          <img
            src="/ethiraj-logo.png"
            alt="Ethiraj College for Women crest"
            className="h-12 w-12 object-contain md:h-14 md:w-14"
          />
          <div className="leading-tight">
            <p className="text-sm font-bold text-gray-900 md:text-base">
              Ethiraj College for Women
              <span className="ml-1 font-semibold text-brand-600">
                (Autonomous)
              </span>
            </p>
            <p className="hidden text-xs italic text-gray-500 sm:block">
              Affiliated to the University of Madras
            </p>
            <p className="hidden text-[11px] text-gray-400 md:block">
              College with Potential for Excellence &middot; Reaccredited
              with &ldquo;A+&rdquo; Grade by NAAC
            </p>
          </div>
        </a>

        <nav className="hidden items-center gap-6 text-sm font-medium text-gray-600 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition hover:text-brand-600"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          onClick={() =>
            window.dispatchEvent(new Event("campusguide:open-chat"))
          }
          className="hidden items-center gap-2 rounded-full bg-brand-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-700 sm:inline-flex"
        >
          <ZiaAvatar className="h-5 w-5" animated={false} sparkles={false} />
          Ask Zia
        </button>
      </div>
    </header>
  );
}
