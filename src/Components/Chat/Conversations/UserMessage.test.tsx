// import "@testing-library/jest-dom/extend-expect";

import { render, screen } from "@testing-library/react";

import UserMessage from "@/Components/Chat/Conversations/UserMessage";
import { SourceTypes } from "@/types/chatMessageType";

describe("UserMessage", () => {
    const message = "Sample message text";

    beforeEach(() => {
        render(<UserMessage key={1} content={message} role={SourceTypes.USER} idx={0} />);
    });

    // it("renders the UserMessage component with the provided message", () => {
    //     const messageElement = screen.getByText(message);
    //     expect(messageElement).toBeInTheDocument();
    // });

    it("renders the UserAvatar component", () => {
        const avatarElement = screen.getByRole("img", { name: "user avatar" });
        expect(avatarElement).toBeInTheDocument();
    });
});
