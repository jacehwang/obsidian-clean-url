import { App, PluginSettingTab, Setting } from "obsidian";
import { normalizeTrackingParams, parseTrackingParamsInput } from "./core/tracking-params";
import type { CleanUrlOptions } from "./core/types";
import type CleanUrlPlugin from "./main";

export interface CleanUrlPluginSettings {
	enablePasteCleaning: boolean;
	preserveHash: boolean;
	extraTrackingParams: string[];
}

export const DEFAULT_SETTINGS: CleanUrlPluginSettings = {
	enablePasteCleaning: true,
	preserveHash: true,
	extraTrackingParams: [],
};

export function toCleanUrlOptions(settings: CleanUrlPluginSettings): CleanUrlOptions {
	return {
		preserveHash: settings.preserveHash,
		extraTrackingParams: normalizeTrackingParams(settings.extraTrackingParams),
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
			.setDesc("Scan pasted text and remove known tracking parameters from every supported link.")
			.addToggle((toggle) => toggle
				.setValue(this.plugin.settings.enablePasteCleaning)
				.onChange(async (value) => {
					this.plugin.settings.enablePasteCleaning = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName("Preserve fragments")
			.setDesc("Keep the part of the URL after '#'.")
			.addToggle((toggle) => toggle
				.setValue(this.plugin.settings.preserveHash)
				.onChange(async (value) => {
					this.plugin.settings.preserveHash = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName("Extra tracking parameters")
			.setDesc("Add one parameter name per line, or separate names with commas or spaces.")
			.addTextArea((textArea) => textArea
				.setPlaceholder("Parameter names")
				.setValue(this.plugin.settings.extraTrackingParams.join("\n"))
				.onChange(async (value) => {
					this.plugin.settings.extraTrackingParams = parseTrackingParamsInput(value);
					await this.plugin.saveSettings();
				}));
	}
}
