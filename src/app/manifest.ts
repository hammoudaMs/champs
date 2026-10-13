import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Café Champ's",
    short_name: "Champ's",
    description: "Self-service menu Café Champ's",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF8F3",
    theme_color: "#2F3B2A",
    lang: "fr",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
