export type Source = "user" | "bot";

export enum SourceTypes {
    USER = "user",
    BOT = "bot",
    SYSTEM = "system",
}

export type Message = {
    id?: string;
    createdAt?: Date;
    role: SourceTypes;
    content: string;
    sources?: string[];
    urls?: string[];
};

export type CreateMessage = {
    id?: string;
    createdAt?: Date;
    role: SourceTypes;
    content: string;
    sources?: string[];
    urls?: string[];
};

export type Conversation = Message[];

export type ConvInfo = Pick<Message, "id" | "role">;

export type ConversationStore = {
    id: string | undefined;
    conversation: Conversation;
    title: string | undefined;
    addMessage: (message: Message) => void;
    appendToLastMessage: (message: Message) => void;
    replaceLastMessage: (message: Message) => void;
    removeLastMessage: () => void;
    setCurrentConversation: (id: string | undefined, conversation: Conversation, title?: string) => void;
    getCurrentConversation: () => {
        id: string | undefined;
        conversation: Conversation;
        title: string | undefined;
    };
    getCurrentConversationInfo: () => ConvInfo[];
    getMessageByIdx: (idx: number) => Message;
    setTitle: (title: string) => void;
    clearConversation: () => void;
};

export type ConversationEntity = {
    id: string;
    title: string;
    conversation: Conversation;
    createdAt?: Date | undefined;
};

export type ConversationEntityStore = {
    conversationMap: Record<string, ConversationEntity>;
    createConversation: (id: string, conversation: Conversation) => void;
    setConversation: (id: string, conversation: Conversation, title?: string) => void;
    getConversation: (id: string) => Conversation;
    removeConversation: (id: string) => void;
};

export type ChatResponseStatus = {
    inProgress: boolean;
    updateProgress: (status: boolean) => void;
    getProgressStatus: () => boolean;
};

export type UseChatOptions = {
    /**
     * The API endpoint that accepts a `{ messages: Message[] }` object and returns
     * a stream of tokens of the AI chat response. Defaults to `/api/chat`.
     */
    api?: string;

    /**
     * An unique identifier for the chat. If not provided, a random one will be
     * generated. When provided, the `useChat` hook with the same `id` will
     * have shared states across components.
     */
    id?: string;

    /**
     * Initial messages of the chat. Useful to load an existing chat history.
     */
    initialMessages?: Message[];

    /**
     * Initial input of the chat.
     */
    initialInput?: string;

    /**
     * Callback function to be called when the API response is received.
     */
    onResponse?: (response: Response) => void;

    /**
     * Callback function to be called when the chat is finished streaming.
     */
    onFinish?: (message?: Message) => void;

    /**
     * Callback function to be called when the chat is incomplete but finished streaming.
     */
    onIncomplete?: (message?: Message) => void;

    /**
     * Callback function to be called when an error is encountered.
     */
    onError?: (error: Error) => void;

    /**
     * HTTP headers to be sent with the API request.
     */
    headers?: Record<string, string> | Headers;

    /**
     * Extra body object to be sent with the API request.
     * @example
     * Send a `sessionId` to the API along with the messages.
     * ```js
     * useChat({
     *   body: {
     *     sessionId: '123',
     *   }
     * })
     * ```
     */
    body?: object;

    /**
     * Whether to send extra message fields such as `message.id` and `message.createdAt` to the API.
     * Defaults to `false`. When set to `true`, the API endpoint might need to
     * handle the extra fields before forwarding the request to the AI service.
     */
    sendExtraMessageFields?: boolean;

    setIsUnfinished?: React.Dispatch<React.SetStateAction<boolean>>;
};
