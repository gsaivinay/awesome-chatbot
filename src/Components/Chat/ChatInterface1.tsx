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
        <div className="flex flex-col overflow-hidden w-full h-full">
            <div className="flex-grow border rounded-md border-gray-400 overflow-auto">
                <div className="container mx-auto max-w-2xl h-full flex flex-col">
                    <div className="overflow-y-auto flex-grow p-6">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={
                                    message.author === "user" ? "flex justify-start mb-4" : "flex justify-start mb-4"
                                }
                            >
                                <div
                                    className={`${message.author === "user" ? "bg-indigo-500" : "bg-slate-500"}
                                        rounded-full aspect-square h-full w-9 mr-4`}
                                />
                                <div
                                    className={
                                        message.author === "user"
                                            ? "bg-indigo-600 text-white p-2 rounded-lg max-w-xl"
                                            : "bg-slate-200 text-gray-700 p-2 rounded-lg max-w-xl"
                                    }
                                >
                                    <p className="text-sm">{message.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-6 flex">
                        <input
                            className="flex-grow rounded-md border border-gray-300 py-2 px-4 bg-white focus:outline-none focus:border-indigo-500"
                            type="text"
                            placeholder="Type your message here..."
                            value={inputValue}
                            onChange={(event) => setInputValue(event.target.value)}
                            onKeyDown={handleInputKeyDown}
                        />
                        <button
                            type="button"
                            className="ml-4 px-4 py-2 bg-indigo-800 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus-border-blue-500"
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
