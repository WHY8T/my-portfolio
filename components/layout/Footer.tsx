"use client";

/* Footer: the name huge one last time, contact links, back to top. */

import { useLenis } from "@/lib/lenis";
import MagneticButton from "@/components/ui/MagneticButton";
import Reveal from "@/components/ui/Reveal";
import { site } from "@/content/config";

export default function Footer() {
  const lenis = useLenis();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t px-5 pb-8 pt-20 md:px-10 md:pt-28" style={{ borderColor: "var(--line)" }}>
      {/* the lamp, parked low */}
      <div
        aria-hidden="true"
        className="glow-blob left-1/2 top-0 h-[46vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 opacity-60"
      />

      <div className="relative">
        <Reveal>
          <p className="type-label mb-6">next</p>
        </Reveal>

        <a
          href={`mailto:${site.email}`}
          className="link-underline group inline-block"
          data-cursor="write"
        >
          <span className="type-ink block font-sans text-[13vw] font-extrabold leading-[0.9] tracking-[-0.04em] md:text-[9.5vw]">
            {site.name.first}
            <span className="type-holo font-serif text-[1.05em] font-normal italic leading-[0.8]">
              lets
            </span>
            talk
          </span>
        </a>

        <div className="mt-12 flex flex-wrap items-end justify-between gap-8">
          <ul className="flex flex-col gap-2" aria-label="Elsewhere">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="link-underline type-label text-text hover:text-neon"
                >
                  {s.label.toLowerCase()}
                </a>
              </li>
            ))}
          </ul>

          <MagneticButton href={`mailto:${site.email}`} variant="ghost">
            {site.email}
          </MagneticButton>

          <button
            type="button"
            onClick={() => (lenis ? lenis.scrollTo(0, { duration: 1.6 }) : window.scrollTo({ top: 0 }))}
            className="magnetic holo-border glass rounded-full px-6 py-3 type-label text-text hover:text-neon"
            aria-label="Back to top"
          >
            back to top ↑
          </button>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t pt-5" style={{ borderColor: "var(--line)" }}>
          <span className="type-label">© {year} {site.name.full.toLowerCase()}</span>
          <span className="type-label">shot in green light, built with restraint</span>
        </div>
      </div>
    </footer>
  );
}
