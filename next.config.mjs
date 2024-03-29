import withBundleAnalyzer from "@next/bundle-analyzer";

/** @type {import('next').NextConfig} */
const nextConfig = {
    productionBrowserSourceMaps: false,
    reactStrictMode: true,
    // output: "standalone",
};

// module.exports = nextConfig
export default withBundleAnalyzer({
    enabled: process.env.ANALYZE === "true",
})(nextConfig);
