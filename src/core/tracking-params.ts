const TRACKING_PARAM_PREFIXES = [
	"utm_",
] as const;

const TRACKING_PARAM_NAMES = new Set([
	"fbclid",
	"gclid",
	"dclid",
	"mc_cid",
	"mc_eid",
	"igshid",
	"mkt_tok",
]);

export function normalizeTrackingParams(params: Iterable<string>): string[] {
	return Array.from(new Set(
		Array.from(params, (param) => normalizeTrackingParam(param)).filter((param) => param.length > 0),
	));
}

export function createTrackingParamSet(params: Iterable<string> = []): ReadonlySet<string> {
	if (params instanceof Set) {
		return params;
	}

	return new Set(normalizeTrackingParams(params));
}

export function parseTrackingParamsInput(input: string): string[] {
	return normalizeTrackingParams(input.split(/[\s,]+/));
}

export function shouldRemoveTrackingParam(
	paramName: string,
	extraTrackingParams: ReadonlySet<string> = new Set(),
	preservedTrackingParams: ReadonlySet<string> = new Set(),
): boolean {
	const normalized = normalizeTrackingParam(paramName);
	if (!normalized) {
		return false;
	}

	if (preservedTrackingParams.has(normalized)) {
		return false;
	}

	if (TRACKING_PARAM_NAMES.has(normalized)) {
		return true;
	}

	if (TRACKING_PARAM_PREFIXES.some((prefix) => normalized.startsWith(prefix))) {
		return true;
	}

	return extraTrackingParams.has(normalized);
}

function normalizeTrackingParam(param: string): string {
	return param.trim().toLowerCase();
}
