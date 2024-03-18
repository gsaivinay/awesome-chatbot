import { MutableRefObject, useCallback, useEffect, useRef } from "react";

import { useChatResponseStatus, useGenerationSettings } from "@/store/ChatSettings";
import { useConversationStore } from "@/store/ChatStore";
import { useApiKey } from "@/store/GlobalStore";
import {
    ChatResponseStatus,
    ConversationStore,
    type Message,
    SourceTypes,
    type UseChatOptions,
} from "@/types/chatMessageType";
import { GenerationSettings } from "@/types/generationSettings";
import { ApiKeyType } from "@/types/globalTypes";
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
        (state: ConversationStore) => [
            state.getCurrentConversation,
            state.addMessage,
            state.replaceLastMessage,
            state.removeLastMessage,
        ],
    );
    const [inProgress] = useChatResponseStatus((state: ChatResponseStatus) => [state.inProgress]);
    const settings = useGenerationSettings((state: GenerationSettings) => state);
    const [apiKey] = useApiKey((state: ApiKeyType) => [state.apiKey]);

    // Generate an unique id for the chat if not provided.
    // const hookId = useId();
    // const chatId = id || hookId;

    // Store the chat state in SWR, using the chatId as the key to share states.
    // const { data, mutate } = useSWR<Message[]>([api, chatId], null, {
    //     fallbackData: initialMessages,
    // });
    // const messages = data!;

    // Keep the latest messages in a ref.
    // const messagesRef = useRef<Message[]>(conversation);
    // useEffect(() => {
    //     messagesRef.current = messages;
    // }, [messages]);

    // Abort controller to cancel the current API call.
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
                // Do an optimistic update to the chat state to show the updated messages
                // immediately.
                // const previousMessages = messagesRef.current;
                const messagesSnapshot = messagesSnapshotArg || getConversation().conversation;
                // eslint-disable-next-line no-debugger
                // debugger;

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
                }).catch(err => {
                    // Restore the previous messages if the request fails.
                    // mutate(previousMessages, false);
                    throw err;
                });

                if (onResponse) {
                    // eslint-disable-next-line no-useless-catch
                    try {
                        await onResponse(res);
                    } catch (err) {
                        throw err;
                    }
                }

                if (!res.ok) {
                    // Restore the previous messages if the request fails.
                    // mutate(previousMessages, false);
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
                    // console.log(done, value);
                    if (done) {
                        // console.log("done");
                        // console.log(abortControllerRef.current);
                        break;
                    }
                    // Update the chat state with the new message tokens.
                    let valueDecoded = decode(value);
                    if (valueDecoded.endsWith("<|im_not_finished|>")) {
                        valueDecoded = valueDecoded.replace("<|im_not_finished|>", "").trimEnd();
                        // console.log("im_not_finished");
                        // setIsUnfinished?.(true);
                        if (onIncomplete) {
                            onIncomplete();
                        }
                        // break;
                        stop();
                    }
                    result += valueDecoded;
                    // console.log(valueDecoded);
                    replaceLastMessage({
                        id: replyId,
                        createdAt,
                        content: result,
                        role: SourceTypes.BOT,
                    });
                    // console.log(abortControllerRef.current);
                    // debugger;
                    // The request has been aborted, stop reading the stream.
                    if (abortControllerRef.current === null) {
                        // console.log(abortControllerRef.current === null);
                        // console.log("aborted");
                        reader.cancel();
                        // break;
                    }
                    // stop();
                }

                abortControllerRef.current = null;
                return result;
            } catch (err: unknown) {
                console.trace(err);
                abortControllerRef.current = null;
                // Ignore abort errors as they are expected.
                if (err instanceof AbortSignal) {
                    return null;
                }

                if (onError && err instanceof Error) {
                    onError(err);
                }

                throw err;
            } finally {
                if (onFinish) {
                    // onFinish({
                    //     id: replyId,
                    //     createdAt,
                    //     content: result,
                    //     role: SourceTypes.BOT,
                    // });
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
            // const convo = currentConversation.slice(0, conversation.length - 1);
            removeLastMessage();
            // streamResponse(convo);
            // return;
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
        // console.log("stopping");
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
            // console.log("stopped");
        }
    }, []);

    useEffect(() => {
        if (!inProgress) {
            stop();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inProgress]);

    // useEffect(() => {
    //     if (conversation.length > 0 && conversation[conversation.length - 1].role === SourceTypes.USER) {
    //         streamResponse(conversation);
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [conversation.length]);

    return {
        append,
        reload,
        complete,
        stop,
        abortControllerRef,
        streamResponse,
    };
}
