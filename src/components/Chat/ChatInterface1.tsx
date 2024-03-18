import "tailwindcss/tailwind.css";

import { useState } from "react";

const App = () => {
    const [messages, setMessages] = useState([
        { author: "user", message: "Hello" },
        { author: "bot", message: "Hi there!" },
    ]);
    const [inputValue, setInputValue] = useState("");

    const handleSendMessage = () => {
        let newMessages = messages;
        if (inputValue !== "" && inputValue) {
            newMessages = [...messages, { author: "user", message: inputValue }];
            setMessages(newMessages);
            setInputValue("");

            // TODO: Replace with actual API call to ChatGPT system
            const botResponse = { author: "bot", message: "Hello, how can I assist you today?" };
            setTimeout(() => {
                setMessages([...newMessages, botResponse]);
            }, 500);
        }
    };

    const handleInputKeyDown = (event: { key: string }) => {
        if (event.key === "Enter") {
            handleSendMessage();
        }
    };

    return (
        <div className="flex size-full flex-col overflow-hidden">
            <div className="grow overflow-auto rounded-md border border-gray-400">
                <div className="container mx-auto flex h-full max-w-2xl flex-col">
                    <div className="grow overflow-y-auto p-6">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={
                                    message.author === "user" ? "mb-4 flex justify-start" : "mb-4 flex justify-start"
                                }
                            >
                                <div
                                    className={`${message.author === "user" ? "bg-indigo-500" : "bg-slate-500"}
                                        mr-4 aspect-square h-full w-9 rounded-full`}
                                />
                                <div
                                    className={
                                        message.author === "user"
                                            ? "max-w-xl rounded-lg bg-indigo-600 p-2 text-white"
                                            : "max-w-xl rounded-lg bg-slate-200 p-2 text-gray-700"
                                    }
                                >
                                    <p className="text-sm">{message.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex p-6">
                        <input
                            className="grow rounded-md border border-gray-300 bg-white px-4 py-2 focus:border-indigo-500 focus:outline-none"
                            type="text"
                            placeholder="Type your message here..."
                            value={inputValue}
                            onChange={event => setInputValue(event.target.value)}
                            onKeyDown={handleInputKeyDown}
                        />
                        <button
                            type="button"
                            className="focus-border-blue-500 ml-4 rounded-md bg-indigo-800 px-4 py-2 font-semibold text-white shadow-md hover:bg-indigo-700 focus:outline-none"
                            onClick={handleSendMessage}
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
