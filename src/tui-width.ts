import { truncateToWidth, visibleWidth, wrapTextWithAnsi } from "@earendil-works/pi-tui";

/**
 * Return one terminal-safe line that never exceeds the render width.
 * Custom TUI components must apply this (or wrapping) before returning lines.
 */
export function fitLineToWidth(line: string, width: number, ellipsis = "..."): string {
	if (width <= 0) return "";
	return truncateToWidth(line, width, ellipsis);
}

/**
 * Wrap ANSI-styled text and defensively truncate each produced line.
 */
export function wrapLineToWidth(line: string, width: number): string[] {
	if (width <= 0) return [""];
	const wrapped = wrapTextWithAnsi(line, width);
	if (wrapped.length === 0) return [""];
	return wrapped.map((part) => fitLineToWidth(part, width));
}

/**
 * Width left after fixed ANSI-styled segments are rendered.
 */
export function remainingVisibleWidth(width: number, ...fixedSegments: string[]): number {
	return Math.max(
		0,
		width - fixedSegments.reduce((used, segment) => used + visibleWidth(segment), 0),
	);
}
