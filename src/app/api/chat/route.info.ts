import { z } from "zod";

export const Route = {
    name: "ApiChat",
    params: z.object({}),
};

export const POST = {
    body: z.object({}),
    result: z.object({}),
};
