import { render } from "@testing-library/react";
import mockRouter from "next-router-mock";

import Layouts from "@/Components/Layout";

jest.mock("next/router", () => require("next-router-mock"));

describe("CustomLayout component", () => {
    test("renders CustomLayout component without errors", () => {
        mockRouter.push("/");
        render(<Layouts.CustomLayout />);
    });

    test("displays Header, LeftNavBar, and RightNavBar components", () => {
        const { getByRole } = render(<Layouts.CustomLayout />);

        expect(getByRole("banner")).toBeInTheDocument();
        expect(getByRole("left-navigation")).toBeInTheDocument();
        expect(getByRole("right-navigation")).toBeInTheDocument();
    });
});
