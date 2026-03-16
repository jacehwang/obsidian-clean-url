import { describe, expect, test } from "bun:test";
import { createTrackingParamSet, parseTrackingParamsInput, shouldRemoveTrackingParam } from "./tracking-params";

describe("tracking parameter helpers", () => {
	test("parses textarea input with whitespace, commas, and duplicate names", () => {
		expect(parseTrackingParamsInput(" UTM_Source,\nref  ref\tFBCLID utm_* ")).toEqual([
			"utm_source",
			"ref",
			"fbclid",
			"utm_*",
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

	test("removes parameters matching a custom wildcard pattern", () => {
		expect(shouldRemoveTrackingParam(
			"campaign_source",
			createTrackingParamSet(["campaign_*"]),
			createTrackingParamSet(),
		)).toBe(true);
	});

	test("does not remove parameters preserved by a wildcard pattern", () => {
		expect(shouldRemoveTrackingParam(
			"utm_medium",
			createTrackingParamSet(["ref"]),
			createTrackingParamSet(["utm_*"]),
		)).toBe(false);
	});

	test("prioritizes an exact preserve rule over a wildcard removal rule", () => {
		const extraTrackingParams = createTrackingParamSet(["campaign_*"]);
		const preservedTrackingParams = createTrackingParamSet(["campaign_source"]);

		expect(shouldRemoveTrackingParam(
			"campaign_source",
			extraTrackingParams,
			preservedTrackingParams,
		)).toBe(false);
		expect(shouldRemoveTrackingParam(
			"campaign_id",
			extraTrackingParams,
			preservedTrackingParams,
		)).toBe(true);
	});

	test("reuses a precomputed set without rebuilding it", () => {
		const preserved = new Set(["utm_source"]);
		expect(createTrackingParamSet(preserved)).toBe(preserved);
	});
});
