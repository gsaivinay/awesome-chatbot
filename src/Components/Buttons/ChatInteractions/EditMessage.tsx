import { TbEdit } from "react-icons/tb";

const EditMessage = () => {
    return (
        <button
            type="button"
            aria-label="edit message"
            className="p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 md:invisible md:group-hover:visible"
        >
            <TbEdit size={20} />
        </button>
    );
};

export default EditMessage;
