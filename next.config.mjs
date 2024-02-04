import withBundleAnalyzer from "@next/bundle-analyzer";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
    productionBrowserSourceMaps: false,
    reactStrictMode: false,
    output: "standalone",
    webpack(config, { dev, isServer }) {
        if (dev && !isServer) {
            const originalEntry = config.entry;
            config.entry = async () => {
                const wdrPath = path.resolve(__dirname, "./src/Common/wdyr.ts");
                const entries = await originalEntry();

                if (entries["main.js"] && !entries["main.js"].includes(wdrPath)) {
                    entries["main.js"].push(wdrPath);
                }
                return entries;
            };
        }

        return config;
    },
};

// module.exports = nextConfig
export default withBundleAnalyzer({
    enabled: process.env.ANALYZE === "true",
})(nextConfig);
