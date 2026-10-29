"use client";

/* Toolkit — compact bars, one row per discipline, each tool shown with its real
   app icon. Hover (or focus) a bar to see what I use it for. A light follows the
   cursor across the bars (CSS in toolkit.css, positions set here), and the bars
   rise in row by row as the section scrolls into view.
   Data: content/tools.ts   Icons: components/tools/icons.ts */

import "./toolkit.css";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import HoloHeading from "@/components/ui/HoloHeading";
import Reveal from "@/components/ui/Reveal";
import { tools, toolCategories, type Tool } from "@/content/tools";
import { toolIcons } from "./icons";

/* dark brand colours (Notion, GitHub, Next.js …) would vanish on the dark site → white */
function glyphColor(hex: string) {
  const n = parseInt(hex, 16);
  const lum = (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  return lum < 0.32 ? "#ffffff" : `#${hex}`;
}

function ToolIcon({ tool }: { tool: Tool }) {
  const [failed, setFailed] = useState(false);

  // 1) your own logo file wins
  if (tool.logo && !failed) {
    return (
      <span className="tk-icon">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={tool.logo}
          alt=""
          draggable={false}
          onError={() => setFailed(true)}
          className={tool.keepColor ? "" : "brightness-0 invert"}
        />
      </span>
    );
  }

  const icon = toolIcons[tool.name];

  // 2) real brand glyph
  if (icon?.type === "path") {
    const color = glyphColor(icon.hex);
    return (
      <span className="tk-icon" style={{ ["--ic" as string]: color }}>
        <svg viewBox="0 0 24 24" role="img" aria-hidden="true" fill={color}>
          <path d={icon.path} />
        </svg>
      </span>
    );
  }

  // 3) app-style badge, or a neutral monogram
  const bg = icon?.type === "badge" ? icon.bg : "rgb(43 244 78 / 0.18)";
  const fg = icon?.type === "badge" ? icon.fg : "#ccff8f";
  const text = icon?.type === "badge" ? icon.text : tool.short;
  return (
    <span className="tk-icon" style={{ ["--ic" as string]: fg }}>
      <span className="tk-badge" style={{ background: bg, color: fg, borderColor: fg }}>
        {text}
      </span>
    </span>
  );
}

export default function Toolkit() {
  const rowsRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);

  /* ---- rise in, row by row, when scrolled into view -------------------------- */
  useEffect(() => {
    const wrap = rowsRef.current;
    if (!wrap) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const bars = wrap.querySelectorAll<HTMLElement>(".tk-chip");
    const labels = wrap.querySelectorAll<HTMLElement>(".tk-row-label");
    gsap.set(bars, { autoAlpha: 0, y: 18, scale: 0.96 });
    gsap.set(labels, { autoAlpha: 0, x: -12 });

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.to(labels, { autoAlpha: 1, x: 0, duration: 0.8, stagger: 0.08, ease: "expo.out" });
        gsap.to(bars, { autoAlpha: 1, y: 0, scale: 1, duration: 0.75, stagger: 0.025, ease: "expo.out" });
      },
    });
    return () => st.kill();
  }, []);

  /* ---- cursor light across the bars ------------------------------------------ */
  const onMove = (e: React.MouseEvent) => {
    const wrap = rowsRef.current;
    if (!wrap || rafRef.current) return;
    const { clientX, clientY } = e;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      wrap.querySelectorAll<HTMLElement>(".tk-chip").forEach((c) => {
        const r = c.getBoundingClientRect();
        c.style.setProperty("--x", `${clientX - r.left}px`);
        c.style.setProperty("--y", `${clientY - r.top}px`);
      });
    });
  };

  return (
    <section id="tools" className="tk-section" aria-labelledby="tools-heading">
      <div className="tk-glow" aria-hidden="true" />

      <div className="relative">
        <div className="flex flex-col gap-6 pb-10 md:flex-row md:items-end md:justify-between md:pb-14">
          <div>
            <p className="type-label mb-5 flex items-center gap-4">
              <span className="h-px w-12 bg-line-strong" aria-hidden="true" />
              <span className="tracking-[0.28em]">
                TOOLKIT — {tools.length} TOOLS · {toolCategories.length} DISCIPLINES
              </span>
            </p>
            <h2 id="tools-heading" className="sr-only">
              My toolkit
            </h2>
            <HoloHeading lines={["my"]} accent="toolkit" size="giant" as="h3" />
          </div>
          <Reveal className="max-w-[26rem]">
            <p className="text-[1rem] leading-relaxed text-text/70">
              From the first sketch to the shipped page — the apps I reach for, grouped by what they&apos;re
              for. Hover one to see what I use it for.
            </p>
          </Reveal>
        </div>

        <div ref={rowsRef} onMouseMove={onMove} className="tk-rows">
          {toolCategories.map((cat) => {
            const list = tools.filter((t) => t.category === cat.id);
            if (!list.length) return null;
            return (
              <div key={cat.id} className="tk-row">
                <p className="tk-row-label type-label">
                  {cat.label}
                  <span>{String(list.length).padStart(2, "0")}</span>
                </p>
                <ul className="tk-chips">
                  {list.map((t) => (
                    <li
                      key={t.name}
                      className="tk-chip"
                      tabIndex={0}
                      aria-label={`${t.name} — ${t.use}`}
                    >
                      <ToolIcon tool={t} />
                      <span className="tk-chip-name">{t.name}</span>
                      <span className="tk-tip" aria-hidden="true">
                        {t.use}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
