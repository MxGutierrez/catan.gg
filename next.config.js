/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Only the generator ships. pages/og-image.tsx is a drawing board for
  // public/og.png, so it stays out of the exported site.
  exportPathMap: async () => ({
    "/": { page: "/" },
    "/catan-dice-odds": { page: "/catan-dice-odds" },
    "/catan-setup-rules": { page: "/catan-setup-rules" },
    "/catan-5-6-player-expansion": { page: "/catan-5-6-player-expansion" },
  }),
};

module.exports = nextConfig;
