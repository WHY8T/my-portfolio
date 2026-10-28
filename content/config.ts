/* ==========================================================================
   CONTENT CONFIG — everything you'd ever want to edit lives in this file.
   ========================================================================== */

export const site = {
  name: {
    first: "Houasnia",
    last: "Ahmed Adem",
    full: "Houasnia Ahmed Adem",
  },
  role: "Creative Artist & Graphic Designer",
  location: "Kolea, Algeria",
  email: "ademhouasnia813@gmail.com",
  availability: "Available from March 2026",
  url: "https://your-domain.com",
  description:
    "Portfolio of a creative artist and graphic designer working in branding, typography and motion.",
  socials: [
    { label: "Instagram", href: "https://instagram.com/yourhandle" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/houasnia-ahmed-adem-a19a5443b/",
    },
  ],
};

/* ---------------------------------------------------------------------------
   SELECTED WORK
   --------------------------------------------------------------------------- */

export type Project = {
  slug: string;
  title: string;
  category: string;
  year: string;
  stack: string[];
  summary: string;
  results: string[];
  cover: string;
  gallery: string[];
  role?: string;
  client?: string;
};

export const projects: Project[] = [
  {
    slug: "shahid",
    title: "Shahid",
    category: "brand identity",
    year: "2026",
    stack: ["Logo", "Branding", "Packaging", "Print"],
    summary:
      "A bilingual identity for an Algerian clothing label: an Arabic ش fused with Latin letters, carried from the logo to labels, tags and packaging.",
    results: [
      "Logo + brand system",
      "Woven labels, hang tags & packaging",
      "Made in Algeria",
    ],
    role: "brand identity",
    client: "Shahid",
    cover: "/work/shahid/cover.png",
    gallery: [
      "/work/shahid/01.png",
      "/work/shahid/02.png",
      "/work/shahid/03.png",
      "/work/shahid/04.png",
      "/work/shahid/05.png",
      "/work/shahid/06.png",
      "/work/shahid/07.png",
      "/work/shahid/08.png",
      "/work/shahid/09.png",
      "/work/shahid/10.png",
    ],
  },
  {
    slug: "lumen-studio",
    title: "Lumen Studio",
    category: "site / motion",
    year: "2026",
    stack: ["Next.js", "GSAP", "WebGL"],
    summary:
      "A lighting-design studio site where every surface answers the cursor.",
    results: ["+38% enquiry rate", "Awwwards honorable mention", "0.9s LCP"],
    cover: "/assets/portrait.png",
    gallery: ["/assets/portrait.png"],
  },
  {
    slug: "verdant",
    title: "Verdant",
    category: "brand / web",
    year: "2025",
    stack: ["React", "Three.js"],
    summary: "E-commerce for a plant lab — growth measured in real time.",
    results: ["+24% conversion", "2× session length"],
    cover: "/assets/portrait.png",
    gallery: ["/assets/portrait.png"],
  },
  {
    slug: "monolith",
    title: "Monolith",
    category: "identity",
    year: "2025",
    stack: ["Type", "Print", "Motion"],
    summary: "An identity carved from a single geometric alphabet.",
    results: ["3 markets launched"],
    cover: "/assets/portrait.png",
    gallery: ["/assets/portrait.png"],
  },
  {
    slug: "pulse",
    title: "Pulse",
    category: "product / ux",
    year: "2024",
    stack: ["TypeScript", "D3"],
    summary: "A health dashboard that reads like a heart-rate monitor.",
    results: ["-41% task time", "SOC2 shipped"],
    cover: "/assets/portrait.png",
    gallery: ["/assets/portrait.png"],
  },
  {
    slug: "afterimage",
    title: "Afterimage",
    category: "experiment",
    year: "2024",
    stack: ["OGL", "Shaders"],
    summary: "Retinal-green light trails; an ode to looking at the sun.",
    results: ["40k plays", "Featured on Codrops"],
    cover: "/assets/portrait.png",
    gallery: ["/assets/portrait.png"],
  },
  {
    slug: "signal",
    title: "Signal",
    category: "site / dev",
    year: "2023",
    stack: ["Next.js", "CMS"],
    summary:
      "A newsroom site with typographic speed as the feature.",
    results: ["Lighthouse 99", "+19% returning readers"],
    cover: "/assets/portrait.png",
    gallery: ["/assets/portrait.png"],
  },
];

/* ---------------------------------------------------------------------------
   SKILLS MARQUEE
   --------------------------------------------------------------------------- */

export const marqueeWords = [
  "art direction",
  "webgl",
  "design systems",
  "typography",
  "react",
  "motion",
  "creative code",
  "branding",
  "gsap",
  "interfaces",
  "shaders",
  "ui design",
];

export const skills = {
  design: [
    "Art direction",
    "Typography",
    "Design systems",
    "Prototyping",
    "Brand identity",
  ],
  code: ["TypeScript", "React / Next.js", "GSAP", "WebGL / GLSL", "Node"],
  tools: ["Figma", "After Effects", "Blender", "Cursor", "Vercel"],
};

/* ---------------------------------------------------------------------------
   ABOUT — story + experience timeline
   --------------------------------------------------------------------------- */

export const about = {
  story: [
    "I'm a designer-developer working where light meets interface. My work starts with one question: what would this product look like if it were lit by a single, deliberate source?",
    "That question has taken me from brand systems to shader-driven websites. I care about type that behaves, motion that means something, and pages that stay fast while doing too much.",
    "Off the clock I photograph portraits in hard light — the same obsession that fuels this site.",
  ],
  timeline: [
    {
      period: "2024 — now",
      role: "Independent creative developer",
      org: "Worldwide, remote",
    },
    {
      period: "2022 — 2024",
      role: "Senior product designer",
      org: "Studio placeholder",
    },
    {
      period: "2020 — 2022",
      role: "Front-end developer",
      org: "Agency placeholder",
    },
    {
      period: "2019 — 2020",
      role: "Design intern",
      org: "Somewhere with good lamps",
    },
  ],
};

/* ---------------------------------------------------------------------------
   LAB — motion experiments shown on /lab
   --------------------------------------------------------------------------- */

export const labExperiments = [
  {
    slug: "particle-portrait",
    kind: "particles",
    title: "Particle portrait",
    blurb: "The hero photo dissolving into cursor-reactive green dust.",
  },
  {
    slug: "holo-tilt",
    kind: "tilt",
    title: "Holo tilt",
    blurb: "A card with an iridescent foil surface that tilts in 3D.",
  },
  {
    slug: "light-orb",
    kind: "orb",
    title: "Light orb",
    blurb: "A shader orb breathing green caustics. Drag to disturb.",
  },
  {
    slug: "type-scramble",
    kind: "scramble",
    title: "Type scramble",
    blurb: "Letters decoding out of noise, masked like the hero.",
  },
] as const;

/* ---------------------------------------------------------------------------
   NAV — command palette + header
   --------------------------------------------------------------------------- */

export const nav = [
  { label: "Index", href: "/" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Lab", href: "/lab" },
  { label: "Contact", href: "/contact" },
];
