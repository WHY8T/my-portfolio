"use client";

/* Shared typographic work list. Hovering a row dims the others (CSS :has),
   grows a holographic-framed preview that trails the cursor with a little
   velocity lean, and swaps the cursor to a "view" disc. */

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { TransitionLink } from "@/components/layout/Transition";
import type { Project } from "@/content/config";

export default function WorkList({
  items,
  showSummary = false,
  id,
}: {
  items: Project[];
  showSummary?: boolean;
  id?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const preview = previewRef.current;
    if (!section || !preview) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let x = tx;
    let y = ty;
    let shown = false;

    gsap.set(preview, { xPercent: -50, yPercent: -58, autoAlpha: 0, scale: 0.85 });

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    const tick = () => {
      const prevX = x;
      x += (tx - x) * 0.11;
      y += (ty - y) * 0.11;
      const vx = x - prevX;
      // holographic distortion: the frame leans into its own velocity
      gsap.set(preview, {
        x,
        y,
        rotation: gsap.utils.clamp(-9, 9, vx * 0.55),
        skewX: gsap.utils.clamp(-4, 4, vx * 0.2),
      });
    };

    const show = () => {
      if (shown) return;
      shown = true;
      gsap.to(preview, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "expo.out" });
    };

    const hide = () => {
      if (!shown) return;
      shown = false;
      gsap.to(preview, { autoAlpha: 0, scale: 0.85, duration: 0.35, ease: "power3.out" });
    };

    const rows = Array.from(section.querySelectorAll<HTMLElement>("[data-work-index]"));
    const cleanups: Array<() => void> = [];

    rows.forEach((row, i) => {
      const enter = () => {
        show();
        imgRefs.current.forEach((el, j) => {
          if (el) gsap.to(el, { opacity: j === i ? 1 : 0, duration: 0.3, overwrite: "auto" });
        });
      };
      row.addEventListener("mouseenter", enter);
      cleanups.push(() => row.removeEventListener("mouseenter", enter));
    });

    window.addEventListener("mousemove", onMove, { passive: true });
    section.addEventListener("mouseleave", hide);
    gsap.ticker.add(tick);

    return () => {
      cleanups.forEach((fn) => fn());
      window.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", hide);
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <section ref={sectionRef} id={id} className="relative px-5 pb-24 md:px-10 md:pb-32">
      {/* floating preview — desktop pointers only */}
      <div
        ref={previewRef}
        aria-hidden="true"
        className="work-preview pointer-events-none fixed left-0 top-0 z-30 hidden aspect-[4/3] w-[min(24vw,340px)] overflow-hidden rounded-xl opacity-0 md:block"
      >
        {items.map((p, i) => (
          <div
            key={p.slug}
            ref={(el) => {
              imgRefs.current[i] = el;
            }}
            className="absolute inset-0 opacity-0"
          >
            <Image src={p.cover} alt="" fill sizes="340px" className="object-cover" />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(115deg, transparent 30%, rgb(204 255 143 / 0.14) 46%, rgb(43 244 78 / 0.1) 54%, transparent 70%)",
              }}
            />
          </div>
        ))}
        <div className="holo-border absolute inset-0 rounded-xl" />
      </div>

      <ul className="work-list">
        {items.map((p) => (
          <li key={p.slug} className="border-t" style={{ borderColor: "var(--line)" }}>
            <TransitionLink
              href={`/work/${p.slug}`}
              data-work-index
              data-cursor="view"
              className="work-row group grid grid-cols-[1fr_auto] items-baseline gap-x-4 py-6 md:grid-cols-[1.6fr_0.7fr_auto_auto] md:py-8"
            >
              <span>
                <span className="type-ink block font-sans text-large font-extrabold tracking-[-0.025em] transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-x-3 md:text-[2.6rem]">
                  {p.title}
                </span>
                {showSummary && (
                  <span className="mt-2 block max-w-[52ch] text-[0.95rem] leading-relaxed text-muted">
                    {p.summary}
                  </span>
                )}
              </span>
              <span className="type-label hidden md:block">{p.category}</span>
              <span className="type-label hidden text-right md:block">
                {p.stack.slice(0, 2).join(" · ")}
              </span>
              <span className="type-label justify-self-end">{p.year}</span>
            </TransitionLink>
          </li>
        ))}
        <li className="border-t" style={{ borderColor: "var(--line)" }} />
      </ul>
    </section>
  );
}
