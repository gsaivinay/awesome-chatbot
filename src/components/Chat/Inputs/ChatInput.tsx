import { FC } from "react";

import { TextAreaWithButton } from "@/components/Chat/Inputs";

const ChatInput: FC = () => {
    return (
        <div className="bg-background flex justify-center absolute bottom-0 left-0 w-[calc(100%-.5rem)] border-t border-transparent pt-2">
            <div className="relative flex h-full flex-1 flex-col items-center justify-center max-w-5xl shadow-primary shadow-2xl">
                <TextAreaWithButton />
            </div>
        </div>
    );
};

export default ChatInput;
