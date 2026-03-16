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

export function parseTrackingParamsInput(input: string): string[] {
	return normalizeTrackingParams(input.split(/[\s,]+/));
}

export function isTrackingParam(paramName: string, extraTrackingParams: Iterable<string> = []): boolean {
	const normalized = normalizeTrackingParam(paramName);
	if (!normalized) {
		return false;
	}

	if (TRACKING_PARAM_NAMES.has(normalized)) {
		return true;
	}

	if (TRACKING_PARAM_PREFIXES.some((prefix) => normalized.startsWith(prefix))) {
		return true;
	}

	const normalizedExtras = new Set(normalizeTrackingParams(extraTrackingParams));
	return normalizedExtras.has(normalized);
}

function normalizeTrackingParam(param: string): string {
	return param.trim().toLowerCase();
}
