import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { join } from "path";

const assistantFolderPath = join(process.cwd(), "public/assistant");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.url === "/api/assistant/ai-plugin.json") {
        const jsonPath = join(assistantFolderPath, "ai-plugin.json");
        const aiPluginJson = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

        const baseUrl = `${req.headers["x-forwarded-proto"]}://${req.headers.host}`;
        aiPluginJson.logo_url = `${baseUrl}/api/assistant/icon.png`;
        aiPluginJson.api.url = `${baseUrl}/api/assistant/openapi.json`;

        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(aiPluginJson));
    } else if (req.url === "/api/assistant/icon.png") {
        const iconPath = join(assistantFolderPath, "icon.png");
        const icon = fs.readFileSync(iconPath);
        res.setHeader("Content-Type", "image/png");
        res.end(icon);
    } else if (req.url === "/api/assistant/openapi.json") {
        const jsonPath = join(assistantFolderPath, "openapi.json");
        const openapiJSON = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(openapiJSON));
    }
}
