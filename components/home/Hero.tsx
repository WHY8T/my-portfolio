"use client";

/* Hero — full-bleed portrait on the right, all the writing on the left.
   The portrait is the page's light source: it rises out of darkness while the
   studio lamp flickers on, the headline lines slide up from behind masks, and
   the photo drifts a few pixels with the cursor. Waits for the opening gate
   ("open") before it plays.

   ✏️ EDIT YOUR COPY HERE — headline, intro paragraph and buttons. */

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useLenis } from "@/lib/lenis";
import { TransitionLink } from "@/components/layout/Transition";
import { site } from "@/content/config";

const HEADLINE: { text: string; accent?: boolean }[] = [
  { text: "Designing" },
  { text: "interfaces", accent: true }, // ← the italic serif word
  { text: "that feel" },
  { text: "right." },
];

const INTRO =
  "I craft user-centered web & mobile experiences — UX research, design systems, and pixel-perfect UI that adds real value.";

const PRIMARY_CTA = { label: "View work", href: "/work" };
const SECONDARY_CTA = { label: "About me", href: "/about" };

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  /* ------------------------------------------------ light-on + entrance */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const lines = root.querySelectorAll<HTMLElement>(".hero-line");
    const fades = root.querySelectorAll<HTMLElement>(".hero-fade");
    const portrait = portraitRef.current;
    const light = lightRef.current;

    let started = false;
    let safety: ReturnType<typeof setTimeout> | undefined;

    const start = () => {
      if (started) return;
      started = true;
      window.removeEventListener("greenlight:ready", start);
      if (safety) clearTimeout(safety);

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      // the lamp flickers on — quick stutter, then settles bright
      if (light) {
        tl.fromTo(light, { opacity: 0 }, { opacity: 1, duration: 0.06 }, 0)
          .to(light, { opacity: 0.15, duration: 0.09 })
          .to(light, { opacity: 0.85, duration: 0.05 })
          .to(light, { opacity: 0.3, duration: 0.1 })
          .to(light, { opacity: 1, duration: 0.7 });
      }

      // the portrait rises out of darkness with it
      if (portrait) {
        tl.fromTo(
          portrait,
          { opacity: 0, scale: 1.12, filter: "brightness(0.2) saturate(0.6)" },
          {
            opacity: 1,
            scale: 1.05,
            filter: "brightness(1) saturate(1)",
            duration: 2,
            onComplete: () => {
              gsap.set(portrait, { opacity: 1, clearProps: "filter" });
            },
          },
          0.1
        );
      }

      // headline lines slide up from behind their masks, smooth and slow
      tl.to(lines, { yPercent: 0, duration: 1.4, stagger: 0.13 }, 0.5);

      // eyebrow, intro, buttons, scroll hint trail in
      tl.to(fades, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.1 }, 1);
    };

    // hidden until the lamp turns on
    gsap.set(lines, { yPercent: 118 });
    gsap.set(fades, { autoAlpha: 0, y: 18 });
    if (portrait) gsap.set(portrait, { opacity: 0 });
    if (light) gsap.set(light, { opacity: 0 });

    if (window.__greenlightReady) start();
    else {
      window.addEventListener("greenlight:ready", start);
      // safety net: if the gate's event never arrives, show the hero anyway
      // (not while the gate is still waiting for a click)
      safety = setTimeout(() => {
        if (!window.__greenlightGate) start();
      }, 9000);
    }

    return () => {
      window.removeEventListener("greenlight:ready", start);
      if (safety) clearTimeout(safety);
    };
  }, []);

  /* ------------------------------------------- portrait drift (fine pointer) */
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const portrait = portraitRef.current;
    if (!portrait) return;

    const tX = gsap.quickTo(portrait, "x", { duration: 1.2, ease: "power3.out" });
    const tY = gsap.quickTo(portrait, "y", { duration: 1.2, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      tX((e.clientX / window.innerWidth - 0.5) * -22);
      tY((e.clientY / window.innerHeight - 0.5) * -16);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const accentIndex = HEADLINE.findIndex((l) => l.accent);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-5 pb-10 pt-28 md:px-10"
    >
      {/* the master studio light */}
      <div
        ref={lightRef}
        className="studio-light"
        style={{ "--light-x": "66%", "--light-y": "40%" } as React.CSSProperties}
      />

      {/* full-bleed portrait — face sits right of centre, left edge dissolves */}
      <div
        ref={portraitRef}
        aria-hidden="false"
        className="hero-portrait pointer-events-none absolute inset-y-0 right-0 z-0 w-full will-change-transform md:w-[80%] md:[mask-image:linear-gradient(to_right,transparent_0%,#000_36%)] md:[-webkit-mask-image:linear-gradient(to_right,transparent_0%,#000_36%)]"
      >
        <Image
          src="/assets/portrait.png"
          alt={`${site.name.full}, lit by a green studio light`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 80vw"
          className="object-cover object-[50%_30%] md:object-[50%_34%]"
        />
      </div>

      {/* legibility: shade behind the text (left on desktop, bottom on mobile) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] [background:linear-gradient(to_top,var(--bg)_6%,rgb(2_13_5/0.78)_38%,rgb(2_13_5/0.25)_70%,transparent_100%)] md:[background:linear-gradient(to_right,var(--bg)_2%,rgb(2_13_5/0.72)_30%,rgb(2_13_5/0.18)_55%,transparent_75%)]"
      />
      {/* top shade so the nav always reads */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-40 [background:linear-gradient(to_bottom,rgb(2_13_5/0.65),transparent)]"
      />

      {/* all the writing — one side */}
      <div className="relative z-10 max-w-[min(46rem,92vw)]">
        <p className="hero-fade type-label mb-6 flex items-center gap-4 md:mb-8">
          <span className="h-px w-12 bg-line-strong" aria-hidden="true" />
          <span className="tracking-[0.28em]">
            {site.name.full.toUpperCase()} · {site.role.toUpperCase()}
          </span>
        </p>

        <h1 className="font-sans font-extrabold leading-[0.95] tracking-[-0.035em] text-[clamp(3rem,min(7.6vw,14svh),8.25rem)]">
          <span className="sr-only">{HEADLINE.map((l) => l.text).join(" ")}</span>
          <span aria-hidden="true" className="block">
            {HEADLINE.map((l, i) => (
              <span
                key={i}
                className={`block overflow-hidden py-[0.12em] -my-[0.12em] ${i === accentIndex ? "px-[0.12em] -mx-[0.12em]" : ""
                  }`}
              >
                {l.accent ? (
                  <span className="hero-line type-holo block font-serif text-[1.08em] font-normal italic tracking-[-0.01em]">
                    {l.text}
                  </span>
                ) : (
                  <span className="hero-line type-ink block">{l.text}</span>
                )}
              </span>
            ))}
          </span>
        </h1>

        <p className="hero-fade mt-7 max-w-[34rem] text-[clamp(1rem,1.3vw,1.3rem)] leading-[1.55] text-text/75 md:mt-9">
          {INTRO}
        </p>

        <div className="hero-fade mt-8 flex flex-wrap items-center gap-3 md:mt-10">
          <TransitionLink
            href={PRIMARY_CTA.href}
            className="rounded-full bg-text px-8 py-4 font-sans text-[0.95rem] font-bold tracking-tight text-bg transition-colors duration-300 hover:bg-neon-hot"
          >
            {PRIMARY_CTA.label}
          </TransitionLink>
          <TransitionLink
            href={SECONDARY_CTA.href}
            className="rounded-full border px-8 py-4 font-sans text-[0.95rem] font-bold tracking-tight text-text transition-colors duration-300 hover:border-neon hover:text-neon"
            style={{ borderColor: "var(--line-strong)" }}
          >
            {SECONDARY_CTA.label}
          </TransitionLink>
        </div>
      </div>

      {/* vertical scroll hint, bottom right */}
      <button
        type="button"
        onClick={() => lenis?.scrollTo("#intro", { duration: 1.4 })}
        className="hero-fade absolute bottom-10 right-5 z-10 hidden flex-col items-center gap-3 md:flex md:right-10"
        aria-label="Scroll to intro"
      >
        <span className="type-label tracking-[0.3em] [writing-mode:vertical-rl]">SCROLL</span>
        <span className="h-14 w-px animate-pulse bg-neon" aria-hidden="true" />
      </button>
    </section>
  );
}