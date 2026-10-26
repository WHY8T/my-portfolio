"use client";

/* Trusted clients — an "ad bar": logos loop horizontally and forever, pause on
   hover, fade out at both edges. Logos are plain image files you drop into
   /public/clients/ (see the `file` of each client below). If a file is missing
   the client's name is shown as a text wordmark instead, so nothing breaks.

   ✏️ EDIT THE LIST HERE — name, link, logo file. */

import { useState } from "react";

type Client = {
    name: string;
    href: string;
    file: string; // put the logo in /public/clients/ with exactly this name
    keepColor?: boolean; // false (default): logo is turned into a clean white silhouette
    tall?: boolean; // true for square / stacked logos that need more height to stay readable
};

const CLIENTS: Client[] = [
    { name: "ENSSEA", href: "https://enssea.edu.dz", file: "/clients/enssea.png", tall: true },
    { name: "Dini Maak Trip", href: "https://www.dinimaaktrip.com/fr", file: "/clients/dini-maak-trip.png" },
    { name: "Tali Cosmetics", href: "https://talicosmetics.shop", file: "/clients/tali-cosmetics.png" },
    { name: "L’Algérienne Vie", href: "https://lalgeriennevie.dz", file: "/clients/lalgerienne-vie.png" },
    {
        name: "Economic Ingenious Club",
        href: "https://www.instagram.com/economicingeniousclub",
        file: "/clients/economic-ingenious-club.png",
    },
];

const REPEAT = 3; // how many times the list repeats inside one half of the loop

function ClientItem({ client }: { client: Client }) {
    const [failed, setFailed] = useState(false);

    return (
        <a
            href={client.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={client.name}
            className="group flex h-16 shrink-0 items-center opacity-60 transition-opacity duration-300 hover:opacity-100 md:h-20"
        >
            {failed ? (
                <span className="whitespace-nowrap font-sans text-[1.35rem] font-extrabold tracking-[-0.03em] text-text md:text-[1.6rem]">
                    {client.name}
                </span>
            ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={client.file}
                    alt={client.name}
                    onError={() => setFailed(true)}
                    className={`w-auto max-w-none object-contain ${client.tall ? "h-14 md:h-[4.5rem]" : "h-9 md:h-11"
                        } ${client.keepColor ? "" : "brightness-0 invert"}`}
                    loading="lazy"
                    draggable={false}
                />
            )}
        </a>
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