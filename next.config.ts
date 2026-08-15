import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // The app is intentionally exportable so the same Next.js source can become
  // the GitHub Pages artifact. `docs/` remains untouched as a rollback until
  // the workflow-backed site has been verified live.
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
