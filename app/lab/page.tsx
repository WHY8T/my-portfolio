import type { Metadata } from "next";
import HoloHeading from "@/components/ui/HoloHeading";
import ParticlePortrait from "@/components/lab/ParticlePortrait";
import HoloTilt from "@/components/lab/HoloTilt";
import LightOrb from "@/components/lab/LightOrb";
import TypeScramble from "@/components/lab/TypeScramble";

export const metadata: Metadata = {
  title: "Lab",
  description: "Motion experiments — particles, foil tilt, shader orbs, decoding type.",
};

function Experiment({
  tag,
  title,
  blurb,
  children,
  pad = false,
}: {
  tag: string;
  title: string;
  blurb: string;
  children: React.ReactNode;
  pad?: boolean;
}) {
  return (
    <section className="border-t py-10 md:py-14" style={{ borderColor: "var(--line)" }}>
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-sans text-[1.6rem] font-extrabold tracking-[-0.02em]">
          {title}
          <span className="type-holo ml-3 font-serif text-[0.85em] font-normal italic">
            {tag}
          </span>
        </h2>
        <p className="type-label max-w-[42ch] text-right">{blurb}</p>
      </div>
      <div
        className={`relative h-[420px] overflow-hidden rounded-2xl border md:h-[480px] ${
          pad ? "grid place-items-center" : ""
        }`}
        style={{ borderColor: "var(--line)", background: "var(--surface)" }}
      >
        {children}
      </div>
    </section>
  );
}

export default function LabPage() {
  return (
    <div className="px-5 pt-32 md:px-10 md:pt-44">
      <HoloHeading lines={["playground", "for light."]} accent="the lab" size="giant" />
      <p className="mt-8 max-w-[52ch] text-[1.05rem] leading-relaxed text-muted">
        Small experiments kept alive between client work. Move the cursor, drag,
        break things — everything here runs in the browser, no plugins, no mercy.
      </p>

      <div className="mt-16 md:mt-24">
        <Experiment
          tag="canvas / 2d"
          title="Particle portrait"
          blurb="The hero photo, sampled into ~4,000 dust motes that scatter around the cursor and spring back home."
        >
          <ParticlePortrait />
        </Experiment>

        <Experiment
          tag="css / 3d"
          title="Holo tilt"
          blurb="An iridescent foil card that leans into the cursor, glare tracking the light."
          pad
        >
          <HoloTilt />
        </Experiment>

        <Experiment
          tag="webgl / ogl"
          title="Light orb"
          blurb="A shader orb breathing green caustics — press and drag to pump energy into it."
        >
          <LightOrb />
        </Experiment>

        <Experiment
          tag="type / loop"
          title="Type scramble"
          blurb="Letters decoding out of noise, left to right. The site's mask reveal, inverted."
          pad
        >
          <TypeScramble />
        </Experiment>
      </div>
    </div>
  );
}
