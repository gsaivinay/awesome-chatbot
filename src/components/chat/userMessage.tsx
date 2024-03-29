import { type FC, memo } from "react";
import { LuUser } from "react-icons/lu";

import { useConversationStore } from "@/store/chatStore";
import type { ActiveConversation, Message } from "@/types/types";

interface UserMessageProps extends Message {
    idx: number;
}

const UserMessage: FC<UserMessageProps> = memo(({ idx }) => {
    const [getMessageByIdx] = useConversationStore((state: ActiveConversation) => [state.getMessageByIdx]);
    const conversation = getMessageByIdx(idx);
    return (
        <div className="group w-full ">
            <div className="m-auto flex max-w-5xl gap-4 rounded-lg border border-primary/30 p-4 text-base">
                <div className="relative flex size-9 flex-col items-center justify-center">
                    <LuUser size={25} className="text-primary/80" />
                </div>
                <div className="relative flex flex-col gap-1 ">
                    <div className="flex min-h-[20px] flex-col items-start gap-4 whitespace-pre-wrap">
                        {conversation?.content}
                    </div>
                </div>
            </div>
        </div>
    );
});

UserMessage.displayName = "UserMessage";

export default UserMessage;
