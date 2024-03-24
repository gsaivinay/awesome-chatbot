import "katex/dist/katex.min.css";

import { memo, useMemo } from "react";
import { ReactMarkdownOptions } from "react-markdown/lib/react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { useConversationStore } from "@/store/ChatStore";
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
    // eslint-disable-next-line prefer-const
    let { content, id: convId } = conversation || {};

    const components: ReactMarkdownOptions["components"] = useMemo(() => {
        return {
            code: ({ node, inline, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || "") || [];
                return !inline ? (
                    <CodeBlock
                        key={`${id}-${node.position?.start.line}-${node.position?.start.column}`}
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
                    <div className="rounded-lg border border-border overflow-hidden p-1">
                        <table className="m-0">{children}</table>
                    </div>
                );
            },
            th: ({ children }) => {
                return (
                    <th className="break-words border border-border bg-secondary px-3 py-1 text-secondary-foreground">
                        {children}
                    </th>
                );
            },
            td: ({ children }) => {
                return <td className="break-words border border-border px-3 py-1">{children}</td>;
            },
        };
    }, [id]);


    return (
        <>
            <MemoizedReactMarkdown
                key={`${id}-${convId}`}
                className="m-0"
                remarkPlugins={remarkPlugins}
                rehypePlugins={rehypePlugins}
                components={components}
                linkTarget={"_blank"}
            >
                {content}
            </MemoizedReactMarkdown>
        </>
    );
});

RenderedMarkdown.displayName = "RenderedMarkdown";

export { RenderedMarkdown };
