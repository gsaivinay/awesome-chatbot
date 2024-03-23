import type { ServerResponse } from "node:http";

/**
 * A utility class for streaming text responses.
 */
export class StreamingTextResponse extends Response {
    constructor(res: ReadableStream, init?: ResponseInit) {
        super(res as ReadableStream, {
            ...init,
            status: 200,
            headers: {
                "Content-Type": "text/event-stream; charset=utf-8",
                ...init?.headers,
            },
        });
    }
}

/**
 * A utility function to stream a ReadableStream to a Node.js response-like object.
 */
export function streamToResponse(
    res: ReadableStream,
    response: ServerResponse,
    init?: { headers?: Record<string, string>; status?: number },
) {
    response.writeHead(init?.status || 200, {
        "Content-Type": "text/event-stream; charset=utf-8",
        ...init?.headers,
    });
    response.on("close", () => {
        console.log("disconnected");
        response.end();
    });

    const reader = res.getReader();
    function read() {
        reader.read().then(({ done, value }: { done: boolean; value?: unknown }) => {
            if (done) {
                response.end();
                return;
            }
            response.write(value);
            read();
        });
    }
    read();
}
