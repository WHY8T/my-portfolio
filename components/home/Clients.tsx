"use client";

/* Trusted clients — an "ad bar": logos loop horizontally and forever, pause on
   hover, fade out at both edges. Logos are plain image files you drop into
   /public/clients/ (see the `file` of each client below). If a file is missing
   the client's name is shown as a text wordmark instead, so nothing breaks.

   ✏️ EDIT THE LIST HERE — name, link, logo file. */

import { useState } from "react";

type Client = {
    name: string;
    href?: string; // optional — leave it out and the logo simply isn't a link
    file: string; // put the logo in /public/clients/ with exactly this name
    size?: "sm" | "md" | "lg" | "xl"; // logo height: sm = very wide logos … xl = tall/narrow logos
    keepColor?: boolean; // false (default): logo is turned into a clean white silhouette
};

/* ➕ NEW CLIENT? 1) drop the logo in /public/clients/  2) add one line below. */
const CLIENTS: Client[] = [
    { name: "ENSSEA", href: "https://enssea.edu.dz", file: "/clients/enssea.png", size: "lg" },
    { name: "Yaomy", file: "/clients/yaomy.png", size: "md" },
    { name: "Dini Maak Trip", href: "https://www.dinimaaktrip.com/fr", file: "/clients/dini-maak-trip.png" },
    { name: "Tali Cosmetics", href: "https://talicosmetics.shop", file: "/clients/tali-cosmetics.png", size: "xl" },
    { name: "L’Algérienne Vie", href: "https://lalgeriennevie.dz", file: "/clients/lalgerienne-vie.png", size: "sm" },
    {
        name: "Economic Ingenious Club",
        href: "https://www.instagram.com/economicingeniousclub",
        file: "/clients/economic-ingenious-club.png",
        size: "lg",
    },
    { name: "HD Concept", href: "https://hdconcept.dz", file: "/clients/hd-concept.png", size: "lg" },
    { name: "Maffinoo", href: "https://www.instagram.com/maffinoo/", file: "/clients/maffinoo.png", size: "md" },
    { name: "Absher Kolea", href: "https://www.instagram.com/absher_kolea/", file: "/clients/absher.png", size: "lg" },
];

const SIZES: Record<NonNullable<Client["size"]>, string> = {
    sm: "h-8 md:h-10",
    md: "h-10 md:h-12",
    lg: "h-14 md:h-[4.25rem]",
    xl: "h-16 md:h-20",
};

const REPEAT = 3; // how many times the list repeats inside one half of the loop

function ClientItem({ client }: { client: Client }) {
    const [failed, setFailed] = useState(false);

    const content = failed ? (
        <span className="whitespace-nowrap font-sans text-[1.35rem] font-extrabold tracking-[-0.03em] text-text md:text-[1.6rem]">
            {client.name}
        </span>
    ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={client.file}
            alt={client.name}
            onError={() => setFailed(true)}
            className={`w-auto max-w-none object-contain ${SIZES[client.size ?? "md"]} ${client.keepColor ? "" : "brightness-0 invert"
                }`}
            loading="lazy"
            draggable={false}
        />
    );

    const cls =
        "group flex h-20 shrink-0 items-center opacity-60 transition-opacity duration-300 hover:opacity-100 md:h-24";

    return client.href ? (
        <a href={client.href} target="_blank" rel="noopener noreferrer" aria-label={client.name} className={cls}>
            {content}
        </a>
    ) : (
        <div className={cls} role="img" aria-label={client.name}>
            {content}
        </div>
    );
}

export default function Clients() {
    const half = (hidden: boolean) => (
        <ul
            className="flex shrink-0 items-center gap-14 pr-14 md:gap-24 md:pr-24"
            aria-hidden={hidden || undefined}
        >
            {Array.from({ length: REPEAT }).flatMap((_, r) =>
                CLIENTS.map((c) => (
                    <li key={`${r}-${c.name}`} className="flex items-center gap-14 md:gap-24">
                        <ClientItem client={c} />
                        <span className="text-[0.7rem] text-neon opacity-60" aria-hidden="true">
                            ✦
                        </span>
                    </li>
                ))
            )}
        </ul>
    );

    return (
        <section
            aria-label="Trusted clients"
            className="relative border-y py-8 md:py-10"
            style={{ borderColor: "var(--line)" }}
        >
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
                <p className="type-label shrink-0 px-5 tracking-[0.28em] md:px-10">
                    TRUSTED BY
                </p>

                <div className="group relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
                    <div
                        className="marquee-track flex w-max group-hover:[animation-play-state:paused] motion-reduce:[animation:none]"
                        style={{ ["--marquee-duration" as string]: "45s" }}
                    >
                        {half(false)}
                        {half(true)}
                    </div>
                </div>
            </div>
        </section>
    );
}