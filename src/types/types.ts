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

export type ConversationMetadata = Pick<Message, "id" | "role">;

export type ActiveConversation = {
    id: string | undefined;
    conversation: Conversation;
    title: string | undefined;
    addMessage: (message: Message) => void;
    appendToLastMessage: (message: Message) => void;
    replaceLastMessage: (message: Message) => void;
    removeLastMessage: () => void;
    setActiveChat: (id: string | undefined, conversation: Conversation, title?: string) => void;
    getActiveChat: () => {
        id: string | undefined;
        conversation: Conversation;
        title: string | undefined;
    };
    getActiveMetadata: () => ConversationMetadata[];
    getMessageByIdx: (idx: number) => Message;
    setTitle: (title: string) => void;
    resetActiveChat: () => void;
};

export type Conversations = {
    id: string;
    title: string;
    conversation: Conversation;
    createdAt?: Date | undefined;
};

export type ConversationEntityStore = {
    conversationMap: Record<string, Conversations>;
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
    api?: string;

    id?: string;

    initialMessages?: Message[];

    initialInput?: string;

    onResponse?: (response: Response) => void;

    onFinish?: (message?: Message) => void;

    onIncomplete?: (message?: Message) => void;

    onError?: (error: Error) => void;

    headers?: Record<string, string> | Headers;

    body?: object;

    sendExtraMessageFields?: boolean;

    setIsUnfinished?: React.Dispatch<React.SetStateAction<boolean>>;
};

export type NavBar = {
    leftNavExpanded: boolean;
    rightNavExpanded: boolean;
    toggleLeftNav: () => void;
    toggleRightNav: () => void;
};

export type ApiKeyType = {
    apiKey: string | undefined;
    setApiKey: (currentTheme: string) => void;
};

export type GenerationSettings = {
    max_new_tokens: number;
    do_sample: boolean | string;
    temperature: number;
    repetition_penalty: number;
    top_k: number;
    top_p: number;
};

export type GenerationSettingsState = GenerationSettings & {
    setGenerationSettings: (settings: GenerationSettings) => void;
    getGenerationSettings: () => GenerationSettings;
};
