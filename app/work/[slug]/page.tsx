import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/ui/Reveal";
import HoloHeading from "@/components/ui/HoloHeading";
import { TransitionLink } from "@/components/layout/Transition";
import { projects } from "@/content/config";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Work" };
  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: [{ url: project.cover }],
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];

  return (
    <article className="pt-32 md:pt-44">
      {/* header */}
      <header className="px-5 md:px-10">
        <TransitionLink
          href="/work"
          className="link-underline type-label text-neon"
        >
          ← all work
        </TransitionLink>
        <div className="mt-8">
          <HoloHeading lines={[project.title]} size="giant" reveal="lines" />
          <p className="type-holo -mt-2 font-serif text-[1.5em] italic md:text-[2.2rem]">
            {project.category}
          </p>
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-8 border-t pt-8 md:grid-cols-4" style={{ borderColor: "var(--line)" }}>
          {[
            ["year", project.year],
            ["stack", project.stack.join(", ")],
            ["role", "design + build"],
            ["client", "confidential"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="type-label mb-2">{k}</dt>
              <dd className="font-sans text-[1.05rem] font-bold tracking-tight">{v}</dd>
            </div>
          ))}
        </dl>
      </header>

      {/* cover */}
      <Reveal className="mt-14 px-5 md:px-10">
        <div
          className="holo-border relative aspect-[16/9] w-full overflow-hidden rounded-2xl"
          style={{ borderColor: "var(--line)" }}
        >
          <Image
            src={project.cover}
            alt={`${project.title} — cover`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 92vw"
            className="object-cover"
          />
        </div>
      </Reveal>

      {/* summary + results */}
      <section className="mt-20 grid gap-12 px-5 md:mt-28 md:grid-cols-12 md:px-10">
        <Reveal className="md:col-span-5">
          <p className="type-label mb-4">the brief</p>
          <p className="max-w-[48ch] font-serif text-[1.6rem] italic leading-[1.3] md:text-[2rem]">
            {project.summary}
          </p>
        </Reveal>
        <Reveal delay={0.08} className="md:col-span-6 md:col-start-7">
          <p className="type-label mb-4">results</p>
          <ul className="border-t" style={{ borderColor: "var(--line)" }}>
            {project.results.map((r) => (
              <li
                key={r}
                className="border-b py-5 font-sans text-[1.4rem] font-extrabold tracking-[-0.02em] md:text-[1.8rem]"
                style={{ borderColor: "var(--line)" }}
              >
                <span className="type-ink">{r}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* gallery */}
      <section className="mt-20 space-y-6 px-5 md:mt-28 md:px-10">
        {project.gallery.map((src, i) => (
          <Reveal key={i}>
            <div
              className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border"
              style={{ borderColor: "var(--line)" }}
            >
              <Image
                src={src}
                alt={`${project.title} — image ${i + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 92vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        ))}
      </section>

      {/* next project */}
      <footer className="mt-24 border-t px-5 py-16 md:mt-36 md:px-10" style={{ borderColor: "var(--line)" }}>
        <p className="type-label mb-4">next project</p>
        <TransitionLink href={`/work/${next.slug}`} data-cursor="view" className="group inline-block">
          <span className="type-ink block font-sans text-giant font-extrabold leading-[0.95] tracking-[-0.03em] transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)] group-hover:translate-x-3">
            {next.title}
          </span>
        </TransitionLink>
        <Link href="/work" className="link-underline type-label mt-8 inline-block text-neon">
          back to all work
        </Link>
      </footer>
    </article>
  );
}
