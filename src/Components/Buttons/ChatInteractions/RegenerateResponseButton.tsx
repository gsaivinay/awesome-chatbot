import { FaStop } from "react-icons/fa";

import { useChatResponseStatus } from "@/Store/ChatSettings";

const RegenerateResponseButton: React.FC = () => {
    const [updateProgress] = useChatResponseStatus((state) => [state.updateProgress]);

    const setProgressToDone = () => {
        updateProgress(false);
    };

    return (
        <button
            type="button"
            role="stop-generation"
            onClick={setProgressToDone}
            className="button-core border-200 bg-secondary p-2 font-normal hover:bg-200"
        >
            <div className="flex w-full items-center justify-center gap-2">
                <>
                    <FaStop />
                    <span>Stop generating</span>
                </>
            </div>
        </button>
    );
};

export default RegenerateResponseButton;
