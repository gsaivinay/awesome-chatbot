import { motion } from "framer-motion";
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
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                exit={{ x: "-100%", transition: { duration: 0.45 } }}
                className="group w-full "
            >
                <div className="m-auto flex max-w-5xl gap-4 rounded-lg border border-primary/50 p-5 text-base">
                    <div className="relative flex size-9 flex-col items-center justify-center">
                        <BsRobot size={25} className="text-primary" />
                    </div>
                    <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
                        <div className="flex grow flex-col gap-3">
                            <div className="flex min-h-[20px] flex-col items-start gap-4 whitespace-pre-wrap">
                                <div
                                    className={`${
                                        inProgress && isLast ? "streaming-blinker" : "after:content-['▋'] after:invisible"
                                    } markdown prose m-0 w-full break-words dark:prose-invert prose-p:m-0 prose-pre:m-0 prose-pre:rounded-lg prose-pre:p-0 prose-ol:m-0 prose-li:m-0 `}
                                >
                                    <RenderedMarkdown key={idx} id={idx} markdown={""} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
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
