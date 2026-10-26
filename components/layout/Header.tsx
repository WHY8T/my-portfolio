"use client";

/* Slim fixed header: wordmark left, nav + ⌘K right. Gains a glass surface
   and hairline after the page starts moving. On touch devices the ⌘K
   button reads as "menu" — the command palette doubles as the mobile nav. */

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { TransitionLink } from "./Transition";
import { nav, site } from "@/content/config";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[120] transition-[background-color,border-color,backdrop-filter] duration-500 ${scrolled ? "glass border-b" : "border-b border-transparent"
        }`}
      style={scrolled ? { borderColor: "var(--line)" } : undefined}
    >
      <div className="grid grid-cols-[1fr_auto] items-center px-5 py-4 md:grid-cols-[1fr_auto_1fr] md:px-10">
        <TransitionLink
          href="/"
          className="group flex items-baseline gap-[0.18em] font-sans text-lg font-extrabold tracking-[-0.03em]"
          aria-label={`${site.name.full} — home`}
        >
          <span className="type-ink">port</span>
          <span className="type-holo font-serif text-[1.25em] font-normal italic leading-none">
            f
          </span>
          <span className="type-ink">olio</span>
        </TransitionLink>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {nav.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <TransitionLink
                key={item.href}
                href={item.href}
                className={`font-sans text-[0.95rem] transition-colors hover:text-text ${active ? "text-text" : "text-text/60"
                  }`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </TransitionLink>
            );
          })}
        </nav>

        <div className="flex items-center justify-end gap-3">
          <TransitionLink
            href="/contact"
            className="hidden rounded-full bg-text px-6 py-3 font-sans text-[0.95rem] font-bold tracking-tight text-bg transition-colors duration-300 hover:bg-neon-hot md:inline-flex"
          >
            Let&apos;s talk
          </TransitionLink>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("palette:open"))}
            className="holo-border glass flex items-center gap-2 rounded-full px-4 py-1.5 type-label text-text transition-colors hover:text-neon md:hidden"
            aria-label="Open command menu"
          >
            menu
          </button>
        </div>
      </div>
    </header>
  );
}