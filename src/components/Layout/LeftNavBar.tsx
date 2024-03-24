"use client";

import { AnimatePresence, Reorder } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { TbMistOff } from "react-icons/tb";

import { ChatListButton, CreateChatButton } from "@/components/Chat/Buttons";
import SettingsModal from "@/components/UserSettings/Settings";
import { useConversationEntityStore, useConversationStore } from "@/store/ChatStore";
import useSideBarState from "@/store/GlobalStore";
import { ConversationEntityStore, ConversationStore } from "@/types/chatMessageType";
import { SideBarState } from "@/types/globalTypes";

export default function LeftNavBar() {
    const [leftSidebarOpen] = useSideBarState((state: SideBarState) => [state.leftSidebarOpen]);

    const [leftSidebarClasses, setLeftSidebarClasses] = useState<string[]>([]);

    const [conversationMap, setEntityConversation, removeConversationMap] = useConversationEntityStore(
        (state: ConversationEntityStore) => [state.conversationMap, state.setConversation, state.removeConversation],
    );

    const [selectedId, conversation, setCurrentConversation, clearConversation, setTitle] = useConversationStore(
        (state: ConversationStore) => [
            state.id,
            state.conversation,
            state.setCurrentConversation,
            state.clearConversation,
            state.setTitle,
        ],
    );

    const path = usePathname();

    const titleChangeHandler = (title: string) => {
        setTitle(title);
        setEntityConversation(selectedId!, conversation, title);
    };

    useEffect(() => {
        if (!leftSidebarOpen) {
            setLeftSidebarClasses(["w-0"]);
        } else {
            setLeftSidebarClasses([]);
        }
    }, [leftSidebarOpen]);

    useEffect(() => {
        if (path === "/") {
            setCurrentConversation(undefined, [], undefined);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [path]);

    const convIds = Object.entries(conversationMap);

    return (
        <div
            className={`sidebar-core shrink-0 overflow-x-hidden border-none ${leftSidebarClasses.join(" ")}`}
            role="left-navigation"
        >
            <div className={`h-full w-[var(--sidebar-width)]`}>
                <div className="flex h-full flex-none flex-col gap-2 p-2">
                    <CreateChatButton />
                    {/* <hr className="my-1 h-1 border-0 bg-gray-200 dark:bg-gray-700" /> */}
                    <div className="flex grow flex-col gap-1 overflow-auto rounded-lg border border-primary/50 p-1">
                        <Reorder.Group axis="y" values={convIds} onReorder={() => {}}>
                            <AnimatePresence mode="sync">
                                {convIds.length > 0 ? (
                                    convIds
                                        .map(([id, convMap]) => (
                                            <Reorder.Item key={id} value={convMap} transition={{ type: "spring" }}>
                                                <ChatListButton
                                                    key={id}
                                                    id={id}
                                                    convMap={convMap}
                                                    selected={id === selectedId}
                                                    setCurrentConversation={setCurrentConversation}
                                                    setTitle={titleChangeHandler}
                                                    clearConversation={clearConversation}
                                                    removeConversationMap={removeConversationMap}
                                                />
                                            </Reorder.Item>
                                        ))
                                        .reverse()
                                ) : (
                                    <div className="mt-4 flex flex-col items-center justify-center">
                                        <TbMistOff className="text-gray-400" size="1.5rem" />
                                        <p className="text-gray-400">No Conversations</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </Reorder.Group>
                    </div>
                    <div className="flex flex-col rounded-lg border border-primary/50 p-1">
                        <div className="relative flex items-center">
                            <SettingsModal key="settings-modal" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
