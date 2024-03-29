import hljs, { type HighlightResult } from "highlight.js";
import { type FC, memo, useEffect, useRef, useState } from "react";
import { AiOutlineCheck, AiOutlineCopy, AiOutlineDownload } from "react-icons/ai";

import { generateRandomString, programmingLanguages } from "@/utils/app/codeblock";

interface CodeSnippetProps {
    lang: string;
    code: string;
}

const CodeGen: FC<CodeSnippetProps> = memo(
    ({ lang, code }) => {
        const detectedLang = useRef<string>(lang);
        const shouldDetectLang = useRef<boolean>(true);
        const detectLangTimeout = useRef<NodeJS.Timeout>();
        const isLangSupported = hljs.getLanguage(lang) !== undefined;

        if (!isLangSupported) {
            detectedLang.current = "";
        }

        useEffect(() => {
            if (lang === "AUTO_DETECT" || lang === "" || !lang || !isLangSupported) {
                detectedLang.current = "";
                shouldDetectLang.current = true;
            } else {
                detectedLang.current = lang;
                shouldDetectLang.current = false;
                clearTimeout(detectLangTimeout.current);
            }
        }, [lang, isLangSupported]);

        const [hasCopied, setHasCopied] = useState<boolean>(false);

        const copyCode = () => {
            if (!navigator.clipboard || !navigator.clipboard.writeText) {
                return;
            }
            navigator.clipboard.writeText(code).then(() => {
                setHasCopied(true);
                setTimeout(() => {
                    setHasCopied(false);
                }, 2000);
            });
        };

        let highlightedCode: HighlightResult;

        if (detectedLang.current === "" || !detectedLang.current) {
            highlightedCode = hljs.highlightAuto(code);
            if (highlightedCode.language) {
                detectedLang.current = highlightedCode.language;
            }
            if (code.length < 2000 && shouldDetectLang.current) {
                detectLangTimeout.current = setTimeout(() => {
                    if (shouldDetectLang.current) detectedLang.current = "";
                }, 500);
            }
        } else {
            highlightedCode = hljs.highlight(code, { language: detectedLang.current, ignoreIllegals: true });
        }

        const saveAsFile = () => {
            const fileExt = programmingLanguages[highlightedCode.language || ""] || ".file";
            const defaultFileName = `snippet-${generateRandomString(3, true)}${fileExt}`;
            const fileName = window.prompt("Enter file name", defaultFileName);
            if (!fileName) {
                return;
            }
            const blob = new Blob([code], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.download = fileName;
            link.href = url;
            link.style.display = "none";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        };

        return (
            <div className="codeblock relative flex flex-col overflow-hidden rounded-lg border font-sans dark:border-primary/50">
                <div className="flex items-center justify-between px-4 py-1.5">
                    <span className="text-xs lowercase text-white">{detectedLang.current}</span>
                    <div className="flex items-center">
                        <button
                            type="button"
                            className="flex items-center rounded bg-none p-1 text-xs text-white"
                            onClick={saveAsFile}
                        >
                            <AiOutlineDownload size={18} />
                        </button>
                        <button
                            type="button"
                            className="flex items-center gap-1.5 rounded bg-none p-1 text-xs text-white"
                            onClick={copyCode}
                        >
                            {hasCopied ? <AiOutlineCheck size={18} /> : <AiOutlineCopy size={18} />}
                        </button>
                    </div>
                </div>
                <code
                    className="hljs overflow-auto whitespace-pre rounded-lg p-1 px-4 py-1.5"
                    dangerouslySetInnerHTML={{ __html: highlightedCode.value }}
                />
            </div>
        );
    },
    (prevProps, nextProps) => {
        return prevProps.lang === nextProps.lang && prevProps.code === nextProps.code;
    },
);

CodeGen.displayName = "CodeGen";

export { CodeGen };
