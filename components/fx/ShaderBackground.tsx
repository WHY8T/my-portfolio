"use client";

/* Optional WebGL backdrop: slow green caustics that bend toward the cursor.
   Loaded lazily (next/dynamic, ssr:false), skipped entirely on low-power
   devices and reduced-motion — the CSS studio-light carries those cases. */

import { useEffect, useRef } from "react";
import { useLowPower, useReducedMotion } from "@/lib/prefs";

export default function ShaderBackground() {
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
      gl.clearColor(0, 0, 0, 0);

      const scene = new Vec2(0.5, 0.5); // normalized cursor, lerped below
      const target = new Vec2(0.5, 0.5);

      const program = new Program(gl, {
        transparent: true,
        uniforms: {
          uTime: { value: 0 },
          uMouse: { value: scene },
          uRes: { value: new Vec2(gl.canvas.width, gl.canvas.height) },
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
          uniform vec2 uRes;
          varying vec2 vUv;

          // cheap 2D noise + fbm
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
              p = p * 2.03 + vec2(11.3, 7.7);
              a *= 0.5;
            }
            return v;
          }

          void main() {
            vec2 uv = vUv;
            vec2 asp = vec2(uRes.x / uRes.y, 1.0);
            vec2 p = uv * asp;

            // cursor bends the light field
            vec2 m = uMouse * asp;
            float md = length(p - m);
            vec2 pull = normalize(p - m + 0.0001) * exp(-md * 3.2) * 0.16;

            float t = uTime * 0.045;
            float c1 = fbm(p * 2.2 + t + pull * 2.0);
            float c2 = fbm(p * 3.7 - t * 1.3 - pull * 3.0);
            float caustic = pow(abs(c1 - c2) * 1.6, 2.2);

            // falloff from the cursor light + page vignette
            float glow = exp(-md * 1.6);
            float vig = smoothstep(1.25, 0.25, length(uv - 0.5));

            vec3 deep = vec3(0.008, 0.055, 0.02);
            vec3 neon = vec3(0.17, 0.96, 0.31);
            vec3 col = deep
              + neon * caustic * (0.10 + glow * 0.22)
              + neon * glow * 0.05;

            float alpha = (caustic * (0.10 + glow * 0.22) + glow * 0.05) * vig;
            gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.42));
          }
        `,
      });

      const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

      const resize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        program.uniforms.uRes.value.set(gl.canvas.width, gl.canvas.height);
      };
      resize();
      window.addEventListener("resize", resize);

      const onMove = (e: MouseEvent) => {
        target.set(e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight);
      };
      window.addEventListener("mousemove", onMove, { passive: true });

      let raf = 0;
      let running = true;
      const onVis = () => {
        running = document.visibilityState === "visible";
        if (running) raf = requestAnimationFrame(frame);
      };
      document.addEventListener("visibilitychange", onVis);

      const frame = (now: number) => {
        if (!running) return;
        program.uniforms.uTime.value = now * 0.001;
        scene.set(scene.x + (target.x - scene.x) * 0.05, scene.y + (target.y - scene.y) * 0.05);
        renderer.render({ scene: mesh });
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("resize", resize);
        window.removeEventListener("mousemove", onMove);
        document.removeEventListener("visibilitychange", onVis);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, [lowPower, reduced]);

  if (lowPower || reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 h-full w-full opacity-70"
    />
  );
}
