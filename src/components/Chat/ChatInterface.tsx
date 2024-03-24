"use client";

import { useRouter } from "next/navigation";
import { Key, memo, useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

import ConversationList from "@/components/Chat/Conversations/Conversation";
import { InputContainer } from "@/components/Chat/Inputs";
import { useConversationEntityStore, useConversationStore } from "@/store/ChatStore";
import { ConversationEntityStore, ConversationStore } from "@/types/chatMessageType";

function ChatInterface({ id }: { id: Key }) {
    const idString = id as string;
    const router = useRouter();
    const [getConversation, currentTitle] = useConversationEntityStore((state: ConversationEntityStore) => [
        state.getConversation,
        state.conversationMap[idString]?.title || "",
    ]);
    const [setConversation, getCurrentConversationInfo] = useConversationStore((state: ConversationStore) => [
        state.setCurrentConversation,
        state.getCurrentConversationInfo,
    ]);
    const currentConvInfo = getCurrentConversationInfo();
    const [convInfoLocal, setConvInfoLocal] = useState<typeof currentConvInfo>([]);

    useEffect(() => {
        const conversation = getConversation(idString);
        if (!conversation) {
            console.log("pushing", idString);
            router.push("/");
        } else {
            setConversation(idString, conversation, currentTitle);
            document.title = currentTitle;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idString, currentTitle]);

    useEffect(() => {
        setConvInfoLocal(currentConvInfo);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentConvInfo.length, idString]);

    return (
        <div className="transition-width relative flex size-full flex-1 grow flex-col items-stretch overflow-hidden">
            <div className="flex-1 overflow-hidden">
                <ScrollToBottom
                    key={id}
                    className="size-full overflow-y-auto "
                    initialScrollBehavior="auto"
                    followButtonClassName="scroll-bottom-button"
                >
                    <ConversationList key={id} id={idString} convInfo={convInfoLocal} />
                </ScrollToBottom>
            </div>
            <InputContainer />
        </div>
    );
}

ChatInterface.displayName = "ChatInterface";

const MemoizedChatInterface = memo(ChatInterface);
(MemoizedChatInterface as unknown as { whyDidYouRender: boolean }).whyDidYouRender = true;

export default MemoizedChatInterface;
