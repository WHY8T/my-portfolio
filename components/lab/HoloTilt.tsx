"use client";

/* Lab experiment 2 — a card with an iridescent foil surface that tilts in
   3D under the cursor, glare tracking the light. Pure CSS + GSAP. */

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function HoloTilt() {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.set(card, { transformPerspective: 800 });

    const rX = gsap.quickTo(card, "rotationX", { duration: 0.7, ease: "power3.out" });
    const rY = gsap.quickTo(card, "rotationY", { duration: 0.7, ease: "power3.out" });
    const glare = card.querySelector<HTMLElement>(".foil-glare");

    const onMove = (e: MouseEvent) => {
      const r = card.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      rY(nx * 16);
      rX(-ny * 12);
      if (glare) {
        glare.style.backgroundPosition = `${50 + nx * 100}% ${50 + ny * 100}%`;
      }
    };
    const onLeave = () => {
      rX(0);
      rY(0);
    };

    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);
    return () => {
      card.removeEventListener("mousemove", onMove);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="foil-card relative flex aspect-[16/9] max-h-[380px] w-full max-w-[560px] items-center justify-center overflow-hidden rounded-2xl"
      data-cursor="tilt"
    >
      {/* iridescent foil */}
      <div
        aria-hidden="true"
        className="foil-glare absolute inset-0 opacity-80"
        style={{
          background:
            "linear-gradient(115deg, #0b4d1a 0%, #02901b 22%, #ccff8f 38%, #eafff0 44%, #2bf44e 52%, #0b4d1a 78%, #02901b 100%)",
          backgroundSize: "220% 220%",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 10%, transparent 40%, rgb(2 13 5 / 0.55) 100%)",
        }}
      />
      <p className="relative font-sans text-[clamp(2rem,5vw,3.4rem)] font-extrabold tracking-[-0.03em] text-[#02150a] mix-blend-overlay">
        foil
        <span className="font-serif font-normal italic"> tilt</span>
      </p>
    </div>
  );
}
