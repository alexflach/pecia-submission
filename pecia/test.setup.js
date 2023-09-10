import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
console.log("running setup");

// reset the DOM after each test;
afterEach(() => {
    cleanup();
});
