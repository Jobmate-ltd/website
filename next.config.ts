import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'avatar.vercel.sh' },
    ],
  },
  // The gated toolkit PDF lives in /private (never under /public), so it is only
  // reachable through the signed download route. Ship it with that route's lambda.
  outputFileTracingIncludes: {
    '/api/toolkit/download': ['./private/**'],
  },
};

export default nextConfig;
