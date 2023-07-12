import { AiOutlineDislike } from "react-icons/ai";

const DislikeButton = () => {
    return (
        <button type="button" className="p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 ">
            <AiOutlineDislike size={20} />
        </button>
    );
};

export default DislikeButton;
