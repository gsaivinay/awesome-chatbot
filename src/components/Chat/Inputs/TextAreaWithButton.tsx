import { FC, useEffect, useRef, useState } from "react";
import { AiFillFastForward } from "react-icons/ai";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BiSolidUpArrowSquare } from "react-icons/bi";
import { FaStop } from "react-icons/fa6";
import { SlReload } from "react-icons/sl";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChatCustom } from "@/hooks/useChatCustom";
import { useChatResponseStatus } from "@/store/ChatSettings";
import { useConversationEntityStore, useConversationStore } from "@/store/ChatStore";
import { ChatResponseStatus, ConversationEntityStore, ConversationStore, SourceTypes } from "@/types/chatMessageType";

const TextAreaWithButton: FC = () => {
    const [currentConversation, setTitle] = useConversationStore((state: ConversationStore) => [
        state.getCurrentConversation,
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

    const handleInput = () => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "1em";
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    };

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
        handleInput();
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
        if (textAreaRef.current!.value.length > 0) {
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
        setConversationEntity(convId!, conversation, title);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inProgress]);

    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "1em";
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
        }
    }, []);

    return (
        <div className="relative flex w-full grow rounded-t-xl border border-border dark:border-primary/50 p-2 min-h-24 mb-0">
            <Textarea
                tabIndex={0}
                disabled={inProgress}
                className="max-h-40 min-h-10 focus-visible:ring-0 focus:outline-none"
                ref={textAreaRef}
                onInput={handleInput}
                onKeyDown={handleKeyPress}
                onKeyUp={checkLength}
            />
            <Button
                type="button"
                onClick={isEmptyInput ? reloadHandler : submitHandler}
                disabled={inProgress || (isEmptyInput && conversation.length === 0)}
                variant={"secondary"}
                size={"icon"}
                className={`absolute size-7 bottom-2.5 right-2 rounded-md border-0 bg-secondary p-1 disabled:bg-transparent 
                    ${isEmptyInput && conversation.length !== 0 ? "w-28" : "w-7"}
                `}
            >
                {inProgress ? (
                    <AiOutlineLoading3Quarters className="animate-spin " size={20} />
                ) : isEmptyInput && conversation.length !== 0 ? (
                    <span className="flex">
                        <SlReload className="" size={20} /> Regenreate
                    </span>
                ) : (
                    <BiSolidUpArrowSquare className="" size={20} />
                )}
            </Button>
            {isUnfinished && !inProgress && (
                <Button
                    type="button"
                    onClick={continueHandler}
                    disabled={inProgress || (isEmptyInput && conversation.length === 0)}
                    variant={"secondary"}
                    size={"icon"}
                    className="absolute bottom-2.5 right-10 rounded-md border-0 bg-secondary p-1 disabled:bg-transparent "
                >
                    <AiFillFastForward size={20} />
                </Button>
            )}
            {inProgress && (
                <Button
                    variant={"secondary"}
                    className="flex items-center justify-center gap-2 absolute size-7 bottom-2.5 right-28 w-fit"
                    role="stop-generation"
                    onClick={() => updateProgress(false)}
                >
                    <FaStop />
                    <span>Stop generating</span>
                </Button>
            )}
        </div>
    );
};

export default TextAreaWithButton;
