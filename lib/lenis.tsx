"use client";

/* Lenis smooth scrolling, wired into GSAP's ticker so ScrollTrigger and
   scroll progress stay in sync. Falls back to native scroll when the user
   prefers reduced motion. */
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

export function LenisProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Reduced motion → no smoothing at all; native scroll + instant jumps.
    if (reduced) {
      setLenis(null);
      return;
    }

    const instance = new Lenis({
      lerp: 0.095,              // smooth but responsive — the "slow and smooth" feel
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      syncTouch: false,
    });

    setLenis(instance);
    instance.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Keep scroll position sane across route changes.
    const onRouteScroll = () => instance.scrollTo(0, { immediate: true });
    window.addEventListener("route:scrolltop", onRouteScroll);

    return () => {
      gsap.ticker.remove(raf);
      window.removeEventListener("route:scrolltop", onRouteScroll);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
