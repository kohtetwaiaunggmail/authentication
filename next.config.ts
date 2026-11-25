import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This app lives in a larger learning workspace with its own lockfile.
  // Keep Turbopack rooted here so it does not infer the parent directory.
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
