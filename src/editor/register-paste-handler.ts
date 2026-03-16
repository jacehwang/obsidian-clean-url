import type CleanUrlPlugin from "../main";
import { replaceUrlsInText } from "../core/replace-urls-in-text";
import { toCleanUrlOptions } from "../settings";

export function registerPasteHandler(plugin: CleanUrlPlugin): void {
	plugin.registerEvent(plugin.app.workspace.on("editor-paste", (event, editor) => {
		if (event.defaultPrevented || !plugin.settings.enablePasteCleaning) {
			return;
		}

		const pastedText = event.clipboardData?.getData("text/plain");
		if (!pastedText) {
			return;
		}

		const cleanedText = replaceUrlsInText(pastedText, toCleanUrlOptions(plugin.settings));
		if (cleanedText === pastedText) {
			return;
		}

		event.preventDefault();
		editor.replaceSelection(cleanedText);
	}));
}
