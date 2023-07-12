import { FC } from "react";
import { TbArrowDown } from "react-icons/tb";

type FloatingButtonProps = {
    scrollToBottom: () => void;
};

const FloatingButton: FC<FloatingButtonProps> = ({ scrollToBottom }) => {
    return (
        <button
            type="button"
            className="cursor-pointer absolute right-6 bottom-[124px] md:bottom-[120px] z-10 rounded-full border border-gray-200 text-gray-600 shadow-lg"
            onClick={scrollToBottom}
        >
            <TbArrowDown className="m-1" />
        </button>
    );
};

export default FloatingButton;
