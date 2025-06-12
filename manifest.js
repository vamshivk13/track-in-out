export default function manifest() {
  return {
    name: "Track It",
    short_name: "TrackIt",
    description: "A Progressive Web App built with Next.js",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/vk.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: "/vk.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
    ],
  };
}
