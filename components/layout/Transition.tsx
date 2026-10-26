"use client";

/* Route transitions: a green sheet wipes down over the page, the route
   swaps underneath, then the sheet lifts away with the destination's name
   ghosted on it. Internal links use <TransitionLink>; back/forward still
   gets the reveal side of the effect. Reduced motion: instant navigation. */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap";

type Ctx = { navigate: (href: string) => void };
const TransitionContext = createContext<Ctx>({ navigate: () => {} });

export const useTransition = () => useContext(TransitionContext);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const pending = useRef(false);
  const [label, setLabel] = useState("");

  const playReveal = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.dispatchEvent(new Event("route:scrolltop"));
      return;
    }
    gsap.timeline({ onComplete: () => window.dispatchEvent(new Event("route:scrolltop")) })
      .to(overlay, { clipPath: "inset(0 0 100% 0)", duration: 0.7, ease: "power4.inOut" })
      .set(overlay, { clipPath: "inset(0 0 100% 0)", autoAlpha: 0 });
  }, []);

  const navigate = useCallback(
    (href: string) => {
      if (href === pathname) {
        window.dispatchEvent(new Event("route:scrolltop"));
        return;
      }
      const overlay = overlayRef.current;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduced || !overlay) {
        router.push(href);
        return;
      }

      setLabel(href === "/" ? "index" : href.replace(/^\//, "").split("/")[0] || "index");
      pending.current = true;

      gsap
        .timeline()
        .set(overlay, { autoAlpha: 1, clipPath: "inset(100% 0 0 0)" })
        .to(overlay, {
          clipPath: "inset(0% 0 0 0)",
          duration: 0.65,
          ease: "power4.inOut",
          onComplete: () => router.push(href),
        });
    },
    [pathname, router]
  );

  // when the new route mounts, lift the sheet
  useEffect(() => {
    if (!pending.current) return;
    pending.current = false;
    playReveal();
  }, [pathname, playReveal]);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[150] flex items-end bg-bg-2 px-6 pb-6 opacity-0 md:px-10"
        style={{ clipPath: "inset(0 0 100% 0)" }}
      >
        <div className="w-full">
          <span ref={labelRef} className="type-label text-neon">
            {label}
          </span>
          <div className="mt-1 h-px w-full bg-line-strong" />
        </div>
      </div>
    </TransitionContext.Provider>
  );
}

export function TransitionLink({
  href,
  children,
  className,
  ...rest
}: {
  href: string;
  children: ReactNode;
  className?: string;
} & Omit<React.ComponentProps<typeof Link>, "href">) {
  const { navigate } = useTransition();
  return (
    <Link
      href={href}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        navigate(href);
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}
