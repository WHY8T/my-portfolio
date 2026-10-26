"use client";

/* User preferences + theme.
   - useReducedMotion / useFinePointer / useLowPower: gates for heavy effects
   - ThemeProvider: dark (studio black-green) is default; light = "studio paper".
     Persisted to localStorage; an inline script in layout.tsx applies it
     before paint to avoid a flash. */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/* ---------------------------------------------------------------- hooks -- */

function useMedia(query: string, initial = false) {
  const [matches, setMatches] = useState(initial);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return matches;
}

export const useReducedMotion = () =>
  useMedia("(prefers-reduced-motion: reduce)");

export const useFinePointer = () => useMedia("(pointer: fine)");

/* Heuristic for "this device shouldn't run a WebGL scene":
   small core count / low device memory / integrated-GPU-ish. */
export function useLowPower(): boolean {
  const [low, setLow] = useState(false);
  useEffect(() => {
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      hardwareConcurrency?: number;
    };
    const cores = nav.hardwareConcurrency ?? 4;
    const mem = nav.deviceMemory ?? 4;
    setLow(cores <= 4 || mem <= 4);
  }, []);
  return low;
}

/* ---------------------------------------------------------------- theme -- */

type Theme = "dark" | "light";
const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "dark",
  toggle: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored === "light" || stored === "dark") setTheme(stored);
  }, []);

  const toggle = useCallback(() => {
    setTheme((t) => {
      const next: Theme = t === "dark" ? "light" : "dark";
      localStorage.setItem("theme", next);
      document.documentElement.dataset.theme = next;
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
