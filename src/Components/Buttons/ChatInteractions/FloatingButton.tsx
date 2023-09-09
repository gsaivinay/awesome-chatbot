import { FC } from "react";
import { TbArrowDown } from "react-icons/tb";

type FloatingButtonProps = {
    scrollToBottom: () => void;
};

const FloatingButton: FC<FloatingButtonProps> = ({ scrollToBottom }) => {
    return (
        <button
            type="button"
            className="absolute bottom-[124px] right-6 z-10 cursor-pointer rounded-full border border-gray-200 text-gray-600 shadow-lg md:bottom-[120px]"
            onClick={scrollToBottom}
        >
            <TbArrowDown className="m-1" />
        </button>
    );
};

export default FloatingButton;
