import { FC } from "react";
import { useScrollToBottom, useSticky } from "react-scroll-to-bottom";

import { FloatingButton } from "@/Components/Buttons/ChatInteractions";
import { Message } from "@/types/chatMessageType";

import BotMessage from "./BotMessage";
import UserMessage from "./UserMessage";

const ConversationList: FC<{ id: string; convInfo: Pick<Message, "id" | "role">[] | undefined }> & {
    whyDidYouRender: boolean;
} = ({ convInfo }) => {
    const scrollToBottom = useScrollToBottom();
    const [sticky] = useSticky();

    return (
        <>
            <div className="flex flex-col items-center text-sm">
                {convInfo?.map((convo, idx, array) => {
                    return convo.role === "user" ? (
                        <UserMessage key={`${idx}-${array[idx].id}`} idx={idx} role={convo.role} content={""} />
                    ) : (
                        <BotMessage
                            key={`${idx}-${array[idx].id}`}
                            uniqueId={`${idx}-${array[idx].id}`}
                            idx={idx}
                            isLast={idx === array.length - 1}
                            role={convo.role}
                            content={""}
                        />
                    );
                })}

                <div className="h-32 w-full flex-shrink-0" />
            </div>
            {!sticky && (
                <FloatingButton
                    scrollToBottom={() => {
                        scrollToBottom({ behavior: "smooth" });
                    }}
                />
            )}
        </>
    );
};

ConversationList.displayName = "ConversationList";
ConversationList.whyDidYouRender = true;
export default ConversationList;
