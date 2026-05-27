import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false,
      },
    ];
  },
  images: {
    domains: ['res.cloudinary.com'], // ✅ Add Cloudinary domain here
  },
};

export default nextConfig;
