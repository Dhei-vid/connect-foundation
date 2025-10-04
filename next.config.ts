import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizePackageImports: ["@mui/icons-material"],
  },
  images: {
    remotePatterns: [
      "fra1.digitaloceanspaces.com",
      "encrypted-tbn0.gstatic.com",
      "flowbite.s3.amazonaws.com",
      "encrypted-tbn0.gstatic.com",
      "destinyimpactchurch.org",
      "via.placeholder.com",
      "images.unsplash.com",
      "plus.unsplash.com",
      "images.pexels.com",
      "sowdinitiative.org",
      "abroadship.org",
    ].map((hostname) => ({
      protocol: "https",
      hostname,
      port: "",
    })),
  },
};

export default nextConfig;
