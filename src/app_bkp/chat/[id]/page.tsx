import { ChatInterface } from "@/components/Chat";

export default function Page({ params }: { params: { id: string } }) {
    return <ChatInterface key={params.id} id={params.id} />;
}
