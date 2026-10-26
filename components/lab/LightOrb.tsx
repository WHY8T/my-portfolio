"use client";

/* Lab experiment 3 — a shader orb breathing green caustics. Drag disturbs
   the light field. OGL, DPR-capped, pauses when offscreen or hidden. */

import { useEffect, useRef } from "react";
import { useLowPower, useReducedMotion } from "@/lib/prefs";

export default function LightOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lowPower = useLowPower();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (lowPower || reduced || !canvasRef.current) return;

    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const { Renderer, Program, Mesh, Triangle, Vec2 } = await import("ogl");
      if (disposed || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const renderer = new Renderer({
        canvas,
        alpha: true,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio, 1.5),
      });
      const gl = renderer.gl;

      const mouse = new Vec2(0.5, 0.5);
      const smooth = new Vec2(0.5, 0.5);
      let dragging = 0;
      let energy = 0; // rises while dragging, decays after

      const program = new Program(gl, {
        transparent: true,
        uniforms: {
          uTime: { value: 0 },
          uMouse: { value: smooth },
          uEnergy: { value: 0 },
          uRes: { value: new Vec2(1, 1) },
        },
        vertex: /* glsl */ `
          attribute vec2 uv;
          attribute vec2 position;
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position, 0.0, 1.0);
          }
        `,
        fragment: /* glsl */ `
          precision highp float;
          uniform float uTime;
          uniform vec2 uMouse;
          uniform float uEnergy;
          uniform vec2 uRes;
          varying vec2 vUv;

          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
          }
          float noise(vec2 p) {
            vec2 i = floor(p), f = fract(p);
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(hash(i), hash(i + vec2(1, 0)), u.x),
              mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
          }
          float fbm(vec2 p) {
            float v = 0.0, a = 0.5;
            for (int i = 0; i < 4; i++) {
              v += a * noise(p);
              p = p * 2.07 + vec2(9.2, 5.1);
              a *= 0.5;
            }
            return v;
          }

          void main() {
            vec2 uv = (vUv - 0.5) * vec2(uRes.x / uRes.y, 1.0);
            float t = uTime * 0.35;

            // orb: circle SDF with a wobbly rim
            vec2 m = (uMouse - 0.5) * vec2(uRes.x / uRes.y, 1.0);
            float wobble = fbm(uv * 3.0 + t * 0.4 + m * uEnergy * 2.0) - 0.5;
            float d = length(uv - wobble * 0.08 * (1.0 + uEnergy)) - 0.32;

            // caustic filaments inside the orb
            float caustic = pow(
              abs(fbm(uv * 5.0 + vec2(t * 0.5, -t * 0.3) + wobble) -
                  fbm(uv * 5.0 - vec2(t * 0.3, t * 0.6))),
              1.6
            );

            float inside = smoothstep(0.012, -0.012, d);
            float rim = smoothstep(0.05, 0.0, abs(d)) * (1.0 - inside);
            float halo = exp(-max(d, 0.0) * 6.0);

            vec3 deep = vec3(0.01, 0.08, 0.03);
            vec3 neon = vec3(0.17, 0.96, 0.31);
            vec3 lime = vec3(0.8, 1.0, 0.56);

            vec3 col = deep * inside
              + neon * caustic * inside * (0.8 + uEnergy * 1.4)
              + lime * caustic * caustic * inside
              + neon * rim * 1.2
              + neon * halo * 0.25;

            float alpha = inside * (0.35 + caustic * 0.6 + uEnergy * 0.2)
              + rim * 0.8 + halo * 0.3;
            gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.95));
          }
        `,
      });

      const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        renderer.setSize(Math.max(rect.width, 1), Math.max(rect.height, 1));
        program.uniforms.uRes.value.set(gl.canvas.width, gl.canvas.height);
      };
      resize();

      const ro = new ResizeObserver(resize);
      ro.observe(canvas);

      const onMove = (e: MouseEvent) => {
        const r = canvas.getBoundingClientRect();
        mouse.set(
          (e.clientX - r.left) / r.width,
          1 - (e.clientY - r.top) / r.height
        );
      };
      const onDown = () => (dragging = 1);
      const onUp = () => (dragging = 0);
      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener("mousedown", onDown);
      window.addEventListener("mouseup", onUp);

      let raf = 0;
      let visible = true;
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      });
      io.observe(canvas);

      const onVis = () => {
        if (document.visibilityState !== "visible") visible = false;
      };
      document.addEventListener("visibilitychange", onVis);

      const frame = (now: number) => {
        raf = requestAnimationFrame(frame);
        if (!visible) return;
        energy += (dragging * 0.9 - energy) * 0.04;
        smooth.set(
          smooth.x + (mouse.x - smooth.x) * 0.06,
          smooth.y + (mouse.y - smooth.y) * 0.06
        );
        program.uniforms.uTime.value = now * 0.001;
        program.uniforms.uEnergy.value = energy;
        renderer.render({ scene: mesh });
      };
      raf = requestAnimationFrame(frame);

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mousedown", onDown);
        window.removeEventListener("mouseup", onUp);
        document.removeEventListener("visibilitychange", onVis);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [lowPower, reduced]);

  if (lowPower || reduced) {
    // CSS fallback: a breathing radial-gradient orb
    return (
      <div className="relative flex h-full w-full items-center justify-center">
        <div
          className="h-56 w-56 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 42% 38%, #ccff8f 0%, #2bf44e 26%, #02901b 52%, #01460e 74%, transparent 76%)",
            boxShadow: "0 0 90px rgb(43 244 78 / 0.35)",
          }}
        />
      </div>
    );
  }

  return <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />;
}
