import { describe, expect, test } from "bun:test";
import { visibleWidth } from "@earendil-works/pi-tui";
import { fitLineToWidth, remainingVisibleWidth, wrapLineToWidth } from "./tui-width.js";

const expectFits = (lines: string[], width: number) => {
	for (const line of lines) {
		expect(visibleWidth(line)).toBeLessThanOrEqual(width);
	}
};

describe("TUI width helpers", () => {
	test("fitLineToWidth truncates ANSI-styled long lines", () => {
		const line = `\x1b[31m${"x".repeat(50)}\x1b[39m`;
		const fitted = fitLineToWidth(line, 12);

		expect(visibleWidth(fitted)).toBeLessThanOrEqual(12);
	});

	test("wrapLineToWidth wraps long natural language lines", () => {
		const lines = wrapLineToWidth("Reason: this is a long sentence that should wrap safely", 20);

		expect(lines.length).toBeGreaterThan(1);
		expectFits(lines, 20);
	});

	test("remainingVisibleWidth ignores ANSI escape sequences", () => {
		expect(remainingVisibleWidth(10, "  ", "\x1b[31mabc\x1b[39m")).toBe(5);
	});
});
