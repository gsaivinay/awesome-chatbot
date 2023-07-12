import { FC } from "react";

import { RegenerateResponseButton } from "@/Components/Buttons/ChatInteractions";
import { TextAreaWithButton } from "@/Components/Chat/Inputs";
import { useChatResponseStatus } from "@/Store/ChatSettings";

const ChatInput: FC = () => {
    const [inProgress] = useChatResponseStatus((state) => [state.inProgress]);
    return (
        <div className="bg-vert-light-gradient absolute bottom-0 left-0 w-[calc(100%-.5rem)] border-t border-t-0 border-transparent !bg-transparent pt-2">
            <form className="stretch mx-auto mb-6 flex flex-row gap-3 lg:max-w-[52rem]">
                <div className="relative flex h-full flex-1 flex-col">
                    <div
                        className={`m-auto mb-2 flex w-full justify-center gap-0 gap-2 ${!inProgress ? "hidden" : ""}`}
                    >
                        <RegenerateResponseButton />
                    </div>
                    <TextAreaWithButton />
                </div>
            </form>
        </div>
    );
};

export default ChatInput;
