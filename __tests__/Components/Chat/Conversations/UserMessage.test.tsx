import { render } from "@testing-library/react";

import UserMessage from "@/components/Chat/Conversations/UserMessage";
import { SourceTypes } from "@/types/chatMessageType";

jest.mock("@/components/Chat/Avatars", () => ({
    UserAvatar: () => <div data-testid="mock-user-avatar" />,
}));

describe("UserMessage", () => {
    test("renders without errors", () => {
        const { container } = render(<UserMessage idx={1} role={SourceTypes.USER} content={""} />);
        expect(container).toBeInTheDocument();
    });

    // test("displays the correct conversation content", () => {
    //     const { getByText } = render(<UserMessage idx={1} role={SourceTypes.USER} content={""} />);
    //     expect(getByText("Test message 1")).toBeInTheDocument();
    // });

    test("renders the UserAvatar component", () => {
        const { getByTestId } = render(<UserMessage idx={1} role={SourceTypes.USER} content={""} />);
        expect(getByTestId("mock-user-avatar")).toBeInTheDocument();
    });
});
