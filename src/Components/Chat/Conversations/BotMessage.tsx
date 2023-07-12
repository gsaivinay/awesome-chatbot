import "katex/dist/katex.min.css";

import { FC, memo, useState } from "react";
import { HiArrowTopRightOnSquare } from "react-icons/hi2";

import { DislikeButton, LikeButton, ShowHideButton } from "@/Components/Buttons/ChatInteractions";
import { BotAvatar } from "@/Components/Chat/Avatars";
import { RenderedMarkdown } from "@/Components/Chat/Markdown/RenderedMarkdown";
import { useChatResponseStatus } from "@/Store/ChatSettings";
import { ChatResponseStatus, Message } from "@/types/chatMessageType";

interface LocalProps extends Message {
    isLast: boolean;
    idx: number;
    uniqueId: string;
}

const BotMessage: FC<LocalProps> = memo(
    ({ sources, urls, isLast, idx, uniqueId: _uniqueId }) => {
        const [inProgress] = useChatResponseStatus((state: ChatResponseStatus) => [state.inProgress]);
        const [showSources, setShowSources] = useState(false);

        const toggleShowSources = () => {
            setShowSources((sourceState) => !sourceState);
        };

        return (
            <div className="group w-full border-black/10 text-gray-800 ">
                <div className="m-auto flex max-w-3xl gap-4 rounded-lg bg-secondary p-5 text-base">
                    <div className="relative flex h-9 w-9 flex-col items-center justify-center rounded-full border border-gray-400">
                        <BotAvatar />
                    </div>
                    <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
                        <div className="flex flex-grow flex-col gap-3">
                            <div className="flex min-h-[20px] flex-col items-start gap-4 whitespace-pre-wrap">
                                <div
                                    className={`${
                                        inProgress && isLast ? "streaming-blinker" : ""
                                    } markdown prose m-0 w-full break-words prose-p:m-0 prose-pre:m-0 prose-pre:p-0 prose-ol:m-0 prose-li:m-0 `}
                                >
                                    <RenderedMarkdown key={idx} id={idx} markdown={""} />
                                    {/* {memoizedComponent} */}
                                </div>
                                <div className="w-full">
                                    {showSources &&
                                        (!inProgress || !isLast) &&
                                        sources?.map((source, idx) => (
                                            <div key={idx}>
                                                Source:{" "}
                                                <a
                                                    className="underline"
                                                    href={urls ? urls[idx] : ""}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    {source}
                                                </a>
                                                <HiArrowTopRightOnSquare className="inline" />
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="visible absolute right-0 top-0 mt-0 flex translate-x-full justify-center gap-1 self-center pl-2 text-gray-400">
                                <LikeButton />
                                <DislikeButton />
                            </div>
                            <div className="visible absolute right-0 flex translate-x-full justify-center gap-1 self-center pl-4 text-gray-400">
                                <ShowHideButton isHidden={showSources} handler={toggleShowSources} />
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
    }
);

BotMessage.displayName = "BotMessage";

export default BotMessage;
