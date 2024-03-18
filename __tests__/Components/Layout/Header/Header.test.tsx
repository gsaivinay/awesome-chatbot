import { render } from "@testing-library/react";

import Header from "@/components/Layout/Header";

test("renders Header component without errors", () => {
    render(<Header />);
});
