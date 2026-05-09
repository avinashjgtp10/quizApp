/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },

  turbopack: {
    root: import.meta.dirname,
  },

  output: "standalone",
}

export default nextConfig