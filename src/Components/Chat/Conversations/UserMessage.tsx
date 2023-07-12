/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
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
        <div className="group w-full text-gray-800 border-black/10 ">
            <div className="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 md:py-6 flex  md:px-6 m-auto">
                <div className="w-9 h-9 flex flex-col relative items-center justify-center border rounded-full border-brand">
                    <UserAvatar />
                </div>
                <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
                    <div className="flex flex-grow flex-col gap-3">
                        <div className="min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap">
                            {conversation?.content}
                        </div>
                    </div>
                    <div className="text-gray-400 flex self-end lg:self-center justify-center mt-2 gap-3 md:gap-4 lg:gap-1 lg:absolute lg:top-0 lg:translate-x-full lg:right-0 lg:mt-0 lg:pl-2 visible">
                        {/* <EditMessage /> */}
                    </div>
                    <div className="flex justify-between" />
                </div>
            </div>
        </div>
    );
});

UserMessage.displayName = 'UserMessage';

export default UserMessage;
