import React from "react";

const Intro = () => {
    return (
        <div className="bg-secondary text-secondary-foreground border border-border relative flex flex-col h-fit mt-8 rounded-lg items-center justify-center p-8 text-center transition-width">
            <h1 className="mb-4 text-4xl text-primary dark:text-secondary-foreground font-bold">
                Welcome to Open Assistant
            </h1>
            <p className="mb-8 text-lg">
                Powered by{" "}
                <a
                    href="https://huggingface.co/mistralai/Mixtral-8x7B-Instruct-v0.1"
                    className="hover:text-primary underline underline-offset-[6px] decoration-dotted"
                    target="_blank"
                >
                    <span className="">mistralai/Mixtral-8x7B-Instruct-v0.1</span>
                </a>{" "}
                model
            </p>
            <div className="text-gray-500">
                <p className="mb-2">
                    Add your Free{" "}
                    <a
                        href="https://huggingface.co/settings/tokens"
                        className="hover:text-primary underline underline-offset-[6px] decoration-dotted"
                        target="_blank"
                    >
                        <strong>Huggingface API Key</strong>
                    </a>{" "}
                    in the settings
                </p>
                <p className="mb-4">
                    (You can still continue without adding API key, but responses can be slow or rate limited)
                </p>
            </div>
        </div>
    );
};

export default Intro;
