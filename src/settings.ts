import { App, PluginSettingTab, SettingDefinitionItem } from "obsidian";
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
    background: "#87414e",
    backgroundFocused: "#e64590",
    text: "#f6d5e2",
    textFocused: "#2a0012",
  },
  tangerine: {
    name: "Tangerine",
    background: "#824825",
    backgroundFocused: "#ea8448",
    text: "#fbe0cc",
    textFocused: "#3a1600",
  },
  lemonade: {
    name: "Lemonade",
    background: "#c29742",
    backgroundFocused: "#f0de6c",
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
    backgroundFocused: "#10a3de",
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
    background: "#8e302c",
    backgroundFocused: "#ca4d46",
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

  getSettingDefinitions(): SettingDefinitionItem[] {
    const themeEntries = Object.entries(THEMES).map(([id, { name }]) => [
      id,
      name,
    ]);

    return [
      {
        name: "Window theme",
        desc: "Colors for the window bar.",
        aliases: ["color", "titlebar"],
        control: {
          type: "dropdown",
          key: "theme",
          options: Object.fromEntries(themeEntries),
          defaultValue: DEFAULT_SETTINGS.theme,
        },
      },
    ];
  }

  async setControlValue(key: string, value: unknown): Promise<void> {
    if (key !== "theme") throw new Error(`Unknown setting: ${key}`);

    const theme = value as ThemeId;
    if (THEMES[theme] === undefined) throw new Error(`Unknown theme: ${theme}`);

    this.plugin.settings.theme = theme;
    await this.plugin.saveSettings();
    this.plugin.applyTheme();
  }
}
