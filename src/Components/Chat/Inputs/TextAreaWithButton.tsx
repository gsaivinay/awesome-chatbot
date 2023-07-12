import { FC, useEffect, useRef, useState } from "react";
import { AiFillFastForward, AiOutlineSend } from "react-icons/ai";
import { CgSpinnerTwo } from "react-icons/cg";
import { IoReload } from "react-icons/io5";

import { useChatCustom } from "@/hooks/useChatCustom";
import { useChatResponseStatus } from "@/Store/ChatSettings";
import { useConversationEntityStore, useConversationStore } from "@/Store/ChatStore";
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
    // const { messages, append, reload, isLoading } = useChat({
    //     initialMessages: conversation,
    // });
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
            // addMessage({
            //     role: SourceTypes.BOT,
            //     content: "",
            // });
            // getResponseForInputProgressive(text, null, updateProgress, replaceLastMessage, getProgressStatus);
            // GetResponseAi(text, conversation, null, updateProgress, replaceLastMessage, getProgressStatus);
            // append({
            //     role: SourceTypes.USER,
            //     content: text,
            //     createdAt: new Date(),
            // });
            // while (isLoading) {
            //     setConversation(messages);
            // }
            // updateProgress(false);
            // streamResponse(conversation);
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
        <div className="relative flex w-full flex-grow rounded-xl border border-black/10 bg-white py-2 shadow-[0_0_10px_rgba(0,0,0,0.10)] md:py-3 md:pl-4 ">
            <textarea
                tabIndex={0}
                disabled={inProgress}
                className="m-0 max-h-40 w-full cursor-text resize-none border-0 bg-transparent p-0 pl-2 pr-7 text-brand focus:outline-none md:pl-0"
                ref={textAreaRef}
                onInput={handleInput}
                onKeyDown={handleKeyPress}
                onKeyUp={checkLength}
            />
            <button
                type="button"
                onClick={isEmptyInput ? reloadHandler : submitHandler}
                disabled={inProgress || (isEmptyInput && conversation.length === 0)}
                className="button-core absolute bottom-2.5 right-2 rounded-md border-0 bg-secondary p-1 hover:bg-200 disabled:bg-transparent disabled:text-gray-300 disabled:hover:bg-transparent"
            >
                {inProgress ? (
                    <CgSpinnerTwo className="animate-spin " size={20} />
                ) : isEmptyInput && conversation.length !== 0 ? (
                    <IoReload className="" size={20} />
                ) : (
                    <AiOutlineSend className="" size={20} />
                )}
            </button>
            {isUnfinished && !inProgress && (
                <button
                    type="button"
                    onClick={continueHandler}
                    disabled={inProgress || (isEmptyInput && conversation.length === 0)}
                    className="button-core absolute bottom-2.5 right-10 rounded-md border-0 bg-secondary p-1 hover:bg-200 disabled:bg-transparent disabled:text-gray-300 disabled:hover:bg-transparent"
                >
                    <AiFillFastForward size={20} />
                </button>
            )}
        </div>
    );
};

export default TextAreaWithButton;
