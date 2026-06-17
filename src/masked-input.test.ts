import { describe, expect, test } from "bun:test";
import type { Theme } from "@earendil-works/pi-coding-agent";
import { visibleWidth, type TUI } from "@earendil-works/pi-tui";
import { MaskedInput } from "./masked-input.js";

const ansiTheme = {
	fg: (_color: string, text: string) => `\x1b[38;2;128;128;128m${text}\x1b[39m`,
} as Theme;

const noopTui = {
	requestRender() {},
} as unknown as TUI;

const expectFits = (lines: string[], width: number) => {
	for (const line of lines) {
		expect(visibleWidth(line)).toBeLessThanOrEqual(width);
	}
};

describe("MaskedInput render", () => {
	test("wraps long request reasons instead of overflowing the terminal width", () => {
		const input = new MaskedInput(
			"HAPPY_PEOPLE_PROD_API_KEY",
			"Happy People production API key is needed to read the actual HRIS config from https://api.arc.inc/graphql without exposing the token.",
			noopTui,
			ansiTheme,
			() => {},
		);

		const lines = input.render(119);

		expect(lines.length).toBeGreaterThan(5);
		expectFits(lines, 119);
	});

	test("keeps the masked value row within narrow widths", () => {
		const input = new MaskedInput("TOKEN", "short reason", noopTui, ansiTheme, () => {});
		input.focused = true;
		input.handleInput("x".repeat(200));

		expectFits(input.render(24), 24);
	});
});
