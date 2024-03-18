import { cloneDeep } from "lodash";
import { create } from "zustand";
// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-imports
import { createJSONStorage, persist } from "zustand/middleware";

import { Conversation, ConversationEntityStore, ConversationStore, ConvInfo, Message } from "@/types/chatMessageType";

const useConversationStore = create<ConversationStore>()(
    // persist(
    // devtools(
    (set, get) => ({
        id: undefined,
        title: undefined,
        conversation: [],
        addMessage: (message: Message) => set(state => ({ conversation: [...state.conversation, message] })),
        setCurrentConversation: (id: string | undefined, conversation: Conversation, title?: string) =>
            set(() => {
                return { id, conversation, title: title || undefined };
            }),
        getCurrentConversation: () => ({ id: get().id, conversation: get().conversation, title: get().title }),
        getCurrentConversationInfo: () => {
            const convo = get().conversation;
            return convo.map(
                (item): ConvInfo => ({
                    id: item.id,
                    role: item.role,
                }),
            );
        },
        getMessageByIdx: (idx: number) => get().conversation[idx],
        setTitle: (title: string) => set({ title }),
        clearConversation: () =>
            set({
                id: undefined,
                title: undefined,
                conversation: [],
            }),
        appendToLastMessage: (message: Message) =>
            set(state => {
                const newMessage: Message = {
                    role: message.role,
                    content: state.conversation[state.conversation.length - 1].content + message.content,
                };
                const newState = {
                    conversation: [...state.conversation.slice(0, state.conversation.length - 1), newMessage],
                };
                return newState;
            }),
        replaceLastMessage: (message: Message) =>
            set(state => {
                const newState = {
                    conversation: [...state.conversation.slice(0, state.conversation.length - 1), message],
                };
                return newState;
            }),
        removeLastMessage: () =>
            set(state => {
                const newState = {
                    conversation: [...state.conversation.slice(0, state.conversation.length - 1)],
                };
                return newState;
            }),
    }),

    // )

    //     {
    //         storage: createJSONStorage(() => localStorage),
    //         name: "chat-convo",
    //     }
    // )
);

const useConversationEntityStore = create<ConversationEntityStore>()(
    persist(
        // devtools(
        (set, get) => ({
            conversationMap: {},
            createConversation: (id: string, conversation: Conversation, title?: string) =>
                set(state => {
                    const newState = cloneDeep(state);
                    newState.conversationMap[id] = {
                        id: id,
                        title: title || "Untitled",
                        conversation: conversation,
                        createdAt: new Date(),
                    };
                    return newState;
                }),
            setConversation: (id: string, conversation: Conversation, title?: string) =>
                set(state => {
                    // const currentConversation = state.conversationMap[id];
                    // const newState = {
                    //     ...state,
                    //     [id]: {
                    //         ...currentConversation,
                    //         conversation: conversation,
                    //     },
                    // };
                    // return newState;
                    const newState = cloneDeep(state);
                    if (newState.conversationMap[id]) {
                        newState.conversationMap[id].conversation = conversation;
                        if (title) {
                            newState.conversationMap[id].title = title;
                        }
                    }

                    return newState;
                }),
            getConversation: (id: string) => {
                return get().conversationMap[id]?.conversation || null;
            },
            removeConversation: (id: string) =>
                set(state => {
                    const newState = cloneDeep(state);
                    delete newState.conversationMap[id];
                    return newState;
                }),
        }),

        // )

        {
            storage: createJSONStorage(() => localStorage),
            name: "chat-entity",
        },
    ),
);

export { useConversationEntityStore, useConversationStore };
