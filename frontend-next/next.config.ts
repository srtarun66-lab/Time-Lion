import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // some versions of Next.js expect this under experimental, others top-level,
    // let's just add it top-level since the error message said top-level.
  },
  // @ts-ignore
  allowedDevOrigins: ['10.72.127.120'],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:5000/api/:path*'
      },
      {
        source: '/uploads/:path*',
        destination: 'http://127.0.0.1:5000/uploads/:path*'
      }
    ];
  },
};

export default nextConfig;
