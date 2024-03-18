import { render, screen } from "@testing-library/react";

import App from "@/components/App";

describe("Intro component", () => {
    test("renders welcome message", () => {
        render(<App />);
        const welcomeMessage = screen.getByText("Welcome to Open Assistant");
        expect(welcomeMessage).toBeInTheDocument();
    });

    test("renders New Chat button", () => {
        render(<App />);
        const newChatButton = screen.getByText("+ New Chat");
        expect(newChatButton).toBeInTheDocument();
    });

    test("renders existing conversation instructions", () => {
        render(<App />);
        const existingConversationInstructions = screen.getByText(/select an existing conversation from the list/i);
        expect(existingConversationInstructions).toBeInTheDocument();
    });

    // You can write more tests for other parts of the component if needed
});
