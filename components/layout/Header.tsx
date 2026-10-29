"use client";

/* Floating frosted-glass header: wordmark left, nav centre, "Let's talk" right.
   The bar is see-through glass (blur + a hint of green) and gets a touch
   stronger once the page starts moving. A soft light follows the cursor across
   it. On phones the right side becomes a "menu" button (the ⌘K palette doubles
   as the mobile nav). Styles live in header.css. */

import "./header.css";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { TransitionLink } from "./Transition";
import { nav, site } from "@/content/config";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onBarMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--bx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--by", `${e.clientY - r.top}px`);
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[120] px-3 pt-3 md:px-6 md:pt-4">
      <div
        onMouseMove={onBarMove}
        className={`hdr-bar pointer-events-auto mx-auto grid max-w-[96rem] grid-cols-[1fr_auto] items-center py-2 pl-5 pr-2 md:grid-cols-[1fr_auto_1fr] md:pl-7 md:pr-2.5 ${scrolled ? "hdr-bar--scrolled" : ""
          }`}
      >
        <TransitionLink
          href="/"
          className="group flex items-baseline gap-[0.18em] font-sans text-lg font-extrabold tracking-[-0.03em]"
          aria-label={`${site.name.full} — home`}
        >
          <span className="type-ink">port</span>
          <span className="type-holo font-serif text-[1.25em] font-normal italic leading-none">f</span>
          <span className="type-ink">olio</span>
        </TransitionLink>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {nav.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <TransitionLink
                key={item.href}
                href={item.href}
                className="hdr-link font-sans"
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </TransitionLink>
            );
          })}
        </nav>

        <div className="flex items-center justify-end gap-3">
          <TransitionLink href="/contact" className="hdr-talk hidden md:inline-flex">
            <span className="hdr-talk-dot" aria-hidden="true" />
            <span className="hdr-talk-label">
              <span>Let&apos;s talk</span>
              <span aria-hidden="true">Let&apos;s talk</span>
            </span>
            <span className="hdr-talk-arrow" aria-hidden="true">
              ↗
            </span>
          </TransitionLink>

          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("palette:open"))}
            className="hdr-menu type-label md:hidden"
            aria-label="Open command menu"
          >
            menu
          </button>
        </div>
      </div>
    </header>
  );
}