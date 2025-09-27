import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizePackageImports: ["@mui/icons-material"],
  },
  images: {
    remotePatterns: [
      "fra1.digitaloceanspaces.com",
      "flowbite.s3.amazonaws.com",
      "destinyimpactchurch.org",
      "via.placeholder.com",
      "images.unsplash.com",
      "plus.unsplash.com",
      "images.pexels.com",
      "abroadship.org",
    ].map((hostname) => ({
      protocol: "https",
      hostname,
      port: "",
    })),
  },
};

export default nextConfig;
