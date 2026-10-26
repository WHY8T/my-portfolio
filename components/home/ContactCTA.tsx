"use client";

/* Contact CTA — one idea, center stage: a heading, one button, the lamp. */

import MagneticButton from "@/components/ui/MagneticButton";
import Reveal from "@/components/ui/Reveal";
import HoloHeading from "@/components/ui/HoloHeading";
import { site } from "@/content/config";

export default function ContactCTA() {
  return (
    <section className="relative overflow-hidden px-5 py-28 text-center md:px-10 md:py-44">
      <div
        aria-hidden="true"
        className="glow-blob left-1/2 top-1/2 h-[52vh] w-[72vw] -translate-x-1/2 -translate-y-1/2 opacity-50"
      />

      <Reveal>
        <p className="type-label mb-6">{site.availability.toLowerCase()}</p>
      </Reveal>

      <HoloHeading
        lines={["have an idea", "worth lighting?"]}
        size="giant"
        className="mx-auto max-w-[16ch] text-left md:text-center"
      />

      <Reveal delay={0.15} className="mt-12">
        <MagneticButton href={`mailto:${site.email}`}>start a project</MagneticButton>
      </Reveal>
    </section>
  );
}
