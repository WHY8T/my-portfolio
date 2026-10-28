"use client";

/* Selected work as cards. Each card: cover image, category + year pills, big
   title, short summary and stack chips. On desktop the card tilts in 3D toward
   the cursor and a soft light glides across it; the first card can be featured
   (full width). Click → smooth page transition to the case study. */

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { TransitionLink } from "@/components/layout/Transition";
import Reveal from "@/components/ui/Reveal";
import type { Project } from "@/content/config";

function WorkCard({
  project,
  featured,
  index,
}: {
  project: Project;
  featured: boolean;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.set(el, { transformPerspective: 1000 });
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3.out" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      ry((px - 0.5) * 9);
      rx(-(py - 0.5) * 7);
      el.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
    };
    const onLeave = () => {
      rx(0);
      ry(0);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <Reveal delay={(index % 2) * 0.08} className={featured ? "md:col-span-2" : ""}>
      <div
        ref={cardRef}
        className="group relative h-full will-change-transform"
        style={{ "--gx": "50%", "--gy": "50%" } as React.CSSProperties}
      >
        <TransitionLink
          href={`/work/${project.slug}`}
          data-cursor="view"
          aria-label={`${project.title} — ${project.category}`}
          className="holo-border glass relative block h-full overflow-hidden rounded-2xl transition-shadow duration-500 hover:shadow-[0_0_60px_-10px_rgba(43,244,78,0.35)]"
        >
          {/* cover */}
          <div
            className={`relative w-full overflow-hidden ${
              featured ? "aspect-[16/10] md:aspect-[2/1]" : "aspect-[16/10]"
            }`}
          >
            <Image
              src={project.cover}
              alt=""
              fill
              sizes={featured ? "(max-width: 768px) 100vw, 92vw" : "(max-width: 768px) 100vw, 46vw"}
              className="object-cover object-[50%_30%] transition-transform duration-[900ms] [transition-timing-function:var(--ease-out-expo)] group-hover:scale-[1.06]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgb(2 13 5 / 0.65), transparent 55%)" }}
            />
            {/* moving light */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-0 mix-blend-soft-light transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(circle 280px at var(--gx) var(--gy), rgb(255 255 255 / 0.55), transparent 70%)",
              }}
            />
            <span className="type-label glass absolute left-4 top-4 rounded-full px-3 py-1.5 text-text">
              {project.category}
            </span>
            <span className="type-label glass absolute right-4 top-4 rounded-full px-3 py-1.5 text-text">
              {project.year}
            </span>
          </div>

          {/* text */}
          <div className="p-5 md:p-7">
            <div className="flex items-start justify-between gap-4">
              <h3 className="type-ink font-sans text-[1.7rem] font-extrabold leading-none tracking-[-0.03em] md:text-[2.2rem]">
                {project.title}
              </h3>
              <span
                aria-hidden="true"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full border text-lg text-text transition-all duration-500 group-hover:rotate-45 group-hover:bg-text group-hover:text-bg"
                style={{ borderColor: "var(--line-strong)" }}
              >
                ↗
              </span>
            </div>
            <p className="mt-4 line-clamp-2 max-w-[60ch] text-[0.98rem] leading-relaxed text-text/70">
              {project.summary}
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {project.stack.map((t) => (
                <li
                  key={t}
                  className="type-label rounded-full border px-3 py-1.5"
                  style={{ borderColor: "var(--line)" }}
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </TransitionLink>
      </div>
    </Reveal>
  );
}

export default function WorkCards({
  items,
  featureFirst = true,
  id,
}: {
  items: Project[];
  featureFirst?: boolean;
  id?: string;
}) {
  return (
    <section id={id} className="px-5 pb-24 md:px-10 md:pb-32">
      <div className="grid gap-5 md:grid-cols-2 md:gap-7">
        {items.map((p, i) => (
          <WorkCard key={p.slug} project={p} index={i} featured={featureFirst && i === 0} />
        ))}
      </div>
    </section>
  );
}
