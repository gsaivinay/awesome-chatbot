import { z } from "zod";

export const Route = {
    name: "ChatId",
    params: z.object({
        id: z.string(),
    }),
};
