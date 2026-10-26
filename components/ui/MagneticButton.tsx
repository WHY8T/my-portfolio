"use client";

/* Magnetic pill button: the label leans toward the cursor inside the hit
   area, then springs back. Glass surface + holographic border. */

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";

type Props = {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: "solid" | "ghost";
  className?: string;
};

export default function MagneticButton({
  href,
  onClick,
  children,
  variant = "solid",
  className = "",
}: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = rootRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    gsap.to(el, { x: dx * 0.22, y: dy * 0.22, duration: 0.5, ease: "power3.out" });
    gsap.to(innerRef.current, { x: dx * 0.12, y: dy * 0.12, duration: 0.5, ease: "power3.out" });
  };

  const onLeave = () => {
    gsap.to([rootRef.current, innerRef.current], {
      x: 0,
      y: 0,
      duration: 0.9,
      ease: "elastic.out(1, 0.45)",
    });
  };

  const classes = [
    "magnetic holo-border glass rounded-full px-7 py-3.5",
    "font-sans font-bold text-[0.95rem] tracking-tight",
    variant === "solid"
      ? "text-bg bg-neon hover:bg-neon-hot border-transparent"
      : "text-text hover:text-neon",
    "transition-colors duration-300",
    className,
  ].join(" ");

  if (href) {
    return (
      <Link
        ref={rootRef as never}
        href={href}
        className={classes}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <span ref={innerRef} className="inline-flex items-center gap-2">
          {children}
        </span>
      </Link>
    );
  }

  return (
    <button
      ref={rootRef as never}
      type="button"
      onClick={onClick}
      className={classes}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <span ref={innerRef} className="inline-flex items-center gap-2">
        {children}
      </span>
    </button>
  );
}
