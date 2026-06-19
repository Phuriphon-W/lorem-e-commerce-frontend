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
  async headers() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_SERVER_ADDRESS || "http://localhost:5000";
    const wsBackendUrl = backendUrl.replace(/^http/, "ws");
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ""};
      style-src 'self' 'unsafe-inline';
      img-src 'self' https://lorem-e-commerce-575490177692-ap-southeast-1-an.s3.ap-southeast-1.amazonaws.com https://placehold.co data:;
      connect-src 'self' ${backendUrl} ${wsBackendUrl} ws: wss:;
      font-src 'self';
      frame-ancestors 'none';
    `.replace(/\s{2,}/g, ' ').trim();

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: cspHeader,
          },
        ],
      },
    ];
  },
};

const config = process.env.ANALYZE === "true"
  ? withBundleAnalyzer({ enabled: true })(nextConfig)
  : nextConfig;

export default config;
