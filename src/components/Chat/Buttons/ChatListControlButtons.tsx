import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { GrEdit } from "react-icons/gr";
import { TbCheck, TbX } from "react-icons/tb";

import { Button } from "@/components/ui/button";

interface LocalProps {
    id: string;
    setTitle: (title: string) => void;
    clearConversation: () => void;
    removeConversationMap: (id: string) => void;
    inProgress: boolean;
    titleRef: React.RefObject<HTMLInputElement | undefined>;
    isRenaming: boolean;
    setIsRenaming: (status: boolean) => void;
}

type ActionProps = {
    confirm: () => void;
    cancel: () => void;
};

export function ChatListButtonControls({
    id,
    setTitle,
    clearConversation,
    removeConversationMap,
    inProgress,
    titleRef,
    isRenaming,
    setIsRenaming,
}: LocalProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const router = useRouter();

    const handleDeleteConversation = () => {
        removeConversationMap(id);
        clearConversation();
        setIsDeleting(false);
        router.push("/");
    };

    const handleRenameConversation = () => {
        if (titleRef!.current?.value) setTitle(titleRef.current.value);
        setIsRenaming(false);
    };

    const InitControls = () => {
        return (
            <div className="absolute right-1 z-10 mb-2 flex">
                <Button
                    className="size-8 border-0 bg-transparent p-0"
                    variant={"secondary"}
                    size={"icon"}
                    onClick={() => {
                        setIsRenaming(true);
                        titleRef.current?.focus();
                    }}
                    disabled={inProgress}
                >
                    <GrEdit size="1rem" />
                </Button>
                <Button
                    className="size-8 border-0 bg-transparent p-0"
                    variant={"secondary"}
                    size={"icon"}
                    onClick={() => {
                        setIsDeleting(true);
                    }}
                    disabled={inProgress}
                >
                    <FaRegTrashCan size="1rem" />
                </Button>
            </div>
        );
    };

    const ConfirmActionControls = ({ confirm, cancel }: ActionProps) => (
        <div className="absolute right-1 z-10 mb-2 flex">
            <Button
                className="size-8 border-0 bg-transparent p-0"
                variant={"secondary"}
                size={"icon"}
                onClick={() => {
                    confirm();
                }}
            >
                <TbCheck size="1rem" />
            </Button>
            <Button
                className="size-8 border-0 bg-transparent p-0"
                variant={"secondary"}
                size={"icon"}
                onClick={() => {
                    cancel();
                }}
            >
                <TbX size="1rem" />
            </Button>
        </div>
    );

    return isDeleting || isRenaming ? (
        <ConfirmActionControls
            confirm={isDeleting ? handleDeleteConversation : handleRenameConversation}
            cancel={function (): void {
                setIsRenaming(false);
                setIsDeleting(false);
            }}
        />
    ) : (
        <InitControls />
    );
}
