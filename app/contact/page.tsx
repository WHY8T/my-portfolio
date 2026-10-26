import type { Metadata } from "next";
import ContactForm from "@/components/home/ContactForm";
import HoloHeading from "@/components/ui/HoloHeading";
import Reveal from "@/components/ui/Reveal";
import { site } from "@/content/config";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name.full} — ${site.email}.`,
};

export default function ContactPage() {
  return (
    <div className="px-5 pt-32 md:px-10 md:pt-44">
      <HoloHeading lines={["say"]} accent="hello." size="giant" />

      <div className="mt-14 grid gap-16 md:mt-20 md:grid-cols-12">
        <div className="md:col-span-7">
          <Reveal>
            <p className="max-w-[46ch] text-[1.1rem] leading-relaxed text-muted">
              New projects, collaborations, or just a good lamp recommendation —
              the inbox is open. I reply within two working days.
            </p>
          </Reveal>
          <Reveal delay={0.08} className="mt-10">
            <a
              href={`mailto:${site.email}`}
              className="link-underline type-ink inline-block font-sans text-[clamp(1.6rem,4vw,3rem)] font-extrabold tracking-[-0.03em]"
              data-cursor="write"
            >
              {site.email}
            </a>
          </Reveal>
          <Reveal delay={0.12} className="mt-12">
            <p className="type-label mb-4">elsewhere</p>
            <ul className="flex flex-wrap gap-x-8 gap-y-2">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="link-underline font-sans font-bold tracking-tight text-text hover:text-neon"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="md:col-span-5">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
