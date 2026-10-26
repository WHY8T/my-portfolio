import type { MetadataRoute } from "next";
import { site } from "@/content/config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name.full} — ${site.role}`,
    short_name: site.name.first,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#020d05",
    theme_color: "#020d05",
    icons: [
      { src: "/assets/portfolio-logo.png", sizes: "any", type: "image/png" },
    ],
  };
}
