import { useRouter } from "next/router";
import { useState } from "react";
import { GrEdit, GrTrash } from "react-icons/gr";
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

export const ChatListButtonControls: React.FC<LocalProps> = ({
    id,
    setTitle,
    clearConversation,
    removeConversationMap,
    inProgress,
    titleRef,
    isRenaming,
    setIsRenaming,
}) => {
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
            <div className="absolute right-1 z-10 flex mb-2">
                <Button
                    className="bg-transparent p-0 border-0 size-8"
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
                    className="bg-transparent p-0 border-0 size-8"
                    variant={"secondary"}
                    size={"icon"}
                    onClick={() => {
                        setIsDeleting(true);
                    }}
                    disabled={inProgress}
                >
                    <GrTrash size="1rem" />
                </Button>
            </div>
        );
    };

    const ConfirmActionControls = ({ confirm, cancel }: ActionProps) => (
        <div className="absolute right-1 z-10 flex mb-2">
            <Button
                className="bg-transparent p-0 border-0 size-8"
                variant={"secondary"}
                size={"icon"}
                onClick={() => {
                    confirm();
                }}
            >
                <TbCheck size="1rem" />
            </Button>
            <Button
                className="bg-transparent p-0 border-0 size-8"
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
};
