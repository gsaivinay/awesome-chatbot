import { AnimatePresence } from "framer-motion";
import { FC } from "react";
import { FaAnglesDown } from "react-icons/fa6";
import { useScrollToBottom, useSticky } from "react-scroll-to-bottom";

import { ConvInfo } from "@/types/chatMessageType";

import BotMessage from "./BotMessage";
import UserMessage from "./UserMessage";

const ConversationList: FC<{ id: string; convInfo: ConvInfo[] | undefined }> & {
    whyDidYouRender: boolean;
} = ({ convInfo }) => {
    const scrollToBottom = useScrollToBottom();
    const [sticky] = useSticky();

    return (
        <>
            <div className="flex flex-col gap-2 pt-2 items-center text-sm">
                <AnimatePresence mode="sync" initial={false}>
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
                </AnimatePresence>

                <div className="h-32 w-full shrink-0" />
            </div>
            {!sticky && (
                <button
                    type="button"
                    className="absolute bottom-[124px] right-6 z-10 cursor-pointer rounded-full border border-gray-200 text-gray-600 shadow-lg md:bottom-[120px]"
                    onClick={() => {
                        scrollToBottom({ behavior: "smooth" });
                    }}
                >
                    <FaAnglesDown className="m-1" />
                </button>
            )}
        </>
    );
};

ConversationList.displayName = "ConversationList";
ConversationList.whyDidYouRender = false;
export default ConversationList;
