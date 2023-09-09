import { TbEdit } from "react-icons/tb";

const EditMessage = () => {
    return (
        <button
            type="button"
            aria-label="edit message"
            className="rounded-md p-1 hover:bg-gray-100 hover:text-gray-700 md:invisible md:group-hover:visible"
        >
            <TbEdit size={20} />
        </button>
    );
};

export default EditMessage;
