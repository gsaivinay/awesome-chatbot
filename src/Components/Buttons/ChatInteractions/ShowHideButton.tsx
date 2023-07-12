import { FC } from "react";
import { BiHide, BiShow } from "react-icons/bi";

const ShowHideButton: FC<{ isHidden: boolean; handler: () => void }> = ({ isHidden, handler }) => {
    return (
        <button
            type="button"
            onClick={handler}
            aria-label="show/hide source"
            className="rounded-md hover:bg-gray-100 hover:text-gray-700"
        >
            {!isHidden ? <BiShow /> : <BiHide />}
        </button>
    );
};

export default ShowHideButton;
