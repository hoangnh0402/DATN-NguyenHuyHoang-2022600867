/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use standalone for development, export for production
  output: process.env.NODE_ENV === 'production' ? 'export' : 'standalone',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

  // Trailing slash for static hosting
  trailingSlash: true,

  // Enable SWC minification for smaller bundles
  swcMinify: true,

  // Compiler optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  // Optimize for modern browsers (reduce polyfills)
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'date-fns'],
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },

  // Webpack configuration
  webpack: (config) => {
    config.externals = [...(config.externals || []), 'canvas', 'jsdom'];
    return config;
  },
};

export default nextConfig;

