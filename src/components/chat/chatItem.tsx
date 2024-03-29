"use client";

import { motion, usePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LuMessagesSquare } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import { useChatResponseStatus } from "@/store/globalStore";
import type { ChatResponseStatus, Conversation, Conversations } from "@/types/types";

import { ConversationControls } from "./conversationControls";

interface LocalProps {
    id: string;
    chat: Conversations;
    setActiveChat: (id: string, conversation: Conversation, title?: string | undefined) => void;
    updateChatTitle: (title: string) => void;
    resetActiveChat: () => void;
    deleteChatHistory: (id: string) => void;
    isActive: boolean;
}

export function ChatItem({ ...props }: LocalProps) {
    const router = useRouter();
    const [isPresent, safeToRemove] = usePresence();
    const {
        id: conversationId,
        chat: convMap,
        updateChatTitle: updateConversationTitle,
        resetActiveChat: resetConversation,
        deleteChatHistory: deleteConversation,
        isActive: selected,
    } = props;
    const [isLoading] = useChatResponseStatus((state: ChatResponseStatus) => [state.inProgress]);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const conversationTitleInputRef = useRef<HTMLInputElement>(null);

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            conversationTitleInputRef.current?.value &&
                updateConversationTitle(conversationTitleInputRef.current?.value);
            setIsEditingTitle(false);
        }
    };

    useEffect(() => {
        if (conversationTitleInputRef.current) conversationTitleInputRef.current.value = convMap.title;
    }, [convMap]);

    useEffect(() => {
        if (isEditingTitle) {
            conversationTitleInputRef.current?.focus();
        }
    }, [isEditingTitle]);

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
                className={` mb-2 flex h-10 w-full cursor-pointer items-center gap-3 rounded-lg border-0 p-[0.85rem] text-sm shadow-none transition-all disabled:opacity-100 ${
                    selected ? "bg-primary/30 hover:bg-primary/30" : "bg-transparent hover:bg-secondary"
                }`}
                onClick={() => {
                    router.push(`/chat/${conversationId}`);
                }}
                disabled={isLoading || selected}
            >
                <LuMessagesSquare size="1.2rem" />
                {selected ? (
                    <input
                        type="text"
                        className={`relative max-h-5 flex-1 cursor-pointer appearance-none truncate break-all
                    bg-transparent text-left text-[14px] outline-none ${selected ? "pr-12" : "pr-1"} ${
                        isEditingTitle ? "pr-0" : ""
                    }`}
                        ref={conversationTitleInputRef}
                        defaultValue={convMap.title}
                        disabled={!isEditingTitle}
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
                <ConversationControls
                    conversationId={conversationId}
                    updateConversationTitle={updateConversationTitle}
                    resetConversation={resetConversation}
                    deleteConversation={deleteConversation}
                    isLoading={isLoading}
                    conversationTitleInputRef={conversationTitleInputRef}
                    isEditingTitle={isEditingTitle}
                    setIsEditingTitle={setIsEditingTitle}
                />
            )}
        </motion.li>
    );
}
