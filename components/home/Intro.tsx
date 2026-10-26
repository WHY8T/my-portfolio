"use client";

/* Intro — a short manifesto in mixed type: the sans voice states, the
   italic serif voice contradicts softly. One idea, few words. */

import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { site } from "@/content/config";

export default function Intro() {
  return (
    <section id="intro" className="relative px-5 py-28 md:px-10 md:py-40">
      <div className="grid gap-10 md:grid-cols-12">
        <Reveal className="md:col-span-3">
          <p className="type-label">about, briefly</p>
        </Reveal>

        <div className="md:col-span-9 lg:col-span-8">
          <Reveal>
            <p className="font-sans text-giant font-extrabold leading-[1.02] tracking-[-0.03em]">
              <span className="type-ink">I design pages that behave like</span>{" "}
              <span className="type-holo font-serif text-[1.12em] font-normal italic tracking-[-0.01em]">
                light
              </span>
              <span className="type-ink">
                {" "}
                — fast, deliberate, and impossible to ignore.
              </span>
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-10 max-w-[58ch]">
            <p className="text-muted text-[1.05rem] leading-relaxed">
              Independent {site.role.toLowerCase()} based in {site.location}. I take
              on a handful of projects a year — brand sites, products and the odd
              experiment — and light each one by hand.
            </p>
          </Reveal>

          <Reveal delay={0.16} className="mt-8">
            <Link
              href="/about"
              className="link-underline type-label text-neon"
            >
              more about me
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
