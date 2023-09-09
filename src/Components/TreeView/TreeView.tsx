import { useState } from "react";

interface Child {
    id: number;
    title: string;
}

interface TreeNode {
    id: number;
    title: string;
    children: Child[];
}

interface TreeViewProps {
    data: TreeNode;
}

interface TreeViewListProps {
    data: TreeNode[];
}

const TreeView: React.FC<TreeViewProps> = ({ data }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="mb-2 flex items-center">
            {isOpen ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 h-4 w-4 text-gray-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    onClick={handleClick}
                >
                    <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-7a1 1 0 0 1 2 0v3a1 1 0 1 1-2 0v-3zm0-4a1 1 0 0 1 2 0v1a1 1 0 1 1-2 0v-1z"
                        clipRule="evenodd"
                    />
                </svg>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 h-4 w-4 text-gray-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    onClick={handleClick}
                >
                    <path
                        fillRule="evenodd"
                        d="M7 9a1 1 0 0 1 1-1h4a1 1 0 0 1 0 2H8a1 1 0 0 1-1-1zm-1-4a1 1 0 0 1 1-1h4a1 1 0 0 1 0 2H7a1 1 0 0 1-1-1zm1 8a1 1 0 0 1-1-1H3a1 1 0 1 1 0-2h3a1 1 0 0 1 1 1v2z"
                        clipRule="evenodd"
                    />
                </svg>
            )}
            <span className="font-bold">{data.title}</span>
            {isOpen && (
                <div className="mt-2 pl-4">
                    {data.children.map((child) => (
                        <div key={child.id} className="mb-2 flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="mr-2 h-3 w-3 text-gray-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <circle cx="10" cy="10" r="6" />
                            </svg>
                            <span>{child.title}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const TreeViewList: React.FC<TreeViewListProps> = ({ data }) => {
    return (
        <div className="space-y-2">
            {data.map((item) => (
                <TreeView key={item.id} data={item} />
            ))}
        </div>
    );
};

export default TreeViewList;
