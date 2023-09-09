import { render, screen } from "@testing-library/react";

import { ChatInterface } from "@/Components/Chat";
import { useConversationEntityStore, useConversationStore } from "@/Store/ChatStore";

jest.mock("next/router", () => require("next-router-mock"));

describe("ChatInterface", () => {
    const initialEntityState = useConversationEntityStore.getState();
    const initialConversationState = useConversationStore.getState();
    beforeEach(() => {
        useConversationEntityStore.setState(initialEntityState, true);
        useConversationStore.setState(initialConversationState, true);
    });

    test("should render successfully", async () => {
        render(<ChatInterface id={1} />);

        expect(await screen.findByRole("stop-generation")).toBeInTheDocument();
    });
});
