"use client";

/* The signature heading: heavy sans lines with the logo's vertical ink fade,
   plus an optional oversized italic serif accent word overlapping the last
   line (the "f" from the logo, recreated live in type).

   Reveal: letters slide up from behind a per-line mask, one by one, smooth
   and slow — reference video #1. Scroll-triggered for sections; 'load'
   mode waits for the preloader's greenlight event (hero). */

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const GREENLIGHT_READY = "greenlight:ready";

declare global {
  interface Window {
    __greenlightReady?: boolean;
    __greenlightGate?: boolean;
  }
}

type Props = {
  lines: string[];
  accent?: string;
  as?: "h1" | "h2" | "h3";
  size?: "mega" | "giant" | "large";
  reveal?: "chars" | "lines" | "none";
  trigger?: "scroll" | "load";
  className?: string;
};

export default function HoloHeading({
  lines,
  accent,
  as: Tag = "h2",
  size = "giant",
  reveal = "lines",
  trigger = "scroll",
  className = "",
}: Props) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || reveal === "none") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return; // content stays fully visible

    const targets =
      reveal === "chars"
        ? el.querySelectorAll<HTMLElement>(".split-char")
        : el.querySelectorAll<HTMLElement>(".reveal-line");
    const accents = el.querySelectorAll<HTMLElement>(".heading-accent");

    const play = () => {
      gsap.fromTo(
        targets,
        { yPercent: 118 },
        {
          yPercent: 0,
          duration: reveal === "chars" ? 1.25 : 1.4,
          ease: "expo.out", // smooth and slow, no bounce
          stagger: reveal === "chars" ? 0.045 : 0.12,
          delay: reveal === "chars" ? 0.08 : 0,
        }
      );
      if (accents.length) {
        gsap.fromTo(
          accents,
          { autoAlpha: 0, y: 6.4, rotate: 4 },
          {
            autoAlpha: 1,
            y: 0,
            rotate: 0,
            duration: 1.6,
            ease: "expo.out",
            delay: reveal === "chars" ? 0.75 : 0.35,
          }
        );
      }
    };

    const ctx = gsap.context(() => {
      if (trigger === "load") {
        if (window.__greenlightReady) play();
        else window.addEventListener(GREENLIGHT_READY, play, { once: true });
      } else {
        gsap.timeline({
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        }).add(play);
      }
    }, el);

    return () => {
      ctx.revert();
      window.removeEventListener(GREENLIGHT_READY, play);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reveal, trigger]);

  const sizeClass =
    size === "mega"
      ? "text-mega"
      : size === "large"
        ? "text-large"
        : "text-giant";

  const renderLine = (line: string, lineIndex: number) => {
    if (reveal === "chars") {
      return (
        <span className="reveal-mask" key={lineIndex}>
          <span className="reveal-line" aria-hidden="true">
            {Array.from(line).map((ch, i) => (
              <span key={i} className="split-char type-ink">
                {ch === " " ? " " : ch}
              </span>
            ))}
          </span>
        </span>
      );
    }
    return (
      <span className="reveal-mask" key={lineIndex}>
        <span className="reveal-line type-ink">{line}</span>
      </span>
    );
  };

  return (
    <Tag
      ref={rootRef as never}
      className={`holo-heading font-sans font-extrabold leading-[0.94] tracking-[-0.03em] ${sizeClass} ${className}`}
    >
      <span className="sr-only">{lines.join(" ")}{accent ? ` ${accent}` : ""}</span>
      <span aria-hidden="true" className="block">
        {lines.map(renderLine)}
        {accent && (
          <span className="heading-accent pointer-events-none relative z-10 block font-serif italic font-normal text-[1.18em] leading-none tracking-[-0.01em] -mt-[0.52em] pl-[0.6em]">
            <span className="type-holo block">{accent}</span>
          </span>
        )}
      </span>
    </Tag>
  );
}