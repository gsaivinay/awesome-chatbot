import { type MutableRefObject, useCallback, useEffect, useRef } from "react";

import { useConversationStore } from "@/store/chatStore";
import { useGenerationSettings } from "@/store/globalStore";
import { useChatResponseStatus } from "@/store/globalStore";
import { useApiKey } from "@/store/globalStore";
import type { GenerationSettings } from "@/types/types";
import type { ApiKeyType } from "@/types/types";
import {
    type ActiveConversation,
    type ChatResponseStatus,
    type Message,
    SourceTypes,
    type UseChatOptions,
} from "@/types/types";
import { createChunkDecoder, nanoid } from "@/utils/streams/utils";
export type { UseChatOptions };

export type UseChatHelpers = {
    append: (message: Message) => Promise<void>;
    /**
     * Reload the last AI chat response for the given chat history. If the last
     * message isn't from the assistant, it will request the API to generate a
     * new response.
     */
    reload: () => Promise<string | null | undefined>;

    complete: () => Promise<string | null | undefined>;
    /**
     * Abort the current request immediately, keep the generated tokens if any.
     */
    stop: () => void;

    abortControllerRef: MutableRefObject<AbortController | null>;

    streamResponse: (messagesSnapshotArg?: Message[], continueGeneration?: boolean) => Promise<string | null>;
};

export function useChatCustom({
    api = "/api/chat",
    sendExtraMessageFields,
    onResponse,
    onFinish,
    onIncomplete,
    onError,
    headers,
    body,
}: UseChatOptions = {}): UseChatHelpers {
    const [getConversation, addMessage, replaceLastMessage, removeLastMessage] = useConversationStore(
        (state: ActiveConversation) => [
            state.getActiveChat,
            state.addMessage,
            state.replaceLastMessage,
            state.removeLastMessage,
        ],
    );
    const [inProgress] = useChatResponseStatus((state: ChatResponseStatus) => [state.inProgress]);
    const settings = useGenerationSettings((state: GenerationSettings) => state);
    const [apiKey] = useApiKey((state: ApiKeyType) => [state.apiKey]);

    const abortControllerRef = useRef<AbortController | null>(null);

    const extraMetadataRef = useRef<{
        headers: Record<string, string> | Headers | undefined;
        body: object | undefined;
    }>({
        headers,
        body,
    });
    useEffect(() => {
        extraMetadataRef.current = {
            headers,
            body,
        };
    }, [headers, body]);

    const streamResponse = useCallback(
        async (messagesSnapshotArg?: Message[], continueGeneration?: boolean) => {
            const abortController = new AbortController();
            abortControllerRef.current = abortController;

            try {
                const messagesSnapshot = messagesSnapshotArg || getConversation().conversation;

                const res = await fetch(api, {
                    method: "POST",
                    body: JSON.stringify({
                        messages: sendExtraMessageFields
                            ? messagesSnapshot
                            : messagesSnapshot.map(({ role, content }: { role: string; content: string }) => ({
                                  role,
                                  content,
                              })),
                        ...extraMetadataRef.current.body,
                        ...settings,
                        apiKey,
                        continueGeneration: continueGeneration,
                    }),
                    headers: extraMetadataRef.current.headers || {},
                    signal: abortController.signal,
                }).catch((err) => {
                    throw err;
                });

                if (onResponse) {
                    await onResponse(res);
                }

                if (!res.ok) {
                    throw new Error((await res.text()) || "Failed to fetch the chat response.");
                }

                if (!res.body) {
                    throw new Error("The response body is empty.");
                }

                let result = "";
                const createdAt = new Date();
                const replyId = nanoid();
                const reader = res.body.getReader();
                const decode = createChunkDecoder();

                if (!continueGeneration) {
                    addMessage({
                        id: replyId,
                        createdAt,
                        content: result,
                        role: SourceTypes.BOT,
                    });
                } else {
                    result += `${messagesSnapshot[messagesSnapshot.length - 1].content}`;
                }

                // eslint-disable-next-line no-constant-condition
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        break;
                    }
                    let valueDecoded = decode(value);
                    if (valueDecoded.endsWith("<|im_not_finished|>")) {
                        valueDecoded = valueDecoded.replace("<|im_not_finished|>", "").trimEnd();
                        if (onIncomplete) {
                            onIncomplete();
                        }
                        stop();
                    }
                    result += valueDecoded;
                    replaceLastMessage({
                        id: replyId,
                        createdAt,
                        content: result,
                        role: SourceTypes.BOT,
                    });
                    if (abortControllerRef.current === null) {
                        reader.cancel();
                    }
                }

                abortControllerRef.current = null;
                return result;
            } catch (err: unknown) {
                console.trace(err);
                abortControllerRef.current = null;
                if (err instanceof AbortSignal) {
                    return null;
                }

                if (onError && err instanceof Error) {
                    onError(err);
                }

                throw err;
            } finally {
                if (onFinish) {
                    onFinish();
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [getConversation, abortControllerRef, settings, apiKey],
    );

    const append = async (message: Message) => {
        if (!message.id) {
            message.id = nanoid();
        }
        addMessage(message);
        streamResponse(getConversation().conversation);
    };

    const reload = useCallback(async () => {
        const currentConversation = getConversation().conversation;
        if (currentConversation.length === 0) return null;
        const lastMessage = currentConversation[currentConversation.length - 1];
        if (lastMessage.role === SourceTypes.BOT) {
            removeLastMessage();
        }
        streamResponse(getConversation().conversation);
    }, [getConversation, removeLastMessage, streamResponse]);

    const complete = useCallback(async () => {
        const currentConversation = getConversation().conversation;
        if (currentConversation.length === 0) return null;
        const lastMessage = currentConversation[currentConversation.length - 1];
        if (lastMessage.role === SourceTypes.BOT) {
            streamResponse(currentConversation, true);
            return;
        }
    }, [getConversation, streamResponse]);

    const stop = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (!inProgress) {
            stop();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inProgress]);

    return {
        append,
        reload,
        complete,
        stop,
        abortControllerRef,
        streamResponse,
    };
}
