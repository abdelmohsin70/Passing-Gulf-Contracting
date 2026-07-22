import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },
  images: {
    localPatterns: [
      { pathname: "/api/media/file/**" },
      { pathname: "/images/**" },
    ],
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
