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
  }),
};

module.exports = nextConfig;
