import { describe, expect, test } from "bun:test";
import { cleanUrl } from "./clean-url";

describe("cleanUrl", () => {
	test("removes known tracking parameters from a bare origin", () => {
		expect(cleanUrl("https://example.com?utm_source=newsletter&fbclid=abc123")).toBe("https://example.com");
	});

	test("removes mixed-case tracking parameters while preserving an explicit root slash", () => {
		expect(cleanUrl("https://example.com/?UTM_Source=newsletter&FBCLID=abc123&page=1")).toBe("https://example.com/?page=1");
		expect(cleanUrl("https://example.com?UTM_Source=newsletter&FBCLID=abc123&page=1")).toBe("https://example.com?page=1");
	});

	test("preserves non-tracking parameters and fragments", () => {
		expect(cleanUrl("https://example.com/docs?page=2&utm_medium=email#section-3")).toBe("https://example.com/docs?page=2#section-3");
	});

	test("removes host-scoped built-in parameters on supported hosts only", () => {
		expect(cleanUrl("https://www.youtube.com/watch?v=abc123&si=share-token")).toBe("https://www.youtube.com/watch?v=abc123");
		expect(cleanUrl("https://youtu.be/abc123?si=share-token")).toBe("https://youtu.be/abc123");
		expect(cleanUrl("https://www.instagram.com/reel/abc123/?igsh=share-token")).toBe("https://www.instagram.com/reel/abc123/");
		expect(cleanUrl("https://www.instagram.com/p/abc123/?igshid=share-token")).toBe("https://www.instagram.com/p/abc123/");
		expect(cleanUrl("https://example.com/watch?v=abc123&si=share-token")).toBe("https://example.com/watch?v=abc123&si=share-token");
		expect(cleanUrl("https://example.com/p/abc123/?igshid=share-token")).toBe("https://example.com/p/abc123/?igshid=share-token");
	});

	test("supports extra tracking parameters from settings", () => {
		expect(cleanUrl("https://example.com/article?ref=feed&page=1", {
			extraTrackingParams: ["ref"],
		})).toBe("https://example.com/article?page=1");
	});

	test("supports wildcard extra tracking parameters from settings", () => {
		expect(cleanUrl("https://example.com/article?campaign_id=42&campaign_source=newsletter&page=1", {
			extraTrackingParams: ["campaign_*"],
		})).toBe("https://example.com/article?page=1");
	});

	test("preserves parameters listed in the denylist even when they match removal rules", () => {
		expect(cleanUrl("https://example.com/article?utm_source=newsletter&ref=feed&page=1", {
			extraTrackingParams: ["ref"],
			preservedTrackingParams: ["utm_source", "ref"],
		})).toBe("https://example.com/article?utm_source=newsletter&ref=feed&page=1");
	});

	test("preserves parameters matched by a wildcard keep rule", () => {
		expect(cleanUrl("https://example.com/article?utm_source=newsletter&utm_medium=email&page=1", {
			preservedTrackingParams: ["utm_*"],
		})).toBe("https://example.com/article?utm_source=newsletter&utm_medium=email&page=1");
	});

	test("preserves host-scoped built-in parameters when explicitly kept", () => {
		expect(cleanUrl("https://www.youtube.com/watch?v=abc123&si=share-token", {
			preservedTrackingParams: ["si"],
		})).toBe("https://www.youtube.com/watch?v=abc123&si=share-token");
		expect(cleanUrl("https://www.instagram.com/reel/abc123/?igsh=share-token", {
			preservedTrackingParams: ["igsh"],
		})).toBe("https://www.instagram.com/reel/abc123/?igsh=share-token");
		expect(cleanUrl("https://www.instagram.com/p/abc123/?igshid=share-token", {
			preservedTrackingParams: ["igshid"],
		})).toBe("https://www.instagram.com/p/abc123/?igshid=share-token");
	});

	test("can drop fragments when configured", () => {
		expect(cleanUrl("https://example.com/docs?utm_campaign=launch#summary", {
			preserveHash: false,
		})).toBe("https://example.com/docs");
	});

	test("treats fragment content as non-query text unless hash preservation is disabled", () => {
		const input = "https://example.com/docs?page=1#section&utm_source=newsletter";

		expect(cleanUrl(input)).toBe(input);
		expect(cleanUrl(input, {
			preserveHash: false,
		})).toBe("https://example.com/docs?page=1");
	});

	test("leaves invalid URLs untouched", () => {
		expect(cleanUrl("not-a-url")).toBe("not-a-url");
	});
});
