import { AiOutlineLike } from "react-icons/ai";

const LikeButton = () => {
    return (
        <button type="button" className="rounded-md p-1 hover:bg-gray-100 hover:text-gray-700 ">
            <AiOutlineLike size={20} />
        </button>
    );
};

export default LikeButton;
