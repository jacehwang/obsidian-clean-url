import { Plugin } from "obsidian";
import { registerCommands } from "./commands/register-commands";
import { normalizeTrackingParams } from "./core/tracking-params";
import { registerPasteHandler } from "./editor/register-paste-handler";
import { CleanUrlSettingTab, DEFAULT_SETTINGS, type CleanUrlPluginSettings } from "./settings";

export default class CleanUrlPlugin extends Plugin {
	settings: CleanUrlPluginSettings;

	async onload(): Promise<void> {
		await this.loadSettings();
		registerCommands(this);
		registerPasteHandler(this);
		this.addSettingTab(new CleanUrlSettingTab(this.app, this));
	}

	async loadSettings(): Promise<void> {
		const loaded = await this.loadData() as Partial<CleanUrlPluginSettings> | null;
		this.settings = {
			...DEFAULT_SETTINGS,
			...loaded,
			extraTrackingParams: normalizeTrackingParams(loaded?.extraTrackingParams ?? DEFAULT_SETTINGS.extraTrackingParams),
			preservedTrackingParams: normalizeTrackingParams(loaded?.preservedTrackingParams ?? DEFAULT_SETTINGS.preservedTrackingParams),
		};
	}

	async saveSettings(): Promise<void> {
		this.settings = {
			...this.settings,
			extraTrackingParams: normalizeTrackingParams(this.settings.extraTrackingParams),
			preservedTrackingParams: normalizeTrackingParams(this.settings.preservedTrackingParams),
		};
		await this.saveData(this.settings);
	}
}
