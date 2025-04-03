import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["www.themoviedb.org", "logodownload.org", "m.media-amazon.com", "storage.googleapis.com", "logosmarcas.net", "www.google.com", 
      "www.cnnbrasil.com.br", "media.themoviedb.org", "image.tmdb.org"
    ],
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
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.cnnbrasil.com.br",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.themoviedb.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
