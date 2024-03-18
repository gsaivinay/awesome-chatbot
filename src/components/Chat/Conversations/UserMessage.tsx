import { motion } from "framer-motion";
import { FC, memo } from "react";
import { LuUser } from "react-icons/lu";

import { useConversationStore } from "@/store/ChatStore";
import { ConversationStore, Message } from "@/types/chatMessageType";

interface UserMessageProps extends Message {
    idx: number;
}

const UserMessage: FC<UserMessageProps> = memo(({ idx }) => {
    const [getMessageByIdx] = useConversationStore((state: ConversationStore) => [state.getMessageByIdx]);
    const conversation = getMessageByIdx(idx);
    return (
        <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ x: "-100%", transition: { duration: 0.35 } }}
            // transition={{ type: "just", stiffness: 150, damping: 12 }}
            className="group w-full "
        >
            <div className="m-auto flex gap-4 p-4 text-base border border-primary/30 rounded-lg max-w-5xl">
                <div className="relative flex size-9 flex-col items-center justify-center">
                    <LuUser size={25} className="text-primary/80" />
                </div>
                <div className="relative flex flex-col gap-1 ">
                    <div className="flex min-h-[20px] flex-col items-start gap-4 whitespace-pre-wrap">
                        {conversation?.content}
                    </div>
                </div>
            </div>
        </motion.div>
    );
});

UserMessage.displayName = "UserMessage";

export default UserMessage;
