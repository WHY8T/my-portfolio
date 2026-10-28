"use client";

/* Hero — the photo fills the whole hero, the writing sits on the left.
   Flashlight effect: the photo is dimmed, and a soft pool of light follows the
   mouse over it (it comes back to rest on the face when the mouse leaves).
   It also waits for the opening gate ("open") before it plays: the light
   flickers on, the photo rises out of darkness, the headline slides up.

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

/* The hero photo is public/assets/hero.jpg (5504 × 3072). Its size and position are
   set on the <Image> below; the light rests on the face at the spot in faceSpot(). */
const SPOT_RADIUS = 430; // px — size of the pool of light
const DARKNESS = 0.6; // 0 = no dimming … 1 = black. 0.6 keeps the face easy to see.

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
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
    const light = glowRef.current;

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

  /* ------------------------------- flashlight: light follows the mouse */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    // where the face is on screen — the light rests here
    const faceSpot = () => {
      const w = root.clientWidth;
      const h = window.innerHeight;
      const desktop = window.innerWidth >= 768;
      return desktop ? { x: w * 0.6, y: h * 0.4 } : { x: w * 0.5, y: h * 0.26 };
    };

    const rest = faceSpot();
    const pos = { x: rest.x, y: rest.y };
    const write = () => {
      root.style.setProperty("--mx", `${pos.x.toFixed(1)}px`);
      root.style.setProperty("--my", `${pos.y.toFixed(1)}px`);
    };
    write();
    if (reduced) return; // static: light stays on the face

    const qx = gsap.quickTo(pos, "x", { duration: 0.7, ease: "power3.out" });
    const qy = gsap.quickTo(pos, "y", { duration: 0.7, ease: "power3.out" });

    const tick = () => {
      if (window.scrollY > root.offsetHeight) return; // hero is off-screen
      write();
    };
    gsap.ticker.add(tick);

    const goRest = () => {
      const r = faceSpot();
      qx(r.x);
      qy(r.y);
    };

    let idle: gsap.core.Tween | undefined;

    if (finePointer) {
      const onMove = (e: MouseEvent) => {
        const rect = root.getBoundingClientRect();
        qx(e.clientX - rect.left);
        qy(e.clientY - rect.top);
      };
      window.addEventListener("mousemove", onMove, { passive: true });
      document.documentElement.addEventListener("mouseleave", goRest);
      window.addEventListener("resize", goRest);

      // the photo itself drifts a few pixels opposite the cursor
      const portrait = portraitRef.current;
      let dX: ((v: number) => void) | undefined;
      let dY: ((v: number) => void) | undefined;
      if (portrait) {
        dX = gsap.quickTo(portrait, "x", { duration: 1.2, ease: "power3.out" });
        dY = gsap.quickTo(portrait, "y", { duration: 1.2, ease: "power3.out" });
      }
      const onDrift = (e: MouseEvent) => {
        dX?.((e.clientX / window.innerWidth - 0.5) * -22);
        dY?.((e.clientY / window.innerHeight - 0.5) * -16);
      };
      window.addEventListener("mousemove", onDrift, { passive: true });

      return () => {
        gsap.ticker.remove(tick);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mousemove", onDrift);
        document.documentElement.removeEventListener("mouseleave", goRest);
        window.removeEventListener("resize", goRest);
      };
    }

    // touch screens: the light slowly sways around the face
    idle = gsap.to(pos, {
      x: rest.x + root.clientWidth * 0.06,
      y: rest.y + root.clientHeight * 0.03,
      duration: 4,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
    return () => {
      gsap.ticker.remove(tick);
      idle?.kill();
    };
  }, []);

  const accentIndex = HEADLINE.findIndex((l) => l.accent);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-5 pb-10 pt-28 md:px-10"
      style={{ "--mx": "66%", "--my": "36%" } as React.CSSProperties}
    >
      {/* the photo — a big close-up that fills the whole hero. The image is sized by
          the screen height so the face is large (like a magazine cover), and placed so
          the face sits right of centre with the writing on the left. */}
      <div
        ref={portraitRef}
        className="hero-portrait pointer-events-none absolute inset-0 z-0 overflow-hidden will-change-transform"
      >
        <Image
          src="/assets/hero.jpg"
          alt={`${site.name.full}, smiling, lit by a green studio light`}
          width={5504}
          height={3072}
          priority
          sizes="300vw"
          className="absolute left-[calc(50vw_-_105svh)] top-[-8.5svh] h-[120svh] w-auto max-w-none md:left-[calc(60vw_-_171svh)] md:top-[-14.7svh] md:h-[195svh]"
        />
      </div>

      {/* flashlight: dim everywhere except a soft pool of light under the cursor */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: `radial-gradient(circle ${SPOT_RADIUS}px at var(--mx) var(--my), rgb(2 13 5 / 0) 0%, rgb(2 13 5 / ${DARKNESS * 0.25}) 45%, rgb(2 13 5 / ${DARKNESS}) 100%)`,
        }}
      />
      {/* the light itself — a little extra glow in the middle of the pool */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          mixBlendMode: "soft-light",
          background:
            "radial-gradient(circle 300px at var(--mx) var(--my), rgb(255 255 255 / 0.55) 0%, rgb(190 255 200 / 0.18) 55%, transparent 100%)",
        }}
      />

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