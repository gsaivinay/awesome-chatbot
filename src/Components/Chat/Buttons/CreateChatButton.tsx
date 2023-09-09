import { useRouter } from "next/router";
import { AiOutlinePlus } from "react-icons/ai";
import { v4 as uuid } from "uuid";

import { useChatResponseStatus } from "@/Store/ChatSettings";
import { useConversationEntityStore, useConversationStore } from "@/Store/ChatStore";
import { ChatResponseStatus, ConversationEntityStore, ConversationStore } from "@/types/chatMessageType";

export const useCreateChat = () => {
    // const router = useRouter();
    // const { trigger: newChatTrigger } = useSWRMutation<{ id: string }>(API_ROUTES.LIST_CHAT, post);
    // const createChat = useCallback(async () => {
    //     const { id } = await newChatTrigger();
    //     router.push(`/chat/${id}`);
    //     return id;
    // }, [newChatTrigger, router]);
    // return createChat;
};

export const CreateChatButton = () => {
    const [createConversation] = useConversationEntityStore((state: ConversationEntityStore) => [
        state.createConversation,
    ]);
    const [setCurrentConversation] = useConversationStore((state: ConversationStore) => [state.setCurrentConversation]);
    const [inProgress] = useChatResponseStatus((state: ChatResponseStatus) => [state.inProgress]);
    const router = useRouter();
    return (
        <button
            className="button-core flex items-center justify-center "
            onClick={() => {
                const newId = uuid();
                createConversation(newId, []);
                setCurrentConversation(newId, []);
                router.push(`/chat/${newId}`);
            }}
            disabled={inProgress}
        >
            <div className="flex items-center justify-center gap-1">
                <AiOutlinePlus size="1rem" />
                New chat
            </div>
        </button>
    );
};
