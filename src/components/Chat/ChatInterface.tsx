import { useRouter } from "next/router";
import { FC, Key, memo, useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

import ConversationList from "@/components/Chat/Conversations/Conversation";
import { ChatInput } from "@/components/Chat/Inputs";
import { useConversationEntityStore, useConversationStore } from "@/store/ChatStore";
import { ConversationEntityStore, ConversationStore } from "@/types/chatMessageType";

// const ConversationList = dynamic(() => import("@/components/Chat/Conversations/Conversation"), {});

interface Props {
    id: Key;
}

const ChatInterface: FC<Props> = memo(({ id }: Props) => {
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
                <ScrollToBottom key={id} className="size-full overflow-y-auto " initialScrollBehavior="auto">
                    <ConversationList key={id} id={idString} convInfo={convInfoLocal} />
                </ScrollToBottom>
            </div>
            <ChatInput />
        </div>
    );
});

ChatInterface.displayName = "ChatInterface";
(ChatInterface as FC<Props> & { whyDidYouRender: boolean }).whyDidYouRender = true;
export default ChatInterface;
