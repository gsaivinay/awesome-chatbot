"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useConversationEntityStore, useConversationStore } from "@/store/chatStore";
import { useChatResponseStatus } from "@/store/globalStore";
import useSideBarState from "@/store/globalStore";
import type { NavBar } from "@/types/types";
import {
    type ActiveConversation,
    type ChatResponseStatus,
    type ConversationEntityStore,
    SourceTypes,
} from "@/types/types";

export default function RightNavBar() {
    const [conversation, id, title, setCurrentConversation, removeLastMessage, getCurrentConversationInfo] =
        useConversationStore((state: ActiveConversation) => [
            state.conversation,
            state.id,
            state.title,
            state.setActiveChat,
            state.removeLastMessage,
            state.getActiveMetadata,
        ]);
    const [setConversationMap] = useConversationEntityStore((state: ConversationEntityStore) => [
        state.setConversation,
    ]);
    const [updateProgress] = useChatResponseStatus((state: ChatResponseStatus) => [state.updateProgress]);
    const [rightNavExpanded] = useSideBarState((state: NavBar) => [state.rightNavExpanded]);

    const rightSidebarClasses = rightNavExpanded ? ["w-72"] : ["w-0"];

    return (
        <div
            className={` shrink-0 overflow-hidden  border border-border p-0 pt-2 transition-all duration-200 ${rightSidebarClasses.join(
                " ",
            )}`}
        >
            <div className={"h-full w-72 overflow-x-hidden"}>
                <div className="m-2 flex flex-col  gap-2 rounded-lg border border-border p-2 text-center">
                    <div className="mb-1 text-center text-lg font-bold text-secondary-foreground">Controls</div>
                    {id !== null && id !== undefined && id !== "" && (
                        <>
                            <Button
                                variant={"secondary"}
                                onClick={() => {
                                    if (id) {
                                        setConversationMap(id, [], title);
                                        setCurrentConversation(id, [], title);
                                    }
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
                                    id && setConversationMap(id, conversation);
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
                                onCheckedChange={(checked) => {
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
