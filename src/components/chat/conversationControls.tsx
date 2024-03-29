import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { GrEdit } from "react-icons/gr";
import { TbCheck, TbX } from "react-icons/tb";

import { Button } from "@/components/ui/button";

interface ConversationControlsProps {
    conversationId: string;
    updateConversationTitle: (newTitle: string) => void;
    resetConversation: () => void;
    deleteConversation: (id: string) => void;
    isLoading: boolean;
    conversationTitleInputRef: React.RefObject<HTMLInputElement | undefined>;
    isEditingTitle: boolean;
    setIsEditingTitle: (status: boolean) => void;
}

type ConfirmationControlsProps = {
    onConfirm: () => void;
    onCancel: () => void;
};

export function ConversationControls({
    conversationId,
    updateConversationTitle,
    resetConversation,
    deleteConversation,
    isLoading,
    conversationTitleInputRef,
    isEditingTitle,
    setIsEditingTitle,
}: ConversationControlsProps) {
    const [isDeletingConversation, setIsDeletingConversation] = useState(false);
    const router = useRouter();

    const confirmDeleteConversation = () => {
        deleteConversation(conversationId);
        resetConversation();
        setIsDeletingConversation(false);
        router.push("/");
    };

    const confirmUpdateConversationTitle = () => {
        if (conversationTitleInputRef?.current?.value) {
            updateConversationTitle(conversationTitleInputRef.current.value);
        }
        setIsEditingTitle(false);
    };

    const DefaultControls = () => {
        return (
            <div className="absolute right-1 z-10 mb-2 flex">
                <Button
                    className="size-8 border-0 bg-transparent p-0"
                    variant={"secondary"}
                    size={"icon"}
                    onClick={() => {
                        setIsEditingTitle(true);
                        conversationTitleInputRef.current?.focus();
                    }}
                    disabled={isLoading}
                >
                    <GrEdit size="1rem" />
                </Button>
                <Button
                    className="size-8 border-0 bg-transparent p-0"
                    variant={"secondary"}
                    size={"icon"}
                    onClick={() => {
                        setIsDeletingConversation(true);
                    }}
                    disabled={isLoading}
                >
                    <FaRegTrashCan size="1rem" />
                </Button>
            </div>
        );
    };

    const ConfirmationControls = ({ onConfirm, onCancel }: ConfirmationControlsProps) => (
        <div className="absolute right-1 z-10 mb-2 flex">
            <Button
                className="size-8 border-0 bg-transparent p-0"
                variant={"secondary"}
                size={"icon"}
                onClick={onConfirm}
            >
                <TbCheck size="1rem" />
            </Button>
            <Button
                className="size-8 border-0 bg-transparent p-0"
                variant={"secondary"}
                size={"icon"}
                onClick={onCancel}
            >
                <TbX size="1rem" />
            </Button>
        </div>
    );

    return isDeletingConversation || isEditingTitle ? (
        <ConfirmationControls
            onConfirm={isDeletingConversation ? confirmDeleteConversation : confirmUpdateConversationTitle}
            onCancel={() => {
                setIsEditingTitle(false);
                setIsDeletingConversation(false);
            }}
        />
    ) : (
        <DefaultControls />
    );
}
