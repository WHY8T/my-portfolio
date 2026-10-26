"use client";

/* Corner HUD: local time (left), FPS meter (right), availability + pulsing
   presence dot (bottom-left). Desktop decoration — hidden on small screens
   so it never crowds the content. */

import { useEffect, useState } from "react";
import { site } from "@/content/config";

function Clock() {
  const [now, setNow] = useState<Date | null>(null);
  const [city, setCity] = useState("local");

  useEffect(() => {
    setNow(new Date());
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "local";
    setCity(tz.split("/").pop()?.replace(/_/g, " ").toLowerCase() ?? "local");
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now
    ? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
    : "--:--:--";

  return (
    <span className="type-label tabular-nums">
      {time} — {city}
    </span>
  );
}

function FpsMeter() {
  const [fps, setFps] = useState<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frames = 0;
    let last = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      frames++;
      if (now - last >= 1000) {
        setFps(Math.round((frames * 1000) / (now - last)));
        frames = 0;
        last = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (fps === null) return null;
  const color = fps >= 50 ? "var(--neon)" : fps >= 32 ? "var(--lime)" : "var(--warm)";

  return (
    <span className="type-label tabular-nums" style={{ color }}>
      {fps} fps
    </span>
  );
}

function Status() {
  return (
    <span className="flex items-center gap-2">
      <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
        <span className="status-ping absolute inline-flex h-full w-full rounded-full bg-neon opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-neon-hot" />
      </span>
      <span className="type-label">{site.availability.toLowerCase()}</span>
    </span>
  );
}

export default function Hud() {
  return (
    <>
      <div className="pointer-events-none fixed left-4 top-16 z-[110] hidden md:block" aria-hidden="true">
        <Clock />
      </div>
      <div className="pointer-events-none fixed right-4 top-16 z-[110] hidden md:block" aria-hidden="true">
        <FpsMeter />
      </div>
      <div className="pointer-events-none fixed bottom-4 left-4 z-[110] hidden md:block">
        <Status />
      </div>
    </>
  );
}
