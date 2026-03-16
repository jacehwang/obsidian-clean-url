import { isTrackingParam } from "./tracking-params";
import type { CleanUrlOptions } from "./types";

const DEFAULT_OPTIONS: CleanUrlOptions = {
	preserveHash: true,
	extraTrackingParams: [],
};

export function cleanUrl(input: string, options: Partial<CleanUrlOptions> = {}): string {
	const resolvedOptions = {
		...DEFAULT_OPTIONS,
		...options,
	};

	let url: URL;
	try {
		url = new URL(input);
	} catch {
		return input;
	}

	const paramsToRemove = new Set<string>();
	for (const [name] of url.searchParams) {
		if (isTrackingParam(name, resolvedOptions.extraTrackingParams)) {
			paramsToRemove.add(name);
		}
	}

	if (paramsToRemove.size === 0 && resolvedOptions.preserveHash) {
		return input;
	}

	for (const name of paramsToRemove) {
		url.searchParams.delete(name);
	}

	if (!resolvedOptions.preserveHash) {
		url.hash = "";
	}

	return formatCleanedUrl(url, input);
}

function formatCleanedUrl(url: URL, original: string): string {
	const keepBareOrigin = /^https?:\/\/[^/?#]+(?=[?#]|$)/i.test(original);
	const pathname = keepBareOrigin && url.pathname === "/" ? "" : url.pathname;
	return `${url.protocol}//${url.host}${pathname}${url.search}${url.hash}`;
}
