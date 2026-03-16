import {
  createTrackingParamSet,
  shouldRemoveTrackingParam,
} from "./tracking-params";
import type { CleanUrlOptionInput, CleanUrlOptions } from "./types";

const DEFAULT_OPTIONS: CleanUrlOptions = {
  preserveHash: true,
  extraTrackingParams: new Set(),
  preservedTrackingParams: new Set(),
};

export function cleanUrl(
  input: string,
  options: CleanUrlOptionInput = {},
): string {
  const resolvedOptions = resolveCleanUrlOptions(options);

  let url: URL;
  try {
    url = new URL(input);
  } catch {
    return input;
  }

  const paramsToRemove = new Set<string>();
  for (const [name] of url.searchParams) {
    if (
      shouldRemoveTrackingParam(
        name,
        resolvedOptions.extraTrackingParams,
        resolvedOptions.preservedTrackingParams,
        url.hostname,
      )
    ) {
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

function resolveCleanUrlOptions(options: CleanUrlOptionInput): CleanUrlOptions {
  return {
    preserveHash: options.preserveHash ?? DEFAULT_OPTIONS.preserveHash,
    extraTrackingParams: createTrackingParamSet(options.extraTrackingParams),
    preservedTrackingParams: createTrackingParamSet(
      options.preservedTrackingParams,
    ),
  };
}

function formatCleanedUrl(url: URL, original: string): string {
  const keepBareOrigin = /^https?:\/\/[^/?#]+(?=[?#]|$)/i.test(original);
  const pathname = keepBareOrigin && url.pathname === "/" ? "" : url.pathname;
  return `${url.protocol}//${url.host}${pathname}${url.search}${url.hash}`;
}
