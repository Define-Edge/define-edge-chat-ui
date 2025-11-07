/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  webpack: (config, { isServer }) => {
    // Fix for canvas issue in browser
    if (!isServer) {
      config.resolve.alias.canvas = false;
    }

    return config;
  },
};

export default nextConfig;
