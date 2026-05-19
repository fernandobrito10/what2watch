import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@libsql/client"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.ltrbxd.com" },
      { protocol: "https", hostname: "**.letterboxd.com" },
    ],
  },
};

export default nextConfig;
