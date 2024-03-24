"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useChatResponseStatus } from "@/store/ChatSettings";
import { useConversationEntityStore, useConversationStore } from "@/store/ChatStore";
import useSideBarState from "@/store/GlobalStore";
import { ChatResponseStatus, ConversationEntityStore, ConversationStore, SourceTypes } from "@/types/chatMessageType";
import { SideBarState } from "@/types/globalTypes";

export default function RightNavBar() {
    const [conversation, id, title, setCurrentConversation, removeLastMessage, getCurrentConversationInfo] =
        useConversationStore((state: ConversationStore) => [
            state.conversation,
            state.id,
            state.title,
            state.setCurrentConversation,
            state.removeLastMessage,
            state.getCurrentConversationInfo,
        ]);
    const [setConversationMap] = useConversationEntityStore((state: ConversationEntityStore) => [
        state.setConversation,
    ]);
    const [updateProgress] = useChatResponseStatus((state: ChatResponseStatus) => [state.updateProgress]);
    const [rightSidebarOpen] = useSideBarState((state: SideBarState) => [state.rightSidebarOpen]);
    const [rightSidebarClasses, setRightSidebarClasses] = useState<string[]>(["w-0"]);

    useEffect(() => {
        if (!rightSidebarOpen) {
            setRightSidebarClasses(["w-0"]);
        } else {
            setRightSidebarClasses([]);
        }
    }, [rightSidebarOpen]);

    return (
        <div
            className={`sidebar-core shrink-0 overflow-hidden p-0 ${rightSidebarClasses.join(" ")}`}
            role="right-navigation"
        >
            <div className={`h-full w-[var(--sidebar-width)] overflow-x-hidden`}>
                <div className="m-2 flex flex-col  gap-2 rounded-lg border border-border p-2 text-center">
                    <div className="mb-1 text-center text-lg font-bold text-secondary-foreground">Controls</div>
                    {id !== null && id !== undefined && id !== "" && (
                        <>
                            <Button
                                variant={"secondary"}
                                onClick={() => {
                                    setConversationMap(id!, [], title);
                                    setCurrentConversation(id!, [], title);
                                }}
                            >
                                Clear chat
                            </Button>
                            <Button
                                variant={"secondary"}
                                onClick={() => {
                                    updateProgress(false);
                                    removeLastMessage();
                                    const info = getCurrentConversationInfo();
                                    if (info[info.length - 1].role === SourceTypes.USER) {
                                        // Remove another time
                                        removeLastMessage();
                                    }
                                    setConversationMap(id!, conversation);
                                }}
                            >
                                Clear last turn
                            </Button>
                        </>
                    )}
                    {process.env.NODE_ENV === "development" && (
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="terms"
                                onCheckedChange={checked => {
                                    updateProgress(checked as boolean);
                                }}
                            />
                            <label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                In progress
                            </label>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
