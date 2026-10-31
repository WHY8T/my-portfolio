/* ✏️ YOUR TOOLKIT — edit this one file and the section updates.

   • category  → must match an `id` in toolCategories below
   • short     → 2–3 letters, used only if a tool has no icon in components/tools/icons.ts
   • use       → one short line shown when someone hovers the tool
   • logo      → OPTIONAL. Drop a transparent PNG/SVG in /public/tools/ and write its path,
                 e.g. logo: "/tools/weavy.svg". Your file always wins over the built-in icon.

   Add a tool = copy a line. Remove a tool = delete its line. A group with no tools hides itself. */

export type ToolCategory = { id: string; label: string };

export type Tool = {
  name: string;
  short: string;
  category: string;
  use: string;
  level?: 1 | 2 | 3 | 4 | 5; // not shown any more — kept so old entries still work
  featured?: boolean; //        not used any more
  logo?: string;
  keepColor?: boolean;
};

export const toolCategories: ToolCategory[] = [
  { id: "design", label: "Design" },
  { id: "ai", label: "AI" },
];

export const tools: Tool[] = [
  /* ---- Design ------------------------------------------------------------- */
  { name: "Photoshop", short: "Ps", category: "design", use: "Retouching, composites & key visuals" },
  { name: "Illustrator", short: "Ai", category: "design", use: "Logos, icons & vector systems" },

  /* ---- AI ----------------------------------------------------------------- */
  { name: "Weavy", short: "Wv", category: "ai", use: "Node-based AI workflows for images & video" },
  { name: "Nano Banana", short: "Nb", category: "ai", use: "AI image generation & precise edits" },
  { name: "Claude", short: "Cl", category: "ai", use: "Coding partner, copy & research" },
];
