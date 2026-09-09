const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/ethiraj_college_for_women/" },
  { label: "X (Twitter)", href: "https://x.com/ECWChennai" },
];

export default function Footer() {
  return (
    <footer
      id="contact"
      className="border-t border-gray-100 bg-brand-900 text-brand-100"
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <img
              src="/ethiraj-logo.png"
              alt="Ethiraj College for Women crest"
              className="h-10 w-10 object-contain"
            />
            <p className="text-sm font-bold text-white">
              Ethiraj College for Women
            </p>
          </div>
          <p className="mt-3 max-w-xs text-xs leading-relaxed text-brand-200">
            Autonomous women&apos;s institution in Chennai, affiliated to the
            University of Madras. &ldquo;College with Potential for
            Excellence&rdquo; &middot; Reaccredited with &ldquo;A+&rdquo;
            Grade by NAAC.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-300">
            Contact
          </p>
          <ul className="mt-3 space-y-2 text-sm text-brand-100">
            <li>70, Ethiraj Salai, Egmore, Chennai&nbsp;-&nbsp;600008</li>
            <li>
              <a href="tel:+914428279189" className="hover:text-white">
                +91-44-2827&nbsp;9189
              </a>
            </li>
            <li>
              <a
                href="mailto:principal@ethirajcollege.edu.in"
                className="hover:text-white"
              >
                principal@ethirajcollege.edu.in
              </a>
            </li>
            <li>
              <a
                href="https://ethirajcollege.edu.in/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                ethirajcollege.edu.in
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-300">
            Follow Us
          </p>
          <ul className="mt-3 space-y-2 text-sm text-brand-100">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="https://ethiraj.ibossems.com/"
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-block rounded-full bg-white px-5 py-2 text-xs font-semibold text-brand-700 transition hover:bg-brand-50"
          >
            Apply Online ↗
          </a>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-brand-300">
        © {new Date().getFullYear()} Ethiraj College for Women. Powered by{" "}
        <span className="font-medium text-white">CampusGuide AI</span>.
      </div>
    </footer>
  );
}
