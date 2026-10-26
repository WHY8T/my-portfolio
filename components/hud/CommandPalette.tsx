"use client";

/* ⌘K / Ctrl+K command palette: navigate, toggle theme, copy email, open
   socials. Keyboard-first (arrows, enter, esc), focus is restored to the
   opener, fully labelled for screen readers. */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@/lib/prefs";
import { useTransition } from "@/components/layout/Transition";
import { nav, site } from "@/content/config";

type Command = {
  id: string;
  label: string;
  hint?: string;
  run: () => void;
};

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const openerRef = useRef<Element | null>(null);
  const { theme, toggle } = useTheme();
  const { navigate } = useTransition();

  const close = useCallback(() => setOpen(false), []);

  const commands = useMemo<Command[]>(() => {
    const go = (href: string, label: string) => () => {
      close();
      navigate(href);
    };
    return [
      ...nav.map((n) => ({
        id: `go-${n.href}`,
        label: `go to ${n.label.toLowerCase()}`,
        hint: n.href,
        run: go(n.href, n.label),
      })),
      {
        id: "theme",
        label: theme === "dark" ? "switch to studio paper (light)" : "switch to studio black (dark)",
        hint: "theme",
        run: () => {
          toggle();
          close();
        },
      },
      {
        id: "email",
        label: copied ? "email copied ✓" : `copy email — ${site.email}`,
        hint: "copy",
        run: async () => {
          try {
            await navigator.clipboard.writeText(site.email);
            setCopied(true);
            setTimeout(() => {
              setCopied(false);
              close();
            }, 900);
          } catch {
            close();
          }
        },
      },
      ...site.socials.map((s) => ({
        id: `soc-${s.label}`,
        label: `open ${s.label.toLowerCase()}`,
        hint: "external",
        run: () => {
          window.open(s.href, "_blank", "noopener,noreferrer");
          close();
        },
      })),
    ];
  }, [theme, toggle, navigate, close, copied]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(q));
  }, [commands, query]);

  /* open/close wiring + keys */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") close();
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("palette:open", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("palette:open", onOpen);
    };
  }, [close]);

  useEffect(() => {
    if (open) {
      openerRef.current = document.activeElement;
      setQuery("");
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      (openerRef.current as HTMLElement | null)?.focus?.();
    }
  }, [open]);

  const runCommand = (c: Command) => c.run();

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const c = filtered[active];
      if (c) runCommand(c);
    }
  };

  /* keep the active row in view */
  useEffect(() => {
    listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[160] flex items-start justify-center px-4 pt-[16vh]"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <div className="absolute inset-0 bg-bg/70 backdrop-blur-sm" aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        className="holo-border glass relative w-full max-w-lg overflow-hidden rounded-2xl"
      >
        <div className="flex items-center gap-3 border-b px-5 py-4" style={{ borderColor: "var(--line)" }}>
          <span aria-hidden="true" className="text-neon">⌘</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={filtered[active]?.id}
            placeholder="type a command…"
            className="w-full bg-transparent font-sans text-[0.95rem] text-text outline-none placeholder:text-[rgb(178_209_162/0.45)]"
          />
          <kbd className="type-label">esc</kbd>
        </div>

        <ul ref={listRef} id="palette-list" role="listbox" className="max-h-[46vh] overflow-y-auto p-2">
          {filtered.length === 0 && (
            <li className="type-label px-3 py-6 text-center">no command matches — try "work" or "theme"</li>
          )}
          {filtered.map((c, i) => (
            <li key={c.id} id={c.id} role="option" aria-selected={i === active}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => runCommand(c)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left font-sans text-[0.95rem] transition-colors ${
                  i === active ? "bg-neon/10 text-neon" : "text-text"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className={`inline-block h-1 w-1 rounded-full ${i === active ? "bg-neon-hot" : "bg-transparent"}`}
                  />
                  {c.label}
                </span>
                {c.hint && <span className="type-label">{c.hint}</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
