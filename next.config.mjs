/** @type {import('next').NextConfig} */
const isVercel = process.env.VERCEL === "1"
const isProd = process.env.NODE_ENV === "production"

const nextConfig = {
  reactStrictMode: true,

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },

  // Static export + basePath only for GitHub Pages, not Vercel
  ...(isVercel
    ? {}
    : {
        output: "export",
        basePath: isProd ? "/quizApp" : "",
        trailingSlash: isProd,
      }),
}

export default nextConfig