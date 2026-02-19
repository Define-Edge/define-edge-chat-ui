// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   output: "standalone",
//   experimental: {
//     serverActions: {
//       bodySizeLimit: "10mb",
//     },
//   },
//   webpack: (config, { isServer }) => {
//     // Fix for canvas issue in browser
//     if (!isServer) {
//       config.resolve.alias.canvas = false;
//     }

//     return config;
//   },
//   // Prevent Next.js from bundling these packages (they contain native binaries)
//   serverExternalPackages: ["@sparticuz/chromium-min", "puppeteer-core"],
// };

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias.canvas = false;
    }
    return config;
  },
  serverExternalPackages: ["@sparticuz/chromium-min", "puppeteer-core"],

  async rewrites() {
    return [
      {
        source: "/auth/:path*", // any /auth request locally
        destination: "https://signin.definedgebroking.com/auth/:path*", // forward to Keycloak
      },
    ];
  },
};

export default nextConfig;
