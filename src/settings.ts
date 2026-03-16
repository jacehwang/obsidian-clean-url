import { App, PluginSettingTab, Setting } from "obsidian";
import { createTrackingParamSet, parseTrackingParamsInput } from "./core/tracking-params";
import type { CleanUrlOptions } from "./core/types";
import type CleanUrlPlugin from "./main";

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

export function toCleanUrlOptions(settings: CleanUrlPluginSettings): CleanUrlOptions {
	return {
		preserveHash: settings.preserveHash,
		extraTrackingParams: createTrackingParamSet(settings.extraTrackingParams),
		preservedTrackingParams: createTrackingParamSet(settings.preservedTrackingParams),
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
			.setDesc("When you paste text containing links, tracking parameters like utm_source and fbclid are removed.")
			.addToggle((toggle) => toggle
				.setValue(this.plugin.settings.enablePasteCleaning)
				.onChange(async (value) => {
					this.plugin.settings.enablePasteCleaning = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName("Preserve fragment")
			.setDesc("Keep the # fragment portion of links (e.g., page.html#introduction). Turn this off to strip it.")
			.addToggle((toggle) => toggle
				.setValue(this.plugin.settings.preserveHash)
				.onChange(async (value) => {
					this.plugin.settings.preserveHash = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName("Additional parameters to remove")
			.setDesc("Add custom parameter names to remove from links, beyond the built-in list (utm_*, fbclid, gclid, etc.). One per line, or separate with commas.")
			.addTextArea((textArea) => textArea
				.setPlaceholder("ref\nsource")
				.setValue(this.plugin.settings.extraTrackingParams.join("\n"))
				.onChange(async (value) => {
					this.plugin.settings.extraTrackingParams = parseTrackingParamsInput(value);
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName("Parameters to keep")
			.setDesc("Keep specific parameters from being removed, even if they match the built-in or additional removal list. One per line, or separate with commas.")
			.addTextArea((textArea) => textArea
				.setPlaceholder("mc_cid")
				.setValue(this.plugin.settings.preservedTrackingParams.join("\n"))
				.onChange(async (value) => {
					this.plugin.settings.preservedTrackingParams = parseTrackingParamsInput(value);
					await this.plugin.saveSettings();
				}));
	}
}
