"use client";

/* Home's selected-work section: heading + the first few projects as cards,
   then a button to see everything. Change HOME_COUNT to show more or fewer. */

import WorkCards from "@/components/work/WorkCards";
import HoloHeading from "@/components/ui/HoloHeading";
import { TransitionLink } from "@/components/layout/Transition";
import { projects } from "@/content/config";

const HOME_COUNT = 4;

export default function SelectedWork() {
  return (
    <>
      <div className="flex items-end justify-between px-5 pb-10 pt-24 md:px-10 md:pb-14 md:pt-32">
        <HoloHeading lines={["selected"]} accent="work" size="giant" />
        <p className="type-label hidden pb-3 md:block">2023 — 2026</p>
      </div>
      <WorkCards items={projects.slice(0, HOME_COUNT)} id="work" />
      <div className="-mt-12 flex justify-center px-5 pb-24 md:-mt-20 md:pb-32">
        <TransitionLink
          href="/work"
          className="rounded-full border px-8 py-4 font-sans text-[0.95rem] font-bold tracking-tight text-text transition-colors duration-300 hover:border-neon hover:text-neon"
          style={{ borderColor: "var(--line-strong)" }}
        >
          View all work ↗
        </TransitionLink>
      </div>
    </>
  );
}
