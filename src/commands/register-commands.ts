import { Notice } from "obsidian";
import type CleanUrlPlugin from "../main";
import { replaceUrlsInText } from "../core/replace-urls-in-text";
import { toCleanUrlOptions } from "../settings";

export function registerCommands(plugin: CleanUrlPlugin): void {
	plugin.addCommand({
		id: "clean-urls-in-selection",
		name: "Clean selected links",
		editorCheckCallback: (checking, editor) => {
			const selection = editor.getSelection();
			if (!selection) {
				return false;
			}

			if (checking) {
				return true;
			}

			const cleanedSelection = replaceUrlsInText(selection, toCleanUrlOptions(plugin.settings));
			if (cleanedSelection === selection) {
				new Notice("No cleanable links found in the selection.");
				return true;
			}

			editor.replaceSelection(cleanedSelection);
			return true;
		},
	});
}
