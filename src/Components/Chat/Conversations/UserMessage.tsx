/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { motion } from "framer-motion";
import { FC, memo } from "react";

import { UserAvatar } from "@/Components/Chat/Avatars";
import { useConversationStore } from "@/Store/ChatStore";
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
            className="group w-full border-black/10 text-gray-800 "
        >
            <div className="m-auto flex gap-4 p-4 text-base md:max-w-2xl md:gap-6 md:px-6 md:py-6  lg:max-w-2xl xl:max-w-3xl">
                <div className="relative flex h-9 w-9 flex-col items-center justify-center rounded-full border border-brand">
                    <UserAvatar />
                </div>
                <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
                    <div className="flex flex-grow flex-col gap-3">
                        <div className="flex min-h-[20px] flex-col items-start gap-4 whitespace-pre-wrap">
                            {conversation?.content}
                        </div>
                    </div>
                    <div className="visible mt-2 flex justify-center gap-3 self-end text-gray-400 md:gap-4 lg:absolute lg:right-0 lg:top-0 lg:mt-0 lg:translate-x-full lg:gap-1 lg:self-center lg:pl-2">
                        {/* <EditMessage /> */}
                    </div>
                    <div className="flex justify-between" />
                </div>
            </div>
        </motion.div>
    );
});

UserMessage.displayName = "UserMessage";

export default UserMessage;
