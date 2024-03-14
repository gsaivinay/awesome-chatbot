const Intro = () => {
    return (
        <div className="transition-width relative flex h-full w-full flex-1 flex-grow flex-col items-stretch justify-center overflow-hidden">
            <div className="text-center text-4xl font-bold text-primary ">Welcome to Open Assistant</div>
            <div className="text-center text-lg text-gray-800 ">
                <div className="mb-8">
                    Discover the Power of Open Assistant powered by mistralai/Mixtral-8x7B-Instruct-v0.1 model
                </div>
            </div>
            <div className="text-center text-gray-500 ">
                <div className="mb-2">Ready to embark on a conversation?</div>
                <div className="mb-2">
                    Add your <b>Huggingface API Key</b> in the settings
                </div>
                <div className="mb-2">
                    (You can still continue without adding API key, but responses can be slow or rate limited)
                </div>
                <br></br>
                <div className="mb-2">
                    Click the <b>+ New Chat</b> button on the top left
                </div>
                <div className="mb-2">or select an existing conversation from the list</div>
            </div>
        </div>
    );
};

export default Intro;
