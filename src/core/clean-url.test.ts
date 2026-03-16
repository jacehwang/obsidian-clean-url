import { describe, expect, test } from "bun:test";
import { cleanUrl } from "./clean-url";

describe("cleanUrl", () => {
	test("removes known tracking parameters from a bare origin", () => {
		expect(cleanUrl("https://example.com?utm_source=newsletter&fbclid=abc123")).toBe("https://example.com");
	});

	test("preserves non-tracking parameters and fragments", () => {
		expect(cleanUrl("https://example.com/docs?page=2&utm_medium=email#section-3")).toBe("https://example.com/docs?page=2#section-3");
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

	test("can drop fragments when configured", () => {
		expect(cleanUrl("https://example.com/docs?utm_campaign=launch#summary", {
			preserveHash: false,
		})).toBe("https://example.com/docs");
	});

	test("leaves invalid URLs untouched", () => {
		expect(cleanUrl("not-a-url")).toBe("not-a-url");
	});
});
