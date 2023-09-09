import { AiOutlineDislike } from "react-icons/ai";

const DislikeButton = () => {
    return (
        <button
            type="button"
            data-testid="dislike-icon"
            className="rounded-md p-1 hover:bg-gray-100 hover:text-gray-700 "
        >
            <AiOutlineDislike size={20} />
        </button>
    );
};

export default DislikeButton;
