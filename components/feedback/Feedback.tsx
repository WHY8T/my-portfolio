"use client";

/* Feedback — what people say, as a swipeable row of quote cards.
   • Drag with the mouse, swipe on a phone, use the arrows, or the keyboard.
   • A soft light follows the cursor across each card.
   • Only entries with show: true in content/feedback.ts appear. No entries → no section.
   • "Leave feedback" opens an email draft to you (no server needed). */

import "./feedback.css";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import HoloHeading from "@/components/ui/HoloHeading";
import Reveal from "@/components/ui/Reveal";
import { feedback, type Feedback as Item } from "@/content/feedback";
import { site } from "@/content/config";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

function Avatar({ item }: { item: Item }) {
  const [failed, setFailed] = useState(false);
  return (
    <span className="fb-avatar" aria-hidden="true">
      {item.avatar && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.avatar} alt="" draggable={false} onError={() => setFailed(true)} />
      ) : (
        initials(item.name)
      )}
    </span>
  );
}

export default function Feedback() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [bar, setBar] = useState({ left: 0, width: 100, scrollable: false, atStart: true, atEnd: false });

  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(
    `Feedback for ${site.name.full}`
  )}&body=${encodeURIComponent(
    "Hi!\n\nMy name:\nMy role / company:\n\nWhat I'd like to say:\n\n\n(You may show this on your website: yes / no)"
  )}`;

  /* ---- arrows + progress ---------------------------------------------------- */
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      setBar({
        scrollable: max > 4,
        left: (el.scrollLeft / el.scrollWidth) * 100,
        width: (el.clientWidth / el.scrollWidth) * 100,
        atStart: el.scrollLeft < 4,
        atEnd: el.scrollLeft > max - 4,
      });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const step = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".fb-card");
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 380) + 16), behavior: "smooth" });
  };

  /* ---- drag to scroll with the mouse ----------------------------------------- */
  const onPointerDown = (e: React.PointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = trackRef.current;
    if (!el) return;
    const startX = e.clientX;
    const startLeft = el.scrollLeft;
    el.classList.add("is-dragging");
    const move = (ev: PointerEvent) => {
      el.scrollLeft = startLeft - (ev.clientX - startX);
    };
    const up = () => {
      el.classList.remove("is-dragging");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  /* ---- cursor light on cards -------------------------------------------------- */
  const onMove = (e: React.MouseEvent<HTMLLIElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  /* ---- cards rise in -------------------------------------------------------- */
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = el.querySelectorAll<HTMLElement>(".fb-card");
    gsap.set(cards, { autoAlpha: 0, y: 30 });
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () => gsap.to(cards, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1, ease: "expo.out" }),
    });
    return () => st.kill();
  }, []);

  if (feedback.length === 0) return null;

  return (
    <section id="feedback" className="fb-section" aria-labelledby="feedback-heading">
      <div className="fb-glow" aria-hidden="true" />

      <div className="relative">
        <div className="flex flex-col gap-8 pb-10 md:flex-row md:items-end md:justify-between md:pb-14">
          <div>
            <p className="type-label mb-5 flex items-center gap-4">
              <span className="h-px w-12 bg-line-strong" aria-hidden="true" />
              <span className="tracking-[0.28em]">FEEDBACK — {feedback.length} KIND WORDS</span>
            </p>
            <h2 id="feedback-heading" className="sr-only">
              What people say
            </h2>
            <HoloHeading lines={["what people"]} accent="say" size="giant" as="h3" />
          </div>

          <Reveal className="flex max-w-[28rem] flex-col gap-5">
            <p className="text-[1rem] leading-relaxed text-text/70">
              Real words from people I&apos;ve worked with — clients, clubs and teammates.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a href={mailto} className="fb-leave">
                <span aria-hidden="true">✦</span> Leave feedback
              </a>
              {bar.scrollable && (
                <div className="ml-auto flex gap-2 md:ml-2">
                  <button
                    type="button"
                    className="fb-ctrl"
                    onClick={() => step(-1)}
                    disabled={bar.atStart}
                    aria-label="Previous feedback"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    className="fb-ctrl"
                    onClick={() => step(1)}
                    disabled={bar.atEnd}
                    aria-label="Next feedback"
                  >
                    →
                  </button>
                </div>
              )}
            </div>
          </Reveal>
        </div>

        <ul
          ref={trackRef}
          className="fb-track"
          tabIndex={0}
          aria-label="Feedback from clients and teammates"
          onPointerDown={onPointerDown}
        >
          {feedback.map((f) => (
            <li key={f.id} className="fb-card" onMouseMove={onMove}>
              {f.sample && <span className="fb-sample">sample — hidden on the live site</span>}
              <div>
                <span className="fb-mark" aria-hidden="true">
                  “
                </span>
                <blockquote className="fb-text">{f.quote}</blockquote>
              </div>

              <div className="fb-bottom">
                {f.project && <span className="fb-project">re: {f.project}</span>}
                <footer className="fb-person">
                  <Avatar item={f} />
                  <div className="min-w-0">
                    <p className="fb-name">{f.name}</p>
                    {(f.role || f.company) && (
                      <p className="fb-role">{[f.role, f.company].filter(Boolean).join(" · ")}</p>
                    )}
                  </div>
                  {f.rating && (
                    <span className="fb-stars" role="img" aria-label={`${f.rating} out of 5`}>
                      {"★".repeat(f.rating)}
                      <span className="opacity-25">{"★".repeat(5 - f.rating)}</span>
                    </span>
                  )}
                </footer>
              </div>
            </li>
          ))}
        </ul>

        {bar.scrollable && (
          <div className="fb-progress" aria-hidden="true">
            <span style={{ left: `${bar.left}%`, width: `${bar.width}%` }} />
          </div>
        )}
      </div>
    </section>
  );
}
