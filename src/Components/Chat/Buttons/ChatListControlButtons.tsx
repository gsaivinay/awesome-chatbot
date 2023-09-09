import { useRouter } from "next/router";
import { useState } from "react";
import { TbCheck, TbEdit, TbTrash, TbX } from "react-icons/tb";

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
            <div className="absolute right-1 z-10 flex ">
                <button
                    className="button-core border-0 p-1"
                    onClick={() => {
                        setIsRenaming(true);
                        titleRef.current?.focus();
                    }}
                    disabled={inProgress}
                >
                    <TbEdit size="1rem" />
                </button>
                <button
                    className="button-core border-0 p-1"
                    onClick={() => {
                        setIsDeleting(true);
                    }}
                    disabled={inProgress}
                >
                    <TbTrash size="1rem" />
                </button>
            </div>
        );
    };

    const ConfirmActionControls = ({ confirm, cancel }: ActionProps) => (
        <div className="absolute right-1 z-10 flex">
            <button
                className="button-core border-0 p-1"
                onClick={() => {
                    confirm();
                }}
            >
                <TbCheck size="1rem" />
            </button>
            <button
                className="button-core border-0 p-1"
                onClick={() => {
                    cancel();
                }}
            >
                <TbX size="1rem" />
            </button>
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
