import { useRouter } from "next/router";

import { ChatInterface } from "@/components/Chat";

const Chat: React.FC & { whyDidYouRender: boolean } = () => {
    console.log("in app router");
    const { query } = useRouter();
    const id = query.id as string;

    const router = useRouter();

    if (!id) router.push("/");

    return <ChatInterface key={id} id={id} />;
};

Chat.displayName = "Chat";
Chat.whyDidYouRender = true;
export default Chat;
