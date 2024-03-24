"use client";

import { FC } from "react";
import { FaAnglesDown } from "react-icons/fa6";
import { useScrollToBottom, useSticky } from "react-scroll-to-bottom";

import { Button } from "@/components/ui/button";
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
            <div className="flex flex-col items-center gap-2 pt-2 text-sm">
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

                <div className="h-32 w-full shrink-0" />
            </div>
            {!sticky && (
                <Button
                    className="absolute bottom-32 right-4 z-10 size-9 rounded-xl bg-primary/75 shadow-xl transition-opacity"
                    size={"icon"}
                    onClick={() => {
                        scrollToBottom({ behavior: "smooth" });
                    }}
                >
                    <FaAnglesDown className="m-1" />
                </Button>
            )}
        </>
    );
};

ConversationList.displayName = "ConversationList";
ConversationList.whyDidYouRender = false;
export default ConversationList;
