import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: {
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
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**"
      },
    ],
  },
};

const config = process.env.ANALYZE === "true"
  ? withBundleAnalyzer({ enabled: true })(nextConfig)
  : nextConfig;

export default config;
