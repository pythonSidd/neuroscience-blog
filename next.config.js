/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static generation and streaming for Amplify
  reactStrictMode: true,
  swcMinify: true,
  
  // Image optimization for serverless
  images: {
    unoptimized: true, // Recommended for serverless deployments
  },
  
  // Optimize for production builds
  compress: true,
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;
