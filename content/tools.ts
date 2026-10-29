/* ✏️ YOUR TOOLKIT — edit this one file and the whole section updates.

   • category  → must match an `id` in toolCategories below
   • short     → 2–3 letters shown on the app-style icon (used when there is no logo)
   • use       → one short line: what you use it for
   • level     → 1–5 dots   5 = daily driver · 4 = confident · 3 = comfortable · 2 = learning
   • featured  → true makes the tile wider (shown in the "All" view only). Keep it to ~4.
   • logo      → OPTIONAL. Drop a transparent PNG/SVG in /public/tools/ and write its path,
                 e.g. logo: "/tools/figma.svg". Logos are shown as clean white silhouettes
                 (add keepColor: true to keep the original colours).
                 No logo? The tile shows the monogram — it looks great either way.

   Remove anything you don't use, add anything you do. */

export type ToolCategory = { id: string; label: string };

export type Tool = {
  name: string;
  short: string;
  category: string;
  use: string;
  level: 1 | 2 | 3 | 4 | 5;
  featured?: boolean;
  logo?: string;
  keepColor?: boolean;
};

export const toolCategories: ToolCategory[] = [
  { id: "design", label: "Design" },
  { id: "ux", label: "UX & Research" },
  { id: "motion", label: "Motion & Video" },
  { id: "3d", label: "3D" },
  { id: "code", label: "Code & Handoff" },
  { id: "ai", label: "AI" },
];

export const tools: Tool[] = [
  /* ---- Design ------------------------------------------------------------- */
  { name: "Figma", short: "Fg", category: "design", use: "Interfaces, design systems & prototypes", level: 5, featured: true },
  { name: "Photoshop", short: "Ps", category: "design", use: "Retouching, composites & key visuals", level: 5, featured: true },
  { name: "Illustrator", short: "Ai", category: "design", use: "Logos, icons & vector systems", level: 5 },
  { name: "InDesign", short: "Id", category: "design", use: "Editorial & print layouts", level: 4 },
  { name: "Lightroom", short: "Lr", category: "design", use: "Photo grading & batch edits", level: 4 },
  { name: "Canva", short: "Cv", category: "design", use: "Fast social kits & templates", level: 4 },

  /* ---- UX & Research ------------------------------------------------------ */
  { name: "FigJam", short: "Fj", category: "ux", use: "Workshops, user flows & journey maps", level: 5 },
  { name: "Miro", short: "Mi", category: "ux", use: "Research boards & affinity mapping", level: 4 },
  { name: "Notion", short: "No", category: "ux", use: "Specs, docs & project tracking", level: 5 },
  { name: "Maze", short: "Mz", category: "ux", use: "Usability tests & quick validation", level: 3 },
  { name: "Framer", short: "Fr", category: "ux", use: "Interactive sites & high-fidelity prototypes", level: 4 },

  /* ---- Motion & Video ----------------------------------------------------- */
  { name: "After Effects", short: "Ae", category: "motion", use: "Motion graphics & UI animation", level: 4, featured: true },
  { name: "Premiere Pro", short: "Pr", category: "motion", use: "Video editing & storytelling", level: 4 },
  { name: "DaVinci Resolve", short: "Dr", category: "motion", use: "Colour grading", level: 3 },
  { name: "CapCut", short: "Cc", category: "motion", use: "Quick social edits", level: 4 },

  /* ---- 3D ----------------------------------------------------------------- */
  { name: "Blender", short: "Bl", category: "3d", use: "3D scenes & product renders", level: 3 },
  { name: "Spline", short: "Sp", category: "3d", use: "Interactive 3D for the web", level: 3 },

  /* ---- Code & Handoff ----------------------------------------------------- */
  { name: "Next.js", short: "Nx", category: "code", use: "This portfolio, and real products", level: 4, featured: true },
  { name: "React", short: "Re", category: "code", use: "Component-driven interfaces", level: 4 },
  { name: "Tailwind CSS", short: "Tw", category: "code", use: "Design tokens straight into code", level: 5 },
  { name: "GSAP", short: "Gs", category: "code", use: "Scroll, reveal & motion in the browser", level: 4 },
  { name: "VS Code", short: "Vs", category: "code", use: "Daily code editor", level: 4 },
  { name: "GitHub", short: "Gh", category: "code", use: "Version control & shipping", level: 4 },

  /* ---- AI ----------------------------------------------------------------- */
  { name: "Claude", short: "Cl", category: "ai", use: "Coding partner, copy & research", level: 5 },
  { name: "ChatGPT", short: "Gp", category: "ai", use: "Brainstorming & content drafts", level: 4 },
  { name: "Midjourney", short: "Mj", category: "ai", use: "Concept art & mood imagery", level: 3 },
];
