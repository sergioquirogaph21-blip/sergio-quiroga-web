import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sergio Quiroga Fotografía — Panel",
    short_name: "SQ Fotografía",
    description: "Panel de administración de galerías — Sergio Quiroga Fotografía.",
    start_url: "/admin",
    scope: "/",
    display: "standalone",
    background_color: "#16150f",
    theme_color: "#16150f",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
