"use client";

/* Custom cursor + the page's cursor-following light.
   - A precise dot and a lagging ring (the "soft glowing light" that follows
     the mouse — reference video #1).
   - The ring's position also feeds --mx/--my, which the page spotlight and
     holographic gradients read, so the whole site's light bends toward it.
   - Grows over links; over [data-cursor="view|play"] targets it becomes a
     filled disc with a label.
   - Fine pointers only; reduced motion keeps the native cursor. */

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!fine) return; // touch devices: native cursor, static page light

    const root = document.documentElement;

    if (reduced) {
      // No custom cursor; park the page light somewhere neutral.
      root.style.setProperty("--mx", "50vw");
      root.style.setProperty("--my", "38vh");
      return;
    }

    root.classList.add("has-custom-cursor");

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    const label = labelRef.current!;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let ringX = targetX;
    let ringY = targetY;
    let shown = false;

    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power2.out" });

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      dotX(targetX);
      dotY(targetY);
      if (!shown) {
        shown = true;
        gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3 });
      }
    };

    // The ring lags behind the dot → the "soft glow trailing the pointer".
    const lerpLight = () => {
      ringX += (targetX - ringX) * 0.16;
      ringY += (targetY - ringY) * 0.16;
      gsap.set(ring, { x: ringX, y: ringY });
      root.style.setProperty("--mx", `${ringX.toFixed(1)}px`);
      root.style.setProperty("--my", `${ringY.toFixed(1)}px`);
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el?.closest) return;
      const labelled = el.closest<HTMLElement>("[data-cursor]");
      if (labelled) {
        const text = labelled.dataset.cursor ?? "";
        if (label.textContent !== text) label.textContent = text;
        ring.dataset.mode = "label";
        return;
      }
      const actionable = el.closest("a, button, [role='button'], input, textarea, select, label, summary");
      ring.dataset.mode = actionable ? "link" : "default";
    };

    const onDown = () => gsap.to(dot, { scale: 0.6, duration: 0.25 });
    const onUp = () => gsap.to(dot, { scale: 1, duration: 0.35, ease: "back.out(2)" });
    const onLeave = () => gsap.to([dot, ring], { autoAlpha: 0, duration: 0.3 });
    const onEnter = () => shown && gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3 });

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    gsap.ticker.add(lerpLight);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      gsap.ticker.remove(lerpLight);
      root.classList.remove("has-custom-cursor");
    };
  }, []);

  return (
    <div aria-hidden="true" className="cursor-layer">
      <div ref={ringRef} className="cursor-ring" data-mode="default">
        <span ref={labelRef} className="cursor-label" />
      </div>
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
}
