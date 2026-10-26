"use client";

/* Home's selected-work section: heading + the shared list. */

import WorkList from "@/components/work/WorkList";
import HoloHeading from "@/components/ui/HoloHeading";
import { projects } from "@/content/config";

export default function SelectedWork() {
  return (
    <>
      <div className="flex items-end justify-between px-5 pb-2 pt-24 md:px-10 md:pt-32">
        <HoloHeading lines={["selected"]} accent="work" size="giant" />
        <p className="type-label hidden pb-3 md:block">2023 — 2026</p>
      </div>
      <WorkList items={projects} id="work" />
    </>
  );
}
