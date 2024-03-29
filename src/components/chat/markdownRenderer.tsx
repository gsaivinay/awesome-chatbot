import "katex/dist/katex.min.css";

import { memo, useMemo } from "react";
import type { ReactMarkdownOptions } from "react-markdown/lib/react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { useConversationStore } from "@/store/chatStore";
import type { ActiveConversation } from "@/types/types";

import { CodeGen } from "./codeGen";
import { MemoizedReactMarkdown } from "./memoizedReactMarkdown";

interface MarkdownRendererProps {
    content: string;
    messageId: number;
}

const markdownPlugins = {
    remark: [remarkGfm, remarkMath],
    rehype: [rehypeKatex],
};

const MarkdownRenderer = memo((props: MarkdownRendererProps) => {
    const { messageId } = props;
    const [conversation] = useConversationStore((state: ActiveConversation) => [state.conversation]);
    const message = conversation[messageId];

    const customComponents: ReactMarkdownOptions["components"] = useMemo(
        () => ({
            code: ({ node, inline, className, children, ...props }) => {
                const languageMatch = /language-(\w+)/.exec(className || "");
                const language = languageMatch ? languageMatch[1] : "";

                return !inline ? (
                    <CodeGen
                        key={`${messageId}-${node.position?.start.line}-${node.position?.start.column}`}
                        lang={language}
                        code={String(children).replace(/\n$/, "")}
                    />
                ) : (
                    <code className={className} {...props}>
                        {children}
                    </code>
                );
            },
            table: ({ children }) => (
                <div className="overflow-hidden rounded-lg border border-border p-1">
                    <table className="m-0">{children}</table>
                </div>
            ),
            th: ({ children }) => (
                <th className="break-words border border-border bg-secondary px-3 py-1 text-secondary-foreground">
                    {children}
                </th>
            ),
            td: ({ children }) => <td className="break-words border border-border px-3 py-1">{children}</td>,
        }),
        [messageId],
    );

    return (
        <MemoizedReactMarkdown
            key={`${messageId}-${message?.id}`}
            className="m-0"
            remarkPlugins={markdownPlugins.remark}
            rehypePlugins={markdownPlugins.rehype}
            components={customComponents}
            linkTarget="_blank"
        >
            {message ? message.content : ""}
        </MemoizedReactMarkdown>
    );
});

MarkdownRenderer.displayName = "MarkdownRenderer";

export { MarkdownRenderer };
