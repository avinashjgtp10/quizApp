/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production"

const nextConfig = {
  reactStrictMode: true,

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },

  output: "export",
  basePath: isProd ? "/quizApp" : "",
  trailingSlash: isProd,
}

export default nextConfig