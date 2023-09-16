import { test, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../../utils/testUtils.tsx";
import VersionMenu from "./VersionsMenu.tsx";

test("renders component with clickable tabs on click", () => {
    renderWithProviders(<VersionMenu />);

    // @ts-expect-error The toBeInTheDocument is not being picked up by TS
    expect(screen.getByTitle("your versions")).toBeInTheDocument();

    // @ts-expect-error The toBeInTheDocument is not being picked up by TS
    expect(screen.getByTitle("colleague versions")).toBeInTheDocument();
});
