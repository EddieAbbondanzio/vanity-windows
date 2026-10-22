import { Plugin } from "obsidian";
import {
  DEFAULT_SETTINGS,
  THEMES,
  VanityWindowsSettings,
  VanityWindowsSettingTab,
  WindowTheme,
} from "./settings";

export default class VanityWindowsPlugin extends Plugin {
  settings: VanityWindowsSettings = { ...DEFAULT_SETTINGS };

  async onload() {
    await this.loadSettings();

    this.register(() => {
      const theme = THEMES[this.settings.theme];
      const themeVars = buildThemeCSSVars(theme);
      for (const prop of Object.keys(themeVars)) {
        document.body.style.removeProperty(prop);
      }
    });
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

    const themeVars = buildThemeCSSVars(theme);
    for (const [prop, value] of Object.entries(themeVars)) {
      document.body.style.setProperty(prop, value);
    }
  }
}

function buildThemeCSSVars(theme: WindowTheme): Record<string, string> {
  return {
    "--vanity-windows-background": theme.background,
    "--vanity-windows-background-focused": theme.backgroundFocused,
    "--vanity-windows-text": theme.text,
    "--vanity-windows-text-focused": theme.textFocused,
  };
}
