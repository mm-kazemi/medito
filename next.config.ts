import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* --- Strict Mode --- */
  reactStrictMode: true,

  /* --- Image Optimization --- */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.example.com", // TODO: Replace with actual image CDN
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  /* --- Headers — Security & Performance --- */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
