import { test, expect } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "../../../utils/testUtils.tsx";
import VersionMenu from "./VersionsMenu.tsx";
import { RootState } from "../../../state/store.ts";

test("renders component with expand and collapse on click", () => {
    renderWithProviders(<VersionMenu />);

    expect(screen.queryAllByTitle("collapse").length).toBe(0);
    // @ts-expect-error The toBeInTheDocument is not being picked up by TS
    expect(screen.getByTitle("expand")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button"));

    // @ts-expect-error The toBeInTheDocument is not being picked up by TS
    expect(screen.getByTitle("collapse")).toBeInTheDocument();
    expect(screen.queryAllByTitle("expand").length).toBe(0);
    fireEvent.click(screen.getByTitle("collapse"));
    expect(screen.queryAllByTitle("collapse").length).toBe(0);

    // @ts-expect-error The toBeInTheDocument is not being picked up by TS
    expect(screen.getByTitle("expand")).toBeInTheDocument();
});
