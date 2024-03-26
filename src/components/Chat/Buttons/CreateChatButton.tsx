import { useRouter } from "next/navigation";
import { BiMessageAdd } from "react-icons/bi";
import { v4 as uuid } from "uuid";

import { Button } from "@/components/ui/button";
import { useChatResponseStatus } from "@/store/ChatSettings";
import { useConversationEntityStore, useConversationStore } from "@/store/ChatStore";
import { ChatResponseStatus, ConversationEntityStore, ConversationStore } from "@/types/chatMessageType";

export function CreateChatButton() {
    const [createConversation] = useConversationEntityStore((state: ConversationEntityStore) => [
        state.createConversation,
    ]);
    const [setCurrentConversation] = useConversationStore((state: ConversationStore) => [state.setCurrentConversation]);
    const [inProgress] = useChatResponseStatus((state: ChatResponseStatus) => [state.inProgress]);
    const router = useRouter();
    return (
        <Button
            className=" flex items-center justify-center "
            variant={"default"}
            onClick={() => {
                const newId = uuid();
                createConversation(newId, []);
                setCurrentConversation(newId, []);
                router.push(`/chat/${newId}`);
            }}
            disabled={inProgress}
        >
            <div className="flex items-center justify-center gap-1">
                <BiMessageAdd size="1.2rem" />
                Create new chat
            </div>
        </Button>
    );
}
