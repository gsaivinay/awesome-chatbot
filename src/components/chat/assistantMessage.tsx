import { type FC, memo } from "react";
import { BsRobot } from "react-icons/bs";

import { MarkdownRenderer } from "@/components/chat/markdownRenderer";
import { useChatResponseStatus } from "@/store/globalStore";
import type { ChatResponseStatus, Message } from "@/types/types";

interface AssistantMessageProps extends Message {
    isLastMessage: boolean;
    messageIndex: number;
    uniqueId: string;
}

const AssistantMessage: FC<AssistantMessageProps> = memo(({ isLastMessage, messageIndex, uniqueId: _uniqueId }) => {
    const [isGenerating] = useChatResponseStatus((state: ChatResponseStatus) => [state.inProgress]);

    return (
        <div className="group w-full ">
            <div className="m-auto flex max-w-5xl gap-4 rounded-lg border border-primary/50 p-5 text-base">
                <div className="relative flex size-9 flex-col items-center justify-center">
                    <BsRobot size={25} className="text-primary" />
                </div>
                <div className="relative flex max-w-5xl flex-col gap-3">
                    <div className="flex grow flex-col gap-3">
                        <div className={"flex min-h-[20px] flex-col items-start gap-4 whitespace-pre-wrap"}>
                            <div
                                className={` m-0 max-w-4xl break-words text-base  after:content-['●●●'] ${
                                    isGenerating && isLastMessage ? "  after:animate-ping" : "after:invisible"
                                } prose m-0 max-w-4xl break-words dark:prose-invert prose-p:m-0 prose-pre:m-0 prose-pre:rounded-lg prose-pre:p-0 prose-ol:m-0 prose-li:m-0  `}
                            >
                                <MarkdownRenderer key={messageIndex} messageId={messageIndex} content={""} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

AssistantMessage.displayName = "AssistantMessage";

export default AssistantMessage;
