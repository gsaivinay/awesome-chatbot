import { useEffect, useRef, useState } from "react";
import { AiFillFastForward } from "react-icons/ai";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BiSolidUpArrowSquare } from "react-icons/bi";
import { FaStop } from "react-icons/fa6";
import { GrRefresh } from "react-icons/gr";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChatCustom } from "@/hooks/useChatCustom";
import { useConversationEntityStore, useConversationStore } from "@/store/chatStore";
import { useChatResponseStatus } from "@/store/globalStore";
import {
    type ActiveConversation,
    type ChatResponseStatus,
    type ConversationEntityStore,
    SourceTypes,
} from "@/types/types";

export default function InputArea() {
    const [currentConversation, setTitle] = useConversationStore((state: ActiveConversation) => [
        state.getActiveChat,
        state.setTitle,
    ]);

    const { conversation, id: convId, title } = currentConversation();
    const [setConversationEntity] = useConversationEntityStore((state: ConversationEntityStore) => [
        state.setConversation,
    ]);
    const [inProgress, updateProgress] = useChatResponseStatus((state: ChatResponseStatus) => [
        state.inProgress,
        state.updateProgress,
    ]);
    const [isUnfinished, setIsUnfinished] = useState<boolean>(false);
    const { append, reload, complete } = useChatCustom({
        onFinish: () => {
            updateProgress(false);
        },
        onIncomplete: () => setIsUnfinished(true),
    });
    const [isEmptyInput, setIsEmptyInput] = useState<boolean>(false);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const submitHandler = async () => {
        let text = "";
        if (textAreaRef.current) {
            text = textAreaRef.current.value.trim();
            textAreaRef.current.value = "";
        }
        if (text && text !== "") {
            updateProgress(true);
            setIsUnfinished(false);
            await append({
                role: SourceTypes.USER,
                content: text,
            });
        }
    };

    const reloadHandler = () => {
        updateProgress(true);
        reload();
    };

    const continueHandler = () => {
        setIsUnfinished(false);
        updateProgress(true);
        complete();
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submitHandler();
        }
    };

    const checkLength = (_e?: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((textAreaRef.current?.value?.length || 0) > 0) {
            setIsEmptyInput(false);
        } else {
            setIsEmptyInput(true);
        }
    };

    useEffect(() => {
        if (!inProgress && textAreaRef.current) {
            textAreaRef.current.focus();
        }
        checkLength();
        if ((!title || title === "Untitled") && conversation.length > 0) {
            let titleToSet = conversation[0].content.substring(0, 40);
            if (titleToSet.length === 40) {
                titleToSet += "...";
            }
            setTitle(titleToSet);
        }
        convId && setConversationEntity(convId, conversation, title);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inProgress]);

    return (
        <div className="mb-0 flex min-h-24 w-full grow flex-col items-end gap-2 rounded-t-xl border border-border p-2 dark:border-primary/50">
            <Textarea
                tabIndex={0}
                disabled={inProgress}
                className="h-10 max-h-40 min-h-10"
                ref={textAreaRef}
                onKeyDown={handleKeyPress}
                onKeyUp={checkLength}
            />
            <div className="flex items-center justify-center gap-2">
                <Button
                    onClick={reloadHandler}
                    disabled={inProgress}
                    variant={"default"}
                    className={`flex h-8 w-fit items-center justify-center gap-2 ${
                        conversation.length === 0 || inProgress ? "hidden" : ""
                    }`}
                >
                    <GrRefresh className="" size={20} /> <span>Regenreate</span>
                </Button>
                {isUnfinished && !inProgress && (
                    <Button
                        onClick={continueHandler}
                        disabled={inProgress || (isEmptyInput && conversation.length === 0)}
                        variant={"default"}
                        size={"icon"}
                        className="rounded-md border-0 p-1 "
                    >
                        <AiFillFastForward size={20} />
                    </Button>
                )}
                {inProgress && (
                    <>
                        <Button
                            variant={"default"}
                            className="flex h-8 w-fit items-center justify-center gap-2"
                            onClick={() => updateProgress(false)}
                        >
                            <FaStop />
                            <span>Stop generating</span>
                        </Button>
                        <Button
                            variant={"ghost"}
                            size={"icon"}
                            className="flex size-8 items-center justify-center gap-2"
                            disabled
                        >
                            <AiOutlineLoading3Quarters className="animate-spin " size={20} />
                        </Button>
                    </>
                )}
                <Button
                    onClick={isEmptyInput ? reloadHandler : submitHandler}
                    disabled={inProgress || isEmptyInput}
                    variant={"default"}
                    size={"icon"}
                    className={`size-8 rounded-md border-0 p-1 ${inProgress ? "hidden" : ""}`}
                >
                    <BiSolidUpArrowSquare className="" size={30} />
                </Button>
            </div>
        </div>
    );
}
