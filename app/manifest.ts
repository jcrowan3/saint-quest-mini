import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Saint Quest - Journey to Sainthood",
    short_name: "Saint Quest",
    description:
      "Walk with the saints, answer challenges, and grow in virtue offline.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#fffbeb",
    theme_color: "#f59e0b",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
