import { useRouter } from "next/navigation";
import { BiMessageAdd } from "react-icons/bi";
import { v4 as uuid } from "uuid";

import { Button } from "@/components/ui/button";
import { useConversationEntityStore, useConversationStore } from "@/store/chatStore";
import { useChatResponseStatus } from "@/store/globalStore";
import type { ActiveConversation, ChatResponseStatus, ConversationEntityStore } from "@/types/types";

export function NewChat() {
    const [createConversation] = useConversationEntityStore((state: ConversationEntityStore) => [
        state.createConversation,
    ]);
    const [setCurrentConversation] = useConversationStore((state: ActiveConversation) => [state.setActiveChat]);
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
