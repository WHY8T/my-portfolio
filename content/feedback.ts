/* ✏️ FEEDBACK — what people say about you. YOU decide what is shown.

   For every entry:
     show: true   → visible on the website
     show: false  → hidden (keep it here for later, nobody sees it)

   To add a new one, copy a block, give it a new unique `id`, fill it in, set show: true.
   Order = the order on the site (first one first). Delete an entry to remove it for good.

   Fields
     name      required
     quote     required — what they said (keep it short and real)
     role      optional — e.g. "Marketing lead"
     company   optional — e.g. "ENSSEA"
     project   optional — a small tag, e.g. "Shahid"
     rating    optional — 1 to 5 stars
     avatar    optional — a photo path in /public/feedback/, e.g. "/feedback/sara.jpg"
                (no photo? their initials are shown)

   ⚠️ The four "sample" entries below are fake — they only exist so you can see the design
   while you work with `npm run dev`. They NEVER appear on the live site (a build ignores
   anything with sample: true). Delete them once you have real feedback.
   If nothing is visible, the whole section hides itself. */

export type Feedback = {
  id: string;
  name: string;
  quote: string;
  role?: string;
  company?: string;
  project?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  avatar?: string;
  show: boolean;
  sample?: boolean;
};

const all: Feedback[] = [
  /* ---- your real feedback goes here ------------------------------------------
  {
    id: "enssea-1",
    name: "Full Name",
    role: "Their role",
    company: "ENSSEA",
    project: "Shahid",
    rating: 5,
    quote: "What they said, in their own words.",
    show: true,
  },
  ------------------------------------------------------------------------------ */

  /* ---- samples (fake, dev only) ---------------------------------------------- */
  {
    id: "sample-1",
    name: "Sample Person",
    role: "Founder",
    company: "Sample Studio",
    project: "Brand identity",
    rating: 5,
    quote:
      "He turned a messy idea into a brand we are proud of. Fast, calm and incredibly detail-oriented.",
    show: true,
    sample: true,
  },
  {
    id: "sample-2",
    name: "Another Sample",
    role: "Marketing lead",
    company: "Sample Co.",
    rating: 5,
    quote:
      "Every revision felt like a step forward, never sideways. The final files were perfectly organised.",
    show: true,
    sample: true,
  },
  {
    id: "sample-3",
    name: "Third Sample",
    role: "Club president",
    company: "Sample Club",
    project: "Visual identity",
    rating: 4,
    quote: "Our posts finally look like one family. People keep asking who designed them.",
    show: true,
    sample: true,
  },
  {
    id: "sample-4",
    name: "Hidden Sample",
    role: "Client",
    quote: "This one is set to show: false, so you can see how hiding works — it will not appear.",
    show: false,
    sample: true,
  },
];

/* What the website actually uses: shown entries only (samples only while developing). */
const isDev = process.env.NODE_ENV !== "production";
export const feedback: Feedback[] = all.filter((f) => f.show && (!f.sample || isDev));
