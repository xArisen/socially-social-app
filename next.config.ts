import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  // TODO: IMPORTANT! - Revisit Suspense strategy once the `use cache` (PPR) story is clear.
  cacheComponents: true,
};

export default withBundleAnalyzer(nextConfig);
