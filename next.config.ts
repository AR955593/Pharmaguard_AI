import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export', // Disabled for Render deployment. Re-enable for mobile builds.
  // output: process.env.NEXT_PUBLIC_BUILD_MOBILE === 'true' ? 'export' : undefined,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
