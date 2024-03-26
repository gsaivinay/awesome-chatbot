import { FC, memo } from "react";
import { BsRobot } from "react-icons/bs";

import { RenderedMarkdown } from "@/components/Chat/Markdown/RenderedMarkdown";
import { useChatResponseStatus } from "@/store/ChatSettings";
import { ChatResponseStatus, Message } from "@/types/chatMessageType";

interface LocalProps extends Message {
    isLast: boolean;
    idx: number;
    uniqueId: string;
}

const BotMessage: FC<LocalProps> = memo(
    ({ isLast, idx, uniqueId: _uniqueId }) => {
        const [inProgress] = useChatResponseStatus((state: ChatResponseStatus) => [state.inProgress]);

        return (
            <div className="group w-full ">
                <div className="m-auto flex max-w-5xl gap-4 rounded-lg border border-primary/50 p-5 text-base">
                    <div className="relative flex size-9 flex-col items-center justify-center">
                        <BsRobot size={25} className="text-primary" />
                    </div>
                    <div className="relative flex max-w-5xl flex-col gap-3">
                        <div className="flex grow flex-col gap-3">
                            <div className="flex min-h-[20px] flex-col items-start gap-4 whitespace-pre-wrap">
                                <div
                                    className={`${
                                        inProgress && isLast
                                            ? "cursor-stream-blink"
                                            : "after:invisible after:content-['●●●']"
                                    } prose max-w-4xl m-0 break-words dark:prose-invert prose-p:m-0 prose-pre:m-0 prose-pre:rounded-lg prose-pre:p-0 prose-ol:m-0 prose-li:m-0 `}
                                >
                                    <RenderedMarkdown key={idx} id={idx} markdown={""} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    (prevProps, nextProps) => {
        const ev =
            prevProps.uniqueId === nextProps.uniqueId &&
            prevProps.isLast === nextProps.isLast &&
            prevProps.idx === nextProps.idx;
        return ev;
    },
);

BotMessage.displayName = "BotMessage";

export default BotMessage;
