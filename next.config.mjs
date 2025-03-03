/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['metaschool.so', 'illustrations.popsy.co'],
  },
}

export default nextConfig;