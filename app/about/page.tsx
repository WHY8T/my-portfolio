import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import HoloHeading from "@/components/ui/HoloHeading";
import MagneticButton from "@/components/ui/MagneticButton";
import { about, site, skills } from "@/content/config";

export const metadata: Metadata = {
  title: "About",
  description: `${site.name.full} — ${site.role}. Story, skills and experience.`,
};

function SkillGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="border-t py-7 md:py-9" style={{ borderColor: "var(--line)" }}>
      <p className="type-label mb-4">{title}</p>
      <ul className="flex flex-wrap gap-x-6 gap-y-2">
        {items.map((s) => (
          <li key={s} className="font-sans text-[1.15rem] font-bold tracking-[-0.02em] text-text">
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="px-5 pt-32 md:px-10 md:pt-44">
      <HoloHeading lines={["the person in", "the green room."]} size="giant" />

      <div className="mt-16 grid gap-14 md:mt-24 md:grid-cols-12">
        {/* portrait — framed, glowing edge */}
        <div className="md:col-span-5 lg:col-span-4">
          <div className="sticky top-28">
            <Reveal>
              <div
                className="holo-border relative aspect-[4/5] w-full max-w-[440px] overflow-hidden rounded-2xl"
                data-cursor="hi"
              >
                <Image
                  src="/assets/portrait.png"
                  alt={`${site.name.full}`}
                  fill
                  sizes="(max-width: 768px) 90vw, 440px"
                  className="object-cover"
                />
              </div>
              <p className="type-label mt-4">
                {site.location.toLowerCase()} — usually near a lamp
              </p>
            </Reveal>
          </div>
        </div>

        <div className="md:col-span-7 lg:col-span-7 lg:col-start-6">
          {about.story.map((paragraph, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <p
                className={`max-w-[58ch] leading-relaxed ${
                  i === 0
                    ? "font-serif text-large italic leading-[1.25] text-text md:text-[2rem]"
                    : "mt-7 text-[1.05rem] text-muted"
                }`}
              >
                {paragraph}
              </p>
            </Reveal>
          ))}

          {/* skills */}
          <div className="mt-20">
            <Reveal>
              <p className="type-label mb-2">capabilities</p>
            </Reveal>
            <SkillGroup title="design" items={skills.design} />
            <SkillGroup title="code" items={skills.code} />
            <SkillGroup title="tools" items={skills.tools} />
          </div>

          {/* experience timeline — this content genuinely is a sequence */}
          <div className="mt-20">
            <Reveal>
              <p className="type-label mb-2">experience</p>
            </Reveal>
            <ol>
              {about.timeline.map((t) => (
                <li
                  key={t.period}
                  className="group grid grid-cols-[auto_1fr] gap-x-6 border-t py-6 md:grid-cols-[180px_1fr_auto] md:py-7"
                  style={{ borderColor: "var(--line)" }}
                >
                  <span className="type-label pt-1.5 tabular-nums">{t.period}</span>
                  <span>
                    <span className="block font-sans text-[1.3rem] font-extrabold tracking-[-0.02em] transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-x-2">
                      {t.role}
                    </span>
                    <span className="mt-1 block text-[0.95rem] text-muted">{t.org}</span>
                  </span>
                </li>
              ))}
            </ol>
            <div className="border-t" style={{ borderColor: "var(--line)" }} />
          </div>

          <Reveal className="mt-16">
            <MagneticButton href={`mailto:${site.email}`}>say hello</MagneticButton>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
