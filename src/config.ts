// Configuration file for the ChatGPT Desktop Client
// This file contains configuration settings and API key management

export interface AppConfig {
  apiKey?: string;
  theme: "light" | "dark";
  maxMessageHistory: number;
  autoSave: boolean;
}

export const defaultConfig: AppConfig = {
  theme: "light",
  maxMessageHistory: 100,
  autoSave: true,
};

// In a real implementation, you would:
// 1. Store API keys securely (encrypted)
// 2. Use environment variables or secure storage
// 3. Implement proper key validation
// 4. Add configuration persistence

export class ConfigService {
  private config: AppConfig = { ...defaultConfig };

  getConfig(): AppConfig {
    return { ...this.config };
  }

  setApiKey(apiKey: string): void {
    this.config.apiKey = apiKey;
    // In a real app, you would save this securely
    localStorage.setItem("chatgpt_config", JSON.stringify(this.config));
  }

  getApiKey(): string | undefined {
    return this.config.apiKey;
  }

  setTheme(theme: "light" | "dark"): void {
    this.config.theme = theme;
    this.saveConfig();
  }

  private saveConfig(): void {
    localStorage.setItem("chatgpt_config", JSON.stringify(this.config));
  }

  private loadConfig(): void {
    try {
      const saved = localStorage.getItem("chatgpt_config");
      if (saved) {
        const parsed = JSON.parse(saved);
        this.config = { ...defaultConfig, ...parsed };
      }
    } catch (error) {
      console.error("Failed to load config:", error);
      this.config = { ...defaultConfig };
    }
  }

  constructor() {
    this.loadConfig();
  }
}

export const configService = new ConfigService();
