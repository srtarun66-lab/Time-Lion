import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore
  allowedDevOrigins: ['10.72.127.120'],

  // Image optimization — accept remote images from Firebase Storage and Unsplash
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
    // Enable lazy loading and blur placeholders for better performance
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compression
  compress: true,

  // Power profile
  poweredByHeader: false,

  // API rewrites — proxied to backend if running
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000'}/api/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000'}/uploads/:path*`,
      },
    ];
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
        ],
      },
      {
        // Cache static assets aggressively
        source: '/(.*)\\.(jpg|jpeg|png|webp|avif|svg|ico|gif)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default nextConfig;
