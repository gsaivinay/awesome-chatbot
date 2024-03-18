import { motion, usePresence } from "framer-motion";
import { useRouter } from "next/router";
import { FC, useEffect, useRef, useState } from "react";
import { LuMessagesSquare } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import { useChatResponseStatus } from "@/store/ChatSettings";
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

export const ChatListButton: FC<LocalProps> = props => {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPresent]);

    return (
        <motion.li
            initial={{ y: -200 }}
            animate={{ y: "0%" }}
            exit={{ x: "-200%", transition: { duration: 0.35 } }}
            transition={{ type: "spring", stiffness: 150, damping: 16 }}
            className="relative flex items-center"
        >
            <Button
                variant={"secondary"}
                className={` mb-2 flex w-full cursor-pointer items-center gap-3 rounded-lg border-0 shadow-none p-[0.85rem] h-10 text-sm transition-all disabled:opacity-100 ${
                    selected ? "bg-primary/30 hover:bg-primary/30" : "bg-transparent hover:bg-secondary"
                }`}
                onClick={() => {
                    router.push(`/chat/${id}`);
                }}
                disabled={inProgress || selected}
            >
                <LuMessagesSquare size="1.2rem" />
                {selected ? (
                    <input
                        type="text"
                        className={`relative max-h-5 flex-1 cursor-pointer appearance-none truncate break-all
                    bg-transparent text-left text-[14px] outline-none ${
                        selected ? "pr-12" : "pr-1"
                    } ${isRenaming ? "pr-0" : ""}`}
                        ref={titleRef}
                        defaultValue={convMap.title}
                        disabled={!isRenaming}
                        onKeyDown={handleKeyPress}
                    />
                ) : (
                    <span
                        className="relative max-h-5 flex-1 cursor-pointer appearance-none truncate break-all
                    bg-transparent text-left text-[14px] outline-none"
                    >
                        {convMap.title}
                    </span>
                )}
            </Button>
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
