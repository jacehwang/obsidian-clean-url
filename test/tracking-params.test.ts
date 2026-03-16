import { describe, expect, test } from "bun:test";
import { createTrackingParamSet, parseTrackingParamsInput, shouldRemoveTrackingParam } from "../src/core/tracking-params";

describe("tracking parameter helpers", () => {
	test("parses textarea input with whitespace, commas, and duplicate names", () => {
		expect(parseTrackingParamsInput(" UTM_Source,\nref  ref\tFBCLID ")).toEqual([
			"utm_source",
			"ref",
			"fbclid",
		]);
	});

	test("does not remove a preserved parameter even when it is built-in or custom", () => {
		expect(shouldRemoveTrackingParam(
			"utm_source",
			createTrackingParamSet(["ref"]),
			createTrackingParamSet(["utm_source"]),
		)).toBe(false);
		expect(shouldRemoveTrackingParam(
			"ref",
			createTrackingParamSet(["ref"]),
			createTrackingParamSet(["ref"]),
		)).toBe(false);
	});

	test("reuses a precomputed set without rebuilding it", () => {
		const preserved = new Set(["utm_source"]);
		expect(createTrackingParamSet(preserved)).toBe(preserved);
	});
});
