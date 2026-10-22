import { Plugin } from "obsidian";
import {
  DEFAULT_SETTINGS,
  THEMES,
  VanityWindowsSettings,
  VanityWindowsSettingTab,
} from "./settings";

export default class VanityWindowsPlugin extends Plugin {
  settings: VanityWindowsSettings = { ...DEFAULT_SETTINGS };
  private styleEl!: HTMLStyleElement;

  async onload() {
    await this.loadSettings();

    this.styleEl = document.head.createEl("style", {
      attr: { id: "vanity-windows-theme" },
    });
    this.register(() => this.styleEl.remove());
    this.applyTheme();

    this.addSettingTab(new VanityWindowsSettingTab(this.app, this));
  }

  async loadSettings() {
    const loaded: VanityWindowsSettings | null = await this.loadData();

    // Theme may have been deleted, or the file could have been edited.
    if (loaded == null || THEMES[loaded.theme] === undefined) {
      if (loaded !== null) {
        console.warn(
          `vanity-windows: Unknown theme "${loaded.theme}". Falling back to "${DEFAULT_SETTINGS.theme}"`,
        );
      }
      this.settings.theme = DEFAULT_SETTINGS.theme;
    } else {
      this.settings.theme = loaded.theme;
    }
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  applyTheme() {
    const theme = THEMES[this.settings.theme];
    if (theme === undefined)
      throw new Error(`Unknown theme: ${this.settings.theme}`);

    this.styleEl.textContent = `
body:not(.is-focused) {
	--titlebar-background: ${theme.background};
	--titlebar-background-focused: ${theme.background};
	--titlebar-text-color: ${theme.text};
	--titlebar-text-color-focused: ${theme.text};
}
body.is-focused {
	--titlebar-background: ${theme.backgroundFocused};
	--titlebar-background-focused: ${theme.backgroundFocused};
	--titlebar-text-color: ${theme.textFocused};
	--titlebar-text-color-focused: ${theme.textFocused};
}`;
  }
}
