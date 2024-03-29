"use client";
import { AnimatePresence, Reorder } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { TbMessage2Off } from "react-icons/tb";

import { ChatItem } from "@/components/chat/chatItem";
import { NewChat } from "@/components/chat/newChat";
import UserPreferences from "@/components/preferences";
import { useConversationEntityStore, useConversationStore } from "@/store/chatStore";
import useSideBarState from "@/store/globalStore";
import type { ActiveConversation, ConversationEntityStore } from "@/types/types";
import type { NavBar } from "@/types/types";

export default function LeftSidebar() {
    const [leftNavExpanded] = useSideBarState((state: NavBar) => [state.leftNavExpanded]);

    const [chatHistory, setChatHistory, deleteChatHistory] = useConversationEntityStore(
        (state: ConversationEntityStore) => [state.conversationMap, state.setConversation, state.removeConversation],
    );

    const [activeChatId, activeChat, setActiveChat, resetActiveChat, updateChatTitle] = useConversationStore(
        (state: ActiveConversation) => [
            state.id,
            state.conversation,
            state.setActiveChat,
            state.resetActiveChat,
            state.setTitle,
        ],
    );

    const currentPath = usePathname();

    const handleChatTitleChange = (title: string) => {
        updateChatTitle(title);
        activeChatId && setChatHistory(activeChatId, activeChat, title);
    };

    const sidebarClasses = leftNavExpanded ? ["w-72"] : ["w-0"];

    useEffect(() => {
        if (currentPath === "/") {
            setActiveChat(undefined, [], undefined);
        }
    }, [currentPath, setActiveChat]);

    const chatIds = Object.entries(chatHistory);

    return (
        <div
            className={` shrink-0 overflow-auto overflow-x-hidden  border border-none border-border p-0 pt-2 transition-all duration-200 ${sidebarClasses.join(
                " ",
            )}`}
            role="navigation"
        >
            <div className={"h-full w-72"}>
                <div className="flex h-full flex-none flex-col gap-2 p-2">
                    <NewChat />
                    <div className="flex grow flex-col gap-1 overflow-auto rounded-lg border border-primary/50 p-1">
                        <Reorder.Group axis="y" values={chatIds} onReorder={() => {}}>
                            <AnimatePresence mode="sync">
                                {chatIds.length > 0 &&
                                    chatIds
                                        .map(([id, chat]) => (
                                            <Reorder.Item key={id} value={chat} transition={{ type: "spring" }}>
                                                <ChatItem
                                                    key={id}
                                                    id={id}
                                                    chat={chat}
                                                    isActive={id === activeChatId}
                                                    setActiveChat={setActiveChat}
                                                    updateChatTitle={handleChatTitleChange}
                                                    resetActiveChat={resetActiveChat}
                                                    deleteChatHistory={deleteChatHistory}
                                                />
                                            </Reorder.Item>
                                        ))
                                        .reverse()}
                            </AnimatePresence>
                        </Reorder.Group>
                        {chatIds.length === 0 && (
                            <div className="m-auto mt-4 flex h-full grow flex-col items-center justify-center">
                                <TbMessage2Off className="text-gray-400" size="1.5rem" />
                                <p className="text-gray-400">No Chats</p>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col rounded-lg border border-primary/50 p-1">
                        <div className="relative flex items-center">
                            <UserPreferences key="user-preferences" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
