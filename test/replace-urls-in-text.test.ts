import { describe, expect, test } from "bun:test";
import { replaceUrlsInText } from "../src/core/replace-urls-in-text";

describe("replaceUrlsInText", () => {
	test("cleans multiple URLs inside pasted text", () => {
		const input = [
			"First: https://example.com?utm_source=newsletter&page=2",
			"Second: https://another.example/path?fbclid=123#keep",
		].join("\n");

		const expected = [
			"First: https://example.com?page=2",
			"Second: https://another.example/path#keep",
		].join("\n");

		expect(replaceUrlsInText(input)).toBe(expected);
	});

	test("cleans URLs inside Markdown links and autolinks", () => {
		const input = "[Docs](https://example.com/docs?utm_medium=email#intro) and <https://another.example?a=1&utm_campaign=launch>";
		const expected = "[Docs](https://example.com/docs#intro) and <https://another.example?a=1>";

		expect(replaceUrlsInText(input)).toBe(expected);
	});

	test("preserves trailing punctuation around raw URLs", () => {
		const input = "Visit https://example.com/path?utm_source=newsletter, then reply.";
		const expected = "Visit https://example.com/path, then reply.";

		expect(replaceUrlsInText(input)).toBe(expected);
	});

	test("keeps balanced parentheses that are part of the URL", () => {
		const input = "Reference https://example.com/Function_(mathematics)?utm_source=wiki).";
		const expected = "Reference https://example.com/Function_(mathematics)).";

		expect(replaceUrlsInText(input)).toBe(expected);
	});

	test("is idempotent for already clean text", () => {
		const input = "Already clean: https://example.com/docs?page=2#summary";
		expect(replaceUrlsInText(input)).toBe(input);
	});
});
