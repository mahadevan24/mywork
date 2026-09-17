/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["firebase", "@grpc/grpc-js"],
  },
};

export default nextConfig;
