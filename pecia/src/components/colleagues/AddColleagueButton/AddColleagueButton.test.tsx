import { test, expect } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "../../../utils/testUtils.tsx";
import AddColleagueButton from "./AddColleagueButton.tsx";

test("renders component with overlay on click", () => {
    const handler = () => {};
    renderWithProviders(<AddColleagueButton handler={handler} />);

    expect(screen.queryAllByText(/Add a colleague/i).length).toBe(0);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getAllByText(/Add a Colleague/i).length).toBeGreaterThan(0);
});

test("can add colleague", () => {
    const USERNAME = "ALICE";
    const PASSCODE = "SECRET";
    const PECIA_ID = "1234";

    renderWithProviders(<AddColleagueButton handler={handler} />);

    function handler(username: string, passcode: string, peciaID: string) {
        expect(username).toBe(USERNAME);
        expect(passcode).toBe(PASSCODE);
        expect(peciaID).toBe(PECIA_ID);
    }

    fireEvent.click(screen.getByRole("button"));
    fireEvent.input(screen.getByTitle("username"), {
        target: { value: USERNAME },
    });
    fireEvent.input(screen.getByTitle("passcode"), {
        target: { value: PASSCODE },
    });
    fireEvent.input(screen.getByTitle("pecia ID"), {
        target: { value: PECIA_ID },
    });
    fireEvent.click(screen.getByTitle("confirm"));
});

test("can cancel", () => {
    const handler = () => {};
    renderWithProviders(<AddColleagueButton handler={handler} />);

    expect(screen.queryAllByText(/Add a colleague/i).length).toBe(0);
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getAllByText(/Add a Colleague/i).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByTitle("cancel"));
    expect(screen.queryAllByText(/Add a colleague/i).length).toBe(0);
});
