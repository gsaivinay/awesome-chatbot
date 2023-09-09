import { render } from "@testing-library/react";

import { DislikeButton } from "@/Components/Buttons/ChatInteractions";

describe("DislikeButton", () => {
    test("renders without errors", () => {
        const { container } = render(<DislikeButton />);
        expect(container).toBeInTheDocument();
    });

    // test("button click triggers an action", () => {
    //     // Mock your action function (e.g., you can use Jest's mock function)
    //     const mockActionFunction = jest.fn();

    //     const { getByRole } = render(<DislikeButton />);
    //     const button = getByRole("button");

    //     fireEvent.click(button);

    //     expect(mockActionFunction).toHaveBeenCalledTimes(1);
    // });

    test("displays the correct test-id for the button", () => {
        const { getByTestId } = render(<DislikeButton />);
        const buttonElement = getByTestId("dislike-icon");
        expect(buttonElement).toBeInTheDocument();
    });

    test("renders the dislike icon", () => {
        const { getByTestId } = render(<DislikeButton />);
        const iconElement = getByTestId("dislike-icon").querySelector("svg");
        expect(iconElement).toBeInTheDocument();
    });
});
