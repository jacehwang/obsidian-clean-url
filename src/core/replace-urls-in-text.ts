import { cleanUrl } from "./clean-url";
import type { CleanUrlOptionInput } from "./types";

const URL_PATTERN = /https?:\/\/[^\s<>"']+/gi;
const SIMPLE_TRAILING_PUNCTUATION = new Set([".", ",", "!", "?", ";", ":", "'", "\""]);

export function replaceUrlsInText(text: string, options: CleanUrlOptionInput = {}): string {
	return text.replace(URL_PATTERN, (match) => {
		const { url, trailing } = splitTrailingDelimiters(match);
		return `${cleanUrl(url, options)}${trailing}`;
	});
}

function splitTrailingDelimiters(candidate: string): { url: string; trailing: string } {
	let url = candidate;
	let trailing = "";

	while (url.length > 0) {
		const lastCharacter = url.at(-1);
		if (!lastCharacter) {
			break;
		}

		if (SIMPLE_TRAILING_PUNCTUATION.has(lastCharacter)) {
			url = url.slice(0, -1);
			trailing = `${lastCharacter}${trailing}`;
			continue;
		}

		if (lastCharacter === ")" && hasUnbalancedClosingDelimiter(url, "(", ")")) {
			url = url.slice(0, -1);
			trailing = `)${trailing}`;
			continue;
		}

		if (lastCharacter === "]" && hasUnbalancedClosingDelimiter(url, "[", "]")) {
			url = url.slice(0, -1);
			trailing = `]${trailing}`;
			continue;
		}

		break;
	}

	return { url, trailing };
}

function hasUnbalancedClosingDelimiter(value: string, open: string, close: string): boolean {
	let balance = 0;
	for (const character of value) {
		if (character === open) {
			balance += 1;
		}

		if (character === close) {
			balance -= 1;
		}
	}

	return balance < 0;
}
