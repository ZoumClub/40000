/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { 
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.car-logos.org',
      },
      {
        protocol: 'https',
        hostname: 'igbpxesaulnzqaiqdjol.supabase.co',
      },
    ],
  },
  // Add build cache configuration
  experimental: {
    turbotrace: {
      logLevel: 'error',
    },
    // Enable build cache
    incrementalCacheHandlerPath: require.resolve('./cache-handler.js'),
  },
  // Ensure trailing slashes for static export
  trailingSlash: true,
  // Add env configuration
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://igbpxesaulnzqaiqdjol.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlnYnB4ZXNhdWxuenFhaXFkam9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyOTEyMzYsImV4cCI6MjA0OTg2NzIzNn0.G6NsqYzhAgn6EurprNJhYgUGbec6U3GCxKA1UBMcqJo',
  },
};

module.exports = nextConfig;