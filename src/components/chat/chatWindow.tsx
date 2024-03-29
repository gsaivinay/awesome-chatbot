"use client";
import { useRouter } from "next/navigation";
import { type Key, useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

import ChatHistory from "@/components/chat/chatHistory";
import InputContainer from "@/components/inputContainer";
import { useConversationEntityStore, useConversationStore } from "@/store/chatStore";
import type { ActiveConversation, ConversationEntityStore } from "@/types/types";

export default function ChatWindow({ conversationId }: { conversationId: Key }) {
    const conversationIdString = conversationId as string;
    const router = useRouter();
    const [getConversationById, currentConversationTitle] = useConversationEntityStore(
        (state: ConversationEntityStore) => [
            state.getConversation,
            state.conversationMap[conversationIdString]?.title || "",
        ],
    );
    const [updateActiveConversation, getActiveConversationMessages] = useConversationStore(
        (state: ActiveConversation) => [state.setActiveChat, state.getActiveMetadata],
    );
    const activeConversationMessages = getActiveConversationMessages();
    const [localConversationMessages, setLocalConversationMessages] = useState<typeof activeConversationMessages>([]);

    useEffect(() => {
        const conversation = getConversationById(conversationIdString);
        if (!conversation) {
            router.push("/");
        } else {
            updateActiveConversation(conversationIdString, conversation, currentConversationTitle);
            document.title = currentConversationTitle;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversationIdString, currentConversationTitle, getConversationById, router, updateActiveConversation]);

    useEffect(() => {
        setLocalConversationMessages(activeConversationMessages);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeConversationMessages.length, conversationIdString]);

    return (
        <div className="transition-width relative flex size-full flex-1 grow flex-col items-stretch overflow-hidden">
            <div className="flex-1 overflow-hidden">
                <ScrollToBottom
                    key={conversationId}
                    className="size-full overflow-y-auto"
                    initialScrollBehavior="auto"
                    followButtonClassName="scroll-bottom-button"
                >
                    <ChatHistory key={conversationId} id={conversationIdString} convInfo={localConversationMessages} />
                </ScrollToBottom>
            </div>
            <InputContainer />
        </div>
    );
}
