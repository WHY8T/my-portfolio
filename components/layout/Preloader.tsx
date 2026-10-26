"use client";

/* Opening gate: your name runs across the screen horizontally on a loop and a
   single word — "open" — sits in the middle. Nothing happens until it is
   clicked (or Enter / Space is pressed). On click the name rushes away, the
   sheet lifts, and the site's light turns on (fires greenlight:ready, which
   the hero and its headline wait for). Shown once per full page load.
   Reduced motion: skipped, the site opens directly. */

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { site } from "@/content/config";

export const GREENLIGHT_READY = "greenlight:ready";

export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const openedRef = useRef(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      window.__greenlightGate = false;
      window.__greenlightReady = true;
      window.dispatchEvent(new Event(GREENLIGHT_READY));
      setDone(true);
      return;
    }

    // the gate is up: hold the page still and tell the hero to wait for the click
    window.__greenlightGate = true;
    document.body.style.overflow = "hidden";
    btnRef.current?.focus({ preventScroll: true });

    // the name letters rise in as the gate appears
    const ctx = gsap.context(() => {
      gsap.from(".gate-row", { autoAlpha: 0, duration: 1.2, ease: "power2.out" });
      gsap.from(".gate-open", {
        autoAlpha: 0,
        scale: 0.7,
        duration: 1.1,
        delay: 0.5,
        ease: "expo.out",
      });
      gsap.from(".gate-meta", {
        autoAlpha: 0,
        y: 12,
        duration: 1,
        delay: 0.8,
        stagger: 0.1,
        ease: "expo.out",
      });
    }, rootRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, []);

  const open = () => {
    if (openedRef.current) return;
    openedRef.current = true;

    const fire = () => {
      window.__greenlightGate = false;
      window.__greenlightReady = true;
      window.dispatchEvent(new Event(GREENLIGHT_READY));
    };

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        setDone(true);
      },
    });

    tl.to(".gate-open", { scale: 1.6, autoAlpha: 0, duration: 0.5, ease: "power3.in" }, 0)
      .to(".gate-meta", { autoAlpha: 0, duration: 0.3 }, 0)
      .to(trackRef.current, { scale: 1.12, autoAlpha: 0, duration: 0.8, ease: "power3.in" }, 0.05)
      // sheet lifts away, the light turns on underneath it
      .to(
        rootRef.current,
        { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "power4.inOut" },
        0.35
      )
      .call(fire, undefined, 0.8);
  };

  if (done) return null;

  const row = (hidden: boolean) => (
    <div
      className="gate-row flex shrink-0 items-center gap-[0.35em] pr-[0.35em]"
      aria-hidden={hidden || undefined}
    >
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="flex items-center gap-[0.35em] whitespace-nowrap">
          {i % 2 === 0 ? (
            <span className="type-ink font-sans font-extrabold tracking-[-0.04em]">
              {site.name.full}
            </span>
          ) : (
            <span className="type-holo font-serif font-normal italic">{site.name.full}</span>
          )}
          <span className="text-[0.3em] text-neon opacity-70" aria-hidden="true">
            ✦
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-label={`Welcome — ${site.name.full}`}
      className="fixed inset-0 z-[200] flex flex-col justify-between overflow-hidden bg-bg px-6 pb-6 pt-[max(1.25rem,env(safe-area-inset-top))] md:px-10"
      style={{ clipPath: "inset(0 0 0% 0)" }}
    >
      <div className="gate-meta type-label relative z-10">
        {site.role.toLowerCase()} — {site.location.toLowerCase()}
      </div>

      {/* the name, running horizontally */}
      <div ref={trackRef} className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2">
        <div className="gate-track flex w-max text-[19vw] leading-[1] md:text-[13vw]">
          {row(false)}
          {row(true)}
        </div>
      </div>

      {/* the only thing you can do: open */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <button
          ref={btnRef}
          type="button"
          onClick={open}
          aria-label="Open the website"
          className="gate-open group relative flex h-32 w-32 items-center justify-center rounded-full border bg-bg/80 backdrop-blur-md transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] hover:scale-110 focus-visible:scale-110 md:h-40 md:w-40"
          style={{ borderColor: "var(--line-strong)" }}
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
            style={{ boxShadow: "0 0 60px 6px rgba(43,244,78,0.45), inset 0 0 30px rgba(43,244,78,0.25)" }}
          />
          <span className="type-holo relative font-serif text-[2.4rem] italic leading-none md:text-[3rem]">
            open
          </span>
        </button>
      </div>

      <div className="gate-meta type-label relative z-10 text-right">click to enter</div>
    </div>
  );
}