/* Skills marquee — alternating heavy sans / italic serif words, the logo's
   two voices in one line. Pure CSS loop, duplicated for seamlessness,
   pauses on hover. Reduced motion: a static wrapped list. */

import { marqueeWords } from "@/content/config";

export default function Marquee() {
  const row = (hidden: boolean) => (
    <div
      className="marquee-row flex shrink-0 items-center gap-[0.9em] pr-[0.9em]"
      aria-hidden={hidden || undefined}
    >
      {marqueeWords.map((word, i) => (
        <span key={`${word}-${i}`} className="flex items-center gap-[0.9em] whitespace-nowrap">
          {i % 2 === 1 ? (
            <span className="font-serif italic font-normal text-large type-holo">{word}</span>
          ) : (
            <span className="font-sans font-extrabold text-large tracking-[-0.02em] type-ink">
              {word}
            </span>
          )}
          <span className="text-neon text-[0.5em] opacity-70" aria-hidden="true">
            ✦
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className="marquee group relative overflow-hidden border-y py-5"
      style={{ borderColor: "var(--line)" }}
      aria-label="Skills and tools"
    >
      <div className="marquee-track flex w-max group-hover:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
