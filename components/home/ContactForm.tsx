"use client";

/* Front-end-only contact form: builds a mailto: draft from the fields so it
   works without a backend. Replace with a real endpoint when one exists. */

import { useState } from "react";
import { site } from "@/content/config";

const field =
  "w-full rounded-xl border bg-transparent px-4 py-3 font-sans text-[0.95rem] text-text outline-none transition-colors placeholder:text-muted focus:border-neon";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Project enquiry from ${name || "the site"}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
  };

  return (
    <form
      onSubmit={submit}
      className="holo-border glass rounded-2xl p-6 md:p-8"
      aria-label="Contact form"
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="cf-name" className="type-label mb-2 block">
            name
          </label>
          <input
            id="cf-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
            placeholder="Ada Lovelace"
            className={`${field}`}
            style={{ borderColor: "var(--line)" }}
          />
        </div>
        <div>
          <label htmlFor="cf-email" className="type-label mb-2 block">
            email
          </label>
          <input
            id="cf-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="ada@example.com"
            className={field}
            style={{ borderColor: "var(--line)" }}
          />
        </div>
        <div>
          <label htmlFor="cf-message" className="type-label mb-2 block">
            project
          </label>
          <textarea
            id="cf-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={5}
            placeholder="What are we lighting up?"
            className={`${field} resize-none`}
            style={{ borderColor: "var(--line)" }}
          />
        </div>
      </div>
      <button
        type="submit"
        className="magnetic mt-6 w-full justify-center rounded-xl bg-neon py-3.5 font-sans font-bold text-bg transition-colors hover:bg-neon-hot"
      >
        open email draft
      </button>
      <p className="type-label mt-4 text-center">
        opens your mail app — no data leaves the page
      </p>
    </form>
  );
}
