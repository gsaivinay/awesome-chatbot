import ChatWindow from "@/components/chat/chatWindow";

export default async function Page({ params }: { params: { id: string } }) {
    return <ChatWindow key={params.id} conversationId={params.id} />;
}
