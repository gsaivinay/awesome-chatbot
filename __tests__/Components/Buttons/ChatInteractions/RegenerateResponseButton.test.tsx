import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assert } from "console";

import { RegenerateResponseButton } from "@/Components/Buttons/ChatInteractions";
import { useChatResponseStatus } from "@/Store/ChatSettings";

describe("RegenerateResponseButton", () => {
    const initialStoreState = useChatResponseStatus.getState();
    beforeEach(() => {
        useChatResponseStatus.setState({ ...initialStoreState, inProgress: true }, true);
        // Mock the updateProgress function from Zustand
    });

    test("should render successfully", async () => {
        render(<RegenerateResponseButton />);

        expect(await screen.findByRole("stop-generation")).toBeInTheDocument();
    });

    test("should call updateProgress with false on button click", async () => {
        const user = userEvent.setup();
        render(<RegenerateResponseButton />);

        const button = await screen.findByRole("stop-generation");
        await user.click(button);

        assert(useChatResponseStatus.getState().inProgress === false);
    });
});
