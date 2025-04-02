import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["www.themoviedb.org", "logodownload.org", "m.media-amazon.com", "storage.googleapis.com", "logosmarcas.net"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.themoviedb.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "logodownload.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "logosmarcas.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
