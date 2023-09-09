import { render } from "@testing-library/react";

import Header from "@/Components/Layout/Header";

test("renders Header component without errors", () => {
    render(<Header />);
});
