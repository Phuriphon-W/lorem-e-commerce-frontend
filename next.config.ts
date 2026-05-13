import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8333",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lorem-e-commerce-575490177692-ap-southeast-1-an.s3.ap-southeast-1.amazonaws.com",
        port: "",
        pathname: "/static/**"
      },
      {
        protocol: "https",
        hostname: "lorem-e-commerce-575490177692-ap-southeast-1-an.s3.ap-southeast-1.amazonaws.com",
        port: "",
        pathname: "/product-images/**"
      },
    ],
  },
};

export default nextConfig;
