import { customAlphabet } from "nanoid";

// 7-character random string
export const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 7);

export function createChunkDecoder() {
    const decoder = new TextDecoder();
    return (chunk: Uint8Array): string => decoder.decode(chunk, { stream: true });
}
