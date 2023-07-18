import { memo, useMemo } from "react";
import { ReactMarkdownOptions } from "react-markdown/lib/react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { useConversationStore } from "@/Store/ChatStore";
import { ConversationStore } from "@/types/chatMessageType";

import { CodeBlock } from "./CodeBlock";
import { MemoizedReactMarkdown } from "./MemoizedReactMarkdown";

interface MarkDownProps {
    markdown: string;
    id: number;
}

const remarkPlugins = [remarkGfm, remarkMath];
const rehypePlugins = [rehypeKatex];

const RenderedMarkdown = memo((props: MarkDownProps) => {
    const { id } = { ...props };
    const [getMessageByIdx] = useConversationStore((state: ConversationStore) => [state.getMessageByIdx]);
    const conversation = getMessageByIdx(id);

    const components: ReactMarkdownOptions["components"] = useMemo(() => {
        return {
            code: ({ node, inline, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || "") || [];
                return !inline ? (
                    <CodeBlock
                        key={`${id}-${node.position?.start.line}-${node.position?.start.column}`}
                        // id={`${id}-${node.position?.start.line}-${node.position?.start.column}`}
                        language={match && match[1]}
                        value={String(children).replace(/\n$/, "")}
                    />
                ) : (
                    <code className={className} {...props}>
                        {children}
                    </code>
                );
            },
            table: ({ children }) => {
                return (
                    <table className="border-collapse border border-black px-3 py-1 dark:border-white">
                        {children}
                    </table>
                );
            },
            th: ({ children }) => {
                return (
                    <th className="break-words border border-black bg-gray-500 px-3 py-1 text-white dark:border-white">
                        {children}
                    </th>
                );
            },
            td: ({ children }) => {
                return <td className="break-words border border-black px-3 py-1 dark:border-white">{children}</td>;
            },
        };
    }, [id]);

    // useEffect(() => {
    //     return () => {
    //         console.log(`unmount markdown block: ${id}`);
    //     };
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    return (
        <MemoizedReactMarkdown
            key={`${id}-${conversation?.id}`}
            className="m-0"
            remarkPlugins={remarkPlugins}
            rehypePlugins={rehypePlugins}
            components={components}
        >
            {conversation?.content}
        </MemoizedReactMarkdown>
    );
});

RenderedMarkdown.displayName = "RenderedMarkdown";

export { RenderedMarkdown };
