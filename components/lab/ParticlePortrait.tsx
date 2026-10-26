"use client";

/* Lab experiment 1 — the hero photo dissolves into cursor-reactive green
   dust. Canvas 2D: pixels are sampled from the portrait, drawn as small
   glowing dots, and pushed away from the cursor with a spring back home. */

import { useEffect, useRef } from "react";

type Particle = {
  hx: number; // home
  hy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
};

export default function ParticlePortrait() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let particles: Particle[] = [];
    let raf = 0;
    let running = true;
    const mouse = { x: -9999, y: -9999 };

    const build = async () => {
      const img = new Image();
      img.src = "/assets/portrait.png";
      try {
        await img.decode();
      } catch {
        return;
      }

      // sample a coarse grid from the photo
      const GRID = 88;
      const off = document.createElement("canvas");
      off.width = GRID;
      off.height = GRID;
      const octx = off.getContext("2d");
      if (!octx) return;
      octx.drawImage(img, 0, 0, GRID, GRID);
      const data = octx.getImageData(0, 0, GRID, GRID).data;

      particles = [];
      for (let gy = 0; gy < GRID; gy++) {
        for (let gx = 0; gx < GRID; gx++) {
          const i = (gy * GRID + gx) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
          if (lum < 0.08) continue; // skip pure black — the page shows through
          particles.push({
            hx: gx / (GRID - 1),
            hy: gy / (GRID - 1),
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            color: `rgb(${r},${g},${b})`,
            size: 0.5 + lum * 1.6,
          });
        }
      }
      // start at home
      for (const p of particles) {
        p.x = p.hx;
        p.y = p.hy;
      }
      if (reduced) draw(); // one static frame
      else loop();
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        const px = p.x * w;
        const py = p.y * h;
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = p.color;
        ctx.fillRect(px, py, p.size * 1.4, p.size * 1.4);
      }
      ctx.globalAlpha = 1;
    };

    const step = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const rect = canvas.getBoundingClientRect();
      const mx = mouse.x - rect.left;
      const my = mouse.y - rect.top;

      for (const p of particles) {
        const px = p.x * w;
        const py = p.y * h;
        const dx = px - mx;
        const dy = py - my;
        const dist = Math.hypot(dx, dy);
        const RADIUS = 110;

        if (dist < RADIUS && dist > 0.01) {
          const force = ((RADIUS - dist) / RADIUS) * 0.55;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
        // spring home
        p.vx += (p.hx * w - px) * 0.014;
        p.vy += (p.hy * h - py) * 0.014;
        p.vx *= 0.86;
        p.vy *= 0.86;
        p.x += p.vx / w;
        p.y += p.vy / h;
      }
      draw();
    };

    const loop = () => {
      if (!running) return;
      step();
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    // only animate while visible
    const io = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting;
      if (running && !reduced) {
        cancelAnimationFrame(raf);
        loop();
      }
    });
    io.observe(canvas);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseout", onLeave);
    window.addEventListener("resize", resize);

    build();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full"
      aria-label="Interactive particle portrait — move your cursor through it"
      role="img"
    />
  );
}
