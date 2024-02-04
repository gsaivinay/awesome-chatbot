import { motion, usePresence } from "framer-motion";
import { useRouter } from "next/router";
import { FC, useEffect, useRef, useState } from "react";
import { TbMessage } from "react-icons/tb";

import { useChatResponseStatus } from "@/Store/ChatSettings";
import { ChatResponseStatus, Conversation, ConversationEntity } from "@/types/chatMessageType";

import { ChatListButtonControls } from "./ChatListControlButtons";

interface LocalProps {
    id: string;
    convMap: ConversationEntity;
    setCurrentConversation: (id: string, conversation: Conversation, title?: string | undefined) => void;
    setTitle: (title: string) => void;
    clearConversation: () => void;
    removeConversationMap: (id: string) => void;
    selected: boolean;
}

export const ChatListButton: FC<LocalProps> = (props) => {
    const [isPresent, safeToRemove] = usePresence();

    const { id, convMap, setTitle, clearConversation, removeConversationMap, selected } = props;
    const [inProgress] = useChatResponseStatus((state: ChatResponseStatus) => [state.inProgress]);

    const [isRenaming, setIsRenaming] = useState(false);

    const titleRef = useRef<HTMLInputElement>(null);

    const router = useRouter();

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            setTitle(titleRef.current!.value);
            setIsRenaming(false);
        }
    };

    useEffect(() => {
        if (titleRef.current) titleRef.current.value = convMap.title;
    }, [convMap]);

    useEffect(() => {
        if (isRenaming) {
            titleRef.current?.focus();
        }
    }, [isRenaming]);

    useEffect(() => {
        !isPresent && setTimeout(safeToRemove, 350);
    }, [isPresent]);

    return (
        <motion.li
            // layout
            initial={{ y: -200 }}
            animate={{ y: "0%" }}
            exit={{ x: "-200%", transition: { duration: 0.35 } }}
            transition={{ type: "spring", stiffness: 150, damping: 16 }}
            className="relative flex items-center"
        >
            <button
                className={`button-core flex w-full cursor-pointer items-center gap-3 rounded-lg border-0 p-[0.85rem] text-sm transition-all ${
                    selected ? "bg-primary/50 hover:bg-primary/50" : "hover:bg-secondary"
                }`}
                onClick={() => {
                    // clearConversation();
                    // setCurrentConversation(id, convMap.conversation);
                    router.push(`/chat/${id}`);
                }}
                disabled={inProgress || selected}
            >
                <TbMessage className="text-brand" size="1.2rem" />
                <input
                    type="text"
                    className={`relative max-h-5 flex-1 cursor-pointer appearance-none overflow-hidden text-ellipsis
                    whitespace-nowrap break-all bg-transparent text-left text-[14px] outline-none ${
                        selected ? "pr-12" : "pr-1"
                    } ${isRenaming ? "pr-0" : ""}`}
                    ref={titleRef}
                    defaultValue={convMap.title}
                    disabled={!isRenaming}
                    onKeyDown={handleKeyPress}
                />
            </button>
            {selected && (
                <ChatListButtonControls
                    id={id}
                    setTitle={setTitle}
                    clearConversation={clearConversation}
                    removeConversationMap={removeConversationMap}
                    inProgress={inProgress}
                    titleRef={titleRef}
                    isRenaming={isRenaming}
                    setIsRenaming={setIsRenaming}
                />
            )}
        </motion.li>
    );
};
