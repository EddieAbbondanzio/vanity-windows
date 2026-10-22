import { App, PluginSettingTab, Setting } from "obsidian";
import type VanityWindowsPlugin from "./main";

export interface WindowTheme {
  name: string;
  background: string;
  backgroundFocused: string;
  text: string;
  textFocused: string;
}

export const THEMES = {
  bubblegum: {
    name: "Bubblegum",
    background: "#852852",
    backgroundFocused: "#e64590",
    text: "#f6d5e2",
    textFocused: "#2a0012",
  },
  tangerine: {
    name: "Tangerine",
    background: "#8c4210",
    backgroundFocused: "#f2711c",
    text: "#fbe0cc",
    textFocused: "#3a1600",
  },
  lemonade: {
    name: "Lemonade",
    background: "#9a8f3a",
    backgroundFocused: "#e6d45c",
    // Darkened yellow is still too light for light text.
    text: "#2a2300",
    textFocused: "#3d3200",
  },
  limeSoda: {
    name: "Lime Soda",
    background: "#4c7423",
    backgroundFocused: "#7fc23a",
    text: "#e2f2cf",
    textFocused: "#1a2e05",
  },
  aqua: {
    name: "Aqua",
    background: "#006d8a",
    backgroundFocused: "#00c4f0",
    text: "#d0f2fc",
    textFocused: "#002a36",
  },
  electric: {
    name: "Electric Blue",
    background: "#1c4286",
    backgroundFocused: "#2f6fe0",
    text: "#d6e3fb",
    textFocused: "#ffffff",
  },
  grape: {
    name: "Grape",
    background: "#492676",
    backgroundFocused: "#7a3fc4",
    text: "#e6dbf6",
    textFocused: "#ffffff",
  },
  coral: {
    name: "Coral",
    background: "#852127",
    backgroundFocused: "#d32f3b",
    text: "#f8d6d8",
    textFocused: "#ffffff",
  },
} satisfies Record<string, WindowTheme>;

export type ThemeId = keyof typeof THEMES;

export interface VanityWindowsSettings {
  theme: ThemeId;
}

export const DEFAULT_SETTINGS: VanityWindowsSettings = {
  theme: "bubblegum",
};

export class VanityWindowsSettingTab extends PluginSettingTab {
  constructor(
    app: App,
    private plugin: VanityWindowsPlugin,
  ) {
    super(app, plugin);
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName("Window theme")
      .setDesc("Colors for the window bar.")
      .addDropdown((dropdown) => {
        for (const [id, theme] of Object.entries(THEMES)) {
          dropdown.addOption(id, theme.name);
        }
        dropdown
          .setValue(this.plugin.settings.theme)
          .onChange(async (value) => {
            this.plugin.settings.theme = value as ThemeId;
            await this.plugin.saveSettings();
            this.plugin.applyTheme();
          });
      });
  }
}
