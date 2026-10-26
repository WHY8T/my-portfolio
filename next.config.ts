import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve the portrait as AVIF/WebP automatically
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
