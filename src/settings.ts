import { App, PluginSettingTab, Setting } from "obsidian";
import {
	createTrackingParamSet,
	parseTrackingParamsInput,
} from "./core/tracking-params";
import type { CleanUrlOptions } from "./core/types";
import type CleanUrlPlugin from "./main";

const ISSUES_URL = "https://github.com/jacehwang/obsidian-clean-url/issues";

export interface CleanUrlPluginSettings {
	enablePasteCleaning: boolean;
	preserveHash: boolean;
	extraTrackingParams: string[];
	preservedTrackingParams: string[];
}

export const DEFAULT_SETTINGS: CleanUrlPluginSettings = {
	enablePasteCleaning: true,
	preserveHash: true,
	extraTrackingParams: [],
	preservedTrackingParams: [],
};

export function toCleanUrlOptions(
	settings: CleanUrlPluginSettings,
): CleanUrlOptions {
	return {
		preserveHash: settings.preserveHash,
		extraTrackingParams: createTrackingParamSet(
			settings.extraTrackingParams,
		),
		preservedTrackingParams: createTrackingParamSet(
			settings.preservedTrackingParams,
		),
	};
}

export class CleanUrlSettingTab extends PluginSettingTab {
	plugin: CleanUrlPlugin;

	constructor(app: App, plugin: CleanUrlPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Clean pasted links automatically")
			.setDesc(
				"When you paste text containing links, tracking parameters like utm_source and fbclid are removed.",
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enablePasteCleaning)
					.onChange(async (value) => {
						this.plugin.settings.enablePasteCleaning = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("Preserve fragment")
			.setDesc(
				"Keep the #fragment portion of links (e.g., page.html#introduction). Turn this off to remove it.",
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.preserveHash)
					.onChange(async (value) => {
						this.plugin.settings.preserveHash = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("Additional parameters to remove")
			.setDesc(
				"Add parameter names to remove from links, beyond the built-in list. Supports trailing wildcards (e.g., custom_*). One per line, or separate with commas.",
			)
			.addTextArea((textArea) =>
				textArea
					// eslint-disable-next-line obsidianmd/ui/sentence-case -- Raw parameter examples are easier to scan here than sentence-style placeholder text.
					.setPlaceholder("ref\ncustom_*")
					.setValue(
						this.plugin.settings.extraTrackingParams.join("\n"),
					)
					.onChange(async (value) => {
						this.plugin.settings.extraTrackingParams =
							parseTrackingParamsInput(value);
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("Parameters to keep")
			.setDesc(
				"Prevent specific parameters from being removed, even if they match a built-in or custom removal rule. Supports trailing wildcards (e.g., mc_*). One per line, or separate with commas.",
			)
			.addTextArea((textArea) =>
				textArea
					// eslint-disable-next-line obsidianmd/ui/sentence-case -- Raw parameter examples are easier to scan here than sentence-style placeholder text.
					.setPlaceholder("mc_cid\nutm_*")
					.setValue(
						this.plugin.settings.preservedTrackingParams.join("\n"),
					)
					.onChange(async (value) => {
						this.plugin.settings.preservedTrackingParams =
							parseTrackingParamsInput(value);
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("Feedback")
			.setDesc(createFeedbackDescription());
	}
}

function createFeedbackDescription(): DocumentFragment {
	const fragment = document.createDocumentFragment();
	fragment.append("Found a bug or have an idea? ");

	const link = document.createElement("a");
	link.href = ISSUES_URL;
	link.target = "_blank";
	link.rel = "noopener noreferrer";
	link.textContent = "Open a GitHub issue";
	fragment.append(link);

	fragment.append(" and include an example link if possible.");
	return fragment;
}
