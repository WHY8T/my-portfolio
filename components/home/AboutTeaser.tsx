"use client";

/* About teaser — the second portrait treatment: this one framed with a
   glowing holo edge and a slow 3D tilt, next to a pull-quote and a link. */

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import Reveal from "@/components/ui/Reveal";
import { TransitionLink } from "@/components/layout/Transition";
import { about, site } from "@/content/config";

export default function AboutTeaser() {
  const tiltRef = useRef<HTMLDivElement>(null);

  /* the 3D tilt from reference video #3, on the framed portrait */
  useEffect(() => {
    const tilt = tiltRef.current;
    if (!tilt) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.set(tilt, { transformPerspective: 900 });

    const rX = gsap.quickTo(tilt, "rotationX", { duration: 0.8, ease: "power3.out" });
    const rY = gsap.quickTo(tilt, "rotationY", { duration: 0.8, ease: "power3.out" });
    const glare = tilt.querySelector<HTMLElement>(".teaser-glare");

    const onMove = (e: MouseEvent) => {
      const r = tilt.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      rY(nx * 10);
      rX(-ny * 8);
      if (glare) {
        glare.style.setProperty("--gx", `${50 + nx * 60}%`);
        glare.style.setProperty("--gy", `${50 + ny * 60}%`);
      }
    };

    const onLeave = () => {
      rX(0);
      rY(0);
    };

    tilt.addEventListener("mousemove", onMove);
    tilt.addEventListener("mouseleave", onLeave);
    return () => {
      tilt.removeEventListener("mousemove", onMove);
      tilt.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section className="relative overflow-hidden px-5 py-24 md:px-10 md:py-36">
      <div className="grid items-center gap-12 md:grid-cols-12">
        {/* framed portrait with holo edge */}
        <Reveal className="md:col-span-7">
          <div
            ref={tiltRef}
            className="holo-border relative aspect-[16/9] w-full overflow-hidden rounded-2xl"
          >
            <Image
              src="/assets/about.jpg"
              alt={`${site.name.full} in green studio light`}
              fill
              sizes="(max-width: 768px) 92vw, 760px"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="teaser-glare absolute inset-0"
              style={{
                background:
                  "radial-gradient(300px circle at var(--gx, 50%) var(--gy, 50%), rgb(204 255 143 / 0.12), transparent 65%)",
              }}
            />
          </div>
        </Reveal>

        <div className="md:col-span-5">
          <Reveal>
            <p className="type-label mb-6">the person behind the light</p>
          </Reveal>
          <Reveal delay={0.06}>
            <blockquote className="font-serif text-large italic leading-[1.15] text-text md:text-[1.9rem]">
              “{about.story[0]}”
            </blockquote>
          </Reveal>
          <Reveal delay={0.12} className="mt-8">
            <TransitionLink href="/about" className="link-underline type-label text-neon">
              full story, skills & timeline
            </TransitionLink>
          </Reveal>
        </div>
      </div>
    </section>
  );
}