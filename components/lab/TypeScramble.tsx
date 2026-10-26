"use client";

/* Lab experiment 4 — letters decode out of noise, resolving left to right.
   Loops with a pause. Reduced motion renders the phrase statically. */

import { useEffect, useRef, useState } from "react";

const PHRASE = "light is a language";
const GLYPHS = "abcdefghkmnopqrstuvwxyz01<>/\\*+";

export default function TypeScramble() {
  const [out, setOut] = useState(PHRASE);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return; // skip on mobile data budgets

    let raf = 0;
    let running = true;
    let cycleStart = performance.now() + 600;
    const RESOLVE = 1400; // ms to fully resolve
    const HOLD = 2600;

    const tick = (now: number) => {
      if (!running) return;
      const t = now - cycleStart;
      if (t < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      if (t > RESOLVE + HOLD) {
        cycleStart = now + 400;
        setOut(PHRASE);
        raf = requestAnimationFrame(tick);
        return;
      }
      const settled = Math.floor((t / RESOLVE) * PHRASE.length);
      let s = "";
      for (let i = 0; i < PHRASE.length; i++) {
        const ch = PHRASE[i];
        if (ch === " " || i < settled) s += ch;
        else s += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setOut(s);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <p
      ref={ref}
      className="select-none text-center font-mono text-[clamp(1.1rem,3vw,1.8rem)] tracking-[0.06em] text-neon"
      aria-label={PHRASE}
    >
      {out}
    </p>
  );
}
